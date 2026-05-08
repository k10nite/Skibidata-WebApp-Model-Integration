// PlantSelection — content-first redesign.
// The previous attempts ornamented a thin screen; this one carries weight via
// real data: polygon thumbnail, weather + elevation, ML soil profile, and
// crop recommendations scored against the field's actual conditions.

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAppStore from '../store/appStore';
import AnesBrand from '../components/AnesBrand';
import { getWeatherData } from '../services/satelliteService';
import { buildPolygonPreviewUrl } from '../services/mapboxStaticService';
import { log } from '../services/logger';

// ─────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────

const CROPS_DATA = [
  // Vegetables (21 crops)
  { id: 'cabbage', name: 'Cabbage', nameFil: 'Repolyo', category: 'vegetables', engineLabel: 'Cabbage' },
  { id: 'cabbage_head', name: 'Cabbage (Head)', nameFil: 'Repolyong Ulo', category: 'vegetables', engineLabel: 'Cabbage (Head)' },
  { id: 'pechay', name: 'Pechay', nameFil: 'Pechay', category: 'vegetables', engineLabel: 'Pechay' },
  { id: 'mustard', name: 'Mustard', nameFil: 'Mustasa', category: 'vegetables', engineLabel: 'Mustard' },
  { id: 'cauliflower', name: 'Cauliflower', nameFil: 'Cauliflower', category: 'vegetables', engineLabel: 'Cauliflower' },
  { id: 'broccoli', name: 'Broccoli', nameFil: 'Broccoli', category: 'vegetables', engineLabel: 'Broccoli' },
  { id: 'lettuce', name: 'Lettuce', nameFil: 'Lettuce', category: 'vegetables', engineLabel: 'Lettuce' },
  { id: 'celery', name: 'Celery', nameFil: 'Celery', category: 'vegetables', engineLabel: 'Celery' },
  { id: 'eggplant', name: 'Eggplant', nameFil: 'Talong', category: 'vegetables', engineLabel: 'Eggplant' },
  { id: 'tomato', name: 'Tomato', nameFil: 'Kamatis', category: 'vegetables', engineLabel: 'Tomato' },
  { id: 'bell_pepper', name: 'Bell Pepper', nameFil: 'Bell Pepper', category: 'vegetables', engineLabel: 'Bell Pepper' },
  { id: 'pepper', name: 'Pepper', nameFil: 'Sili', category: 'vegetables', engineLabel: 'Pepper' },
  { id: 'green_pepper', name: 'Green (siling-haba) Pepper', nameFil: 'Siling Haba', category: 'vegetables', engineLabel: 'Green (siling-haba) Pepper' },
  { id: 'black_pepper', name: 'Black Pepper', nameFil: 'Paminta', category: 'vegetables', engineLabel: 'Black Pepper' },
  { id: 'squash', name: 'Squash', nameFil: 'Kalabasa', category: 'vegetables', engineLabel: 'Squash' },
  { id: 'cucumber', name: 'Cucumber', nameFil: 'Pepino', category: 'vegetables', engineLabel: 'Cucumber' },
  { id: 'patola', name: 'Patola', nameFil: 'Patola', category: 'vegetables', engineLabel: 'Patola' },
  { id: 'okra_local', name: 'Okra (Local)', nameFil: 'Okra', category: 'vegetables', engineLabel: 'Okra (Local)' },
  { id: 'okra_hybrid', name: 'Okra (Hybrid)', nameFil: 'Okra Hybrid', category: 'vegetables', engineLabel: 'Okra (Hybrid)' },
  { id: 'ampalaya', name: 'Ampalaya', nameFil: 'Ampalaya', category: 'vegetables', engineLabel: 'Ampalaya' },
  { id: 'chayote', name: 'Chayote', nameFil: 'Sayote', category: 'vegetables', engineLabel: 'Chayote' },

  // Root crops (8)
  { id: 'potato', name: 'Potato', nameFil: 'Patatas', category: 'roots', engineLabel: 'Potato' },
  { id: 'carrot', name: 'Carrot', nameFil: 'Karot', category: 'roots', engineLabel: 'Carrot' },
  { id: 'radish', name: 'Radish/Turnips', nameFil: 'Labanos', category: 'roots', engineLabel: 'Radish/Turnips' },
  { id: 'parsnip', name: 'Parsnip', nameFil: 'Parsnip', category: 'roots', engineLabel: 'Parsnip' },
  { id: 'garlic', name: 'Garlic', nameFil: 'Bawang', category: 'roots', engineLabel: 'Garlic' },
  { id: 'onion', name: 'Onion', nameFil: 'Sibuyas', category: 'roots', engineLabel: 'Onion' },
  { id: 'ginger_local', name: 'Ginger (Local)', nameFil: 'Luya', category: 'roots', engineLabel: 'Ginger (Local)' },
  { id: 'ginger_improved', name: 'Ginger (Improved)', nameFil: 'Luyang Bago', category: 'roots', engineLabel: 'Ginger (Improved)' },

  // Beans/Pulses (10)
  { id: 'string_beans', name: 'String Beans', nameFil: 'Sitaw', category: 'beans', engineLabel: 'String Beans' },
  { id: 'snap_bean', name: 'Snap Bean', nameFil: 'Snap Bean', category: 'beans', engineLabel: 'Snap Bean' },
  { id: 'baguio_beans', name: 'Baguio Beans', nameFil: 'Baguio Beans', category: 'beans', engineLabel: 'Baguio Beans' },
  { id: 'lima', name: 'Lima (Patani)', nameFil: 'Patani', category: 'beans', engineLabel: 'Lima (Patani)' },
  { id: 'winged_beans', name: 'Winged Beans', nameFil: 'Sigarilyas', category: 'beans', engineLabel: 'Winged Beans' },
  { id: 'seguidillas', name: 'Seguidillas', nameFil: 'Seguidillas', category: 'beans', engineLabel: 'Seguidillas' },
  { id: 'dwarf_beans', name: 'Dwarf Beans', nameFil: 'Dwarf Beans', category: 'beans', engineLabel: 'Dwarf Beans' },
  { id: 'batao', name: 'Batao', nameFil: 'Batao', category: 'beans', engineLabel: 'Batao' },
  { id: 'peas', name: 'Peas', nameFil: 'Gisantes', category: 'beans', engineLabel: 'Peas' },

  // Herbs (2)
  { id: 'basil', name: 'Basil', nameFil: 'Balanoy', category: 'herbs', engineLabel: 'Basil' },
  { id: 'mint', name: 'Mint herb', nameFil: 'Mint', category: 'herbs', engineLabel: 'Mint herb' },

  // Highland (1)
  { id: 'asparagus', name: 'Asparagus', nameFil: 'Asparagus', category: 'highland', engineLabel: 'Asparagus' }
];

const NITROGEN_PURE = [
  { name: 'Urea', npk: '46-0-0' },
  { name: 'Ammonium Sulfate', npk: '21-0-0' },
  { name: 'Nitrabor', npk: '15.4-0-0' }
];
const COMPOUND_COMPLETE = [
  { name: 'T-14 (Complete)', npk: '14-14-14' },
  { name: 'Yara Unik (16-16-16)', npk: '16-16-16' },
  { name: 'Ammonium Phosphate', npk: '16-20-0' },
  { name: 'Yara Mila Winner (15-9-20)', npk: '15-9-20' },
  { name: 'Yara Mila Palme (13-33-21)', npk: '13-33-21' },
  { name: 'Yara Mila Grower (13-31-21)', npk: '13-31-21' },
  { name: 'Yara Mila Hydran (19-4-19)', npk: '19-4-19' }
];
const PHOSPHORUS_POTASSIUM = [
  { name: 'Solophos (18)', npk: '0-18-0' },
  { name: 'Super phosphate(20)', npk: '0-20-0' },
  { name: 'Duofos (22)', npk: '0-22-0' },
  { name: 'Muriate of Potash', npk: '0-0-60' }
];
const ALL_FERTILIZERS = [...NITROGEN_PURE, ...COMPOUND_COMPLETE, ...PHOSPHORUS_POTASSIUM];

// Ideal pH range + nitrogen tolerance for the most common crops.
// Used to score "Recommended for your soil." Sourced from PhilRice / BSU
// extension docs. Crops not listed default to a generic vegetable profile.
const CROP_FIT = {
  potato:        { ph: [5.0, 6.5], nMin: 'Low' },
  cabbage:       { ph: [5.5, 6.5], nMin: 'Medium' },
  cabbage_head:  { ph: [5.5, 6.5], nMin: 'Medium' },
  pechay:        { ph: [5.5, 6.8], nMin: 'Medium' },
  mustard:       { ph: [5.5, 6.8], nMin: 'Medium' },
  lettuce:       { ph: [5.5, 6.5], nMin: 'Medium' },
  carrot:        { ph: [5.5, 6.5], nMin: 'Medium' },
  broccoli:      { ph: [6.0, 6.8], nMin: 'Medium' },
  cauliflower:   { ph: [6.0, 6.8], nMin: 'Medium' },
  tomato:        { ph: [6.0, 6.8], nMin: 'Medium' },
  eggplant:      { ph: [6.0, 6.8], nMin: 'Medium' },
  bell_pepper:   { ph: [6.0, 6.8], nMin: 'Medium' },
  pepper:        { ph: [6.0, 6.8], nMin: 'Medium' },
  squash:        { ph: [5.8, 6.8], nMin: 'Medium' },
  cucumber:      { ph: [5.8, 7.0], nMin: 'Medium' },
  ampalaya:      { ph: [5.5, 6.7], nMin: 'Medium' },
  chayote:       { ph: [5.5, 7.0], nMin: 'Medium' },
  string_beans:  { ph: [6.0, 7.0], nMin: 'Low' },
  snap_bean:     { ph: [6.0, 7.0], nMin: 'Low' },
  baguio_beans:  { ph: [6.0, 7.0], nMin: 'Low' },
  peas:          { ph: [6.0, 7.0], nMin: 'Low' },
  garlic:        { ph: [6.0, 7.0], nMin: 'Medium' },
  onion:         { ph: [6.0, 7.0], nMin: 'Medium' },
  ginger_local:  { ph: [5.5, 6.5], nMin: 'Medium' },
  asparagus:     { ph: [6.5, 7.5], nMin: 'Medium' }
};

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

function readRating(field) {
  if (typeof field === 'string') return field;
  if (field && typeof field === 'object' && typeof field.rating === 'string') return field.rating;
  return 'Unknown';
}

function phToNumeric(soilData) {
  // The inference service normalizes pH dominant_class to a numeric value.
  if (typeof soilData?.pH === 'number') return soilData.pH;
  if (typeof soilData?.pH === 'string') {
    // Try direct parse first ("6.4" from inference normalizer).
    const n = parseFloat(soilData.pH);
    if (!Number.isNaN(n) && n >= 3 && n <= 9) return n;
    // Categorical mlPredictions.json strings.
    const s = soilData.pH.toLowerCase();
    if (s.includes('strongly acid')) return 4.5;
    if (s.includes('slightly acid')) return 6.0;
    if (s.includes('acidic')) return 5.2;
    if (s.includes('neutral')) return 6.8;
    if (s.includes('slightly alkal')) return 7.4;
    if (s.includes('alkaline')) return 7.8;
  }
  return 6.5;
}

const N_RANK = { Low: 1, Medium: 2, High: 3 };

function scoreCrop(crop, soilData) {
  const fit = CROP_FIT[crop.id] ?? { ph: [5.5, 7.0], nMin: 'Medium' };
  const ph = phToNumeric(soilData);
  const n = readRating(soilData?.nitrogen);

  let score = 0;
  // pH match
  if (ph >= fit.ph[0] && ph <= fit.ph[1]) score += 4;
  else if (ph >= fit.ph[0] - 0.4 && ph <= fit.ph[1] + 0.4) score += 2;

  // Nitrogen tolerance
  const nLevel = N_RANK[n] ?? 2;
  const required = N_RANK[fit.nMin] ?? 2;
  if (nLevel >= required) score += 3;
  else if (nLevel === required - 1) score += 1;

  return score;
}

function recommendCrops(soilData, n = 3) {
  if (!soilData) return [];
  const scored = CROPS_DATA
    .map((c) => ({ crop: c, score: scoreCrop(c, soilData) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  // Take top n, with at least one beans entry if any qualifies (diversity).
  const top = scored.slice(0, n);
  return top;
}

function fitLabel(score) {
  if (score >= 7) return 'BEST FIT';
  if (score >= 5) return 'GOOD FIT';
  if (score >= 3) return 'WORKABLE';
  return 'STRETCH';
}

const groupedCrops = (() => {
  const groups = {};
  CROPS_DATA.forEach((c) => {
    if (!groups[c.category]) groups[c.category] = [];
    groups[c.category].push(c);
  });
  return groups;
})();

const CATEGORY_ORDER = ['vegetables', 'roots', 'beans', 'herbs', 'highland'];
const categoryLabels = {
  vegetables: 'VEGETABLES',
  roots: 'ROOT CROPS',
  beans: 'BEANS / PULSES',
  herbs: 'HERBS',
  highland: 'HIGHLAND'
};

// ─────────────────────────────────────────────────────────────────────────
// Motion
// ─────────────────────────────────────────────────────────────────────────

const containerVariants = {
  initial: {},
  animate: { transition: { delayChildren: 0.05, staggerChildren: 0.06 } }
};
const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
};

// ─────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────

export default function PlantSelection() {
  const navigate = useNavigate();
  const {
    selectedPlant,
    setSelectedPlant,
    soilData,
    municipality,
    field,
    fieldAreaHa,
    fieldCenter,
    areaHectares,
    setAreaHectares,
    availableFertilizers,
    setAvailableFertilizers
  } = useAppStore();

  const [selectedCrop, setSelectedCrop] = useState(() => {
    if (!selectedPlant) return null;
    return CROPS_DATA.find((crop) =>
      crop.id === selectedPlant.id || crop.engineLabel === selectedPlant.name
    ) || null;
  });
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [weather, setWeather] = useState(null);
  const [selectedFertilizers, setSelectedFertilizers] = useState(() => {
    if (!availableFertilizers) return new Set();
    const items = availableFertilizers.split(',').map((s) => s.trim()).filter(Boolean);
    const known = ALL_FERTILIZERS.map((f) => f.name);
    return new Set(items.filter((it) => known.includes(it)));
  });

  useEffect(() => {
    if (!selectedPlant) {
      setSelectedCrop(null);
      return;
    }
    const storedCrop = CROPS_DATA.find((crop) =>
      crop.id === selectedPlant.id || crop.engineLabel === selectedPlant.name
    ) || null;
    setSelectedCrop(storedCrop);
  }, [selectedPlant]);

  // One-time area seed from polygon
  useEffect(() => {
    if (fieldAreaHa > 0 && areaHectares === 1) setAreaHectares(fieldAreaHa);
  }, [fieldAreaHa, areaHectares, setAreaHectares]);

  // Weather fetch on mount when we know the location
  useEffect(() => {
    let cancelled = false;
    const loc = municipality || 'La Trinidad';
    getWeatherData(loc)
      .then((data) => { if (!cancelled) setWeather(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [municipality]);

  const polygonUrl = useMemo(() => buildPolygonPreviewUrl(field, { width: 720, height: 360 }), [field]);
  const hasField = Boolean(field && fieldAreaHa > 0 && polygonUrl);
  const recommendations = useMemo(() => recommendCrops(soilData, 3), [soilData]);

  const filteredGrouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const out = {};
    CATEGORY_ORDER.forEach((cat) => {
      if (activeCategory !== 'all' && activeCategory !== cat) return;
      const items = (groupedCrops[cat] || []).filter((c) => {
        if (!q) return true;
        return c.name.toLowerCase().includes(q) || c.nameFil.toLowerCase().includes(q);
      });
      if (items.length) out[cat] = items;
    });
    return out;
  }, [search, activeCategory]);

  const totalFiltered = useMemo(
    () => Object.values(filteredGrouped).reduce((sum, arr) => sum + arr.length, 0),
    [filteredGrouped]
  );

  const handleFertilizerToggle = (name) => {
    setSelectedFertilizers((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
        log.store('fertilizer chip removed', { name, count: next.size });
      } else {
        next.add(name);
        log.store('fertilizer chip added', { name, count: next.size });
      }
      const csv = Array.from(next).join(', ');
      setAvailableFertilizers(csv);
      log.store('availableFertilizers → store', csv || '(empty)');
      return next;
    });
  };

  const handleContinue = () => {
    if (!hasField) {
      navigate('/location-selection');
      return;
    }
    if (!selectedCrop) return;
    log.flow('PlantSelection → /soil-status', {
      crop: selectedCrop.engineLabel,
      cropId: selectedCrop.id,
      areaHectares,
      availableFertilizers: Array.from(selectedFertilizers).join(', ') || '(empty)',
      fertilizerCount: selectedFertilizers.size
    });
    setSelectedPlant({
      name: selectedCrop.engineLabel,
      id: selectedCrop.id,
      nameFil: selectedCrop.nameFil,
      category: selectedCrop.category
    }, null);
    navigate('/soil-status');
  };

  const liamRich = soilData?.liam;
  const nStatus = readRating(soilData?.nitrogen);
  const pStatus = readRating(soilData?.phosphorus);
  const kStatus = readRating(soilData?.potassium);
  const phStr = soilData?.pH != null ? String(soilData.pH) : '—';
  const ph = phToNumeric(soilData);

  // ───────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={containerVariants}
      className="min-h-screen relative terrace-page-with-mobile-actions"
      style={{
        background: 'var(--color-paper)',
        fontFamily: '"Fraunces", serif'
      }}
    >
      {/* Subtle topo background */}
      <svg className="terrace-topo opacity-[0.04] fixed inset-0 pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path d="M0,200 Q300,150 600,200 T1200,200" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0,360 Q400,310 800,360 T1200,360" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0,520 Q200,470 500,520 T1200,520" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">

        {/* ─────────── LEFT (62%) — content-first composition ─────────── */}
        <motion.div
          variants={itemVariants}
          className="w-full lg:w-[60%] px-4 sm:px-6 lg:px-14 xl:px-20 py-6 lg:py-10"
        >
          {/* Hero — slim, no giant ornament */}
          <div className="mb-6">
            <AnesBrand compact className="mb-5" />
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
                letterSpacing: '0.22em',
                color: 'var(--color-moss)',
                fontWeight: 600,
                marginBottom: '12px'
              }}
            >
              02 — CROP
            </div>
            <h1
              style={{
                fontFamily: '"Fraunces", serif',
                fontSize: 'clamp(3rem, 4.6vw, 4.5rem)',
                lineHeight: 1.0,
                fontVariationSettings: '"opsz" 144, "wght" 600',
                color: 'var(--color-earth-deep)',
                margin: 0
              }}
            >
              What&apos;s growing here?
            </h1>
          </div>

          {/* Polygon thumbnail — visual anchor */}
          <motion.div variants={itemVariants} className="mb-6">
            <div
              className="relative overflow-hidden"
              style={{
                width: '100%',
                aspectRatio: '2 / 1',
                background: 'var(--color-paper-card)',
                border: '1px solid var(--color-contour)',
                borderRadius: '4px',
                boxShadow: '0 1px 0 rgba(73,40,40,0.04), 0 24px 48px -32px rgba(73,40,40,0.10)'
              }}
            >
              {hasField ? (
                <img
                  src={polygonUrl}
                  alt="Drawn field polygon on satellite imagery"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    fontFamily: '"Fraunces", serif',
                    fontStyle: 'italic',
                    color: 'var(--color-earth-deep)',
                    opacity: 0.45,
                    fontSize: '14px'
                  }}
                >
                  <div>No polygon — go back and draw your field.</div>
                  <button
                    onClick={() => navigate('/location-selection')}
                    className="terrace-btn mt-5"
                    style={{ padding: '0.85rem 1.2rem', fontStyle: 'normal' }}
                  >
                    Draw Field
                  </button>
                </div>
              )}

              {/* Overlay label, top-left */}
              <div
                className="absolute top-3 left-3 px-2.5 py-1.5"
                style={{
                  background: 'rgba(241, 237, 229, 0.92)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '2px',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  color: 'var(--color-earth-deep)',
                  fontWeight: 600
                }}
              >
                FIELD · {hasField ? fieldAreaHa.toFixed(2) : '0.00'} ha
              </div>

              {/* Centroid coordinates, bottom-right */}
              {fieldCenter && (
                <div
                  className="absolute bottom-3 right-3 px-2.5 py-1.5"
                  style={{
                    background: 'rgba(241, 237, 229, 0.92)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '2px',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '10px',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--color-earth-deep)'
                  }}
                >
                  {fieldCenter.lat.toFixed(4)}° N · {fieldCenter.lng.toFixed(4)}° E
                </div>
              )}
            </div>
          </motion.div>

          {/* Telemetry strip — 4 cells, real data */}
          <motion.div variants={itemVariants} className="mb-6">
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-px"
              style={{ background: 'var(--color-contour)', border: '1px solid var(--color-contour)', borderRadius: '4px', overflow: 'hidden' }}
            >
              <TelemetryCell label="LOCATION" value={municipality || 'La Trinidad'} />
              <TelemetryCell label="AREA" value={hasField ? `${fieldAreaHa.toFixed(2)} ha` : 'No field'} mono />
              <TelemetryCell
                label="CLIMATE"
                value={
                  weather?.current
                    ? `${Math.round(weather.current.temperature)}° / ${Math.round(weather.current.humidity)}%`
                    : '—'
                }
                mono
              />
              <TelemetryCell
                label="ELEVATION"
                value={weather?.elevation ? `${weather.elevation} m` : '—'}
                mono
              />
            </div>
          </motion.div>

          {/* Soil profile — N/P/K + pH with confidence bars when inference data exists */}
          <motion.div variants={itemVariants} className="mb-6">
            <div
              className="flex items-baseline justify-between"
              style={{ marginBottom: '10px' }}
            >
              <Eyebrow>SOIL PROFILE</Eyebrow>
              <Caption>
                {liamRich
                  ? `n=${liamRich.sample_count ?? '?'} samples · ${(liamRich.polygon_area_ha ?? 0).toFixed(2)} ha`
                  : soilData?.source === 'placeholder'
                  ? 'regional estimate'
                  : 'pending'}
              </Caption>
            </div>

            <div
              style={{
                background: 'var(--color-paper-card)',
                border: '1px solid var(--color-contour)',
                borderRadius: '4px',
                padding: '20px'
              }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <NutrientCell letter="N" status={nStatus} dist={liamRich?.nitrogen?.class_distribution} />
                <NutrientCell letter="P" status={pStatus} dist={liamRich?.phosphorus?.class_distribution} />
                <NutrientCell letter="K" status={kStatus} dist={liamRich?.potassium?.class_distribution} />
                <PhCell ph={ph} phStr={phStr} />
              </div>

              {liamRich?.warnings?.length > 0 && (
                <div
                  className="mt-4 pt-3"
                  style={{
                    borderTop: '1px solid var(--color-contour)',
                    fontFamily: '"Fraunces", serif',
                    fontStyle: 'italic',
                    fontSize: '12px',
                    color: 'var(--color-rust)'
                  }}
                >
                  {liamRich.warnings.length} warning(s): {liamRich.warnings.slice(0, 2).join('; ')}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recommended for your soil — 3 crops scored */}
          {recommendations.length > 0 && (
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex items-baseline justify-between" style={{ marginBottom: '10px' }}>
                <Eyebrow>RECOMMENDED FOR YOUR SOIL</Eyebrow>
                <Caption>scored against pH {ph.toFixed(1)} · N={nStatus}</Caption>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendations.map(({ crop, score }) => (
                  <button
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop)}
                    className="text-left transition-all duration-200"
                    style={{
                      background: selectedCrop?.id === crop.id ? 'var(--color-moss)' : 'var(--color-paper-card)',
                      color: selectedCrop?.id === crop.id ? 'var(--color-paper)' : 'var(--color-earth-deep)',
                      border: '1px solid var(--color-contour)',
                      borderRadius: '4px',
                      padding: '14px 16px'
                    }}
                  >
                    <div
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '9px',
                        letterSpacing: '0.18em',
                        color: selectedCrop?.id === crop.id ? 'var(--color-paper)' : 'var(--color-moss)',
                        fontWeight: 600,
                        marginBottom: '6px',
                        opacity: selectedCrop?.id === crop.id ? 0.85 : 1
                      }}
                    >
                      {fitLabel(score)}
                    </div>
                    <div style={{ fontFamily: '"Fraunces", serif', fontSize: '17px', fontVariationSettings: '"opsz" 144, "wght" 500', lineHeight: 1.15 }}>
                      {crop.name}
                    </div>
                    <div
                      style={{
                        fontFamily: '"Fraunces", serif',
                        fontStyle: 'italic',
                        fontSize: '12px',
                        opacity: 0.65,
                        marginTop: '2px'
                      }}
                    >
                      {crop.nameFil}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Engine Inputs — area override + on-hand fertilizer chips */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-baseline justify-between" style={{ marginBottom: '10px' }}>
              <Eyebrow>ENGINE INPUTS</Eyebrow>
              <Caption>passed to the rule-based engine on Continue</Caption>
            </div>

            <div
              style={{
                background: 'var(--color-paper-card)',
                border: '1px solid var(--color-contour)',
                borderRadius: '4px',
                padding: '20px'
              }}
            >
              {/* Area override */}
              <div className="mb-5 flex items-end gap-4">
                <div className="flex-1">
                  <div
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      color: 'var(--color-earth-deep)',
                      opacity: 0.55,
                      marginBottom: '6px'
                    }}
                  >
                    FIELD AREA
                  </div>
                  <div className="flex items-baseline gap-2">
                    <input
                      type="number"
                      value={hasField ? areaHectares : ''}
                      onChange={(e) => setAreaHectares(Number(e.target.value) || 0)}
                      disabled={!hasField}
                      placeholder="--"
                      min="0.1"
                      step="0.1"
                      style={{
                        fontFamily: '"Fraunces", serif',
                        fontSize: '32px',
                        fontVariationSettings: '"opsz" 144, "wght" 600',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px dotted var(--color-contour)',
                        outline: 'none',
                        width: '120px',
                        color: 'var(--color-earth-deep)',
                        opacity: hasField ? 1 : 0.35
                      }}
                    />
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', color: 'var(--color-earth-deep)', opacity: 0.6 }}>
                      ha
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: '"Fraunces", serif',
                    fontStyle: 'italic',
                    fontSize: '12px',
                    color: 'var(--color-earth-deep)',
                    opacity: 0.55,
                    paddingBottom: '8px',
                    flexShrink: 0
                  }}
                >
                  {fieldAreaHa > 0 ? 'from your polygon' : 'set manually'}
                </div>
              </div>

              {/* Fertilizer chips — grouped */}
              <div>
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    color: 'var(--color-earth-deep)',
                    opacity: 0.55,
                    marginBottom: '10px'
                  }}
                >
                  ON-HAND FERTILIZERS · {selectedFertilizers.size} of {ALL_FERTILIZERS.length} selected
                </div>
                <FertilizerGroup label="Pure N" items={NITROGEN_PURE} selected={selectedFertilizers} onToggle={handleFertilizerToggle} />
                <FertilizerGroup label="Compound / Complete" items={COMPOUND_COMPLETE} selected={selectedFertilizers} onToggle={handleFertilizerToggle} />
                <FertilizerGroup label="P / K Sources" items={PHOSPHORUS_POTASSIUM} selected={selectedFertilizers} onToggle={handleFertilizerToggle} />
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* ─────────── RIGHT (38%) — index ─────────── */}
        <motion.div
          variants={itemVariants}
          className="w-full lg:w-[40%] flex flex-col lg:sticky lg:top-0 lg:h-screen"
          style={{
            background: 'var(--color-paper-card)',
            borderTop: '1px solid var(--color-contour)',
            borderLeft: '1px solid var(--color-contour)'
          }}
        >
          <div className="px-7 xl:px-9 py-7" style={{ borderBottom: '1px solid var(--color-contour)' }}>
            <div className="flex items-baseline justify-between mb-3">
              <Eyebrow>INDEX 02 — CROP</Eyebrow>
              <Caption>{totalFiltered} of {CROPS_DATA.length}</Caption>
            </div>

            {/* Search */}
            <div
              className="flex items-center"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                borderBottom: '1px solid var(--color-contour)',
                paddingBottom: '6px',
                marginBottom: '14px'
              }}
            >
              <span style={{ color: 'var(--color-moss)', fontSize: '13px', marginRight: '8px' }}>{'>'}</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search crops..."
                style={{
                  flex: 1,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '15px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-earth-deep)'
                }}
              />
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-1.5">
              <CategoryChip label="All" count={CROPS_DATA.length} active={activeCategory === 'all'} onClick={() => setActiveCategory('all')} />
              {CATEGORY_ORDER.map((cat) => (
                <CategoryChip
                  key={cat}
                  label={categoryLabels[cat]}
                  count={(groupedCrops[cat] || []).length}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </div>
          </div>

          {/* Crop list */}
          <div
            className="flex-1 overflow-y-auto terrace-scroll"
            style={{ fontFamily: '"Fraunces", serif' }}
          >
            {Object.keys(filteredGrouped).length === 0 && (
              <div
                className="px-8 py-12 text-center"
                style={{
                  fontFamily: '"Fraunces", serif',
                  fontStyle: 'italic',
                  color: 'var(--color-earth-deep)',
                  opacity: 0.5,
                  fontSize: '14px'
                }}
              >
                No crops match &ldquo;{search}&rdquo;.
              </div>
            )}
            {Object.entries(filteredGrouped).map(([cat, crops]) => (
              <div key={cat}>
                <div
                  className="sticky top-0 z-10 px-7 xl:px-9 py-3"
                  style={{
                    background: 'var(--color-paper-card)',
                    borderBottom: '1px solid var(--color-contour)',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '11px',
                    letterSpacing: '0.22em',
                    color: 'var(--color-moss)',
                    fontWeight: 600,
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{categoryLabels[cat]}</span>
                  <span style={{ opacity: 0.5 }}>{crops.length}</span>
                </div>
                {crops.map((crop) => {
                  const isSelected = selectedCrop?.id === crop.id;
                  return (
                    <button
                      key={crop.id}
                      onClick={() => setSelectedCrop(crop)}
                      className="w-full text-left flex items-center transition-all duration-150"
                      style={{
                        padding: '17px 28px',
                        background: isSelected ? 'var(--color-paper-deep)' : 'transparent',
                        borderBottom: '1px solid var(--color-contour)',
                        borderLeft: `3px solid ${isSelected ? 'var(--color-moss)' : 'transparent'}`
                      }}
                    >
                      <div className="flex-1">
                        <div
                          style={{
                            fontFamily: '"Fraunces", serif',
                            fontSize: '18px',
                            fontVariationSettings: '"opsz" 144, "wght" 500',
                            color: 'var(--color-earth-deep)',
                            lineHeight: 1.2
                          }}
                        >
                          {crop.name}
                        </div>
                        <div
                          style={{
                            fontFamily: '"Fraunces", serif',
                            fontStyle: 'italic',
                            fontSize: '14px',
                            color: 'var(--color-earth-deep)',
                            opacity: 0.55,
                            marginTop: '1px'
                          }}
                        >
                          {crop.nameFil}
                        </div>
                      </div>
                      {isSelected && (
                        <div
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '10px',
                            letterSpacing: '0.18em',
                            color: 'var(--color-moss)',
                            fontWeight: 600
                          }}
                        >
                          ✓ PICKED
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Continue — sticky-bottom on mobile via terrace-mobile-actions */}
          <div className="hidden lg:block px-7 xl:px-9 py-5 terrace-nav-shell">
            {!hasField ? (
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  color: 'var(--color-rust)',
                  opacity: 0.8,
                  marginBottom: '8px'
                }}
              >
                DRAW A FIELD BOUNDARY FIRST
              </div>
            ) : selectedCrop && (
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  color: 'var(--color-earth-deep)',
                  opacity: 0.6,
                  marginBottom: '8px'
                }}
              >
                → {selectedCrop.engineLabel} · {areaHectares.toFixed(2)} ha · {selectedFertilizers.size} fertilizer(s)
              </div>
            )}
            <button
              onClick={handleContinue}
              disabled={hasField && !selectedCrop}
              className="terrace-btn w-full"
              style={{
                padding: '1.1rem 2rem',
                opacity: !hasField || selectedCrop ? 1 : 0.4,
                cursor: !hasField || selectedCrop ? 'pointer' : 'not-allowed',
                letterSpacing: '0.18em'
              }}
            >
              {!hasField ? 'DRAW FIELD FIRST' : selectedCrop ? 'CONTINUE — REVIEW SOIL' : 'PICK A CROP FIRST'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile sticky bottom CTA — duplicates the desktop continue button so
          mobile users always have the action visible without scrolling. */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3 border-t"
        style={{
          background: 'var(--color-paper-card)',
          borderColor: 'var(--color-contour)',
          boxShadow: '0 -8px 20px -8px rgba(45,32,22,0.08)',
          paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0))'
        }}
      >
        {!hasField ? (
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '9px',
              letterSpacing: '0.18em',
              color: 'var(--color-rust)',
              opacity: 0.8,
              marginBottom: '6px',
              textAlign: 'center'
            }}
          >
            DRAW A FIELD BOUNDARY FIRST
          </div>
        ) : selectedCrop && (
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '9px',
              letterSpacing: '0.18em',
              color: 'var(--color-earth-deep)',
              opacity: 0.6,
              marginBottom: '6px',
              textAlign: 'center'
            }}
          >
            → {selectedCrop.engineLabel} · {areaHectares.toFixed(2)} HA · {selectedFertilizers.size} FERT
          </div>
        )}
        <button
          onClick={handleContinue}
          disabled={hasField && !selectedCrop}
          className="terrace-btn w-full justify-center"
          style={{
            padding: '0.95rem 1rem',
            opacity: !hasField || selectedCrop ? 1 : 0.4,
            cursor: !hasField || selectedCrop ? 'pointer' : 'not-allowed',
            letterSpacing: '0.18em'
          }}
        >
          {!hasField ? 'DRAW FIELD FIRST' : selectedCrop ? 'CONTINUE — REVIEW SOIL' : 'PICK A CROP FIRST'}
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────

function Eyebrow({ children }) {
  return (
    <div
      style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '10px',
        letterSpacing: '0.22em',
        color: 'var(--color-moss)',
        fontWeight: 600
      }}
    >
      {children}
    </div>
  );
}

function Caption({ children }) {
  return (
    <div
      style={{
        fontFamily: '"Fraunces", serif',
        fontStyle: 'italic',
        fontSize: '11px',
        color: 'var(--color-earth-deep)',
        opacity: 0.55
      }}
    >
      {children}
    </div>
  );
}

function TelemetryCell({ label, value, mono }) {
  return (
    <div
      style={{
        background: 'var(--color-paper-card)',
        padding: '14px 16px'
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.22em',
          color: 'var(--color-earth-deep)',
          opacity: 0.5,
          fontWeight: 600,
          marginBottom: '6px'
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: mono ? '"JetBrains Mono", monospace' : '"Fraunces", serif',
          fontSize: mono ? '15px' : '17px',
          fontVariationSettings: mono ? undefined : '"opsz" 144, "wght" 500',
          fontVariantNumeric: mono ? 'tabular-nums' : undefined,
          color: 'var(--color-earth-deep)',
          lineHeight: 1.1
        }}
      >
        {value}
      </div>
    </div>
  );
}

function NutrientCell({ letter, status, dist }) {
  const colorByLevel = {
    Low: 'var(--color-rust)',
    Medium: 'var(--color-ochre)',
    High: 'var(--color-moss)'
  };
  const accent = colorByLevel[status] ?? 'var(--color-earth-deep)';

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <div
          style={{
            fontFamily: '"Fraunces", serif',
            fontSize: '28px',
            fontVariationSettings: '"opsz" 144, "wght" 700',
            color: accent,
            lineHeight: 1
          }}
        >
          {letter}
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: 'var(--color-earth-deep)',
            fontWeight: 600
          }}
        >
          {status.toUpperCase()}
        </div>
      </div>

      {dist ? (
        <div className="flex h-1.5 overflow-hidden" style={{ borderRadius: '1px', background: 'var(--color-paper-deep)' }}>
          <div style={{ width: `${(dist.Low ?? 0) * 100}%`, background: 'var(--color-rust)' }} />
          <div style={{ width: `${(dist.Medium ?? 0) * 100}%`, background: 'var(--color-ochre)' }} />
          <div style={{ width: `${(dist.High ?? 0) * 100}%`, background: 'var(--color-moss)' }} />
        </div>
      ) : (
        <div
          style={{
            fontFamily: '"Fraunces", serif',
            fontStyle: 'italic',
            fontSize: '10px',
            color: 'var(--color-earth-deep)',
            opacity: 0.45
          }}
        >
          confidence pending
        </div>
      )}
    </div>
  );
}

function PhCell({ ph, phStr }) {
  // pH bar: 4.0 to 8.0 range
  const pct = Math.max(0, Math.min(100, ((ph - 4) / 4) * 100));
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <div
          style={{
            fontFamily: '"Fraunces", serif',
            fontSize: '28px',
            fontVariationSettings: '"opsz" 144, "wght" 700',
            color: 'var(--color-earth-deep)',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {ph.toFixed(1)}
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: 'var(--color-earth-deep)',
            fontWeight: 600
          }}
        >
          pH
        </div>
      </div>
      <div className="relative h-1.5" style={{ borderRadius: '1px', background: 'linear-gradient(to right, var(--color-rust), var(--color-ochre), var(--color-moss), var(--color-ochre), var(--color-rust))' }}>
        <div
          className="absolute top-1/2"
          style={{
            left: `${pct}%`,
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '8px',
            background: 'var(--color-paper)',
            border: '2px solid var(--color-earth-deep)',
            borderRadius: '50%'
          }}
        />
      </div>
      <div
        style={{
          fontFamily: '"Fraunces", serif',
          fontStyle: 'italic',
          fontSize: '11px',
          color: 'var(--color-earth-deep)',
          opacity: 0.6,
          marginTop: '4px'
        }}
      >
        {typeof phStr === 'string' && phStr !== '—' ? phStr : 'estimated'}
      </div>
    </div>
  );
}

function FertilizerGroup({ label, items, selected, onToggle }) {
  return (
    <div className="mb-3 last:mb-0">
      <div
        style={{
          fontFamily: '"Fraunces", serif',
          fontStyle: 'italic',
          fontSize: '11px',
          color: 'var(--color-earth-deep)',
          opacity: 0.55,
          marginBottom: '6px'
        }}
      >
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((f) => {
          const on = selected.has(f.name);
          return (
            <button
              key={f.name}
              onClick={() => onToggle(f.name)}
              className="transition-colors duration-150"
              style={{
                background: on ? 'var(--color-moss)' : 'var(--color-paper)',
                color: on ? 'var(--color-paper)' : 'var(--color-earth-deep)',
                border: '1px solid var(--color-contour)',
                borderRadius: '2px',
                padding: '6px 10px',
                fontFamily: '"Fraunces", serif',
                fontSize: '12px',
                fontVariationSettings: '"opsz" 14, "wght" 500',
                lineHeight: 1.1,
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: '6px'
              }}
            >
              <span>{f.name}</span>
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '9px',
                  letterSpacing: '0.05em',
                  opacity: on ? 0.85 : 0.5,
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {f.npk}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CategoryChip({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? 'var(--color-earth-deep)' : 'transparent',
        color: active ? 'var(--color-paper)' : 'var(--color-earth-deep)',
        border: `1px solid ${active ? 'var(--color-earth-deep)' : 'var(--color-contour)'}`,
        borderRadius: '2px',
        padding: '4px 8px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '9px',
        letterSpacing: '0.18em',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 150ms'
      }}
    >
      {label} <span style={{ opacity: 0.6 }}>{count}</span>
    </button>
  );
}
