// Liam's SoilScan Sentinel-2 ML API Service
// POSTs GeoJSON polygon to deployed Railway API and normalizes response
// for downstream consumption by recommendationService.mapSoilToEngine

const API_URL = import.meta.env.VITE_LIAM_API_URL;
const FETCH_TIMEOUT_MS = 30000;

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
  if (!API_URL) {
    throw new Error('VITE_LIAM_API_URL not configured');
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

    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      signal: requestSignal
    });

    if (!response.ok) {
      throw new Error(`Liam predict HTTP ${response.status}`);
    }

    const data = await response.json();

    // Normalize response to match mlPredictionService.predictForLocation shape
    // Map Liam's dominant_class values to flat strings for recommendationService.readRating
    const normalized = {
      nitrogen: data.nitrogen?.dominant_class || 'Medium',
      phosphorus: data.phosphorus?.dominant_class || 'Medium',
      potassium: data.potassium?.dominant_class || 'Medium',
      // Convert pH string to number for recommendationService.mapSoilToEngine
      pH: data.ph?.dominant_class ? parseFloat(data.ph.dominant_class) : 6.0,
      source: 'liam-ml',
      // Preserve rich metadata under 'liam' key for potential SoilStatus use
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
  return API_URL || null;
}