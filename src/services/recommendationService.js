import { calculateFertilizerRecommendation } from './fertilizerEngine';

const RULE_API_URL = import.meta.env.VITE_RULE_API_URL;
const FETCH_TIMEOUT_MS = 8000;

const N_STATUS_MAP = { Low: 'L', Medium: 'M', High: 'H' };
const P_STATUS_MAP = { Low: 'L', Medium: 'MH', High: 'H' };
const K_STATUS_MAP = { Low: 'L', Medium: 'S', High: 'S+' };

const CROP_LABEL_MAP = {
  cabbage: 'Cabbage',
  lettuce: 'Lettuce',
  potato: 'Potato',
  carrot: 'Carrot',
  tomato: 'Tomato',
  beans: 'Snap Beans',
  sweetPotato: 'Sweet Potato',
  chayote: 'Chayote'
};

function parseAvailableFertilizers(text) {
  if (!text || typeof text !== 'string') return null;
  const names = text
    .split(/[,\n;]/)
    .map((s) => s.trim().replace(/\s*\([^)]*\)\s*/g, '').trim())
    .filter(Boolean);
  return names.length ? names : null;
}

function mapSoilToEngine(soilData, cropKey, areaHectares, availableFertilizers) {
  const nRating = soilData?.nitrogen?.rating ?? 'Medium';
  const pRating = soilData?.phosphorus?.rating ?? 'Medium';
  const kRating = soilData?.potassium?.rating ?? 'Medium';
  return {
    crop_label: CROP_LABEL_MAP[cropKey] ?? 'Cabbage',
    n_status: N_STATUS_MAP[nRating] ?? 'M',
    p_status: P_STATUS_MAP[pRating] ?? 'MH',
    k_status: K_STATUS_MAP[kRating] ?? 'S',
    soil_ph: typeof soilData?.ph === 'number' ? soilData.ph : 6.0,
    raw_area: areaHectares || 1,
    area_unit: 'ha',
    selected_inventory_names: parseAvailableFertilizers(availableFertilizers)
  };
}

function normalizeEngineResponse(engineRes, soilData, cropKey, areaHectares) {
  if (!engineRes || typeof engineRes !== 'object') {
    return calculateFertilizerRecommendation(soilData, cropKey, areaHectares);
  }
  const mix = Array.isArray(engineRes.adjusted_mix) && engineRes.adjusted_mix.length
    ? engineRes.adjusted_mix
    : engineRes.standard_mix;
  if (!Array.isArray(mix)) {
    return calculateFertilizerRecommendation(soilData, cropKey, areaHectares);
  }
  const recommendations = mix.map((rx, i) => ({
    stage: rx.stage ?? (i === 0 ? 'Basal' : i === 1 ? 'First side-dress' : 'Second side-dress'),
    fertilizer: {
      name: rx.fertilizer_name ?? rx.name ?? 'Fertilizer',
      brand: rx.brand ?? '',
      pricePerKg: rx.price_per_kg ?? rx.pricePerKg ?? 0
    },
    amountKg: Number(rx.amount_kg ?? rx.kg ?? rx.quantity ?? 0),
    timing: rx.timing ?? '',
    method: rx.method ?? 'Broadcast',
    cost: Number(rx.cost ?? rx.total_cost ?? 0)
  }));
  const totalAdj = engineRes.total_adjusted ?? engineRes.total_base ?? { N: 0, P: 0, K: 0 };
  const phRes = engineRes.ph_result ?? {};
  return {
    crop: { name: engineRes.selected_crop_label ?? engineRes.selected_crop ?? cropKey },
    recommendations,
    summary: {
      totalCostPHP: recommendations.reduce((s, r) => s + (r.cost || 0), 0),
      totalNutrients: {
        n: Number(totalAdj.N ?? 0),
        p: Number(totalAdj.P ?? 0),
        k: Number(totalAdj.K ?? 0)
      },
      areaHectares: engineRes.area_ha ?? areaHectares ?? 1,
      expectedYield: ''
    },
    phAdjustment: {
      needed: Boolean(phRes.needs_adjustment ?? phRes.needed ?? false),
      reason: phRes.reason ?? '',
      action: phRes.action ?? phRes.recommendation ?? '',
      amount: phRes.amount ?? '',
      timing: phRes.timing ?? ''
    },
    organicOption: { note: '', materials: [], totalCost: 0 },
    _engineRaw: engineRes
  };
}

async function fetchFromEngine(soilData, cropKey, areaHectares, availableFertilizers) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const body = mapSoilToEngine(soilData, cropKey, areaHectares, availableFertilizers);
    const res = await fetch(`${RULE_API_URL.replace(/\/$/, '')}/recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`Engine HTTP ${res.status}`);
    const data = await res.json();
    return normalizeEngineResponse(data, soilData, cropKey, areaHectares);
  } finally {
    clearTimeout(t);
  }
}

export function getRecommendationForCrop(soilData, cropKey, areaHectares = 1, availableFertilizers = '') {
  if (!RULE_API_URL) {
    return calculateFertilizerRecommendation(soilData, cropKey, areaHectares);
  }
  return calculateFertilizerRecommendation(soilData, cropKey, areaHectares);
}

export async function getRecommendationForCropAsync(soilData, cropKey, areaHectares = 1, availableFertilizers = '') {
  if (!RULE_API_URL) {
    return calculateFertilizerRecommendation(soilData, cropKey, areaHectares);
  }
  try {
    return await fetchFromEngine(soilData, cropKey, areaHectares, availableFertilizers);
  } catch (err) {
    console.warn('[recommendationService] engine fetch failed, falling back:', err?.message ?? err);
    return calculateFertilizerRecommendation(soilData, cropKey, areaHectares);
  }
}
