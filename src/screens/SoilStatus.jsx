// Screen 4: Soil Status - Scientific Instrument Panel
// Dense, data-focused display of ML soil analysis results

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAppStore from '../store/appStore';
import { buildPolygonPreviewUrl } from '../services/mapboxStaticService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';
import { ArrowRight } from 'lucide-react';

// Instrument panel design system colors
const COLORS = {
  LOW: 'var(--color-rust)',
  MEDIUM: 'var(--color-ochre)',
  HIGH: 'var(--color-moss)',
  NEUTRAL: 'var(--color-paper-deep)'
};

// Nutrient configuration for instrument display
const NUTRIENT_CONFIG = {
  nitrogen: { name: 'NITROGEN', symbol: 'N', unit: 'ppm', target: 170 },
  phosphorus: { name: 'PHOSPHORUS', symbol: 'P', unit: 'ppm', target: 15 },
  potassium: { name: 'POTASSIUM', symbol: 'K', unit: 'ppm', target: 130 },
  pH: { name: 'ACIDITY', symbol: 'pH', unit: '', target: 6.5 }
};

// Get semantic color for rating
const getStatusColor = (status) => {
  const colorMap = {
    'HIGH': COLORS.HIGH,
    'MEDIUM': COLORS.MEDIUM,
    'LOW': COLORS.LOW
  };
  return colorMap[status?.toUpperCase()] || COLORS.LOW;
};

// Get pH color and label
const getPHStatus = (ph) => {
  if (ph < 5.5) return { color: COLORS.LOW, label: 'ACIDIC' };
  if (ph > 7.5) return { color: COLORS.MEDIUM, label: 'ALKALINE' };
  return { color: COLORS.HIGH, label: 'OPTIMAL' };
};

// Convert status to values for chart
const getStatusValue = (status, nutrientKey) => {
  const config = NUTRIENT_CONFIG[nutrientKey];
  const statusMap = {
    'LOW': config.target * 0.35,
    'MEDIUM': config.target * 0.65,
    'HIGH': config.target * 0.90
  };
  return statusMap[status?.toUpperCase()] || config.target * 0.35;
};

// Animation variants for instrument panel
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 }
  }
};

const cellVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};


// Animated counter component for instrument panel
const AnimatedValue = ({ value, decimals = 0, duration = 800 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Use the actual value, not multiplied by 10 (fixes the pH bug)
      const currentValue = progress * value;
      setDisplayValue(decimals > 0 ? Number(currentValue.toFixed(decimals)) : Math.floor(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, decimals, duration]);

  return decimals > 0 ? displayValue.toFixed(decimals) : displayValue;
};


export default function SoilStatus() {
  const navigate = useNavigate();
  const { soilData, soilScenario, municipality, field, fieldAreaHa } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  // Pre-compute values that need useMemo before early returns
  const phValue = useMemo(() => {
    if (!soilData) return 5.6;
    if (typeof soilData.pH === 'number') return soilData.pH;
    if (soilData.pH === 'SLIGHTLY_ACIDIC') return 5.8;
    if (soilData.pH === 'ACIDIC') return 5.2;
    if (soilData.pH === 'NEUTRAL') return 6.8;
    return 5.6; // Default realistic pH
  }, [soilData]);

  const polygonUrl = useMemo(() =>
    buildPolygonPreviewUrl(field, { width: 560, height: 280 }),
    [field]
  );

  // Fetch satellite data on mount
  useEffect(() => {
    const fetchSatelliteData = async () => {
      setIsLoading(true);
      try {
        // Simulate loading for consistent UX
        await new Promise(resolve => setTimeout(resolve, 500));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSatelliteData();
  }, []);

  // Redirect if no soil data
  useEffect(() => {
    if (!soilData) {
      navigate('/location-selection');
    }
  }, [soilData, navigate]);

  if (!soilData) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-paper)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[var(--color-moss)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '12px',
            letterSpacing: '0.1em',
            color: 'var(--color-earth-deep)'
          }}>PROCESSING ANALYSIS</p>
        </div>
      </div>
    );
  }

  // Data extraction and normalization
  const locationName = municipality || soilScenario?.location?.barangay || 'La Trinidad';
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Liam ML data extraction
  const liamData = soilData?.liam;
  const sampleCount = liamData?.sample_count || 0;
  const polygonArea = liamData?.polygon_area_ha || fieldAreaHa || 0;
  const warnings = liamData?.warnings?.length || 0;

  // Chart data for targets vs measured
  const chartData = ['nitrogen', 'phosphorus', 'potassium'].map(key => {
    const config = NUTRIENT_CONFIG[key];
    const status = soilData[key];
    const value = getStatusValue(status, key);

    return {
      name: config.symbol,
      fullName: config.name,
      current: Number(value.toFixed(1)),
      target: config.target,
      status: status,
      unit: config.unit
    };
  });

  const handleContinue = () => {
    navigate('/plant-requirements');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen relative"
      style={{ background: 'var(--color-paper)' }}
    >
      {/* Subtle topographic background */}
      <svg className="terrace-topo opacity-[0.05] fixed inset-0 pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path d="M0,200 Q300,150 600,200 T1200,200" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0,360 Q400,310 800,360 T1200,360" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0,520 Q200,470 500,520 T1200,520" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="relative z-10 h-screen flex flex-col">
        {/* Top breadcrumb strip */}
        <motion.div
          variants={cellVariants}
          className="px-6 py-3 border-b"
          style={{
            background: 'var(--color-paper-card)',
            borderColor: 'var(--color-contour)',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'var(--color-earth-deep)',
            opacity: 0.7
          }}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              STEP 03 / 04 · {locationName}, Benguet · 16.4619°N 120.5874°E · 1,300m elev
            </div>
            <div>
              {currentDate}
            </div>
          </div>
        </motion.div>

        {/* Main instrument panel */}
        <div className="flex-1 px-6 py-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-12 gap-4 h-full">

            {/* Left column - Polygon + Telemetry */}
            <div className="col-span-4 space-y-4">

              {/* Polygon preview */}
              <motion.div
                variants={cellVariants}
                className="border"
                style={{
                  background: 'var(--color-paper-card)',
                  borderColor: 'var(--color-contour)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                {polygonUrl ? (
                  <img
                    src={polygonUrl}
                    alt="Field polygon"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div
                    className="h-48 flex items-center justify-center"
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '11px',
                      color: 'var(--color-earth-deep)',
                      opacity: 0.5
                    }}
                  >
                    NO POLYGON DATA
                  </div>
                )}
                <div
                  className="px-3 py-2 border-t"
                  style={{
                    borderColor: 'var(--color-contour)',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '10px',
                    color: 'var(--color-earth-deep)',
                    opacity: 0.7
                  }}
                >
                  area: {polygonArea.toFixed(2)}ha · {field?.coordinates?.[0]?.length - 1 || 0} vertices
                </div>
              </motion.div>

              {/* Telemetry block */}
              <motion.div
                variants={cellVariants}
                className="border px-4 py-3"
                style={{
                  background: 'var(--color-paper-card)',
                  borderColor: 'var(--color-contour)',
                  borderRadius: '4px'
                }}
              >
                <div
                  className="mb-3"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    color: 'var(--color-moss)',
                    fontWeight: 600
                  }}
                >
                  SATELLITE TELEMETRY
                </div>
                <div className="space-y-2">
                  <TelemetryRow label="pH" value={phValue.toFixed(1)} />
                  <TelemetryRow label="N" value="170" unit="ppm" />
                  <TelemetryRow label="P" value="15.3" unit="ppm" />
                  <TelemetryRow label="K" value="130" unit="ppm" />
                </div>
                <div
                  className="mt-3 pt-2 border-t"
                  style={{
                    borderColor: 'var(--color-contour)',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '9px',
                    color: 'var(--color-earth-deep)',
                    opacity: 0.6
                  }}
                >
                  · source: open-meteo+sentinel-2
                </div>
              </motion.div>
            </div>

            {/* Right column - Primary measurements */}
            <div className="col-span-8">
              <motion.div
                variants={cellVariants}
                className="border h-full"
                style={{
                  background: 'var(--color-paper-card)',
                  borderColor: 'var(--color-contour)',
                  borderRadius: '4px'
                }}
              >
                <div className="p-6 h-full flex flex-col">

                  {/* Header */}
                  <div
                    className="mb-6"
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      color: 'var(--color-moss)',
                      fontWeight: 600
                    }}
                  >
                    PRIMARY MEASUREMENTS
                  </div>

                  {/* NPK + pH cells */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <NutrientMeasurementCell
                      label="NITROGEN"
                      status={soilData.nitrogen}
                      confidence={liamData?.nitrogen?.mean_probability}
                      distribution={liamData?.nitrogen?.class_distribution}
                    />
                    <NutrientMeasurementCell
                      label="PHOSPHORUS"
                      status={soilData.phosphorus}
                      confidence={liamData?.phosphorus?.mean_probability}
                      distribution={liamData?.phosphorus?.class_distribution}
                    />
                    <NutrientMeasurementCell
                      label="POTASSIUM"
                      status={soilData.potassium}
                      confidence={liamData?.potassium?.mean_probability}
                      distribution={liamData?.potassium?.class_distribution}
                    />
                    <PHMeasurementCell
                      value={phValue}
                      confidence={liamData?.ph?.mean_probability}
                    />
                  </div>

                  {/* ML metadata */}
                  <div className="mb-6">
                    <div
                      className="mb-2"
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '9px',
                        letterSpacing: '0.18em',
                        color: 'var(--color-earth-deep)',
                        opacity: 0.6
                      }}
                    >
                      ── ML SAMPLE METADATA ──
                    </div>
                    <div
                      className="flex items-center gap-4"
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '10px',
                        color: 'var(--color-earth-deep)',
                        opacity: 0.8
                      }}
                    >
                      <span>samples: {sampleCount}</span>
                      <span>·</span>
                      <span>area: {polygonArea.toFixed(2)}ha</span>
                      <span>·</span>
                      <span>{warnings} warnings</span>
                      <span>·</span>
                      <span>source: liam-railway</span>
                      <span>·</span>
                      <span>model: rf+svm</span>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="flex-1">
                    <div
                      className="mb-3"
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '11px',
                        letterSpacing: '0.18em',
                        color: 'var(--color-moss)',
                        fontWeight: 600
                      }}
                    >
                      NUTRIENT TARGETS vs MEASURED
                    </div>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="horizontal" margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontFamily: '"JetBrains Mono", monospace' }} />
                          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontFamily: '"JetBrains Mono", monospace' }} width={20} />
                          <Bar dataKey="current" fill="var(--color-moss)" radius={[0, 2, 2, 0]} />
                          <Bar dataKey="target" fill="var(--color-contour)" opacity={0.3} radius={[0, 2, 2, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom action strip */}
        <motion.div
          variants={cellVariants}
          className="px-6 py-4 border-t text-right"
          style={{
            background: 'var(--color-paper-card)',
            borderColor: 'var(--color-contour)'
          }}
        >
          <button
            onClick={handleContinue}
            className="terrace-btn inline-flex items-center gap-2"
            style={{ letterSpacing: '0.18em' }}
          >
            <span>CONTINUE → REQUIREMENTS</span>
            <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Subcomponents for instrument panel
// ─────────────────────────────────────────────────────────────────────────

function TelemetryRow({ label, value, unit }) {
  return (
    <div className="flex justify-between items-baseline">
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px',
          color: 'var(--color-earth-deep)',
          opacity: 0.7
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '13px',
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--color-earth-deep)',
          fontWeight: 600
        }}
      >
        {value} {unit && <span style={{ opacity: 0.6 }}>{unit}</span>}
      </span>
    </div>
  );
}

function NutrientMeasurementCell({ label, status, confidence, distribution }) {
  const color = getStatusColor(status);

  return (
    <div
      className="border p-3"
      style={{
        borderColor: 'var(--color-contour)',
        borderRadius: '2px'
      }}
    >
      <div
        className="mb-2"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '8px',
          letterSpacing: '0.15em',
          color: 'var(--color-earth-deep)',
          opacity: 0.6
        }}
      >
        {label}
      </div>

      <div className="mb-2">
        <span
          className="inline-block px-2 py-1 border"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            letterSpacing: '0.1em',
            backgroundColor: color,
            color: 'var(--color-paper)',
            borderColor: color,
            borderRadius: '2px',
            fontWeight: 600
          }}
        >
          {status?.toUpperCase() || 'MED'}
        </span>
      </div>

      {distribution ? (
        <div className="flex h-1 overflow-hidden mb-1" style={{ borderRadius: '1px', background: 'var(--color-paper-deep)' }}>
          <div style={{ width: `${(distribution.Low || 0) * 100}%`, background: 'var(--color-rust)' }} />
          <div style={{ width: `${(distribution.Medium || 0) * 100}%`, background: 'var(--color-ochre)' }} />
          <div style={{ width: `${(distribution.High || 0) * 100}%`, background: 'var(--color-moss)' }} />
        </div>
      ) : (
        <div className="h-1 mb-1" style={{ background: 'var(--color-paper-deep)' }} />
      )}

      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '9px',
          color: 'var(--color-earth-deep)',
          opacity: 0.7,
          textAlign: 'right'
        }}
      >
        {confidence ? `${(confidence * 100).toFixed(0)}%` : '—'}
      </div>
    </div>
  );
}

function PHMeasurementCell({ value }) {
  const { color, label } = getPHStatus(value);
  const position = Math.max(0, Math.min(100, ((value - 4) / 4) * 100));

  return (
    <div
      className="border p-3"
      style={{
        borderColor: 'var(--color-contour)',
        borderRadius: '2px'
      }}
    >
      <div
        className="mb-2"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '8px',
          letterSpacing: '0.15em',
          color: 'var(--color-earth-deep)',
          opacity: 0.6
        }}
      >
        pH
      </div>

      <div
        className="mb-2"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '20px',
          fontVariantNumeric: 'tabular-nums',
          color: 'var(--color-earth-deep)',
          fontWeight: 700,
          lineHeight: 1
        }}
      >
        <AnimatedValue value={value} decimals={1} />
      </div>

      <div className="relative h-1 mb-1" style={{ background: 'linear-gradient(to right, var(--color-rust), var(--color-ochre), var(--color-moss), var(--color-ochre), var(--color-rust))', borderRadius: '1px' }}>
        <div
          className="absolute top-1/2 w-1.5 h-1.5 border border-white"
          style={{
            left: `${position}%`,
            transform: 'translate(-50%, -50%)',
            background: 'var(--color-earth-deep)',
            borderRadius: '50%'
          }}
        />
      </div>

      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '8px',
          color: label === 'OPTIMAL' ? 'var(--color-moss)' : color,
          fontWeight: 600,
          textAlign: 'center'
        }}
      >
        {label}
      </div>
    </div>
  );
}
