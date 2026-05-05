// Processing screen — light, component-driven loading state.
// Replaces the previous brown-on-brown cinematic text loop with a
// visible instrument panel showing real progress: polygon preview,
// step checklist with spinners, telemetry filling in live, and a
// status footer.

import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Loader2, AlertTriangle } from 'lucide-react';
import useAppStore from '../store/appStore';
import { getSatelliteAnalysis } from '../services/satelliteService';
import { predictForLocation } from '../services/mlPredictionService';
import { predictForField, getLiamApiUrl } from '../services/liamMLService';
import { buildPolygonPreviewUrl } from '../services/mapboxStaticService';
import { log } from '../services/logger';

const STEPS = [
  { id: 'satellite', label: 'Sentinel-2 acquisition', sub: 'Open-Meteo / NASA POWER' },
  { id: 'extract',   label: 'Spectral signature extraction', sub: 'B02 B03 B04 B08 B11 B12' },
  { id: 'predict',   label: 'ML soil-nutrient prediction', sub: 'rf+svm classifiers' },
  { id: 'normalize', label: 'Normalize for engine handoff', sub: 'NPK / pH / class confidence' }
];

export default function Processing() {
  const navigate = useNavigate();
  const { municipality, field, fieldAreaHa, fieldCenter, setMLPrediction, setSatelliteData } = useAppStore();

  const [stepStates, setStepStates] = useState({
    satellite: 'pending',
    extract:   'pending',
    predict:   'pending',
    normalize: 'pending'
  });
  const [telemetry, setTelemetry] = useState({});
  const [mlSource, setMlSource] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const startedAtRef = useRef(performance.now());
  const navigatedRef = useRef(false);
  const fetchStartedRef = useRef(false);

  // Polygon preview from store.field
  const polygonUrl = buildPolygonPreviewUrl(field, { width: 720, height: 540 });

  const setStep = useCallback((id, state) => {
    setStepStates((prev) => ({ ...prev, [id]: state }));
    log.flow(`step ${id} → ${state}`);
  }, []);

  // Tick elapsed time (every 100ms) for the live counter
  useEffect(() => {
    const t = setInterval(() => {
      setElapsedMs(Math.round(performance.now() - startedAtRef.current));
    }, 100);
    return () => clearInterval(t);
  }, []);

  const run = useCallback(async () => {
    if (fetchStartedRef.current) return;
    fetchStartedRef.current = true;

    const locationName = municipality || 'La Trinidad';

    // Step 1 — satellite + weather
    setStep('satellite', 'running');
    let satelliteData = null;
    try {
      satelliteData = await getSatelliteAnalysis(locationName);
      setSatelliteData(satelliteData);
      setTelemetry((t) => ({
        ...t,
        location: locationName,
        area: fieldAreaHa ? `${fieldAreaHa.toFixed(2)} ha` : '—',
        elevation: satelliteData?.weather?.elevation ? `${satelliteData.weather.elevation} m` : '—',
        climate: satelliteData?.weather?.current
          ? `${Math.round(satelliteData.weather.current.temperature)}° / ${Math.round(satelliteData.weather.current.humidity)}%`
          : '—'
      }));
      setStep('satellite', 'done');
    } catch (err) {
      log.warn('satellite fetch failed', err?.message);
      setStep('satellite', 'warn');
    }

    // Step 2 — extract (visual delay so user sees the step move; this is
    // genuinely happening server-side inside Liam if his API is reachable)
    setStep('extract', 'running');
    await new Promise((r) => setTimeout(r, 350));
    setStep('extract', 'done');

    // Step 3 — ML prediction (Liam first, fall back to placeholder)
    setStep('predict', 'running');
    let prediction = null;
    if (field && getLiamApiUrl()) {
      try {
        prediction = await predictForField(field);
        setMlSource('liam-ml');
        log.ml('Liam returned prediction', prediction);
      } catch (err) {
        log.warn('Liam call failed — falling back to placeholder JSON', err?.message);
        try {
          prediction = await predictForLocation(locationName);
          setMlSource('placeholder');
        } catch (err2) {
          setErrorMsg('Both Liam and placeholder ML services failed.');
          log.warn('placeholder ML also failed', err2?.message);
        }
      }
    } else {
      try {
        prediction = await predictForLocation(locationName);
        setMlSource('placeholder');
      } catch (err) {
        setErrorMsg('ML service unreachable.');
        log.warn('placeholder ML failed', err?.message);
      }
    }
    setStep('predict', prediction ? 'done' : 'warn');

    // Step 4 — normalize + commit to store
    setStep('normalize', 'running');
    if (prediction) {
      setMLPrediction(prediction);
      setTelemetry((t) => ({
        ...t,
        n: prediction.nitrogen,
        p: prediction.phosphorus,
        k: prediction.potassium,
        ph: typeof prediction.pH === 'number' ? prediction.pH.toFixed(1) : prediction.pH
      }));
      await new Promise((r) => setTimeout(r, 200));
      setStep('normalize', 'done');
    } else {
      setStep('normalize', 'warn');
    }

    // Tiny dwell on completion so user sees the final state, then navigate
    await new Promise((r) => setTimeout(r, 600));
    if (!navigatedRef.current) {
      navigatedRef.current = true;
      navigate('/plant-selection');
    }
  }, [municipality, field, fieldAreaHa, setMLPrediction, setSatelliteData, navigate, setStep]);

  useEffect(() => { run(); }, [run]);

  const allDone = Object.values(stepStates).every((s) => s === 'done' || s === 'warn');

  return (
    <div
      className="min-h-screen relative"
      style={{ background: 'var(--color-paper)', fontFamily: '"Fraunces", serif' }}
    >
      <svg className="terrace-topo opacity-[0.04] absolute inset-0 pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path d="M0,200 Q300,150 600,200 T1200,200" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0,360 Q400,310 800,360 T1200,360" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0,520 Q200,470 500,520 T1200,520" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Top breadcrumb strip — matches downstream screens */}
      <header
        className="flex items-center justify-between px-8 lg:px-12 py-3"
        style={{
          borderBottom: '1px solid var(--color-contour)',
          background: 'var(--color-paper-card)'
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
          STEP 02 / 04
          <span style={{ opacity: 0.4, margin: '0 10px' }}>·</span>
          <span style={{ color: 'var(--color-moss)', fontWeight: 600 }}>INFERENCE</span>
          <span style={{ opacity: 0.4, margin: '0 10px' }}>·</span>
          {telemetry.location || municipality || 'La Trinidad'}
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'var(--color-earth-deep)',
            opacity: 0.6,
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          ELAPSED · {(elapsedMs / 1000).toFixed(1)}s
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-8 lg:px-12 py-10">

        {/* Hero strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              letterSpacing: '0.22em',
              color: 'var(--color-moss)',
              fontWeight: 600,
              marginBottom: '8px'
            }}
          >
            INFERENCE — ANALYSING YOUR FIELD
          </div>
          <h1
            style={{
              fontFamily: '"Fraunces", serif',
              fontSize: 'clamp(2rem, 3vw, 2.75rem)',
              fontVariationSettings: '"opsz" 144, "wght" 600',
              lineHeight: 1.05,
              color: 'var(--color-earth-deep)',
              margin: 0
            }}
          >
            {allDone ? 'Ready' : 'Sampling soil from satellite imagery…'}
          </h1>
        </motion.div>

        {/* Main 2-col panel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT — polygon thumbnail */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2"
          >
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: '4 / 3',
                background: 'var(--color-paper-card)',
                border: '1px solid var(--color-contour)',
                borderRadius: '4px'
              }}
            >
              {polygonUrl ? (
                <img src={polygonUrl} alt="Field polygon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{
                  fontFamily: '"Fraunces", serif',
                  fontStyle: 'italic',
                  color: 'var(--color-earth-deep)',
                  opacity: 0.45,
                  fontSize: '13px'
                }}>
                  no polygon
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
                FIELD · {(fieldAreaHa || 0).toFixed(2)} ha
              </div>
              {fieldCenter && (
                <div
                  className="absolute bottom-2.5 right-2.5 px-2 py-1"
                  style={{
                    background: 'rgba(241, 237, 229, 0.92)',
                    backdropFilter: 'blur(6px)',
                    borderRadius: '2px',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '9px',
                    color: 'var(--color-earth-deep)',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {fieldCenter.lat.toFixed(4)}°N · {fieldCenter.lng.toFixed(4)}°E
                </div>
              )}
            </div>

            {/* Telemetry mini-grid */}
            <div
              className="grid grid-cols-2 gap-px mt-4"
              style={{ background: 'var(--color-contour)', border: '1px solid var(--color-contour)', borderRadius: '4px', overflow: 'hidden' }}
            >
              <TelemCell label="LOCATION" value={telemetry.location} />
              <TelemCell label="AREA" value={telemetry.area} mono />
              <TelemCell label="CLIMATE" value={telemetry.climate} mono />
              <TelemCell label="ELEVATION" value={telemetry.elevation} mono />
            </div>
          </motion.div>

          {/* RIGHT — step checklist */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3"
          >
            <div
              style={{
                background: 'var(--color-paper-card)',
                border: '1px solid var(--color-contour)',
                borderRadius: '4px',
                padding: '20px 24px'
              }}
            >
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  color: 'var(--color-moss)',
                  fontWeight: 600,
                  marginBottom: '14px'
                }}
              >
                PIPELINE
              </div>
              <ol className="space-y-3">
                {STEPS.map((s, i) => (
                  <StepRow
                    key={s.id}
                    index={i + 1}
                    label={s.label}
                    sub={s.sub}
                    state={stepStates[s.id]}
                  />
                ))}
              </ol>
            </div>

            {/* Soil readout — fills in after step 4 */}
            <div
              className="mt-4 grid grid-cols-4 gap-px"
              style={{ background: 'var(--color-contour)', border: '1px solid var(--color-contour)', borderRadius: '4px', overflow: 'hidden' }}
            >
              <SoilCell label="N" value={telemetry.n} />
              <SoilCell label="P" value={telemetry.p} />
              <SoilCell label="K" value={telemetry.k} />
              <SoilCell label="pH" value={telemetry.ph} />
            </div>

            {/* Status footer */}
            <div
              className="mt-4 px-4 py-3 flex items-center justify-between"
              style={{
                background: 'var(--color-paper-card)',
                border: '1px solid var(--color-contour)',
                borderRadius: '4px'
              }}
            >
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  color: 'var(--color-earth-deep)',
                  opacity: 0.7
                }}
              >
                ML SOURCE · <span style={{ color: mlSource === 'liam-ml' ? 'var(--color-moss)' : 'var(--color-rust)', fontWeight: 600 }}>{mlSource ? mlSource.toUpperCase() : 'PENDING'}</span>
              </div>
              {errorMsg ? (
                <div
                  className="flex items-center gap-2"
                  style={{
                    fontFamily: '"Fraunces", serif',
                    fontStyle: 'italic',
                    fontSize: '11px',
                    color: 'var(--color-rust)'
                  }}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errorMsg}
                </div>
              ) : (
                <div
                  style={{
                    fontFamily: '"Fraunces", serif',
                    fontStyle: 'italic',
                    fontSize: '11px',
                    color: 'var(--color-earth-deep)',
                    opacity: 0.6
                  }}
                >
                  {allDone ? 'continuing to crop selection…' : 'do not refresh — ML inference in progress'}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────

function StepRow({ index, label, sub, state }) {
  const accent =
    state === 'done' ? 'var(--color-moss)' :
    state === 'running' ? 'var(--color-ochre)' :
    state === 'warn' ? 'var(--color-rust)' :
    'var(--color-contour)';
  return (
    <li className="flex items-center gap-3" style={{ padding: '6px 0', borderBottom: '1px dotted var(--color-contour)' }}>
      <div
        className="flex items-center justify-center"
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '2px',
          background: state === 'done' ? 'var(--color-moss)' : 'var(--color-paper)',
          border: `1px solid ${accent}`,
          flexShrink: 0
        }}
      >
        {state === 'done' && <Check className="w-3.5 h-3.5" style={{ color: 'var(--color-paper)' }} />}
        {state === 'running' && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--color-ochre)' }} />}
        {state === 'warn' && <AlertTriangle className="w-3.5 h-3.5" style={{ color: 'var(--color-rust)' }} />}
        {state === 'pending' && (
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: 'var(--color-earth-deep)', opacity: 0.45, fontWeight: 600 }}>
            {index}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div
          style={{
            fontFamily: '"Fraunces", serif',
            fontSize: '14px',
            fontVariationSettings: '"opsz" 144, "wght" 500',
            color: state === 'pending' ? 'var(--color-earth-deep)' : 'var(--color-earth-deep)',
            opacity: state === 'pending' ? 0.55 : 1,
            lineHeight: 1.2
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            color: 'var(--color-earth-deep)',
            opacity: 0.5,
            marginTop: '2px',
            letterSpacing: '0.05em'
          }}
        >
          {sub}
        </div>
      </div>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.18em',
          fontWeight: 600,
          color: accent,
          textTransform: 'uppercase',
          flexShrink: 0
        }}
      >
        {state}
      </div>
    </li>
  );
}

function TelemCell({ label, value, mono }) {
  return (
    <div style={{ background: 'var(--color-paper-card)', padding: '12px 14px' }}>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.22em',
          color: 'var(--color-earth-deep)',
          opacity: 0.5,
          fontWeight: 600,
          marginBottom: '4px'
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: mono ? '"JetBrains Mono", monospace' : '"Fraunces", serif',
          fontSize: mono ? '13px' : '15px',
          fontVariationSettings: mono ? undefined : '"opsz" 144, "wght" 500',
          fontVariantNumeric: mono ? 'tabular-nums' : undefined,
          color: 'var(--color-earth-deep)',
          opacity: value ? 1 : 0.35,
          lineHeight: 1.1
        }}
      >
        {value || '—'}
      </div>
    </div>
  );
}

function SoilCell({ label, value }) {
  const color = value
    ? (value === 'Low' ? 'var(--color-rust)' : value === 'High' ? 'var(--color-moss)' : 'var(--color-ochre)')
    : 'var(--color-contour)';
  return (
    <div style={{ background: 'var(--color-paper-card)', padding: '12px 14px' }}>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.22em',
          color: 'var(--color-earth-deep)',
          opacity: 0.5,
          fontWeight: 600,
          marginBottom: '4px'
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '14px',
          color: value ? color : 'var(--color-earth-deep)',
          opacity: value ? 1 : 0.35,
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          letterSpacing: '0.1em'
        }}
      >
        {value || '...'}
      </div>
    </div>
  );
}
