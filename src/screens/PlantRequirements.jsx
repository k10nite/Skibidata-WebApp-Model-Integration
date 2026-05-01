/**
 * Screen 5: Plant Requirements Reference - Premium Linear/Notion Aesthetic
 * Bilingual: Filipino + English
 * Features: Reference table, comparison cards, gradient progress indicators
 * Colors: #2E7D32, #84934A, #492828
 */

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import useAppStore from '../store/appStore';
import {
  ArrowRight,
  Sprout,
  Leaf,
  Info,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Flame,
  Droplets,
  Gauge,
  ChevronRight
} from 'lucide-react';

// Register GSAP plugin
gsap.registerPlugin(useGSAP);

// Premium color system - exact hex codes from requirements
const COLORS = {
  PRIMARY: '#2E7D32',      // Deep Green - Primary
  RICE: '#84934A',         // Rice Green - Secondary
  CLAY: '#492828',         // Clay Dark - Accent
  LOW: '#E74C3C',          // Red - Critical
  MEDIUM: '#F39C12',       // Amber - Medium
  HIGH: '#27AE60',         // Green - High/Optimal
  NEUTRAL: '#6B7280',      // Gray - Neutral
  BACKGROUND: '#FAFAF9',   // Stone-50
  CARD: '#FFFFFF'
};

// Status level configurations
const STATUS_LEVELS = {
  LOW: { 
    labelEN: 'Low', 
    labelPH: 'Mababa', 
    color: COLORS.LOW,
    icon: AlertCircle,
    gradient: 'from-red-500 to-red-600'
  },
  MEDIUM: { 
    labelEN: 'Medium', 
    labelPH: 'Katamtaman', 
    color: COLORS.MEDIUM,
    icon: AlertCircle,
    gradient: 'from-amber-500 to-amber-600'
  },
  'MEDIUM-HIGH': { 
    labelEN: 'Medium-High', 
    labelPH: 'Katamtaman-Mataas', 
    color: '#DAA520',
    icon: CheckCircle2,
    gradient: 'from-yellow-500 to-yellow-600'
  },
  HIGH: { 
    labelEN: 'High', 
    labelPH: 'Mataas', 
    color: COLORS.HIGH,
    icon: CheckCircle2,
    gradient: 'from-emerald-500 to-emerald-600'
  }
};

// Plant data with requirements
const PLANT_DATA = {
  rice: {
    id: 'rice',
    nameEN: 'Rice',
    namePH: 'Palay',
    icon: Droplets,
    image: '/images/plants/rice.jpg',
    descriptionEN: 'Rice requires consistent moisture and high nitrogen for optimal yield. Best grown in flooded paddies.',
    descriptionPH: 'Ang palay ay nangangailangan ng palaging moisture at mataas na nitrogen para sa pinakamahusay na ani. Pinakamahusay na itanim sa binahang bukid.',
    growingPeriod: '90-120 days',
    waterNeeds: 'High',
    requirements: {
      nitrogen: 'HIGH',
      phosphorus: 'MEDIUM-HIGH',
      potassium: 'HIGH',
      pH: 'MEDIUM'
    }
  },
  corn: {
    id: 'corn',
    nameEN: 'Corn',
    namePH: 'Mais',
    icon: Sprout,
    image: '/images/plants/corn.jpg',
    descriptionEN: 'Corn needs well-drained soil and moderate nitrogen. Warm-season crop requiring full sunlight.',
    descriptionPH: 'Ang mais ay nangangailangan ng maayos na drainage at katamtamang nitrogen. Pananim sa mainit na panahon na nangangailangan ng sikat ng araw.',
    growingPeriod: '75-100 days',
    waterNeeds: 'Medium',
    requirements: {
      nitrogen: 'HIGH',
      phosphorus: 'MEDIUM',
      potassium: 'MEDIUM-HIGH',
      pH: 'MEDIUM'
    }
  },
  vegetables: {
    id: 'vegetables',
    nameEN: 'Vegetables',
    namePH: 'Gulay',
    icon: Leaf,
    image: '/images/plants/vegetables.jpg',
    descriptionEN: 'Vegetables vary in needs but generally require balanced nutrients and consistent watering.',
    descriptionPH: 'Ang mga gulay ay magkakaiba ng pangangailangan ngunit karaniwang nangangailangan ng balanseng nutrients at patuloy na pagdidilig.',
    growingPeriod: '45-90 days',
    waterNeeds: 'Medium',
    requirements: {
      nitrogen: 'MEDIUM-HIGH',
      phosphorus: 'MEDIUM',
      potassium: 'MEDIUM',
      pH: 'MEDIUM'
    }
  }
};

// Nutrient configuration
const NUTRIENT_CONFIG = {
  nitrogen: {
    key: 'nitrogen',
    nameEN: 'Nitrogen',
    namePH: 'Nitroheno',
    symbol: 'N',
    icon: Flame,
    descriptionEN: 'Essential for leaf growth',
    descriptionPH: 'Mahalaga sa paglago ng dahon'
  },
  phosphorus: {
    key: 'phosphorus',
    nameEN: 'Phosphorus',
    namePH: 'Posporo',
    symbol: 'P',
    icon: Sprout,
    descriptionEN: 'For root development',
    descriptionPH: 'Para sa pag-unlad ng ugat'
  },
  potassium: {
    key: 'potassium',
    nameEN: 'Potassium',
    namePH: 'Potasyo',
    symbol: 'K',
    icon: Droplets,
    descriptionEN: 'For overall plant health',
    descriptionPH: 'Para sa kalusugan ng halaman'
  },
  pH: {
    key: 'pH',
    nameEN: 'Soil pH',
    namePH: 'pH ng Lupa',
    symbol: 'pH',
    icon: Gauge,
    descriptionEN: 'Acidity/Alkalinity level',
    descriptionPH: 'Antas ng pagka-asido'
  }
};

// Get status config helper
const getStatusConfig = (level) => STATUS_LEVELS[level] || STATUS_LEVELS.MEDIUM;

// Gradient Progress Bar Component
function GradientProgressBar({ level, delay = 0 }) {
  const barRef = useRef(null);
  const config = getStatusConfig(level);
  
  // Calculate width based on level
  const widthMap = { LOW: 25, MEDIUM: 50, 'MEDIUM-HIGH': 75, HIGH: 100 };
  const targetWidth = widthMap[level] || 50;
  
  useGSAP(() => {
    gsap.fromTo(
      barRef.current,
      { width: '0%', opacity: 0 },
      { 
        width: `${targetWidth}%`, 
        opacity: 1,
        duration: 1.2, 
        ease: 'power3.out',
        delay: delay
      }
    );
  }, { scope: barRef, dependencies: [targetWidth, delay] });
  
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        ref={barRef}
        className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
        style={{ width: '0%', opacity: 0 }}
      />
    </div>
  );
}

// Requirement Row Component (Linear/Notion table style)
function RequirementRow({ nutrient, requirement, soilStatus, index }) {
  const rowRef = useRef(null);
  const config = NUTRIENT_CONFIG[nutrient];
  const reqConfig = getStatusConfig(requirement);
  const soilConfig = getStatusConfig(soilStatus);
  const Icon = config.icon;
  const ReqIcon = reqConfig.icon;
  const SoilIcon = soilConfig.icon;
  
  useGSAP(() => {
    gsap.fromTo(
      rowRef.current,
      { x: -20, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 0.5, 
        ease: 'power2.out',
        delay: 0.3 + (index * 0.1)
      }
    );
  }, { scope: rowRef, dependencies: [index] });
  
  // Check if soil matches requirement
  const isMatch = requirement === soilStatus || 
    (requirement === 'HIGH' && soilStatus === 'HIGH') ||
    (requirement === 'MEDIUM' && (soilStatus === 'MEDIUM' || soilStatus === 'MEDIUM-HIGH')) ||
    (requirement === 'MEDIUM-HIGH' && (soilStatus === 'MEDIUM-HIGH' || soilStatus === 'HIGH'));
  
  return (
    <div 
      ref={rowRef}
      className="group grid grid-cols-12 gap-4 py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200 items-center"
      style={{ opacity: 0 }}
    >
      {/* Nutrient Info */}
      <div className="col-span-3 flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${COLORS.PRIMARY}15` }}
        >
          <Icon size={20} style={{ color: COLORS.PRIMARY }} />
        </div>
        <div>
          <span className="font-bold text-gray-900">{config.symbol}</span>
          <span className="text-xs text-gray-500 block">{config.nameEN}</span>
        </div>
      </div>
      
      {/* Required Level */}
      <div className="col-span-4">
        <div className="flex items-center gap-2 mb-2">
          <ReqIcon size={14} style={{ color: reqConfig.color }} />
          <span 
            className="text-sm font-semibold"
            style={{ color: reqConfig.color }}
          >
            {reqConfig.labelEN}
          </span>
        </div>
        <GradientProgressBar level={requirement} delay={0.5 + (index * 0.1)} />
      </div>
      
      {/* Current Soil Status */}
      <div className="col-span-4">
        <div className="flex items-center gap-2 mb-2">
          <SoilIcon size={14} style={{ color: soilConfig.color }} />
          <span 
            className="text-sm font-semibold"
            style={{ color: soilConfig.color }}
          >
            {soilConfig.labelEN}
          </span>
          {isMatch && (
            <span className="text-emerald-500">
              <CheckCircle2 size={14} />
            </span>
          )}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ 
              width: `${{ LOW: 25, MEDIUM: 50, 'MEDIUM-HIGH': 75, HIGH: 100 }[soilStatus] || 50}%`,
              backgroundColor: soilConfig.color
            }}
          />
        </div>
      </div>
      
      {/* Match Indicator */}
      <div className="col-span-1 flex justify-end">
        <div 
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isMatch ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
          }`}
        >
          {isMatch ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
        </div>
      </div>
    </div>
  );
}

// Comparison Card Component
function ComparisonCard({ title, subtitle, plant, soilData, delay = 0 }) {
  const cardRef = useRef(null);
  
  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6, 
        ease: 'power2.out',
        delay: delay
      }
    );
  }, { scope: cardRef, dependencies: [delay] });
  
  const nutrients = ['nitrogen', 'phosphorus', 'potassium', 'pH'];
  
  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
      style={{ opacity: 0 }}
    >
      {/* Header */}
      <div 
        className="px-6 py-4 border-b border-gray-100"
        style={{ backgroundColor: `${COLORS.PRIMARY}08` }}
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {nutrients.map((nutrient, idx) => {
          const config = NUTRIENT_CONFIG[nutrient];
          const reqLevel = plant.requirements[nutrient];
          const soilLevel = soilData[nutrient];
          const reqConfig = getStatusConfig(reqLevel);
          const soilConfig = getStatusConfig(soilLevel);
          const Icon = config.icon;
          
          return (
            <div key={nutrient} className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${COLORS.PRIMARY}10` }}
              >
                <Icon size={16} style={{ color: COLORS.PRIMARY }} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{config.symbol}</span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: `${reqConfig.color}15`,
                        color: reqConfig.color
                      }}
                    >
                      {reqConfig.labelEN}
                    </span>
                    <ChevronRight size={12} className="text-gray-400" />
                    <span 
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: `${soilConfig.color}15`,
                        color: soilConfig.color
                      }}
                    >
                      {soilConfig.labelEN}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full rounded-l-full"
                    style={{ 
                      width: '50%',
                      backgroundColor: reqConfig.color,
                      opacity: 0.7
                    }}
                  />
                  <div 
                    className="h-full rounded-r-full"
                    style={{ 
                      width: '50%',
                      backgroundColor: soilConfig.color
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Educational Info Card
function EducationalCard({ plant, delay = 0 }) {
  const cardRef = useRef(null);
  const PlantIcon = plant.icon;
  
  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 20, opacity: 0, scale: 0.98 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 0.6, 
        ease: 'power2.out',
        delay: delay
      }
    );
  }, { scope: cardRef, dependencies: [delay] });
  
  return (
    <div 
      ref={cardRef}
      className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-6"
      style={{ opacity: 0 }}
    >
      <div className="flex items-start gap-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${COLORS.PRIMARY}15` }}
        >
          <Info size={28} style={{ color: COLORS.PRIMARY }} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">
            Important Note
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {plant.descriptionEN}
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            {plant.descriptionEN}
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-emerald-100">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Growing Period</span>
              <p className="text-sm font-medium text-gray-900">{plant.growingPeriod}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Water Needs</span>
              <p className="text-sm font-medium text-gray-900">{plant.waterNeeds}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Plant Header Component
function PlantHeader({ plant, delay = 0 }) {
  const headerRef = useRef(null);
  const PlantIcon = plant.icon;
  
  useGSAP(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6, 
        ease: 'power2.out',
        delay: delay
      }
    );
  }, { scope: headerRef, dependencies: [delay] });
  
  return (
    <div 
      ref={headerRef}
      className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-2xl border border-gray-200"
      style={{ opacity: 0 }}
    >
      {/* Plant Image/Icon */}
      <div 
        className="w-24 h-24 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: `${COLORS.PRIMARY}10` }}
      >
        <PlantIcon size={48} style={{ color: COLORS.PRIMARY }} />
      </div>
      
      {/* Plant Info */}
      <div className="text-center sm:text-left flex-1">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {plant.nameEN}
          </h2>
          <span 
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{ 
              backgroundColor: `${COLORS.PRIMARY}15`,
              color: COLORS.PRIMARY
            }}
          >
            Selected
          </span>
        </div>
        <p className="text-lg text-gray-600">{plant.nameEN}</p>
        <p className="text-sm text-gray-500 mt-2">
          Mga Kailangan sa Pagtatanim / Growing Requirements
        </p>
      </div>
    </div>
  );
}

// Main Screen Component
export default function PlantRequirements() {
  const navigate = useNavigate();
  const { selectedCrop, soilData, soilScenario, municipality } = useAppStore();
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const tableRef = useRef(null);
  
  // Redirect if no data
  useEffect(() => {
    if (!soilData) {
      navigate('/soil-status');
    }
  }, [soilData, navigate]);
  
  // Get plant data
  const plant = PLANT_DATA[selectedCrop] || PLANT_DATA.rice;
  
  // Button animation
  useGSAP(() => {
    gsap.fromTo(
      buttonRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.2 }
    );
  }, { scope: buttonRef });
  
  // Table header animation
  useGSAP(() => {
    gsap.fromTo(
      tableRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.2 }
    );
  }, { scope: tableRef });
  
  if (!soilData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  const handleBack = () => {
    navigate('/soil-status-screen');
  };

  const handleContinue = () => {
    navigate('/fertilizer-recommendations-premium');
  };
  
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
                  {plant.nameEN} Requirements
                </h1>
                <p className="text-xs text-gray-500">Optimal soil conditions</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Plant Header */}
        <div className="mb-8">
          <PlantHeader plant={plant} delay={0.1} />
        </div>
        
        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            Reference Table
          </h2>
          <p className="text-gray-600">
            Talaan ng Mga Kailangan / Nutrient Requirements
          </p>
        </div>
        
        {/* Requirements Table - Linear/Notion Style */}
        <div 
          ref={tableRef}
          className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8"
          style={{ opacity: 0 }}
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-3">Nutrient</div>
            <div className="col-span-4">Kailangan / Required</div>
            <div className="col-span-4">Kasalukuyan / Current</div>
            <div className="col-span-1 text-right">Status</div>
          </div>
          
          {/* Table Rows */}
          <div className="divide-y divide-gray-50">
            {nutrients.map((nutrient, index) => (
              <RequirementRow
                key={nutrient}
                nutrient={nutrient}
                requirement={plant.requirements[nutrient]}
                soilStatus={soilData[nutrient]}
                index={index}
              />
            ))}
          </div>
        </div>
        
        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ComparisonCard
            title="Kailangan ng Halaman"
            subtitle="Plant Requirements"
            plant={plant}
            soilData={soilData}
            delay={0.7}
          />
          <ComparisonCard
            title="Current Soil"
            subtitle="Current Soil Status"
            plant={plant}
            soilData={soilData}
            delay={0.8}
          />
        </div>
        
        {/* Educational Info Card */}
        <div className="mb-8">
          <EducationalCard plant={plant} delay={0.9} />
        </div>
        
        {/* Legend */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Level Guide / Gabay sa Antas
          </h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(STATUS_LEVELS).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-sm text-gray-600">
                  {config.labelEN}
                </span>
              </div>
            ))}
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
            className="group px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-white"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            <span>Continue to Recommendations</span>
            <span className="text-white/70 text-sm">/ Magpatuloy</span>
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
