// Screen 7: Complete - Field Report Dashboard
// Instrument-panel completion screen showing fertilizer prescription summary
// Matches SoilStatus aesthetic with hairline grids, mono labels, terrace styling

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAppStore from '../store/appStore';

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

export default function Complete() {
  const navigate = useNavigate();
  const {
    selectedPlant,
    municipality,
    recommendations,
    soilData,
    fieldAreaHa,
    resetApp,
  } = useAppStore();

  const sessionId = Math.random().toString(36).substring(2, 7);
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Normalize soil data ratings for display
  const readRating = (field) => {
    if (typeof field === 'string') return field;
    if (field && typeof field === 'object' && typeof field.rating === 'string') return field.rating;
    return 'Medium';
  };

  const nStatus = readRating(soilData?.nitrogen) || 'Medium';
  const pStatus = readRating(soilData?.phosphorus) || 'Medium';
  const kStatus = readRating(soilData?.potassium) || 'Medium';
  const phValue = typeof soilData?.pH === 'number' ? soilData.pH.toFixed(1) : '6.5';

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
      className="h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'var(--color-paper)', fontFamily: '"Fraunces", serif' }}
    >
      {/* Subtle topo backdrop */}
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
      <div className="flex-1 flex flex-col items-center justify-center px-8 lg:px-12 py-8">
        <motion.div
          variants={itemVariants}
          className="w-full max-w-4xl"
        >
          {/* Title */}
          <div className="mb-8">
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
          </div>

          {/* 2x2 grid report */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-px mb-8"
            style={{
              background: 'var(--color-contour)',
              border: '1px solid var(--color-contour)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            {/* FIELD cell */}
            <ReportCell title="FIELD">
              <TelemetryRow label="LOCATION" value={municipality || 'La Trinidad, Benguet'} />
              <TelemetryRow label="AREA" value={`${fieldAreaHa?.toFixed(2) || '1.0'} ha`} />
              <TelemetryRow label="pH" value={phValue} />
            </ReportCell>

            {/* SOIL cell */}
            <ReportCell title="SOIL">
              <TelemetryRow label="N STATUS" value={nStatus} />
              <TelemetryRow label="P STATUS" value={pStatus} />
              <TelemetryRow label="K STATUS" value={kStatus} />
            </ReportCell>

            {/* CROP cell */}
            <ReportCell title="CROP">
              <TelemetryRow label="" value={selectedPlant?.name || 'Cabbage'} />
              <TelemetryRow label="" value="vegetables · highland" />
            </ReportCell>

            {/* PRESCRIPTION cell */}
            <ReportCell title="PRESCRIPTION">
              {recommendations?.slice(0, 3).map((rec, i) => (
                <div key={i} className="flex justify-between" style={{ marginBottom: '3px' }}>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)' }}>
                    {rec.fertilizer?.name || rec.name}:
                  </span>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)', fontVariantNumeric: 'tabular-nums' }}>
                    {rec.amount || '25'} kg
                  </span>
                </div>
              )) || (
                <>
                  <TelemetryRow label="Urea:" value="25 kg" />
                  <TelemetryRow label="14-14-14:" value="30 kg" />
                  <TelemetryRow label="Muriate:" value="15 kg" />
                </>
              )}
            </ReportCell>
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
        </motion.div>
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

function ReportCell({ title, children }) {
  return (
    <div
      style={{
        background: 'var(--color-paper-card)',
        padding: '16px 18px'
      }}
    >
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-3 space-y-1">
        {children}
      </div>
    </div>
  );
}

function TelemetryRow({ label, value }) {
  return (
    <div className="flex justify-between items-baseline">
      {label && (
        <span
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            color: 'var(--color-earth-deep)',
            opacity: 0.6,
            letterSpacing: '0.1em'
          }}
        >
          {label}
        </span>
      )}
      <span
        style={{
          fontFamily: label ? '"JetBrains Mono", monospace' : '"Fraunces", serif',
          fontSize: label ? '11px' : '13px',
          color: 'var(--color-earth-deep)',
          fontWeight: label ? 600 : 500,
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {value}
      </span>
    </div>
  );
}
