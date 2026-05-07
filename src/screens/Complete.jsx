// Screen 7: Complete - Field Report Dashboard
// Prescription-first summary: a compact field/soil/crop info strip up top,
// then the prescription as the hero — source combo, per-row breakdown,
// applied N/P/K, total weight.

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAppStore from '../store/appStore';

const containerVariants = {
  initial: {},
  animate: { transition: { delayChildren: 0.05, staggerChildren: 0.06 } }
};
const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
};

export default function Complete() {
  const navigate = useNavigate();
  const {
    selectedPlant,
    municipality,
    recommendations,
    recommendationSummary,
    soilData,
    fieldAreaHa,
    resetApp,
  } = useAppStore();

  const sessionId = Math.random().toString(36).substring(2, 7);
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const readRating = (field) => {
    if (typeof field === 'string') return field;
    if (field && typeof field === 'object' && typeof field.rating === 'string') return field.rating;
    return 'Medium';
  };

  const nStatus = readRating(soilData?.nitrogen) || 'Medium';
  const pStatus = readRating(soilData?.phosphorus) || 'Medium';
  const kStatus = readRating(soilData?.potassium) || 'Medium';
  const phValue = typeof soilData?.pH === 'number' ? soilData.pH.toFixed(1) : '6.5';

  // Prescription data — engine shape from FertilizerRecommendations.handleContinue:
  //   recommendations[]: { fertilizer: {name}, amountKg, deliveredN/P/K, stage, ... }
  //   recommendationSummary: { totalNutrients: {n,p,k}, areaHectares, expectedYield }
  const prescriptionRows = Array.isArray(recommendations) ? recommendations : [];
  const hasPrescription = prescriptionRows.length > 0;
  const totalKg = prescriptionRows.reduce((sum, r) => sum + (Number(r.amountKg) || 0), 0);
  const applied = recommendationSummary?.totalNutrients || {
    n: prescriptionRows.reduce((s, r) => s + (Number(r.deliveredN) || 0), 0),
    p: prescriptionRows.reduce((s, r) => s + (Number(r.deliveredP) || 0), 0),
    k: prescriptionRows.reduce((s, r) => s + (Number(r.deliveredK) || 0), 0),
  };

  const handleNewAnalysis = () => {
    resetApp();
    navigate('/location-selection');
  };

  const handleBackToPrescription = () => {
    navigate('/fertilizer-recommendations');
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={containerVariants}
      className="min-h-screen flex flex-col relative"
      style={{ background: 'var(--color-paper)', fontFamily: '"Fraunces", serif' }}
    >
      <svg className="terrace-topo opacity-[0.04] absolute inset-0 pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path d="M0,200 Q300,150 600,200 T1200,200" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0,360 Q400,310 800,360 T1200,360" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0,520 Q200,470 500,520 T1200,520" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* ─── Top session strip ─── */}
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
            opacity: 0.7
          }}
        >
          ANALYSIS COMPLETE · session #{sessionId} · saved {dateStr}
        </div>
      </motion.header>

      {/* ─── Main content ─── */}
      <div className="flex-1 px-8 lg:px-12 py-8">
        <div className="w-full max-w-5xl mx-auto">
          {/* Title */}
          <motion.div variants={itemVariants} className="mb-6">
            <h1
              style={{
                fontFamily: '"Fraunces", serif',
                fontVariationSettings: '"opsz" 144, "wght" 600',
                fontSize: '32px',
                color: 'var(--color-earth-deep)',
                letterSpacing: '-0.01em',
                marginBottom: '4px'
              }}
            >
              FIELD REPORT — {municipality || 'La Trinidad, Benguet'}
            </h1>
          </motion.div>

          {/* ─── Compact info strip (FIELD / SOIL / CROP) ─── */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-px mb-6"
            style={{
              background: 'var(--color-contour)',
              border: '1px solid var(--color-contour)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <CompactCell title="FIELD">
              <CompactRow label="LOC" value={municipality || 'La Trinidad'} />
              <CompactRow label="AREA" value={`${fieldAreaHa?.toFixed(2) || '1.0'} ha`} />
              <CompactRow label="pH" value={phValue} />
            </CompactCell>

            <CompactCell title="SOIL">
              <CompactRow label="N" value={nStatus} />
              <CompactRow label="P" value={pStatus} />
              <CompactRow label="K" value={kStatus} />
            </CompactCell>

            <CompactCell title="CROP">
              <div style={{ fontFamily: '"Fraunces", serif', fontSize: '14px', color: 'var(--color-earth-deep)', fontWeight: 500, marginTop: '6px', marginBottom: '2px' }}>
                {selectedPlant?.name || 'Cabbage'}
              </div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: 'var(--color-earth-deep)', opacity: 0.55, letterSpacing: '0.05em' }}>
                {selectedPlant?.category ? `${selectedPlant.category} · highland` : 'vegetables · highland'}
              </div>
            </CompactCell>
          </motion.div>

          {/* ─── HERO: PRESCRIPTION ─── */}
          <motion.div
            variants={itemVariants}
            className="mb-6"
            style={{
              background: 'var(--color-paper-card)',
              border: `1px solid ${hasPrescription ? 'var(--color-moss)' : 'var(--color-contour)'}`,
              borderRadius: '4px',
              padding: '24px 28px'
            }}
          >
            <div className="flex items-baseline justify-between mb-4" style={{ borderBottom: '1px solid var(--color-contour)', paddingBottom: '12px' }}>
              <div>
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    color: 'var(--color-moss)',
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}
                >
                  PRESCRIPTION
                </div>
                <div style={{ fontFamily: '"Fraunces", serif', fontSize: '20px', color: 'var(--color-earth-deep)', fontWeight: 500 }}>
                  {hasPrescription
                    ? `${prescriptionRows.length} fertilizer${prescriptionRows.length === 1 ? '' : 's'} · ${totalKg.toFixed(1)} kg total`
                    : 'No prescription generated'}
                </div>
              </div>
              {hasPrescription && (
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: 'var(--color-earth-deep)', opacity: 0.55, letterSpacing: '0.1em' }}>
                  per {fieldAreaHa?.toFixed(2) || '1.0'} ha
                </div>
              )}
            </div>

            {hasPrescription ? (
              <>
                {/* Per-row breakdown table */}
                <div className="grid mb-5" style={{ gridTemplateColumns: '1fr 90px 60px 60px 60px', gap: '8px 16px' }}>
                  <ColHead>FERTILIZER</ColHead>
                  <ColHead align="right">AMOUNT</ColHead>
                  <ColHead align="right">N kg</ColHead>
                  <ColHead align="right">P kg</ColHead>
                  <ColHead align="right">K kg</ColHead>

                  {prescriptionRows.map((rec, i) => (
                    <RowFragment
                      key={i}
                      name={rec.fertilizer?.name || rec.name || '—'}
                      amountKg={rec.amountKg}
                      n={rec.deliveredN}
                      p={rec.deliveredP}
                      k={rec.deliveredK}
                    />
                  ))}

                  {/* Total row */}
                  <div style={{ gridColumn: '1 / -1', borderTop: '1px dashed var(--color-contour)', marginTop: '4px' }} />
                  <Cell bold>TOTAL</Cell>
                  <Cell align="right" bold>{totalKg.toFixed(1)} kg</Cell>
                  <Cell align="right" bold>{Number(applied.n || applied.N || 0).toFixed(1)}</Cell>
                  <Cell align="right" bold>{Number(applied.p || applied.P || 0).toFixed(1)}</Cell>
                  <Cell align="right" bold>{Number(applied.k || applied.K || 0).toFixed(1)}</Cell>
                </div>

                {/* Applied NPK telemetry strip */}
                <div className="flex flex-wrap gap-x-6 gap-y-1" style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '10px',
                  color: 'var(--color-earth-deep)',
                  opacity: 0.7,
                  letterSpacing: '0.05em',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  <span>APPLIED N · {Number(applied.n || applied.N || 0).toFixed(1)} kg/ha</span>
                  <span>APPLIED P · {Number(applied.p || applied.P || 0).toFixed(1)} kg/ha</span>
                  <span>APPLIED K · {Number(applied.k || applied.K || 0).toFixed(1)} kg/ha</span>
                </div>
              </>
            ) : (
              <div style={{
                fontFamily: '"Fraunces", serif',
                fontStyle: 'italic',
                fontSize: '14px',
                color: 'var(--color-earth-deep)',
                opacity: 0.6,
                padding: '12px 0'
              }}>
                No prescription was generated for this session. Go back to the prescription screen and pick a candidate combo, or run a new analysis.
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants}>
            <Eyebrow>ACTIONS</Eyebrow>
            <div className="flex gap-4 mt-3">
              <button
                onClick={handleNewAnalysis}
                className="terrace-btn"
                style={{ letterSpacing: '0.18em', flex: '1' }}
              >
                ↻ NEW ANALYSIS
              </button>
              <button
                onClick={handleBackToPrescription}
                className="terrace-btn"
                style={{ letterSpacing: '0.18em', flex: '1' }}
              >
                ← PRESCRIPTION
              </button>
            </div>
          </motion.div>
        </div>
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

function CompactCell({ title, children }) {
  return (
    <div style={{ background: 'var(--color-paper-card)', padding: '14px 16px' }}>
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-3 space-y-1">{children}</div>
    </div>
  );
}

function CompactRow({ label, value }) {
  return (
    <div className="flex justify-between items-baseline">
      <span style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '10px',
        color: 'var(--color-earth-deep)',
        opacity: 0.55,
        letterSpacing: '0.1em'
      }}>{label}</span>
      <span style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '11px',
        color: 'var(--color-earth-deep)',
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums'
      }}>{value}</span>
    </div>
  );
}

function ColHead({ children, align = 'left' }) {
  return (
    <div style={{
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '9px',
      letterSpacing: '0.18em',
      color: 'var(--color-earth-deep)',
      opacity: 0.55,
      fontWeight: 600,
      textAlign: align,
      paddingBottom: '6px',
      borderBottom: '1px dashed var(--color-contour)'
    }}>
      {children}
    </div>
  );
}

function Cell({ children, align = 'left', bold = false }) {
  return (
    <div style={{
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: '11px',
      color: 'var(--color-earth-deep)',
      fontWeight: bold ? 600 : 400,
      textAlign: align,
      fontVariantNumeric: 'tabular-nums',
      paddingTop: '4px'
    }}>
      {children}
    </div>
  );
}

function RowFragment({ name, amountKg, n, p, k }) {
  const fmt = (v) => (v == null || Number.isNaN(Number(v)) ? '—' : Number(v).toFixed(1));
  return (
    <>
      <Cell>{name}</Cell>
      <Cell align="right">{amountKg != null ? `${Number(amountKg).toFixed(1)} kg` : '—'}</Cell>
      <Cell align="right">{fmt(n)}</Cell>
      <Cell align="right">{fmt(p)}</Cell>
      <Cell align="right">{fmt(k)}</Cell>
    </>
  );
}
