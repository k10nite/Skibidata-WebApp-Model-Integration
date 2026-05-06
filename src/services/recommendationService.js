import { calculateFertilizerRecommendation } from './fertilizerEngine';
import { log } from './logger';

const RULE_API_URL = import.meta.env.VITE_RULE_API_URL;
const FETCH_TIMEOUT_MS = 8000;

// Canonical NPK % for every fertilizer Hans's engine knows. Mirrors
// _hans_rulebased/fertilizers.json. Used as a fallback when the engine's
// response doesn't include the inventory needed for per-row breakdown
// (the response only includes user_inventory, which is empty when the
// user hasn't picked any chips).
const MASTER_INVENTORY = {
  'Urea':                        { n: 46,   p: 0,  k: 0 },
  'Ammonium Sulfate':            { n: 21,   p: 0,  k: 0 },
  'Nitrabor':                    { n: 15.4, p: 0,  k: 0 },
  'T-14 (Complete)':             { n: 14,   p: 14, k: 14 },
  'Yara Unik (16-16-16)':        { n: 16,   p: 16, k: 16 },
  'Ammonium Phosphate':          { n: 16,   p: 20, k: 0 },
  'Yara Mila Winner (15-9-20)':  { n: 15,   p: 9,  k: 20 },
  'Yara Mila Palme (13-33-21)':  { n: 13,   p: 33, k: 21 },
  'Yara Mila Grower (13-31-21)': { n: 13,   p: 31, k: 21 },
  'Yara Mila Hydran (19-4-19)':  { n: 19,   p: 4,  k: 19 },
  'Solophos (18)':               { n: 0,    p: 18, k: 0 },
  'Super phosphate(20)':         { n: 0,    p: 20, k: 0 },
  'Duofos (22)':                 { n: 0,    p: 22, k: 0 },
  'Muriate of Potash':           { n: 0,    p: 0,  k: 60 }
};

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

// Hans's engine does string equality on fertilizer names — including the
// parenthesized portions like "(14-14-14)" and "(18)". The previous
// implementation stripped parens, which broke 5 of 14 chips silently.
// Now we just split on commas/semicolons/newlines and trim whitespace.
function parseAvailableFertilizers(text) {
  if (!text || typeof text !== 'string') return null;
  const names = text
    .split(/[,\n;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  log.rule('parseAvailableFertilizers', { input: text, parsed: names });
  return names.length ? names : null;
}

// Tolerate both shapes: flat string ({ nitrogen: "Low" }) emitted by mlPredictionService /
// mlPredictions.json, AND nested ({ nitrogen: { rating: "Low" } }) used by older fixtures.
function readRating(field) {
  if (typeof field === 'string') return field;
  if (field && typeof field === 'object' && typeof field.rating === 'string') return field.rating;
  return 'Medium';
}

// pH lands in the store via different paths: mlPredictions.json emits
// strings like "Slightly Acidic", liamMLService normalizes Liam's response
// to a number. Tolerate both. Also tolerate the legacy lowercase `ph` key.
function readPh(soilData) {
  const candidates = [soilData?.pH, soilData?.ph];
  for (const v of candidates) {
    if (typeof v === 'number' && v >= 3 && v <= 9) return v;
    if (typeof v === 'string') {
      const n = parseFloat(v);
      if (!Number.isNaN(n) && n >= 3 && n <= 9) return n;
      const s = v.toLowerCase();
      if (s.includes('strongly acid')) return 4.5;
      if (s.includes('slightly acid')) return 6.0;
      if (s.includes('acidic')) return 5.2;
      if (s.includes('neutral')) return 6.8;
      if (s.includes('slightly alkal')) return 7.4;
      if (s.includes('alkaline')) return 7.8;
    }
  }
  return 6.0;
}

function mapSoilToEngine(soilData, cropKey, areaHectares, availableFertilizers) {
  const nRating = readRating(soilData?.nitrogen);
  const pRating = readRating(soilData?.phosphorus);
  const kRating = readRating(soilData?.potassium);
  return {
    crop_label: CROP_LABEL_MAP[cropKey] ?? 'Cabbage',
    n_status: N_STATUS_MAP[nRating] ?? 'Medium',
    p_status: P_STATUS_MAP[pRating] ?? 'Medium',
    k_status: K_STATUS_MAP[kRating] ?? 'Medium',
    soil_ph: readPh(soilData),
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
  'T-14 (Complete)': 55,
  'Yara Unik (16-16-16)': 60,
  'Muriate of Potash': 50,
  'Solophos (18)': 40,
  'Super phosphate(20)': 42,
  'Duofos (22)': 44,
  'Ammonium Phosphate': 50,
  'Nitrabor': 70
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

  // Look up fertilizer NPK %. The engine does NOT include a master inventory
  // in its response — only `user_inventory` (the user's filtered selection).
  // We try user_inventory first, then fall back to MASTER_INVENTORY (hardcoded
  // mirror of _hans_rulebased/fertilizers.json) so per-row breakdown works
  // even when the user hasn't picked any chips.
  const responseInv = {};
  if (Array.isArray(engineRes.user_inventory)) {
    for (const item of engineRes.user_inventory) {
      if (item?.name) responseInv[item.name] = item;
    }
  }
  if (Array.isArray(engineRes.inventory)) {
    for (const item of engineRes.inventory) {
      if (item?.name) responseInv[item.name] = item;
    }
  }
  const getNpkPercent = (name) => {
    const f = responseInv[name] ?? MASTER_INVENTORY[name];
    if (!f) {
      log.warn('getNpkPercent: unknown fertilizer', name);
      return { n: 0, p: 0, k: 0 };
    }
    return {
      n: typeof f.n === 'number' ? f.n : 0,
      p: typeof f.p === 'number' ? f.p : 0,
      k: typeof f.k === 'number' ? f.k : 0
    };
  };

  // Process ALL candidates, not just the best one
  const candidates = mixCandidates.map((combo, index) => {
    const prescriptions = (combo.Prescription || [])
      .map(parsePrescriptionString)
      .filter(Boolean);
    const recommendations = prescriptions
      .map((p) => {
        const cls = classifyByInventory(p.name, engineRes.inventory);
        const pricePerKg = ENGINE_NAME_TO_PRICE_PHP[p.name] ?? 0;
        const npkPct = getNpkPercent(p.name);
        return {
          stage: cls.stage,
          sortOrder: cls.sortOrder,
          fertilizer: { name: p.name, brand: '', pricePerKg, npkPercent: npkPct },
          amountKg: p.qty,
          // Per-row nutrient contribution: kg × percentage / 100
          deliveredN: (p.qty * npkPct.n) / 100,
          deliveredP: (p.qty * npkPct.p) / 100,
          deliveredK: (p.qty * npkPct.k) / 100,
          timing: '',
          method: 'Broadcast',
          cost: p.qty * pricePerKg
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(({ sortOrder: _, ...cleanRec }) => cleanRec);

    return {
      sourceName: combo.Source || `Combo ${index + 1}`,
      totalWeight: combo['Total Weight'] || 0,
      applied: {
        n: combo['Applied N'] || 0,
        p: combo['Applied P'] || 0,
        k: combo['Applied K'] || 0
      },
      prescriptions: recommendations,
      // Hans's raw Prescription strings — preserved for "engine output" display
      rawPrescription: combo.Prescription || [],
      cost: recommendations.reduce((s, r) => s + (r.cost || 0), 0)
    };
  });

  // Use the first (best) combo for backwards compatibility
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
    .map(({ sortOrder: _, ...cleanRec }) => cleanRec);
  const totalBase = engineRes.total_base ?? { N: 0, P: 0, K: 0 };
  const ph = engineRes.ph_result ?? {};
  const phNeeded = typeof ph.ph_action === 'string' && ph.ph_action !== 'none';
  return {
    crop: { name: engineRes.selected_crop_label ?? engineRes.selected_crop ?? cropKey },
    recommendations,
    selectedCandidateIndex: 0,
    candidates,
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
    log.rule('POST /recommendation → engine', { url: RULE_API_URL, body });
    const t0 = performance.now();
    const res = await fetch(`${RULE_API_URL.replace(/\/$/, '')}/recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    const ms = Math.round(performance.now() - t0);
    if (!res.ok) {
      log.warn(`engine HTTP ${res.status} in ${ms}ms`, { status: res.status });
      throw new Error(`Engine HTTP ${res.status}`);
    }
    const data = await res.json();
    log.rule(`engine response ${res.status} in ${ms}ms`, {
      crop: data.selected_crop_label,
      total_base: data.total_base,
      ph_action: data.ph_result?.ph_action,
      candidates: (data.standard_mix || []).length,
      user_inventory_size: (data.user_inventory || []).length,
      inventory_check_valid: data.inventory_check?.valid,
      inventory_check_reason: data.inventory_check?.reason
    });
    return normalizeEngineResponse(data, soilData, cropKey, areaHectares);
  } finally {
    clearTimeout(t);
  }
}

export function getRecommendationForCrop(soilData, cropKey, areaHectares = 1) {
  // Sync version always returns the local stub — the async path is canonical.
  return calculateFertilizerRecommendation(soilData, cropKey, areaHectares);
}

export async function getRecommendationForCropAsync(soilData, cropKey, areaHectares = 1, availableFertilizers = '') {
  log.rule('getRecommendationForCropAsync called', {
    cropKey,
    areaHectares,
    availableFertilizers,
    soilStatus: { n: soilData?.nitrogen, p: soilData?.phosphorus, k: soilData?.potassium, ph: soilData?.pH },
    engineConfigured: Boolean(RULE_API_URL)
  });
  if (!RULE_API_URL) {
    log.warn('VITE_RULE_API_URL not set — using local stub');
    return calculateFertilizerRecommendation(soilData, cropKey, areaHectares);
  }
  try {
    return await fetchFromEngine(soilData, cropKey, areaHectares, availableFertilizers);
  } catch (err) {
    log.warn('engine fetch failed, falling back to local stub', { error: err?.message ?? String(err) });
    return calculateFertilizerRecommendation(soilData, cropKey, areaHectares);
  }
}
