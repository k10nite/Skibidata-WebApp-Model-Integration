// Sentinel-2 ML inference service.
// POSTs a GeoJSON polygon to the deployed inference API (Railway) and
// normalizes the response for consumption by recommendationService.mapSoilToEngine.

import { log } from './logger';

const API_URL = import.meta.env.VITE_ML_INFERENCE_URL || import.meta.env.VITE_LIAM_API_URL;
const FETCH_TIMEOUT_MS = 30000;

/**
 * Predict soil nutrients for a GeoJSON polygon via the Sentinel-2 inference API.
 * Calls the deployed endpoint directly. If CORS or the network fails, the caller
 * is responsible for falling back (Processing.jsx already handles this via the
 * placeholder mlPredictionService).
 */
export async function predictForField(polygon, opts = {}) {
  if (!API_URL) {
    throw new Error('VITE_ML_INFERENCE_URL not configured');
  }

  const {
    cropType = 'unknown',
    temperatureC = 18.0,
    humidityPercent = 80.0,
    sampleSpacingM = 10.0,
    signal
  } = opts;

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

    log.ml('POST /predict', {
      url: API_URL,
      polygonVertices: polygon?.coordinates?.[0]?.length,
      cropType
    });
    const t0 = performance.now();
    const response = await fetch(`${API_URL.replace(/\/$/, '')}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: requestSignal
    });
    const ms = Math.round(performance.now() - t0);

    if (!response.ok) {
      log.warn(`ML inference HTTP ${response.status} in ${ms}ms`, { status: response.status });
      throw new Error(`ML inference predict HTTP ${response.status}`);
    }

    const data = await response.json();
    log.ml(`Response ${response.status} in ${ms}ms`, {
      sampleCount: data.sample_count,
      polygonAreaHa: data.polygon_area_ha,
      n: data.nitrogen?.dominant_class,
      p: data.phosphorus?.dominant_class,
      k: data.potassium?.dominant_class,
      ph: data.ph?.dominant_class,
      warnings: (data.warnings || []).length
    });

    // The inference API's dominant_class returns labels with mg/kg ranges
    // ("Low (<11 mg/kg)") instead of plain "Low". The rule engine and the
    // webapp normalizer compare on the bare class name, so strip anything
    // in parens.
    const stripRange = (s) => {
      if (typeof s !== 'string') return 'Medium';
      const m = s.match(/^([^(]+)/);
      return (m ? m[1] : s).trim();
    };

    return {
      nitrogen: stripRange(data.nitrogen?.dominant_class),
      phosphorus: stripRange(data.phosphorus?.dominant_class),
      potassium: stripRange(data.potassium?.dominant_class),
      pH: data.ph?.dominant_class ? parseFloat(data.ph.dominant_class) : 6.0,
      source: 'ml-inference',
      raw: {
        nitrogen: data.nitrogen,
        phosphorus: data.phosphorus,
        potassium: data.potassium,
        ph: data.ph,
        sample_count: data.sample_count,
        polygon_area_ha: data.polygon_area_ha,
        warnings: data.warnings || []
      }
    };

  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export function getMLApiUrl() {
  return API_URL || null;
}
