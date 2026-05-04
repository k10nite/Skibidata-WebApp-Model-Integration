import { calculateFertilizerRecommendation } from './fertilizerEngine';

const RULE_API_URL = import.meta.env.VITE_RULE_API_URL;
const FETCH_TIMEOUT_MS = 8000;

// Hans's engine advertises L/M/H/VH status codes via OpenAPI, but crop_npk_rules.json
// keys use long-form Low/Medium/High and the lookup falls through to 0 if codes don't match.
// We send long-form to match the rules dict directly (verified empirically against deployed engine).
const N_STATUS_MAP = { Low: 'Low', Medium: 'Medium', High: 'High' };
const P_STATUS_MAP = { Low: 'Low', Medium: 'Medium', High: 'High' };
const K_STATUS_MAP = { Low: 'Low', Medium: 'Medium', High: 'High' };

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
    n_status: N_STATUS_MAP[nRating] ?? 'Medium',
    p_status: P_STATUS_MAP[pRating] ?? 'Medium',
    k_status: K_STATUS_MAP[kRating] ?? 'Medium',
    soil_ph: typeof soilData?.ph === 'number' ? soilData.ph : 6.0,
    raw_area: areaHectares || 1,
    area_unit: 'ha',
    selected_inventory_names: parseAvailableFertilizers(availableFertilizers)
  };
}

// Engine emits Prescription strings like "10.5 kg/1.0 ha of Urea".
// The format is defined in engine_rules.json: "{qty} kg/{area} {unit} of {fertilizer_name}".
const PRESCRIPTION_RE = /^([\d.]+)\s*kg\/([\d.]+)\s+(\S+)\s+of\s+(.+)$/;

// Engine response includes inventory but no prices. Best-effort PHP/kg lookup
// against the products in fertilizerEngine.PH_FERTILIZERS. Unknowns fall to 0.
const ENGINE_NAME_TO_PRICE_PHP = {
  'Urea': 45,
  'Ammonium Sulfate': 35,
  'Complete (14-14-14)': 55,
  'Complete (16-16-16)': 60,
  'Muriate of Potash': 50,
  'Single Superphosphate (18)': 40,
  'Single Superphosphate (20)': 42,
  'Single Superphosphate (22)': 44,
  'Ammophos': 50,
  'Calcium Nitrate': 70
};

function classifyByInventory(name, inventory) {
  const f = Array.isArray(inventory) ? inventory.find((x) => x.name === name) : null;
  if (!f) return { stage: 'Application', sortOrder: 99 };
  const isPureN = f.n > 0 && f.p === 0 && f.k === 0;
  const isPureK = f.k > 0 && f.n === 0 && f.p === 0;
  const hasP = f.p > 0;
  if (hasP) return { stage: 'Basal (P-compound)', sortOrder: 0 };
  if (isPureN) return { stage: 'Side-dress (N)', sortOrder: 1 };
  if (isPureK) return { stage: 'Top-dress (K)', sortOrder: 2 };
  return { stage: 'Application', sortOrder: 3 };
}

function parsePrescriptionString(s) {
  if (typeof s !== 'string') return null;
  const m = s.match(PRESCRIPTION_RE);
  if (!m) return null;
  return {
    qty: parseFloat(m[1]),
    area: parseFloat(m[2]),
    unit: m[3],
    name: m[4].trim()
  };
}

function normalizeEngineResponse(engineRes, soilData, cropKey, areaHectares) {
  if (!engineRes || typeof engineRes !== 'object') {
    return calculateFertilizerRecommendation(soilData, cropKey, areaHectares);
  }
  // Engine returns up to N alternative combos in standard_mix, ranked ascending
  // by Total Weight. Pick the lowest-weight combo as the recommended prescription.
  // adjusted_mix is reserved for future pH-adjusted output; engine doesn't emit it yet.
  const mixCandidates = Array.isArray(engineRes.adjusted_mix) && engineRes.adjusted_mix.length
    ? engineRes.adjusted_mix
    : engineRes.standard_mix;
  if (!Array.isArray(mixCandidates) || !mixCandidates.length) {
    return calculateFertilizerRecommendation(soilData, cropKey, areaHectares);
  }
  const bestCombo = mixCandidates[0];
  const prescriptions = (bestCombo.Prescription || [])
    .map(parsePrescriptionString)
    .filter(Boolean);
  const recommendations = prescriptions
    .map((p) => {
      const cls = classifyByInventory(p.name, engineRes.inventory);
      const pricePerKg = ENGINE_NAME_TO_PRICE_PHP[p.name] ?? 0;
      return {
        stage: cls.stage,
        sortOrder: cls.sortOrder,
        fertilizer: { name: p.name, brand: '', pricePerKg },
        amountKg: p.qty,
        timing: '',
        method: 'Broadcast',
        cost: p.qty * pricePerKg
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ sortOrder, ...rec }) => rec);
  const totalBase = engineRes.total_base ?? { N: 0, P: 0, K: 0 };
  const ph = engineRes.ph_result ?? {};
  const phNeeded = typeof ph.ph_action === 'string' && ph.ph_action !== 'none';
  return {
    crop: { name: engineRes.selected_crop_label ?? engineRes.selected_crop ?? cropKey },
    recommendations,
    summary: {
      totalCostPHP: recommendations.reduce((s, r) => s + (r.cost || 0), 0),
      totalNutrients: {
        n: Number(totalBase.N ?? 0),
        p: Number(totalBase.P ?? 0),
        k: Number(totalBase.K ?? 0)
      },
      areaHectares: engineRes.area_ha ?? areaHectares ?? 1,
      expectedYield: ''
    },
    phAdjustment: {
      needed: phNeeded,
      reason: ph.borderline_message || ph.recommendation_message || '',
      action: ph.ph_action || '',
      amount: '',
      timing: ''
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
