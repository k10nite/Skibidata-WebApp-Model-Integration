// Screen 6: Fertilizer Recommendations - instrument panel redesign
// Surface all engine combos, mathematical breakdown, candidate browsing

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAppStore from '../store/appStore';
import { getRecommendationForCrop, getRecommendationForCropAsync } from '../services/recommendationService';

// Map plant names to crop keys in CROP_REQUIREMENTS
const PLANT_TO_CROP_KEY = {
  'Cabbage': 'cabbage',
  'Repolyo': 'cabbage',
  'Lettuce': 'lettuce',
  'Litsugas': 'lettuce',
  'Potato': 'potato',
  'Patatas': 'potato',
  'Carrot': 'carrot',
  'Karot': 'carrot',
  'Tomato': 'tomato',
  'Kamatis': 'tomato',
  'Snap Beans': 'beans',
  'Baguio Beans': 'beans',
  'Sweet Potato': 'sweetPotato',
  'Kamote': 'sweetPotato',
  'Chayote': 'chayote',
  'Sayote': 'chayote'
};

// Default soil data for mockup/demo when real data is not available
const DEFAULT_SOIL_DATA = {
  ph: 5.8,
  nitrogen: { value: 0.12, rating: 'Low' },
  phosphorus: { value: 15, rating: 'Medium' },
  potassium: { value: 120, rating: 'Medium' }
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
// Helpers
// ─────────────────────────────────────────────────────────────────────────

// function readRating(field) {
//   if (typeof field === 'string') return field;
//   if (field && typeof field === 'object' && typeof field.rating === 'string') return field.rating;
//   return 'Medium';
// }

function readValue(field) {
  if (typeof field === 'number') return field;
  if (field && typeof field === 'object' && typeof field.value === 'number') return field.value;
  return 0;
}

function phToNumeric(soilData) {
  if (typeof soilData?.pH === 'number') return soilData.pH;
  if (typeof soilData?.ph === 'number') return soilData.ph;
  return 5.6;
}

function formatCurrency(amount) {
  return `₱${amount.toLocaleString()}`;
}

// ─────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────

export default function FertilizerRecommendations() {
  const navigate = useNavigate();
  const {
    selectedPlant,
    soilData,
    setRecommendations,
    areaHectares,
    availableFertilizers
  } = useAppStore();

  // Determine crop key from selected plant
  const cropKey = useMemo(() => {
    if (!selectedPlant?.name) return 'cabbage';
    return PLANT_TO_CROP_KEY[selectedPlant.name] || 'cabbage';
  }, [selectedPlant]);

  // Calculate fertilizer recommendations - sync stub renders instantly, async engine upgrades when reachable
  const [fertilizerData, setFertilizerData] = useState(() => {
    const soil = soilData || DEFAULT_SOIL_DATA;
    return getRecommendationForCrop(soil, cropKey, areaHectares);
  });

  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const soil = soilData || DEFAULT_SOIL_DATA;
    setFertilizerData(getRecommendationForCrop(soil, cropKey, areaHectares));
    getRecommendationForCropAsync(soil, cropKey, areaHectares)
      .then((data) => {
        if (!cancelled) {
          setFertilizerData(data);
          setSelectedCandidateIndex(data.selectedCandidateIndex || 0);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [soilData, cropKey, areaHectares, availableFertilizers]);

  useEffect(() => {
    if (!selectedPlant) {
      navigate('/plant-selection');
      return;
    }
  }, [selectedPlant, navigate]);

  // Get current selected candidate data
  const selectedCandidate = fertilizerData?.candidates?.[selectedCandidateIndex] || null;
  const engineTargets = fertilizerData?._engineRaw?.total_base || {};
  const phAction = fertilizerData?._engineRaw?.ph_result?.ph_action || 'none';

  // Calculate nutrient gaps
  const soil = soilData || DEFAULT_SOIL_DATA;
  const ph = phToNumeric(soil);
  const nMeasured = readValue(soil.nitrogen);
  const pMeasured = readValue(soil.phosphorus);
  const kMeasured = readValue(soil.potassium);
  const nTarget = engineTargets.N || 150;
  const pTarget = engineTargets.P || 60;
  const kTarget = engineTargets.K || 75;

  const handleCandidateSelect = (index) => {
    setSelectedCandidateIndex(index);
  };

  const handleContinue = () => {
    // Update store with selected candidate's data
    if (selectedCandidate) {
      setRecommendations(selectedCandidate.prescriptions, {
        totalCostPHP: selectedCandidate.cost,
        totalNutrients: selectedCandidate.applied,
        areaHectares: fertilizerData.summary.areaHectares,
        expectedYield: fertilizerData.summary.expectedYield
      });
    }
    navigate('/complete');
  };

  const handleBack = () => {
    navigate('/plant-selection');
  };

  if (!selectedPlant) return null;

  const candidates = fertilizerData?.candidates || [];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={containerVariants}
      className="h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'var(--color-paper)', fontFamily: '"Fraunces", serif' }}
    >
      {/* Subtle topo backdrop */}
      <svg className="terrace-topo opacity-[0.04] absolute inset-0 pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path d="M0,200 Q300,150 600,200 T1200,200" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0,360 Q400,310 800,360 T1200,360" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0,520 Q200,470 500,520 T1200,520" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* ─── Top breadcrumb strip ─── */}
      <motion.header
        variants={itemVariants}
        className="flex items-center justify-between px-8 lg:px-12 py-3"
        style={{
          borderBottom: '1px solid var(--color-contour)',
          background: 'var(--color-paper-card)',
          flexShrink: 0
        }}
      >
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: 'var(--color-earth-deep)',
            opacity: 0.85
          }}
        >
          STEP 06 / 04
          <Sep />
          <span style={{ color: 'var(--color-moss)', fontWeight: 600 }}>{fertilizerData.crop.name}</span>
          <Sep />
          {areaHectares.toFixed(1)} ha
          <Sep />
          {phAction !== 'none' ? `pH: ${phAction}` : 'pH: optimal'}
        </div>
      </motion.header>

      {/* ─── Main grid ─── */}
      <div className="flex-1 flex min-h-0">

        {/* LEFT — targets + combos list */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 px-8 lg:px-12 py-6"
          style={{
            width: '38%',
            borderRight: '1px solid var(--color-contour)'
          }}
        >
          {/* Targets panel */}
          <div
            style={{
              background: 'var(--color-paper-card)',
              border: '1px solid var(--color-contour)',
              borderRadius: '4px',
              padding: '18px 20px'
            }}
          >
            <Eyebrow>TARGETS</Eyebrow>
            <div className="mt-3 space-y-3">
              <TargetRow label="N" target={nTarget} measured={nMeasured} gap={nTarget - nMeasured} />
              <TargetRow label="P" target={pTarget} measured={pMeasured} gap={pTarget - pMeasured} />
              <TargetRow label="K" target={kTarget} measured={kMeasured} gap={kTarget - kMeasured} />
              <div className="flex items-baseline justify-between py-1" style={{ borderBottom: '1px dotted var(--color-contour)' }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)', opacity: 0.6, letterSpacing: '0.1em' }}>pH</span>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', color: 'var(--color-earth-deep)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {ph.toFixed(1)} <span style={{ fontSize: '10px', opacity: 0.6 }}>
                    {phAction !== 'none' ? phAction : 'optimal'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Combos list */}
          <div className="flex-1 min-h-0">
            <div className="flex items-baseline justify-between mb-3">
              <Eyebrow>COMBOS ({candidates.length})</Eyebrow>
              <Caption>ranked by weight</Caption>
            </div>
            <div className="flex flex-col gap-1 overflow-y-auto h-full">
              {candidates.map((candidate, index) => (
                <motion.div
                  key={index}
                  onClick={() => handleCandidateSelect(index)}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    background: index === selectedCandidateIndex ? 'var(--color-paper-deep)' : 'var(--color-paper-card)',
                    border: '1px solid var(--color-contour)',
                    borderLeft: index === selectedCandidateIndex ? '3px solid var(--color-moss)' : '1px solid var(--color-contour)',
                    borderRadius: '4px',
                    padding: '12px 16px'
                  }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '12px',
                          color: 'var(--color-earth-deep)',
                          opacity: 0.6,
                          fontWeight: 600
                        }}
                      >
                        [{index + 1}]
                      </span>
                      <span
                        style={{
                          fontFamily: '"Fraunces", serif',
                          fontSize: '13px',
                          color: 'var(--color-earth-deep)',
                          fontWeight: 500
                        }}
                      >
                        {candidate.sourceName}
                      </span>
                    </div>
                    {index === selectedCandidateIndex && (
                      <div
                        style={{
                          background: 'var(--color-moss)',
                          color: 'var(--color-paper)',
                          borderRadius: '2px',
                          padding: '2px 6px',
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '8px',
                          letterSpacing: '0.18em',
                          fontWeight: 700
                        }}
                      >
                        ✓ SELECTED
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '11px',
                        color: 'var(--color-earth-deep)',
                        fontVariantNumeric: 'tabular-nums'
                      }}
                    >
                      {candidate.totalWeight.toFixed(0)} kg
                    </span>
                    <span
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '11px',
                        color: 'var(--color-earth-deep)',
                        fontVariantNumeric: 'tabular-nums'
                      }}
                    >
                      {formatCurrency(candidate.cost)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT — selected combo breakdown */}
        <motion.div
          variants={itemVariants}
          className="flex-1 flex flex-col gap-4 px-8 lg:px-12 py-6 min-h-0"
          style={{ width: '62%' }}
        >
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <Eyebrow>SELECTED COMBO BREAKDOWN</Eyebrow>
              <Caption style={{ fontFamily: '"Fraunces", serif', fontStyle: 'italic' }}>
                Each fertilizer&apos;s NPK percentages × kg applied = nutrients delivered. Total should match the crop target.
              </Caption>
            </div>

            {selectedCandidate && (
              <div
                className="overflow-hidden"
                style={{
                  background: 'var(--color-paper-card)',
                  border: '1px solid var(--color-contour)',
                  borderRadius: '4px'
                }}
              >
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-paper-deep)' }}>
                      <th style={tableHeaderStyle}>FERTILIZER</th>
                      <th style={tableHeaderStyle}>AMOUNT</th>
                      <th style={tableHeaderStyle}>N kg</th>
                      <th style={tableHeaderStyle}>P kg</th>
                      <th style={tableHeaderStyle}>K kg</th>
                      <th style={tableHeaderStyle}>₱</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCandidate.prescriptions.map((presc, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid var(--color-contour)' }}>
                        <td style={tableCellStyle}>
                          <div>
                            <div style={{ fontFamily: '"Fraunces", serif', fontSize: '13px', color: 'var(--color-earth-deep)', fontWeight: 500 }}>
                              {presc.fertilizer.name}
                            </div>
                            {/* NPK inline would go here if we had the percentages */}
                          </div>
                        </td>
                        <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                          {presc.amountKg.toFixed(1)} kg
                        </td>
                        <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                          —
                        </td>
                        <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                          —
                        </td>
                        <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                          —
                        </td>
                        <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                          {formatCurrency(presc.cost || 0)}
                        </td>
                      </tr>
                    ))}
                    {/* Totals row */}
                    <tr style={{ background: 'var(--color-paper-deep)', borderBottom: '1px solid var(--color-contour)' }}>
                      <td style={{ ...tableCellStyle, fontWeight: 700 }}>TOTAL</td>
                      <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
                        {selectedCandidate.totalWeight.toFixed(0)} kg
                      </td>
                      <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
                        {selectedCandidate.applied.n.toFixed(0)}
                      </td>
                      <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
                        {selectedCandidate.applied.p.toFixed(0)}
                      </td>
                      <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
                        {selectedCandidate.applied.k.toFixed(0)}
                      </td>
                      <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>
                        {formatCurrency(selectedCandidate.cost)}
                      </td>
                    </tr>
                    {/* Target row */}
                    <tr style={{ borderBottom: '1px solid var(--color-contour)' }}>
                      <td style={tableCellStyle}>TARGET</td>
                      <td style={tableCellStyle}>—</td>
                      <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                        {nTarget}
                      </td>
                      <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                        {pTarget}
                      </td>
                      <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                        {kTarget}
                      </td>
                      <td style={tableCellStyle}>—</td>
                    </tr>
                    {/* Met % row */}
                    <tr>
                      <td style={tableCellStyle}>MET %</td>
                      <td style={tableCellStyle}>—</td>
                      <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                        <MetPercentage value={selectedCandidate.applied.n} target={nTarget} />
                      </td>
                      <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                        <MetPercentage value={selectedCandidate.applied.p} target={pTarget} />
                      </td>
                      <td style={{ ...tableCellStyle, fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                        <MetPercentage value={selectedCandidate.applied.k} target={kTarget} />
                      </td>
                      <td style={tableCellStyle}>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* pH adjustment if needed */}
          {phAction !== 'none' && (
            <div
              style={{
                background: 'rgba(183, 110, 64, 0.1)',
                border: '1px solid var(--color-rust)',
                borderRadius: '4px',
                padding: '12px 16px'
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-rust)' }} />
                <span
                  style={{
                    fontFamily: '"Fraunces", serif',
                    fontSize: '13px',
                    color: 'var(--color-earth-deep)',
                    fontWeight: 500
                  }}
                >
                  pH ADJUSTMENT: {phAction} recommended
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ─── Bottom strip ─── */}
      <motion.footer
        variants={itemVariants}
        className="flex items-center justify-between px-8 lg:px-12 py-4"
        style={{
          borderTop: '1px solid var(--color-contour)',
          background: 'var(--color-paper-card)',
          flexShrink: 0
        }}
      >
        <button
          onClick={handleBack}
          className="terrace-btn-ghost"
        >
          ← Back
        </button>
        <button
          onClick={handleContinue}
          className="terrace-btn group"
          style={{ padding: '0.85rem 1.6rem', letterSpacing: '0.18em', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          Continue → Summary
        </button>
      </motion.footer>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Subcomponents & Styles
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

function Caption({ children, style }) {
  return (
    <div
      style={{
        fontFamily: '"Fraunces", serif',
        fontStyle: 'italic',
        fontSize: '10px',
        color: 'var(--color-earth-deep)',
        opacity: 0.55,
        ...style
      }}
    >
      {children}
    </div>
  );
}

function Sep() {
  return <span style={{ opacity: 0.4, margin: '0 10px' }}>·</span>;
}

function TargetRow({ label, target, measured, gap }) {
  const gapColor = gap > 0 ? 'var(--color-rust)' : gap < -20 ? 'var(--color-moss)' : 'var(--color-ochre)';
  return (
    <div className="flex items-baseline justify-between py-1" style={{ borderBottom: '1px dotted var(--color-contour)' }}>
      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)', opacity: 0.6, letterSpacing: '0.1em' }}>{label}</span>
      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', fontVariantNumeric: 'tabular-nums' }}>
        <span style={{ color: 'var(--color-earth-deep)', fontWeight: 600 }}>{target}</span>
        <span style={{ opacity: 0.4, margin: '0 4px' }}>/</span>
        <span style={{ opacity: 0.6 }}>{measured.toFixed(0)}</span>
        <span style={{ opacity: 0.4, marginLeft: '4px' }}>kg/ha</span>
        <span style={{ color: gapColor, marginLeft: '8px', fontWeight: 600 }}>
          {gap > 0 ? '+' : ''}{gap.toFixed(0)}
        </span>
      </span>
    </div>
  );
}

function MetPercentage({ value, target }) {
  const pct = target > 0 ? (value / target) * 100 : 0;
  const color = pct >= 95 ? 'var(--color-moss)' : pct >= 80 ? 'var(--color-ochre)' : 'var(--color-rust)';
  return (
    <span style={{ color }}>
      {pct.toFixed(0)}%
    </span>
  );
}

const tableHeaderStyle = {
  padding: '12px 16px',
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '9px',
  letterSpacing: '0.22em',
  color: 'var(--color-earth-deep)',
  fontWeight: 600,
  textAlign: 'left',
  borderBottom: '1px solid var(--color-contour)'
};

const tableCellStyle = {
  padding: '12px 16px',
  fontFamily: '"Fraunces", serif',
  fontSize: '12px',
  color: 'var(--color-earth-deep)',
  textAlign: 'left'
};