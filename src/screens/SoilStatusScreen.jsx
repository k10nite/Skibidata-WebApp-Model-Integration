/**
 * Screen 4: Soil Status Dashboard - Premium Airbnb-Style with Circular Gauges
 * Bilingual: Filipino + English
 * Features: Animated circular progress gauges, color-coded status badges
 */

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import useAppStore from '../store/appStore';
import {
  MapPin,
  ArrowRight,
  Sprout,
  Flame,
  Droplets,
  Gauge,
  ArrowLeft
} from 'lucide-react';

// Register GSAP plugin
gsap.registerPlugin(useGSAP);

// Premium color system - exact hex codes from requirements
const COLORS = {
  LOW: '#E74C3C',      // Red - Critical/Low
  MEDIUM: '#F39C12',   // Yellow/Amber - Medium
  HIGH: '#27AE60',     // Green - High/Optimal
  NEUTRAL: '#6B7280',  // Gray - Neutral
  BACKGROUND: '#FAFAF9', // Stone-50
  CARD: '#FFFFFF'
};

// Nutrient configuration with bilingual labels
const NUTRIENT_CONFIG = {
  nitrogen: {
    key: 'nitrogen',
    nameEN: 'Nitrogen',
    namePH: 'Nitroheno',
    symbol: 'N',
    icon: Flame,
    descriptionEN: 'Essential for leaf growth',
    descriptionPH: 'Mahalaga sa paglago ng dahon',
    maxValue: 100
  },
  phosphorus: {
    key: 'phosphorus',
    nameEN: 'Phosphorus',
    namePH: 'Posporo',
    symbol: 'P',
    icon: Sprout,
    descriptionEN: 'For root development',
    descriptionPH: 'Para sa pag-unlad ng ugat',
    maxValue: 100
  },
  potassium: {
    key: 'potassium',
    nameEN: 'Potassium',
    namePH: 'Potasyo',
    symbol: 'K',
    icon: Droplets,
    descriptionEN: 'For overall plant health',
    descriptionPH: 'Para sa kalusugan ng halaman',
    maxValue: 100
  },
  pH: {
    key: 'pH',
    nameEN: 'Soil pH',
    namePH: 'pH ng Lupa',
    symbol: 'pH',
    icon: Gauge,
    descriptionEN: 'Acidity/Alkalinity level',
    descriptionPH: 'Antas ng pagka-asido',
    maxValue: 14
  }
};

// Status mapping with bilingual labels
const STATUS_LABELS = {
  LOW: { en: 'Low', ph: 'Mababa', color: COLORS.LOW },
  MEDIUM: { en: 'Medium', ph: 'Katamtaman', color: COLORS.MEDIUM },
  HIGH: { en: 'High', ph: 'Mataas', color: COLORS.HIGH },
  ACIDIC: { en: 'Acidic', ph: 'Maasim', color: COLORS.LOW },
  SLIGHTLY_ACIDIC: { en: 'Slightly Acidic', ph: 'Bahagyang Maasim', color: COLORS.MEDIUM },
  NEUTRAL: { en: 'Neutral', ph: 'Neutral', color: COLORS.HIGH },
  SLIGHTLY_ALKALINE: { en: 'Slightly Alkaline', ph: 'Bahagyang Alkaline', color: COLORS.MEDIUM },
  ALKALINE: { en: 'Alkaline', ph: 'Alkaline', color: COLORS.LOW }
};

// Get status configuration
const getStatusConfig = (status) => {
  return STATUS_LABELS[status] || STATUS_LABELS.LOW;
};

// Get percentage based on status and nutrient type
const getPercentage = (status) => {
  const statusMap = {
    'LOW': 25,
    'MEDIUM': 60,
    'HIGH': 90,
    'ACIDIC': 35,
    'SLIGHTLY_ACIDIC': 45,
    'NEUTRAL': 65,
    'SLIGHTLY_ALKALINE': 75,
    'ALKALINE': 85
  };
  return statusMap[status] || 50;
};

// Circular Gauge Component with GSAP Animation
function CircularGauge({ 
  value, 
  maxValue, 
  color, 
  size = 160, 
  strokeWidth = 12, 
  icon: Icon,
  delay = 0 
}) {
  const gaugeRef = useRef(null);
  const progressRef = useRef(null);
  const valueRef = useRef(null);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((value / maxValue) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  useGSAP(() => {
    // Animate the progress ring
    gsap.fromTo(
      progressRef.current,
      { strokeDashoffset: circumference },
      { 
        strokeDashoffset: offset, 
        duration: 1.5, 
        ease: 'power2.out',
        delay: delay 
      }
    );
    
    // Animate the value number
    gsap.fromTo(
      valueRef.current,
      { scale: 0.5, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.8, 
        ease: 'back.out(1.5)',
        delay: delay + 0.3
      }
    );
    
    // Animate the entire card
    gsap.fromTo(
      gaugeRef.current,
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6, 
        ease: 'power2.out',
        delay: delay 
      }
    );
  }, { scope: gaugeRef, dependencies: [offset, delay] });

  return (
    <div 
      ref={gaugeRef}
      className="relative flex flex-col items-center"
      style={{ width: size, height: size + 20 }}
    >
      {/* SVG Gauge */}
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          ref={progressRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ transition: 'none' }}
        />
      </svg>
      
      {/* Center content */}
      <div 
        ref={valueRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ opacity: 0 }}
      >
        {Icon && (
          <Icon 
            size={28} 
            style={{ color }} 
            className="mb-1"
          />
        )}
        <span className="text-2xl font-bold text-gray-800">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}

// Nutrient Card Component
function NutrientGaugeCard({ nutrient, status, delay }) {
  const config = NUTRIENT_CONFIG[nutrient];
  const statusConfig = getStatusConfig(status);
  const percentage = getPercentage(status, nutrient);
  const Icon = config.icon;
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${statusConfig.color}15` }}
          >
            <Icon size={20} style={{ color: statusConfig.color }} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">
              {config.symbol}
            </h3>
            <p className="text-xs text-gray-500">{config.nameEN}</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <span 
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{ 
            backgroundColor: `${statusConfig.color}20`,
            color: statusConfig.color
          }}
        >
          {statusConfig.en}
        </span>
      </div>
      
      {/* Gauge */}
      <div className="flex justify-center mb-4">
        <CircularGauge
          value={percentage}
          maxValue={100}
          color={statusConfig.color}
          size={140}
          strokeWidth={10}
          icon={Icon}
          delay={delay}
        />
      </div>
      
      {/* Description */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">
          {config.nameEN}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {config.descriptionEN}
        </p>
      </div>
      
      {/* Visual comparison bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>0%</span>
          <span style={{ color: statusConfig.color }}>{percentage}%</span>
          <span>100%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: statusConfig.color
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Location Summary Card
function LocationSummary({ soilScenario, municipality }) {
  const cardRef = useRef(null);
  
  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.1 }
    );
  }, { scope: cardRef });
  
  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3"
    >
      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <MapPin size={20} className="text-emerald-600" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
        <p className="text-sm font-semibold text-gray-900 truncate">
          {soilScenario?.location?.barangay || municipality || 'La Trinidad'}, Benguet
        </p>
      </div>
      <div className="ml-auto text-right hidden sm:block">
        <p className="text-xs text-gray-500">Soil Type</p>
        <p className="text-sm font-semibold text-gray-900">
          {soilScenario?.soilType || 'Clay Loam'}
        </p>
      </div>
    </div>
  );
}

// Main Screen Component
export default function SoilStatusScreen() {
  const navigate = useNavigate();
  const { soilData, soilScenario, municipality } = useAppStore();
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  // Use mockup data if no real data (for prototype)
  const displayData = soilData || {
    N: 'LOW',
    P: 'MEDIUM',
    K: 'LOW',
    pH: 'MEDIUM'
  };

  const displayScenario = soilScenario || {
    location: { barangay: 'La Trinidad' },
    soilType: 'Clay Loam'
  };

  const displayMunicipality = municipality || 'Benguet';

  // Button animation
  useGSAP(() => {
    gsap.fromTo(
      buttonRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1 }
    );
  }, { scope: buttonRef });
  
  const handleBack = () => {
    navigate('/processing-screen');
  };

  const handleContinue = () => {
    navigate('/fertilizer-recommendations-premium');
  };
  
  // Prepare nutrients data
  const nutrients = ['nitrogen', 'phosphorus', 'potassium', 'pH'];
  
  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-stone-50"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Soil Status
                </h1>
                <p className="text-xs text-gray-500">Nutrient Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Location Summary */}
        <div className="mb-6">
          <LocationSummary soilScenario={displayScenario} municipality={displayMunicipality} />
        </div>
        
        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            Soil Nutrient Analysis
          </h2>
          <p className="text-gray-600">
            Current levels of N, P, K, and pH in your soil
          </p>
        </div>
        
        {/* Gauge Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {nutrients.map((nutrient, index) => (
            <NutrientGaugeCard
              key={nutrient}
              nutrient={nutrient}
              status={displayData[nutrient]}
              delay={0.2 + (index * 0.15)}
            />
          ))}
        </div>
        
        {/* Legend / Status Guide */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Status Guide
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS.LOW }}
              />
              <span className="text-sm text-gray-600">
                Low <span className="text-gray-400">(0-33%)</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS.MEDIUM }}
              />
              <span className="text-sm text-gray-600">
                Medium <span className="text-gray-400">(34-66%)</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS.HIGH }}
              />
              <span className="text-sm text-gray-600">
                High <span className="text-gray-400">(67-100%)</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <div 
          ref={buttonRef}
          className="flex justify-center pb-8"
          style={{ opacity: 0 }}
        >
          <button
            onClick={handleContinue}
            className="group bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
          >
            <span>View Fertilizer Recommendations</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </main>
    </div>
  );
}
