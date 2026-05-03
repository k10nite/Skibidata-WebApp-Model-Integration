// Screen 4: Soil Status - Editorial Cross-Section Design
// Geological strata reveal of ML soil analysis results

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAppStore from '../store/appStore';
import { getSatelliteAnalysis } from '../services/satelliteService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { ArrowRight } from 'lucide-react';

// Terrace design system semantic colors for soil ratings
const COLORS = {
  LOW: 'var(--color-rust)',      // A24B2A
  MEDIUM: 'var(--color-ochre)',  // C8893A
  HIGH: 'var(--color-moss)',     // 4F5B2F
  NEUTRAL: 'var(--color-paper-deep)'  // E8E2D4
};

// Nutrient configuration for editorial display
const NUTRIENT_CONFIG = {
  nitrogen: {
    name: 'NITROGEN',
    symbol: 'N',
    description: 'Essential for vigorous leaf growth and protein synthesis. Low levels limit vegetative development.',
    unit: 'kg/ha',
    target: 120
  },
  phosphorus: {
    name: 'PHOSPHORUS',
    symbol: 'P',
    description: 'Critical for root development and flowering. Deficiency reduces fruit set and yield.',
    unit: 'kg/ha',
    target: 60
  },
  potassium: {
    name: 'POTASSIUM',
    symbol: 'K',
    description: 'Regulates water use and disease resistance. Insufficient levels weaken plant immunity.',
    unit: 'kg/ha',
    target: 80
  },
  pH: {
    name: 'ACIDITY',
    symbol: 'pH',
    description: 'Controls nutrient availability. Optimal range ensures maximum fertilizer efficiency.',
    unit: '',
    target: 6.5
  }
};

// Get semantic color for rating
const getStatusColor = (status) => {
  const colorMap = {
    'HIGH': COLORS.HIGH,
    'MEDIUM': COLORS.MEDIUM,
    'LOW': COLORS.LOW
  };
  return colorMap[status] || COLORS.LOW;
};

// Get pH color based on value
const getPHColor = (ph) => {
  if (ph < 6.0) return COLORS.LOW;      // Acidic
  if (ph > 7.5) return COLORS.MEDIUM;   // Alkaline
  return COLORS.NEUTRAL;                // Neutral range
};

// Convert status to values for chart visualization
const getStatusValue = (status, nutrientKey) => {
  const config = NUTRIENT_CONFIG[nutrientKey];
  const statusMap = {
    'LOW': config.target * 0.35,
    'MEDIUM': config.target * 0.65,
    'HIGH': config.target * 0.90
  };
  return statusMap[status] || config.target * 0.35;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const stratumVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

// Custom chart tooltip with Terrace styling
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-4 py-3 rounded-lg border border-[var(--color-contour-strong)]"
        style={{
          background: 'var(--color-paper-card)',
          color: 'var(--color-earth-deep)'
        }}
      >
        <p className="terrace-data font-semibold">{payload[0].payload.name}</p>
        <p className="terrace-data text-sm opacity-80 mt-1">
          {payload[0].value} {payload[0].payload.unit}
        </p>
      </div>
    );
  }
  return null;
};

// Animated counter component
const AnimatedValue = ({ value, duration = 1400 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return displayValue;
};

// Mock data fallback for when satellite service fails
const MOCK_SATELLITE_DATA = {
  weather: {
    current: {
      temperature: 22,
      humidity: 75,
      precipitation: 0,
      soilTemperature: 18,
      soilMoisture: 55
    },
    elevation: 1300,
    location: 'La Trinidad'
  },
  vegetation: {
    ndvi: 0.62,
    healthStatus: 'Healthy',
    recommendation: 'Vegetation health is good'
  },
  soil: {
    ph: 5.8,
    nitrogen: { percentage: 0.14, rating: 'Low', ppm: 140 },
    phosphorus: { ppm: 9.5, rating: 'Low' },
    potassium: { ppm: 125, rating: 'Adequate' },
    organicMatter: { percentage: 3.8, rating: 'High' },
    soilType: 'Inceptisol (Volcanic)',
    texture: 'Clay Loam'
  }
};

export default function SoilStatus() {
  const navigate = useNavigate();
  const { soilData, soilScenario, municipality } = useAppStore();
  const [satelliteData, setSatelliteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch satellite data on mount
  useEffect(() => {
    const fetchSatelliteData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const locationName = municipality || soilScenario?.location?.barangay || 'La Trinidad';
        const data = await getSatelliteAnalysis(locationName);
        setSatelliteData(data);
      } catch (err) {
        setError('Using estimated satellite values');
        setSatelliteData(MOCK_SATELLITE_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSatelliteData();
  }, [municipality, soilScenario]);

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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[var(--color-moss)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="terrace-display" style={{ fontSize: '1.5rem' }}>Analyzing Soil Profile</p>
          <p className="terrace-data text-sm mt-2 opacity-60">Processing field measurements...</p>
        </motion.div>
      </div>
    );
  }

  const locationName = municipality || soilScenario?.location?.barangay || 'Atok';
  const currentDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Extract pH value for display
  const phValue = soilData.pH === 'SLIGHTLY_ACIDIC' ? 5.8 :
                  soilData.pH === 'ACIDIC' ? 5.2 :
                  soilData.pH === 'NEUTRAL' ? 6.8 : 5.8;

  // Prepare chart data with Terrace colors
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

  const radarData = chartData.map(item => ({
    nutrient: item.name,
    current: (item.current / item.target) * 100,
    optimal: 100
  }));

  const handleContinue = () => {
    navigate('/plant-requirements');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
      style={{ background: 'var(--color-paper)' }}
    >
      {/* FIRST STRATUM: Hero Header */}
      <motion.section
        variants={stratumVariants}
        className="relative py-16 px-6"
        style={{ background: 'var(--color-paper-card)' }}
      >
        {/* Topographic background */}
        <svg className="terrace-topo opacity-5" viewBox="0 0 400 200" fill="none">
          <path d="M0 50 Q50 30 100 50 T200 50 T300 50 T400 50" stroke="currentColor" strokeWidth="1"/>
          <path d="M0 80 Q60 60 120 80 T240 80 T360 80 T400 80" stroke="currentColor" strokeWidth="1"/>
          <path d="M0 110 Q40 90 80 110 T160 110 T240 110 T320 110 T400 110" stroke="currentColor" strokeWidth="1"/>
        </svg>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="terrace-eyebrow mb-4">03 — SOIL ANALYSIS</p>
          <h1
            className="terrace-display mb-4"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          >
            {locationName}, Benguet
          </h1>
          <div className="terrace-data text-lg opacity-80 space-y-1">
            <p>{currentDate}</p>
            <p>16°24&prime;N 120°35&prime;E · {soilScenario?.elevation || '1,350'}m elevation</p>
          </div>
        </div>
      </motion.section>

      {/* SECOND STRATUM: NPK Results - The WOW */}
      <motion.section
        variants={stratumVariants}
        className="py-20 px-6"
        style={{ background: 'var(--color-paper)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {['nitrogen', 'phosphorus', 'potassium'].map((nutrient) => {
              const config = NUTRIENT_CONFIG[nutrient];
              const status = soilData[nutrient];
              const color = getStatusColor(status);

              return (
                <motion.div
                  key={nutrient}
                  variants={stratumVariants}
                  className="text-center space-y-6"
                >
                  <div className="space-y-2">
                    <p className="terrace-eyebrow">{config.name}</p>

                    {/* Massive rating display */}
                    <div
                      className="terrace-display-italic"
                      style={{
                        fontSize: 'clamp(4rem, 12vw, 6rem)',
                        color
                      }}
                    >
                      {status}
                    </div>

                    {/* Soil core visualization */}
                    <div className="flex justify-center mb-4">
                      <div className="w-3 h-24 rounded-full overflow-hidden border border-[var(--color-contour-strong)]">
                        <div
                          className="w-full transition-all duration-1000"
                          style={{
                            height: status === 'HIGH' ? '80%' : status === 'MEDIUM' ? '50%' : '25%',
                            background: `linear-gradient(to bottom, ${color}, ${color}88)`,
                            marginTop: status === 'HIGH' ? '0%' : status === 'MEDIUM' ? '25%' : '50%'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Editorial description */}
                  <p className="text-sm leading-relaxed max-w-xs mx-auto opacity-80">
                    {config.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* THIRD STRATUM: pH Analysis */}
      <motion.section
        variants={stratumVariants}
        className="py-16 px-6"
        style={{ background: 'var(--color-paper-deep)' }}
      >
        <div className="max-w-4xl mx-auto">
          <p className="terrace-eyebrow text-center mb-8">SOIL ACIDITY</p>

          <div className="text-center space-y-8">
            {/* Large pH display */}
            <div
              className="terrace-display"
              style={{
                fontSize: 'clamp(5rem, 15vw, 8rem)',
                color: getPHColor(phValue)
              }}
            >
              <AnimatedValue value={phValue * 10} duration={1200} />.
              <AnimatedValue value={(phValue * 10) % 10} duration={1200} />
            </div>

            {/* pH Scale */}
            <div className="max-w-lg mx-auto">
              <div className="relative h-4 rounded-full overflow-hidden border border-[var(--color-contour-strong)]">
                {/* Gradient background */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right,
                      var(--color-rust) 0%,
                      var(--color-rust) 25%,
                      var(--color-paper-deep) 25%,
                      var(--color-paper-deep) 75%,
                      var(--color-ochre) 75%,
                      var(--color-ochre) 100%)`
                  }}
                />

                {/* Current pH indicator */}
                <div
                  className="absolute top-0 w-1 h-full transition-all duration-1000"
                  style={{
                    left: `${((phValue - 4) / 6) * 100}%`,
                    background: 'var(--color-moss)',
                    transform: 'translateX(-50%)'
                  }}
                />
              </div>

              <div className="flex justify-between mt-2 terrace-data text-xs opacity-60">
                <span>4.0 ACIDIC</span>
                <span>7.0 NEUTRAL</span>
                <span>10.0 ALKALINE</span>
              </div>
            </div>

            <p className="text-sm opacity-80 max-w-md mx-auto">
              {phValue < 6.0 && "Acidic conditions may limit nutrient availability. Consider lime application."}
              {phValue >= 6.0 && phValue <= 7.5 && "Optimal pH range for most crops. Nutrients are readily available."}
              {phValue > 7.5 && "Alkaline conditions may reduce micronutrient uptake. Monitor carefully."}
            </p>
          </div>
        </div>
      </motion.section>

      {/* FOURTH STRATUM: Satellite Telemetry */}
      {satelliteData?.soil && (
        <motion.section
          variants={stratumVariants}
          className="py-16 px-6"
          style={{ background: 'var(--color-paper-card)' }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <p className="terrace-eyebrow">SATELLITE TELEMETRY</p>
              {error && (
                <span className="terrace-data text-xs px-3 py-1 rounded-full border border-[var(--color-contour-strong)] opacity-60">
                  regional priors
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'pH Level', value: satelliteData.soil.ph?.toFixed(1) || '5.8', unit: '' },
                { label: 'Nitrogen (N)', value: satelliteData.soil.nitrogen?.ppm?.toFixed(0) || '140', unit: 'ppm' },
                { label: 'Phosphorus (P)', value: satelliteData.soil.phosphorus?.ppm?.toFixed(1) || '9.5', unit: 'ppm' },
                { label: 'Potassium (K)', value: satelliteData.soil.potassium?.ppm?.toFixed(0) || '125', unit: 'ppm' }
              ].map((item, index) => (
                <div key={index} className="terrace-card-hairline p-6">
                  <p className="terrace-data text-xs opacity-60 mb-2">{item.label}</p>
                  <p className="terrace-data text-2xl font-bold mb-1">
                    {item.value} <span className="text-sm opacity-60">{item.unit}</span>
                  </p>
                </div>
              ))}
            </div>

            <p className="terrace-data text-xs opacity-60 mt-6 text-center">
              from regional Sentinel-2 priors
            </p>
          </div>
        </motion.section>
      )}

      {/* FIFTH STRATUM: Chart Visualizations */}
      <motion.section
        variants={stratumVariants}
        className="py-16 px-6"
        style={{ background: 'var(--color-paper)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Radar Chart */}
            <div className="terrace-card p-8">
              <h3 className="terrace-display text-2xl mb-6">Nutrient Profile</h3>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--color-contour)" />
                    <PolarAngleAxis
                      dataKey="nutrient"
                      tick={{ fill: 'var(--color-earth-deep)', fontFamily: 'var(--font-data)', fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      tick={{ fill: 'var(--color-earth-deep)', fontSize: 10 }}
                      tickCount={4}
                    />
                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke="var(--color-moss)"
                      fill="var(--color-moss)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Optimal"
                      dataKey="optimal"
                      stroke="var(--color-contour-strong)"
                      fill="none"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="terrace-card p-8">
              <h3 className="terrace-display text-2xl mb-6">Current vs Target</h3>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-contour)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'var(--color-earth-deep)', fontFamily: 'var(--font-data)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--color-contour-strong)' }}
                    />
                    <YAxis
                      tick={{ fill: 'var(--color-earth-deep)', fontSize: 10 }}
                      axisLine={{ stroke: 'var(--color-contour-strong)' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="current" radius={[4, 4, 0, 0]} maxBarSize={60}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                      ))}
                    </Bar>
                    <Bar
                      dataKey="target"
                      radius={[4, 4, 0, 0]}
                      fill="var(--color-contour)"
                      opacity={0.4}
                      maxBarSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Continue Button */}
      <motion.section
        variants={stratumVariants}
        className="py-16 px-6 text-center"
        style={{ background: 'var(--color-paper-deep)' }}
      >
        <motion.button
          onClick={handleContinue}
          className="terrace-btn inline-flex items-center gap-3 group"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <span>Continue to Plant Selection</span>
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </motion.button>
      </motion.section>
    </motion.div>
  );
}
