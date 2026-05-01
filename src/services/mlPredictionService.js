import predictions from '../data/mlPredictions.json';

const API_URL = import.meta.env.VITE_ML_API_URL || null;
const FETCH_TIMEOUT_MS = 5000;

const FALLBACK = {
  nitrogen: 'Medium',
  phosphorus: 'Medium',
  potassium: 'Medium',
  pH: 'Slightly Acidic',
  raw: null
};

function staticPrediction(locationName) {
  const entry = predictions.locations?.[locationName];
  if (entry) {
    return { ...entry, source: predictions.metadata?.source ?? 'static' };
  }
  console.warn(`[mlPredictionService] No static prediction for "${locationName}" — using hard fallback`);
  return { ...FALLBACK, source: 'fallback' };
}

async function fetchFromBackend(locationName) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const url = `${API_URL.replace(/\/$/, '')}/predict?location=${encodeURIComponent(locationName)}`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      console.warn(`[mlPredictionService] backend returned ${res.status} for "${locationName}" — falling back to static`);
      return null;
    }
    const data = await res.json();
    return { ...data, source: data.source ?? 'backend' };
  } catch (err) {
    console.warn(`[mlPredictionService] backend unreachable for "${locationName}" — falling back to static`, err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function predictForLocation(locationName) {
  if (API_URL) {
    const fromBackend = await fetchFromBackend(locationName);
    if (fromBackend) return fromBackend;
  }
  return staticPrediction(locationName);
}

export function getMetadata() {
  return predictions.metadata ?? null;
}

export function getKnownLocations() {
  return Object.keys(predictions.locations ?? {});
}

export function getBackendUrl() {
  return API_URL;
}
