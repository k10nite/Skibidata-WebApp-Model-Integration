/**
 * Screen 5: Plant Requirements - Terrace Design System
 * Editorial-cartographic aesthetic: Cordillera rice terraces meets scientific journal
 * Features: Editorial split-spread, requirements ledger, topographic elements
 */

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import useAppStore from '../store/appStore';
import {
  ArrowRight,
  Sprout,
  Leaf
} from 'lucide-react';

// Terrace easing and motion settings
const TERRACE_EASING = [0.16, 1, 0.3, 1];
const STAGGER_DELAY = 0.08;

// Nutrient requirement values mapping
const NUTRIENT_VALUES = {
  nitrogen: {
    LOW: '40–60',
    MEDIUM: '80–120',
    'MEDIUM-HIGH': '120–160',
    HIGH: '180–220'
  },
  phosphorus: {
    LOW: '20–40',
    MEDIUM: '40–60',
    'MEDIUM-HIGH': '60–90',
    HIGH: '90–120'
  },
  potassium: {
    LOW: '60–100',
    MEDIUM: '100–150',
    'MEDIUM-HIGH': '150–200',
    HIGH: '200–250'
  },
  pH: {
    LOW: '4.5 – 5.5',
    MEDIUM: '5.5 – 6.5',
    'MEDIUM-HIGH': '6.0 – 7.0',
    HIGH: '6.5 – 7.5'
  }
};

// Plant database with scientific names and editorial descriptions
const PLANT_DATA = {
  rice: {
    id: 'rice',
    scientificName: 'Oryza sativa',
    commonName: 'Rice',
    filipinoName: 'Palay',
    icon: Leaf,
    description: 'A semi-aquatic cereal grass native to Asia, requiring consistent moisture and balanced nutrition. Thrives in flooded paddies with slightly acidic to neutral soil conditions. High nitrogen demand during vegetative growth phase, transitioning to potassium requirements during grain filling.',
    requirements: {
      nitrogen: 'HIGH',
      phosphorus: 'MEDIUM-HIGH',
      potassium: 'HIGH',
      pH: 'MEDIUM'
    }
  },
  corn: {
    id: 'corn',
    scientificName: 'Zea mays',
    commonName: 'Corn',
    filipinoName: 'Mais',
    icon: Sprout,
    description: 'A tall annual grass requiring well-drained soils and full sunlight exposure. Moderate to high nitrogen needs during early growth stages, with balanced phosphorus for root development. Prefers slightly acidic to neutral soil pH for optimal nutrient uptake.',
    requirements: {
      nitrogen: 'HIGH',
      phosphorus: 'MEDIUM',
      potassium: 'MEDIUM-HIGH',
      pH: 'MEDIUM'
    }
  },
  vegetables: {
    id: 'vegetables',
    scientificName: 'Mixed cultivars',
    commonName: 'Vegetables',
    filipinoName: 'Gulay',
    icon: Leaf,
    description: 'Diverse group of herbaceous plants with varying nutrient requirements. Generally benefit from balanced NPK nutrition and consistent soil moisture. Most vegetable crops prefer slightly acidic to neutral pH for optimal nutrient availability and root health.',
    requirements: {
      nitrogen: 'MEDIUM-HIGH',
      phosphorus: 'MEDIUM',
      potassium: 'MEDIUM',
      pH: 'MEDIUM'
    }
  }
};

// Nutrient configuration for the requirements ledger
const NUTRIENT_CONFIG = {
  nitrogen: {
    key: 'nitrogen',
    name: 'NITROGEN',
    unit: 'kg/ha'
  },
  phosphorus: {
    key: 'phosphorus',
    name: 'PHOSPHORUS',
    unit: 'kg/ha'
  },
  potassium: {
    key: 'potassium',
    name: 'POTASSIUM',
    unit: 'kg/ha'
  },
  pH: {
    key: 'pH',
    name: 'pH RANGE',
    unit: ''
  }
};

// Requirements Ledger Row Component
function RequirementRow({ nutrient, requirement, index }) {
  const config = NUTRIENT_CONFIG[nutrient];
  const value = NUTRIENT_VALUES[nutrient][requirement];

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        delay: 0.3 + (index * STAGGER_DELAY),
        duration: 0.5,
        ease: TERRACE_EASING
      }}
      className="flex justify-between items-center py-3 border-b last:border-b-0"
      style={{ borderColor: 'var(--color-contour)' }}
    >
      <div className="terrace-data text-sm" style={{
        color: 'var(--color-earth-deep)',
        fontFamily: '"JetBrains Mono", monospace',
        letterSpacing: '0.05em'
      }}>
        {config.name}
      </div>
      <div className="terrace-data text-lg" style={{
        color: 'var(--color-earth-deep)',
        fontFamily: '"JetBrains Mono", monospace',
        fontVariantNumeric: 'tabular-nums'
      }}>
        {value} {config.unit}
      </div>
    </motion.div>
  );
}

// Topographic Background SVG Component
function TopographicBackground() {
  return (
    <svg
      className="terrace-topo opacity-[0.06]"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <ellipse cx="200" cy="160" rx="120" ry="40" />
        <ellipse cx="200" cy="160" rx="90" ry="30" />
        <ellipse cx="200" cy="160" rx="60" ry="20" />
        <ellipse cx="200" cy="160" rx="30" ry="10" />
      </g>
    </svg>
  );
}

// Main Screen Component
export default function PlantRequirements() {
  const navigate = useNavigate();

  // Note: Using selectedCrop to match existing usage, though store defines selectedPlant
  const { selectedCrop, soilData } = useAppStore();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Redirect if no data
  useEffect(() => {
    if (!soilData) {
      navigate('/soil-status');
    }
  }, [soilData, navigate]);

  // Get plant data (fallback to rice if selectedCrop doesn't exist)
  const plant = PLANT_DATA[selectedCrop] || PLANT_DATA.rice;
  const PlantIcon = plant.icon;

  if (!soilData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-paper)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{
            borderColor: 'var(--color-contour)',
            borderTopColor: 'var(--color-moss)'
          }} />
          <p style={{
            color: 'var(--color-earth-deep)',
            fontFamily: '"Fraunces", serif',
            fontVariationSettings: '"opsz" 14, "wght" 400'
          }}>Loading...</p>
        </div>
      </div>
    );
  }

  const handleContinue = () => {
    navigate('/fertilizer-recommendations');
  };

  const nutrients = ['nitrogen', 'phosphorus', 'potassium', 'pH'];

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative"
      style={{ background: 'var(--color-paper)' }}
    >
      {/* Topographic background */}
      <div className="fixed inset-0 pointer-events-none">
        <TopographicBackground />
      </div>

      {/* Progress breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: TERRACE_EASING }}
        className="relative z-10 pt-8 pb-4"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="terrace-data text-xs" style={{
            color: 'var(--color-moss)',
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: '0.05em'
          }}>
            04 — CROP PROFILE
          </div>
        </div>
      </motion.div>

      {/* Main editorial split-spread */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-12 gap-12 min-h-[70vh]">

          {/* LEFT SIDE - Primary Editorial Mass (58%) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: TERRACE_EASING }}
            >
              {/* Massive scientific name in Fraunces italic */}
              <h1
                className="terrace-display-italic mb-4"
                style={{
                  fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                  lineHeight: '0.9',
                  fontFamily: '"Fraunces", serif',
                  fontStyle: 'italic',
                  fontVariationSettings: '"opsz" 144, "wght" 400'
                }}
              >
                {plant.scientificName}
              </h1>

              {/* Common name + regional context */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{
                    backgroundColor: 'var(--color-moss)',
                    opacity: 0.1
                  }}>
                    <PlantIcon size={24} style={{ color: 'var(--color-moss)' }} />
                  </div>
                  <div>
                    <p className="text-xl font-medium" style={{
                      color: 'var(--color-earth-deep)',
                      fontFamily: '"Fraunces", serif',
                      fontVariationSettings: '"opsz" 14, "wght" 600'
                    }}>
                      {plant.commonName}
                    </p>
                    <p className="text-sm" style={{
                      color: 'var(--color-moss)',
                      fontFamily: '"Fraunces", serif',
                      fontStyle: 'italic',
                      fontVariationSettings: '"opsz" 144, "wght" 400'
                    }}>
                      {plant.filipinoName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Editorial description */}
              <div className="max-w-xl">
                <p className="text-base leading-relaxed" style={{
                  color: 'var(--color-earth-deep)',
                  fontFamily: '"Fraunces", serif',
                  fontVariationSettings: '"opsz" 14, "wght" 400'
                }}>
                  {plant.description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE - Supporting Mass (42%) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: TERRACE_EASING }}
            >
              {/* Requirements eyebrow */}
              <div className="terrace-eyebrow mb-8" style={{
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: '0.05em'
              }}>
                REQUIREMENTS
              </div>

              {/* Requirements ledger */}
              <div className="terrace-card-hairline p-8">
                <div className="space-y-1">
                  {nutrients.map((nutrient, index) => (
                    <RequirementRow
                      key={nutrient}
                      nutrient={nutrient}
                      requirement={plant.requirements[nutrient]}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8, ease: TERRACE_EASING }}
          className="flex justify-center mt-16"
        >
          <motion.button
            onClick={handleContinue}
            className="terrace-btn group"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            Continue to Recommendations
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}
