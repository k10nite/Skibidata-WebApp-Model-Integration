// Liam's SoilScan Sentinel-2 ML API Service
// POSTs GeoJSON polygon to deployed Railway API and normalizes response
// for downstream consumption by recommendationService.mapSoilToEngine

import { log } from './logger';

const DIRECT_URL = import.meta.env.VITE_LIAM_API_URL;
const PROXY_URL = import.meta.env.VITE_LIAM_PROXY_URL;
const FETCH_TIMEOUT_MS = 30000;

// Smart URL resolution — probe Liam's CORS once at first call. If GET /health
// succeeds in CORS mode → use direct URL (zero hop). If it fails (current
// state, until Liam adds CORSMiddleware) → fall back to our proxy. Cached
// for the session so we only probe once. When Liam ships CORS upstream, the
// next reload picks up direct automatically with no env-var changes here.
let _resolvedUrl = null;
let _resolvePromise = null;

async function _probeDirectCors() {
  if (!DIRECT_URL) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(`${DIRECT_URL.replace(/\/$/, '')}/health`, {
      method: 'GET',
      mode: 'cors',
      signal: ctrl.signal
    });
    clearTimeout(t);
    if (res.ok) {
      log.ml('CORS probe: direct URL works', { url: DIRECT_URL });
      return DIRECT_URL;
    }
    log.warn('CORS probe: direct returned non-OK', { status: res.status });
  } catch (err) {
    log.warn('CORS probe: direct rejected (likely missing ACAO)', { error: err?.message });
  }
  if (PROXY_URL) {
    log.ml('CORS probe: falling back to proxy URL', { url: PROXY_URL });
    return PROXY_URL;
  }
  log.warn('CORS probe: no proxy configured — direct will be used and may fail');
  return DIRECT_URL;
}

async function getResolvedUrl() {
  if (_resolvedUrl) return _resolvedUrl;
  if (!_resolvePromise) {
    _resolvePromise = _probeDirectCors().then((url) => {
      _resolvedUrl = url;
      return url;
    });
  }
  return _resolvePromise;
}

/**
 * Predict soil nutrients for a GeoJSON polygon via Liam's Sentinel-2 ML API
 * @param {Object} polygon - GeoJSON Polygon geometry object (not a Feature)
 * @param {Object} opts - Optional overrides
 * @param {string} opts.cropType - crop type (defaults to "unknown")
 * @param {number} opts.temperatureC - temperature in Celsius (defaults to 18.0)
 * @param {number} opts.humidityPercent - humidity percentage (defaults to 80.0)
 * @param {number} opts.sampleSpacingM - sample spacing in meters (defaults to 10.0)
 * @param {AbortSignal} opts.signal - abort signal for request cancellation
 * @returns {Promise<Object>} Normalized prediction object for Zustand store
 * @throws {Error} If API_URL not configured or request fails
 */
export async function predictForField(polygon, opts = {}) {
  const apiBase = await getResolvedUrl();
  if (!apiBase) {
    throw new Error('VITE_LIAM_API_URL not configured (and no proxy URL available)');
  }

  const {
    cropType = 'unknown',
    temperatureC = 18.0,
    humidityPercent = 80.0,
    sampleSpacingM = 10.0,
    signal
  } = opts;

  // Set up timeout controller if no signal provided
  const controller = signal ? null : new AbortController();
  const timeoutId = controller ? setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS) : null;
  const requestSignal = signal || (controller ? controller.signal : undefined);

  try {
    const body = {
      polygon,
      crop_type: cropType,
      temperature_c: temperatureC,
      humidity_percent: humidityPercent,
      sample_spacing_m: sampleSpacingM
    };

    const usingProxy = apiBase === PROXY_URL;
    log.ml(`POST /predict → ${usingProxy ? 'PROXY' : 'DIRECT'}`, {
      url: apiBase, polygonVertices: polygon?.coordinates?.[0]?.length, cropType
    });
    const t0 = performance.now();
    const response = await fetch(`${apiBase.replace(/\/$/, '')}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: requestSignal
    });
    const ms = Math.round(performance.now() - t0);

    if (!response.ok) {
      log.warn(`Liam HTTP ${response.status} in ${ms}ms — falling back`, { status: response.status });
      throw new Error(`Liam predict HTTP ${response.status}`);
    }

    const data = await response.json();
    log.ml(`Liam response ${response.status} in ${ms}ms`, {
      sampleCount: data.sample_count,
      polygonAreaHa: data.polygon_area_ha,
      n: data.nitrogen?.dominant_class,
      p: data.phosphorus?.dominant_class,
      k: data.potassium?.dominant_class,
      ph: data.ph?.dominant_class,
      warnings: (data.warnings || []).length
    });

    // Liam's dominant_class started returning labels with mg/kg ranges
    // ("Low (<11 mg/kg)") instead of plain "Low". Hans's rule engine + the
    // webapp normalizer do string equality on the bare class name, so strip
    // anything in parens.
    const stripRange = (s) => {
      if (typeof s !== 'string') return 'Medium';
      const m = s.match(/^([^(]+)/);
      return (m ? m[1] : s).trim();
    };

    const normalized = {
      nitrogen: stripRange(data.nitrogen?.dominant_class),
      phosphorus: stripRange(data.phosphorus?.dominant_class),
      potassium: stripRange(data.potassium?.dominant_class),
      pH: data.ph?.dominant_class ? parseFloat(data.ph.dominant_class) : 6.0,
      source: 'liam-ml',
      liam: {
        nitrogen: data.nitrogen,
        phosphorus: data.phosphorus,
        potassium: data.potassium,
        ph: data.ph,
        sample_count: data.sample_count,
        polygon_area_ha: data.polygon_area_ha,
        warnings: data.warnings || []
      }
    };

    return normalized;

  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Get the configured Liam API URL
 * @returns {string|null} API URL or null if not configured
 */
export function getLiamApiUrl() {
  return DIRECT_URL || PROXY_URL || null;
}