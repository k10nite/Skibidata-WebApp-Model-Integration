// Screen 4: Soil Status Dashboard - Professional Vineyard-Style Analytics
// Inspired by modern agricultural management apps with clean data visualization

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import useAppStore from '../store/appStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  ArrowLeft,
  MapPin,
  Cloud,
  Droplets,
  Wind,
  Sun,
  TrendingDown,
  TrendingUp,
  Minus,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

// Professional color palette
const COLORS = {
  LOW: '#EF4444',      // Red - Critical
  MEDIUM: '#F59E0B',   // Amber - Warning
  HIGH: '#10B981',     // Green - Optimal
  NEUTRAL: '#6B7280'   // Gray - Info
};

// Nutrient configuration with modern icons and targets
const NUTRIENT_CONFIG = {
  nitrogen: {
    name: 'Nitrogen',
    symbol: 'N',
    icon: '🌱',
    unit: 'kg/ha',
    target: 120,
    key: 'nitrogen'
  },
  phosphorus: {
    name: 'Phosphorus',
    symbol: 'P',
    icon: '🌿',
    unit: 'kg/ha',
    target: 60,
    key: 'phosphorus'
  },
  potassium: {
    name: 'Potassium',
    symbol: 'K',
    icon: '🍃',
    unit: 'kg/ha',
    target: 80,
    key: 'potassium'
  },
  pH: {
    name: 'pH Level',
    symbol: 'pH',
    icon: '⚖️',
    unit: '',
    target: 6.5,
    key: 'pH'
  }
};

// Convert status to actual values for visualization
const getStatusValue = (status, nutrientKey) => {
  const config = NUTRIENT_CONFIG[nutrientKey];
  const statusMap = {
    'LOW': config.target * 0.35,
    'MEDIUM': config.target * 0.65,
    'HIGH': config.target * 0.90,
    'SLIGHTLY_ACIDIC': 5.8,
    'NEUTRAL': 6.5,
    'ACIDIC': 5.2
  };
  return statusMap[status] || config.target * 0.35;
};

// Get status color
const getStatusColor = (status) => {
  if (status === 'HIGH' || status === 'NEUTRAL') return COLORS.HIGH;
  if (status === 'MEDIUM' || status === 'SLIGHTLY_ACIDIC') return COLORS.MEDIUM;
  return COLORS.LOW;
};

// Get trend icon
const getTrendIcon = (status) => {
  if (status === 'HIGH' || status === 'NEUTRAL') return CheckCircle;
  if (status === 'MEDIUM' || status === 'SLIGHTLY_ACIDIC') return Minus;
  return TrendingDown;
};

// Get percentage for progress
const getProgressPercentage = (status, nutrientKey) => {
  const value = getStatusValue(status, nutrientKey);
  const target = NUTRIENT_CONFIG[nutrientKey].target;
  return Math.round((value / target) * 100);
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
        <p className="text-sm text-gray-600">
          Current: <span className="font-mono font-semibold">{payload[0].value}</span> {payload[0].payload.unit}
        </p>
        <p className="text-sm text-gray-500">
          Target: <span className="font-mono">{payload[0].payload.target}</span> {payload[0].payload.unit}
        </p>
      </div>
    );
  }
  return null;
};

export default function SoilStatus() {
  const navigate = useNavigate();
  const { soilData, soilScenario, municipality } = useAppStore();
  const containerRef = useRef(null);
  const [weather] = useState({
    temp: 24,
    humidity: 65,
    windSpeed: 5,
    condition: 'Sunny'
  });

  // Redirect if no soil data
  useEffect(() => {
    if (!soilData) {
      navigate('/location-selection');
    }
  }, [soilData, navigate]);

  // GSAP Animations
  useEffect(() => {
    if (!soilData || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.header-bar',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );

      // Weather and map cards stagger
      gsap.fromTo(
        '.top-card',
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.2
        }
      );

      // Chart card animation
      gsap.fromTo(
        '.chart-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.4 }
      );

      // Nutrient cards stagger
      gsap.fromTo(
        '.nutrient-card',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.6
        }
      );

      // Button animation
      gsap.fromTo(
        '.action-button',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.5)',
          delay: 1.2
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [soilData]);

  if (!soilData) {
    return null;
  }

  // Prepare chart data
  const chartData = Object.keys(NUTRIENT_CONFIG).map(key => {
    const config = NUTRIENT_CONFIG[key];
    const status = soilData[key];
    const currentValue = getStatusValue(status, key);

    return {
      name: config.symbol,
      fullName: config.name,
      current: Number(currentValue.toFixed(1)),
      target: config.target,
      status: status,
      unit: config.unit,
      percentage: getProgressPercentage(status, key)
    };
  });

  const handleBack = () => {
    navigate('/location-selection');
  };

  const handleContinue = () => {
    navigate('/plant-requirements');
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gray-50 relative"
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {/* Header Bar */}
      <div className="header-bar bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Soil Analysis</h1>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {soilScenario?.location?.barangay || 'La Trinidad'}, Benguet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section: Weather + Field Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weather Widget */}
          <div className="top-card bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Weather
              </h2>
              <Cloud className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Sun className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{weather.temp}°C</p>
                  <p className="text-sm text-gray-500">{weather.condition}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Humidity</p>
                    <p className="text-sm font-semibold text-gray-900">{weather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Wind</p>
                    <p className="text-sm font-semibold text-gray-900">{weather.windSpeed} m/s</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Field Map Card */}
          <div className="top-card bg-white rounded-2xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Field Location
              </h2>
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>

            <div className="relative h-40 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl overflow-hidden">
              {/* Simplified field visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {soilScenario?.location?.barangay || 'La Trinidad'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Elevation: {soilScenario?.elevation || '1,400'}m | {soilScenario?.soilType || 'Clay Loam'}
                  </p>
                </div>
              </div>

              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Nutrient Overview Chart */}
        <div className="chart-card bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Nutrient Overview</h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6B7280', fontSize: 14, fontWeight: 600 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  label={{ value: 'Level', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="current" radius={[8, 8, 0, 0]} maxBarSize={80}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                  ))}
                </Bar>
                <Bar dataKey="target" radius={[8, 8, 0, 0]} fill="#E5E7EB" opacity={0.3} maxBarSize={80} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.HIGH }} />
              <span className="text-sm text-gray-600">Current Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="text-sm text-gray-600">Target Level</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Soil Nutrient Levels</h2>

        {/* Detailed Nutrient Cards */}
        <div className="space-y-4 mb-8">
          {Object.keys(NUTRIENT_CONFIG).map((key, index) => {
            const config = NUTRIENT_CONFIG[key];
            const status = soilData[key];
            const currentValue = getStatusValue(status, key);
            const percentage = getProgressPercentage(status, key);
            const color = getStatusColor(status);
            const TrendIcon = getTrendIcon(status);
            const statusLabel = status.replace('_', ' ');

            return (
              <div
                key={key}
                className="nutrient-card bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{config.icon}</div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {config.name} ({config.symbol})
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Essential for plant growth and development
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <TrendIcon className="w-4 h-4" style={{ color }} />
                    <span className="text-sm font-semibold" style={{ color }}>
                      {statusLabel}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Progress to Target
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>

                {/* Values */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Current Level</p>
                    <p className="font-mono text-lg font-bold text-gray-900">
                      {currentValue.toFixed(1)} <span className="text-sm text-gray-500">{config.unit}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Target Level</p>
                    <p className="font-mono text-lg font-bold text-gray-600">
                      {config.target} <span className="text-sm text-gray-500">{config.unit}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendation Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Farmer's Advisory
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Your soil analysis indicates nutrient deficiencies. Proper fertilization is recommended
                to achieve optimal crop yields. Continue to the next step to get personalized recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="action-button bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 group"
          >
            <span>Continue to Recommendations</span>
            <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
