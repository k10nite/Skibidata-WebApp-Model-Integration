// SoilStatus — instrument panel, single-screen, no dead space.
// Replaces the recharts chart (was buggy + decorative) with a hand-rolled
// CSS bar chart, balances column heights, and tightens density.

import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import useAppStore from '../store/appStore';
import { buildPolygonPreviewUrl } from '../services/mapboxStaticService';

// ─────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────

const NUTRIENT_CONFIG = {
  nitrogen:   { name: 'NITROGEN',   symbol: 'N',  unit: 'ppm', target: 170 },
  phosphorus: { name: 'PHOSPHORUS', symbol: 'P',  unit: 'ppm', target: 15  },
  potassium:  { name: 'POTASSIUM',  symbol: 'K',  unit: 'ppm', target: 130 }
};

const STATUS_COLOR = {
  Low:    'var(--color-rust)',
  Medium: 'var(--color-ochre)',
  High:   'var(--color-moss)'
};

const STATUS_FRACTION = { Low: 0.35, Medium: 0.65, High: 0.92 };

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

function readRating(field) {
  if (typeof field === 'string') return field;
  if (field && typeof field === 'object' && typeof field.rating === 'string') return field.rating;
  return 'Medium';
}

function phToNumeric(soilData) {
  if (typeof soilData?.pH === 'number') return soilData.pH;
  if (typeof soilData?.pH === 'string') {
    const n = parseFloat(soilData.pH);
    if (!Number.isNaN(n) && n >= 3 && n <= 9) return n;
    const s = soilData.pH.toLowerCase();
    if (s.includes('strongly acid')) return 4.5;
    if (s.includes('slightly acid')) return 6.0;
    if (s.includes('acidic')) return 5.2;
    if (s.includes('neutral')) return 6.8;
    if (s.includes('slightly alkal')) return 7.4;
    if (s.includes('alkaline')) return 7.8;
  }
  return 5.6;
}

function phLabel(ph) {
  if (ph < 5.0) return 'STRONGLY ACIDIC';
  if (ph < 5.5) return 'ACIDIC';
  if (ph < 6.0) return 'SLIGHTLY ACIDIC';
  if (ph <= 7.0) return 'OPTIMAL';
  if (ph < 7.5) return 'SLIGHTLY ALKALINE';
  return 'ALKALINE';
}

// Normalize Liam dominant_class to title-case ("low" → "Low")
function normalizeStatus(s) {
  if (!s) return 'Medium';
  const lower = s.toString().toLowerCase();
  if (lower.startsWith('l')) return 'Low';
  if (lower.startsWith('h')) return 'High';
  return 'Medium';
}

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

export default function SoilStatus() {
  const navigate = useNavigate();
  const { soilData, municipality, field, fieldAreaHa, fieldCenter } = useAppStore();

  useEffect(() => {
    if (!soilData) navigate('/location-selection');
  }, [soilData, navigate]);

  const polygonUrl = useMemo(
    () => buildPolygonPreviewUrl(field, { width: 720, height: 540 }),
    [field]
  );

  if (!soilData) return null;

  const liam = soilData.liam;
  const nStatus = normalizeStatus(readRating(soilData.nitrogen));
  const pStatus = normalizeStatus(readRating(soilData.phosphorus));
  const kStatus = normalizeStatus(readRating(soilData.potassium));
  const ph = phToNumeric(soilData);

  // Estimated ppm (from status fraction × target). When Liam ships real
  // ppm in the future this can read from soilData[key].value directly.
  const estimatedPpm = (key, status) => {
    const cfg = NUTRIENT_CONFIG[key];
    return cfg.target * STATUS_FRACTION[status];
  };

  const measurements = {
    nitrogen:   { status: nStatus, ppm: estimatedPpm('nitrogen',   nStatus), dist: liam?.nitrogen?.class_distribution },
    phosphorus: { status: pStatus, ppm: estimatedPpm('phosphorus', pStatus), dist: liam?.phosphorus?.class_distribution },
    potassium:  { status: kStatus, ppm: estimatedPpm('potassium',  kStatus), dist: liam?.potassium?.class_distribution }
  };

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const lat = fieldCenter?.lat ?? 16.4619;
  const lng = fieldCenter?.lng ?? 120.5874;
  const elevation = 1300; // weather service has this; static fallback for now
  const sampleCount = liam?.sample_count ?? 0;
  const polygonAreaHa = liam?.polygon_area_ha ?? fieldAreaHa ?? 0;
  const warnings = liam?.warnings?.length ?? 0;
  const sourceLabel = liam ? 'liam-railway' : (soilData.source || 'placeholder');
  const verticesCount = field?.coordinates?.[0]?.length ?? 0;

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
          STEP 03 / 04
          <Sep />
          <span style={{ color: 'var(--color-moss)', fontWeight: 600 }}>{municipality || 'La Trinidad'}, BENGUET</span>
          <Sep />
          {lat.toFixed(4)}°N {lng.toFixed(4)}°E
          <Sep />
          {elevation}m
          <Sep />
          {polygonAreaHa.toFixed(2)} ha · {verticesCount} verts
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'var(--color-earth-deep)',
            opacity: 0.6
          }}
        >
          {dateStr} · src: {sourceLabel} · {warnings} warn
        </div>
      </motion.header>

      {/* ─── Main grid ─── */}
      <div className="flex-1 flex min-h-0">

        {/* LEFT — polygon thumbnail + telemetry */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-3 px-8 lg:px-12 py-6"
          style={{
            width: '38%',
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
              FIELD · {polygonAreaHa.toFixed(2)} ha
            </div>
          </div>

          {/* Telemetry table */}
          <div
            className="flex-1 flex flex-col"
            style={{
              background: 'var(--color-paper-card)',
              border: '1px solid var(--color-contour)',
              borderRadius: '4px',
              padding: '14px 18px'
            }}
          >
            <Eyebrow>SATELLITE TELEMETRY</Eyebrow>
            <div className="mt-3 flex-1 flex flex-col justify-around" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              {[
                { k: 'pH',    v: ph.toFixed(1),                         u: '' },
                { k: 'N',     v: measurements.nitrogen.ppm.toFixed(0),  u: 'ppm' },
                { k: 'P',     v: measurements.phosphorus.ppm.toFixed(1), u: 'ppm' },
                { k: 'K',     v: measurements.potassium.ppm.toFixed(0), u: 'ppm' }
              ].map((row) => (
                <div key={row.k} className="flex items-baseline justify-between" style={{ borderBottom: '1px dotted var(--color-contour)', padding: '4px 0' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-earth-deep)', opacity: 0.6, letterSpacing: '0.1em' }}>{row.k}</span>
                  <span>
                    <span style={{ fontSize: '15px', color: 'var(--color-earth-deep)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{row.v}</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-earth-deep)', opacity: 0.5, marginLeft: '4px' }}>{row.u}</span>
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                fontFamily: '"Fraunces", serif',
                fontStyle: 'italic',
                fontSize: '10px',
                color: 'var(--color-earth-deep)',
                opacity: 0.5,
                marginTop: '8px'
              }}
            >
              source: open-meteo + sentinel-2 · {sampleCount > 0 ? `${sampleCount} grid pts` : 'regional est.'}
            </div>
          </div>
        </motion.div>

        {/* RIGHT — measurements + chart */}
        <motion.div
          variants={itemVariants}
          className="flex-1 flex flex-col gap-4 px-8 lg:px-12 py-6 min-h-0"
          style={{ width: '62%' }}
        >
          {/* Primary measurements */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <Eyebrow>PRIMARY MEASUREMENTS</Eyebrow>
              <Caption>4 nutrients · ML soil-survey output</Caption>
            </div>
            <div
              className="grid grid-cols-4 gap-px"
              style={{
                background: 'var(--color-contour)',
                border: '1px solid var(--color-contour)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <NutrientCell label="NITROGEN"   sym="N" status={measurements.nitrogen.status}   ppm={measurements.nitrogen.ppm}   dist={measurements.nitrogen.dist} />
              <NutrientCell label="PHOSPHORUS" sym="P" status={measurements.phosphorus.status} ppm={measurements.phosphorus.ppm} dist={measurements.phosphorus.dist} />
              <NutrientCell label="POTASSIUM"  sym="K" status={measurements.potassium.status}  ppm={measurements.potassium.ppm}  dist={measurements.potassium.dist} />
              <PhCell ph={ph} dist={liam?.ph?.class_distribution} />
            </div>
          </div>

          {/* ML metadata strip */}
          <div className="flex flex-wrap gap-1.5">
            <Pill label="samples" value={sampleCount > 0 ? sampleCount : '—'} />
            <Pill label="area" value={`${polygonAreaHa.toFixed(2)} ha`} />
            <Pill label="warnings" value={warnings} accent={warnings > 0 ? 'var(--color-rust)' : undefined} />
            <Pill label="source" value={sourceLabel} />
            <Pill label="model" value={liam ? 'rf+svm' : 'placeholder.json'} />
          </div>

          {/* Nutrient targets chart — hand-rolled, full width */}
          <div
            className="flex-1 min-h-0 flex flex-col"
            style={{
              background: 'var(--color-paper-card)',
              border: '1px solid var(--color-contour)',
              borderRadius: '4px',
              padding: '20px 24px'
            }}
          >
            <div className="flex items-baseline justify-between mb-4">
              <Eyebrow>NUTRIENT TARGETS vs MEASURED</Eyebrow>
              <Caption>kg/ha targets at {nStatus.toLowerCase()} N</Caption>
            </div>

            <div className="flex flex-col gap-3 flex-1 justify-around">
              {['nitrogen', 'phosphorus', 'potassium'].map((key) => {
                const cfg = NUTRIENT_CONFIG[key];
                const m = measurements[key];
                const pct = Math.min(100, (m.ppm / cfg.target) * 100);
                const color = STATUS_COLOR[m.status];
                return (
                  <div key={key}>
                    <div className="flex items-baseline justify-between mb-1">
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--color-earth-deep)', fontWeight: 600 }}>
                        {cfg.symbol} <span style={{ opacity: 0.55, marginLeft: '6px' }}>{cfg.name}</span>
                      </span>
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: 'var(--color-earth-deep)', fontVariantNumeric: 'tabular-nums' }}>
                        <span style={{ color, fontWeight: 600 }}>{m.ppm.toFixed(1)}</span>
                        <span style={{ opacity: 0.4, margin: '0 4px' }}>/</span>
                        <span style={{ opacity: 0.6 }}>{cfg.target}</span>
                        <span style={{ opacity: 0.4, marginLeft: '4px' }}>{cfg.unit}</span>
                        <span style={{ opacity: 0.5, marginLeft: '8px' }}>({pct.toFixed(0)}%)</span>
                      </span>
                    </div>
                    <div className="relative h-2.5 overflow-hidden" style={{ background: 'var(--color-paper-deep)', borderRadius: '1px' }}>
                      <div
                        className="absolute inset-y-0 left-0 transition-all"
                        style={{ width: `${pct}%`, background: color, transitionDuration: '900ms', transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                      />
                      {/* Target marker line at 100% */}
                      <div className="absolute inset-y-0" style={{ left: '100%', width: '1px', background: 'var(--color-earth-deep)', opacity: 0.4, transform: 'translateX(-1px)' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: '10px',
                fontFamily: '"Fraunces", serif',
                fontStyle: 'italic',
                fontSize: '10px',
                color: 'var(--color-earth-deep)',
                opacity: 0.5
              }}
            >
              measured ÷ crop-target ratio · target line at 100%
            </div>
          </div>
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
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--color-earth-deep)', opacity: 0.55 }}>
          NEXT → CROP REQUIREMENTS · then engine call
        </div>
        <button
          onClick={() => navigate('/plant-requirements')}
          className="terrace-btn group"
          style={{ padding: '0.85rem 1.6rem', letterSpacing: '0.18em', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          CONTINUE → REQUIREMENTS
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.footer>
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
        fontSize: '10px',
        color: 'var(--color-earth-deep)',
        opacity: 0.55
      }}
    >
      {children}
    </div>
  );
}

function Sep() {
  return <span style={{ opacity: 0.4, margin: '0 10px' }}>·</span>;
}

function Pill({ label, value, accent }) {
  return (
    <div
      style={{
        background: 'var(--color-paper-card)',
        border: '1px solid var(--color-contour)',
        borderRadius: '999px',
        padding: '4px 12px',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '10px',
        letterSpacing: '0.05em',
        color: 'var(--color-earth-deep)',
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '6px'
      }}
    >
      <span style={{ opacity: 0.5, fontWeight: 600, letterSpacing: '0.18em' }}>{label.toUpperCase()}</span>
      <span style={{ color: accent ?? 'var(--color-earth-deep)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

function NutrientCell({ label, sym, status, ppm, dist }) {
  const color = STATUS_COLOR[status];
  return (
    <div style={{ background: 'var(--color-paper-card)', padding: '16px 16px 14px' }}>
      <div className="flex items-baseline justify-between mb-2">
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '9px',
            letterSpacing: '0.22em',
            color: 'var(--color-earth-deep)',
            opacity: 0.55,
            fontWeight: 600
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: '"Fraunces", serif',
            fontVariationSettings: '"opsz" 144, "wght" 600',
            fontSize: '20px',
            color,
            lineHeight: 1
          }}
        >
          {sym}
        </div>
      </div>
      <div
        className="inline-block px-2 py-0.5 mb-2"
        style={{
          background: color,
          color: 'var(--color-paper)',
          borderRadius: '2px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px',
          letterSpacing: '0.18em',
          fontWeight: 700
        }}
      >
        {status.toUpperCase()}
      </div>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px',
          color: 'var(--color-earth-deep)',
          opacity: 0.7,
          fontVariantNumeric: 'tabular-nums',
          marginBottom: '8px'
        }}
      >
        {ppm.toFixed(ppm < 100 ? 1 : 0)} <span style={{ opacity: 0.55 }}>ppm</span>
      </div>
      {dist ? (
        <div className="flex h-1.5 overflow-hidden" style={{ background: 'var(--color-paper-deep)', borderRadius: '1px' }}>
          <div style={{ width: `${(dist.Low ?? 0) * 100}%`,    background: 'var(--color-rust)' }} />
          <div style={{ width: `${(dist.Medium ?? 0) * 100}%`, background: 'var(--color-ochre)' }} />
          <div style={{ width: `${(dist.High ?? 0) * 100}%`,   background: 'var(--color-moss)' }} />
        </div>
      ) : (
        <div className="h-1.5 overflow-hidden" style={{ background: 'var(--color-paper-deep)', borderRadius: '1px' }}>
          <div style={{ width: `${STATUS_FRACTION[status] * 100}%`, height: '100%', background: color }} />
        </div>
      )}
    </div>
  );
}

function PhCell({ ph, dist }) {
  const pct = Math.max(0, Math.min(100, ((ph - 4) / 4) * 100));
  const accent =
    ph < 5.5 ? 'var(--color-rust)' :
    ph > 7.5 ? 'var(--color-rust)' :
    ph >= 6.0 && ph <= 7.0 ? 'var(--color-moss)' :
    'var(--color-ochre)';

  return (
    <div style={{ background: 'var(--color-paper-card)', padding: '16px 16px 14px' }}>
      <div className="flex items-baseline justify-between mb-2">
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '9px',
            letterSpacing: '0.22em',
            color: 'var(--color-earth-deep)',
            opacity: 0.55,
            fontWeight: 600
          }}
        >
          ACIDITY
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            color: 'var(--color-earth-deep)',
            opacity: 0.55,
            fontWeight: 600,
            letterSpacing: '0.1em'
          }}
        >
          pH
        </div>
      </div>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--color-earth-deep)',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
          marginBottom: '8px'
        }}
      >
        {ph.toFixed(1)}
      </div>
      <div
        className="inline-block px-2 py-0.5 mb-2"
        style={{
          background: accent,
          color: 'var(--color-paper)',
          borderRadius: '2px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.18em',
          fontWeight: 700
        }}
      >
        {phLabel(ph)}
      </div>
      <div
        className="relative h-1.5 mt-1"
        style={{
          background: 'linear-gradient(to right, var(--color-rust), var(--color-ochre), var(--color-moss), var(--color-ochre), var(--color-rust))',
          borderRadius: '1px'
        }}
      >
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
      {dist && (
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '9px',
            color: 'var(--color-earth-deep)',
            opacity: 0.5,
            marginTop: '4px',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {Object.keys(dist).length}-class confidence
        </div>
      )}
    </div>
  );
}
