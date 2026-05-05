// Screen 7: CompleteScreen - Premium Field Report Dashboard
// Instrument-panel completion screen with enhanced details and polygon preview
// Matches SoilStatus aesthetic - removes all confetti, gradients, glow decorations

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAppStore from '../store/appStore';
import { buildPolygonPreviewUrl } from '../services/mapboxStaticService';

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

export default function CompleteScreen() {
  const navigate = useNavigate();
  const {
    selectedPlant,
    municipality,
    recommendations,
    recommendationSummary,
    soilData,
    field,
    fieldAreaHa,
    fieldCenter,
    resetApp,
  } = useAppStore();

  const sessionId = Math.random().toString(36).substring(2, 7);
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const polygonUrl = useMemo(
    () => buildPolygonPreviewUrl(field, { width: 720, height: 540 }),
    [field]
  );

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

  const lat = fieldCenter?.lat ?? 16.4619;
  const lng = fieldCenter?.lng ?? 120.5874;
  const elevation = 1300;

  const handleDownloadReport = () => {
    const summary = generateTextSummary();
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fertilizer-report-${selectedPlant?.name || 'analysis'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNewAnalysis = () => {
    resetApp();
    navigate('/location-selection');
  };

  const handleBackToPrescription = () => {
    navigate('/fertilizer-recommendations');
  };

  const generateTextSummary = () => {
    const currentDate = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
================================================================================
FERTILIZER RECOMMENDATION REPORT
================================================================================
Date: ${currentDate}
Location: ${municipality || 'CAR Region'}
Plant: ${selectedPlant?.name || 'Not specified'} (${selectedPlant?.scientificName || ''})

SOIL STATUS
--------------------------------------------------------------------------------
Nitrogen (N):        ${nStatus}
Phosphorus (P):      ${pStatus}
Potassium (K):       ${kStatus}
Soil pH:             ${phValue}

RECOMMENDATIONS SUMMARY
--------------------------------------------------------------------------------
Total Products:      ${recommendationSummary?.totalProducts || 0}
High Priority:       ${recommendationSummary?.highPriority || 0}
Medium Priority:     ${recommendationSummary?.mediumPriority || 0}
Estimated Cost:      ₱${(recommendationSummary?.estimatedCost || 0).toLocaleString()} (1 hectare)

FERTILIZER PRODUCTS
--------------------------------------------------------------------------------
${recommendations?.map((rec, i) => `
${i + 1}. ${rec.fertilizer?.name || rec.name} (${rec.fertilizer?.formula || rec.formula})
   Priority: ${rec.priority}
   Nutrient: ${rec.nutrient}
   Reason: ${rec.reason}
   Application: ${rec.fertilizer?.applicationRate || rec.applicationRate}
`).join('\n') || 'No fertilizer needed - soil is in perfect condition!'}

================================================================================
Created by SkibiDATA - Powered by Sentinel-2 Satellite & AI
For CAR Highland Farmers
================================================================================
    `.trim();
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
          <span style={{ opacity: 0.4, margin: '0 10px' }}>·</span>
          {lat.toFixed(4)}°N {lng.toFixed(4)}°E
          <span style={{ opacity: 0.4, margin: '0 10px' }}>·</span>
          {elevation}m
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'var(--color-moss)',
            fontWeight: 600
          }}
        >
          PREMIUM REPORT
        </div>
      </motion.header>

      {/* ─── Main grid layout ─── */}
      <div className="flex-1 flex min-h-0">

        {/* LEFT — polygon + field info */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 px-8 lg:px-12 py-6"
          style={{
            width: '40%',
            borderRight: '1px solid var(--color-contour)'
          }}
        >
          {/* Polygon thumbnail */}
          <div
            className="relative overflow-hidden flex-shrink-0"
            style={{
              aspectRatio: '4 / 3',
              background: 'var(--color-paper-card)',
              border: '1px solid var(--color-contour)',
              borderRadius: '4px'
            }}
          >
            {polygonUrl ? (
              <img
                src={polygonUrl}
                alt="Drawn field polygon"
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
                  fontSize: '13px'
                }}
              >
                no polygon drawn
              </div>
            )}
            <div
              className="absolute top-2.5 left-2.5 px-2 py-1"
              style={{
                background: 'rgba(241, 237, 229, 0.92)',
                backdropFilter: 'blur(6px)',
                borderRadius: '2px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '9px',
                letterSpacing: '0.18em',
                color: 'var(--color-earth-deep)',
                fontWeight: 600
              }}
            >
              FIELD · {fieldAreaHa?.toFixed(2) || '1.0'} ha
            </div>
          </div>

          {/* Soil status snapshot */}
          <div
            className="flex-1 flex flex-col"
            style={{
              background: 'var(--color-paper-card)',
              border: '1px solid var(--color-contour)',
              borderRadius: '4px',
              padding: '14px 18px'
            }}
          >
            <Eyebrow>SOIL STATUS SNAPSHOT</Eyebrow>
            <div className="mt-3 grid grid-cols-2 gap-4 flex-1">
              <SoilCell label="N" status={nStatus} />
              <SoilCell label="P" status={pStatus} />
              <SoilCell label="K" status={kStatus} />
              <div className="flex flex-col">
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '9px',
                    letterSpacing: '0.22em',
                    color: 'var(--color-earth-deep)',
                    opacity: 0.55,
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}
                >
                  pH
                </div>
                <div
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--color-earth-deep)',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {phValue}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — report details */}
        <motion.div
          variants={itemVariants}
          className="flex-1 flex flex-col px-8 lg:px-12 py-6"
        >
          {/* Title */}
          <div className="mb-6">
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
            <Caption>{selectedPlant?.name || 'Cabbage'} fertilizer prescription ready</Caption>
          </div>

          {/* Enhanced 2x2 grid report */}
          <div
            className="grid grid-cols-2 gap-px mb-6"
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
              <TelemetryRow label="ELEVATION" value={`${elevation}m`} />
            </ReportCell>

            {/* SOIL cell */}
            <ReportCell title="SOIL ANALYSIS">
              <TelemetryRow label="NITROGEN" value={nStatus} />
              <TelemetryRow label="PHOSPHORUS" value={pStatus} />
              <TelemetryRow label="POTASSIUM" value={kStatus} />
              <TelemetryRow label="ACIDITY" value={`pH ${phValue}`} />
            </ReportCell>

            {/* CROP cell */}
            <ReportCell title="CROP SELECTION">
              <TelemetryRow label="" value={selectedPlant?.name || 'Cabbage'} />
              <TelemetryRow label="CATEGORY" value="vegetables · highland" />
              <TelemetryRow label="SCIENTIFIC" value={selectedPlant?.scientificName || 'Brassica oleracea'} />
            </ReportCell>

            {/* PRESCRIPTION cell */}
            <ReportCell title="FERTILIZER PRESCRIPTION">
              {recommendations?.slice(0, 3).map((rec, i) => (
                <div key={i} className="flex justify-between items-baseline" style={{ marginBottom: '4px' }}>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)', opacity: 0.7 }}>
                    {rec.fertilizer?.name || rec.name}:
                  </span>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {rec.amount || '25'} kg · ₱{rec.cost?.toLocaleString() || '1,250'}
                  </span>
                </div>
              )) || (
                <>
                  <div className="flex justify-between items-baseline" style={{ marginBottom: '4px' }}>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)', opacity: 0.7 }}>Urea:</span>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>25 kg · ₱1,250</span>
                  </div>
                  <div className="flex justify-between items-baseline" style={{ marginBottom: '4px' }}>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)', opacity: 0.7 }}>14-14-14:</span>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>30 kg · ₱1,800</span>
                  </div>
                  <div className="flex justify-between items-baseline" style={{ marginBottom: '4px' }}>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)', opacity: 0.7 }}>Muriate:</span>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>15 kg · ₱900</span>
                  </div>
                </>
              )}
              <div
                className="flex justify-between items-baseline pt-2 mt-2"
                style={{ borderTop: '1px solid var(--color-contour)' }}
              >
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)', fontWeight: 700, letterSpacing: '0.1em' }}>
                  TOTAL COST:
                </span>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', color: 'var(--color-moss)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  ₱{recommendationSummary?.estimatedCost?.toLocaleString() || '8,350'}
                </span>
              </div>
            </ReportCell>
          </div>

          {/* Actions */}
          <div className="mt-auto">
            <Eyebrow>ACTIONS</Eyebrow>
            <div className="flex gap-4 mt-3">
              <button
                onClick={handleDownloadReport}
                className="terrace-btn"
                style={{ letterSpacing: '0.18em', flex: '1' }}
              >
                ↓ DOWNLOAD REPORT
              </button>
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
          </div>
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

function ReportCell({ title, children }) {
  return (
    <div
      style={{
        background: 'var(--color-paper-card)',
        padding: '16px 18px'
      }}
    >
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-3 space-y-2">
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

function SoilCell({ label, status }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'low': return 'var(--color-rust)';
      case 'high': return 'var(--color-moss)';
      default: return 'var(--color-ochre)';
    }
  };

  const color = getStatusColor(status);

  return (
    <div className="flex flex-col">
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.22em',
          color: 'var(--color-earth-deep)',
          opacity: 0.55,
          fontWeight: 600,
          marginBottom: '4px'
        }}
      >
        {label}
      </div>
      <div
        className="inline-block px-2 py-0.5"
        style={{
          background: color,
          color: 'var(--color-paper)',
          borderRadius: '2px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.18em',
          fontWeight: 700,
          width: 'fit-content'
        }}
      >
        {status?.toUpperCase() || 'MEDIUM'}
      </div>
    </div>
  );
}
