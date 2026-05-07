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
  Leaf,
  Apple
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

// Plant database with scientific names and editorial descriptions.
// Keys mirror the `id` field set by PlantSelection's CROPS_DATA so the
// lookup `PLANT_DATA[selectedPlant.id]` resolves directly. NPK ranges
// are sourced from PhilRice + BSU extension recommendations for the
// CAR highland context.
const PLANT_DATA = {
  cabbage: {
    scientificName: 'Brassica oleracea var. capitata',
    commonName: 'Cabbage',
    filipinoName: 'Repolyo',
    icon: Leaf,
    description: 'A cool-season cole crop well-adapted to CAR highland elevations of 1,000–2,000 m. Heavy nitrogen feeder during head formation; moderate phosphorus and potassium for firm head density. Prefers slightly acidic loam with consistent moisture; susceptible to clubroot below pH 5.5.',
    requirements: { nitrogen: 'HIGH', phosphorus: 'MEDIUM-HIGH', potassium: 'MEDIUM-HIGH', pH: 'MEDIUM' }
  },
  cabbage_head: {
    scientificName: 'Brassica oleracea var. capitata',
    commonName: 'Cabbage (Head)',
    filipinoName: 'Repolyong Ulo',
    icon: Leaf,
    description: 'A dense-headed cabbage cultivar prioritized for storage and transport. NPK requirements mirror standard cabbage with slightly elevated potassium for head firmness. Performs best in cool, well-drained highland soils with steady irrigation.',
    requirements: { nitrogen: 'HIGH', phosphorus: 'MEDIUM-HIGH', potassium: 'HIGH', pH: 'MEDIUM' }
  },
  pechay: {
    scientificName: 'Brassica rapa subsp. chinensis',
    commonName: 'Pechay',
    filipinoName: 'Pechay',
    icon: Leaf,
    description: 'A short-cycle leafy brassica harvested 30–45 days after planting. Highest demand is nitrogen for leaf expansion; moderate phosphorus supports root development. Tolerates a wide pH range but prefers slightly acidic to neutral conditions.',
    requirements: { nitrogen: 'HIGH', phosphorus: 'MEDIUM', potassium: 'MEDIUM', pH: 'MEDIUM' }
  },
  lettuce: {
    scientificName: 'Lactuca sativa',
    commonName: 'Lettuce',
    filipinoName: 'Litsugas',
    icon: Leaf,
    description: 'A cool-season leafy crop sensitive to heat-induced bolting. Moderate nitrogen for leaf production; balanced phosphorus and potassium for root vigor and stress tolerance. Prefers loose, fertile, slightly acidic soils with constant soil moisture to prevent tip-burn.',
    requirements: { nitrogen: 'MEDIUM-HIGH', phosphorus: 'MEDIUM', potassium: 'MEDIUM', pH: 'MEDIUM' }
  },
  potato: {
    scientificName: 'Solanum tuberosum',
    commonName: 'Potato',
    filipinoName: 'Patatas',
    icon: Sprout,
    description: 'A cool-climate tuber crop suited to CAR elevations above 1,200 m. Moderate nitrogen during vegetative growth; high phosphorus for tuber initiation; very high potassium for tuber bulking and starch quality. Prefers acidic, well-drained sandy loam.',
    requirements: { nitrogen: 'MEDIUM', phosphorus: 'HIGH', potassium: 'HIGH', pH: 'LOW' }
  },
  carrot: {
    scientificName: 'Daucus carota subsp. sativus',
    commonName: 'Carrot',
    filipinoName: 'Karot',
    icon: Sprout,
    description: 'A biennial root crop grown as an annual in CAR. Low to moderate nitrogen (excess produces forked roots); high phosphorus for root elongation; moderate potassium for sugar content. Requires deep, stone-free, slightly acidic loam for straight, well-formed roots.',
    requirements: { nitrogen: 'MEDIUM', phosphorus: 'HIGH', potassium: 'MEDIUM-HIGH', pH: 'MEDIUM' }
  },
  tomato: {
    scientificName: 'Solanum lycopersicum',
    commonName: 'Tomato',
    filipinoName: 'Kamatis',
    icon: Apple,
    description: 'A warm-season fruiting crop adapted to mid-elevation CAR conditions. Balanced NPK with elevated potassium during fruit set and ripening for sugar accumulation and disease resistance. Prefers slightly acidic to neutral soil with steady moisture; calcium availability critical to prevent blossom-end rot.',
    requirements: { nitrogen: 'MEDIUM-HIGH', phosphorus: 'MEDIUM-HIGH', potassium: 'HIGH', pH: 'MEDIUM' }
  },
  string_beans: {
    scientificName: 'Vigna unguiculata subsp. sesquipedalis',
    commonName: 'String Beans',
    filipinoName: 'Sitaw',
    icon: Sprout,
    description: 'A nitrogen-fixing legume requiring trellis support. Low external nitrogen needs (Rhizobium symbiosis supplies most); moderate phosphorus for nodulation and pod development; moderate potassium for pod fill. Prefers warm, well-drained loam at 6.0–7.0 pH.',
    requirements: { nitrogen: 'LOW', phosphorus: 'MEDIUM', potassium: 'MEDIUM', pH: 'MEDIUM' }
  },
  baguio_beans: {
    scientificName: 'Phaseolus vulgaris',
    commonName: 'Baguio Beans',
    filipinoName: 'Habichuelas',
    icon: Sprout,
    description: 'A bush snap-bean variety thriving in cool CAR conditions. Self-sufficient in nitrogen via root nodulation; moderate phosphorus for pod set; moderate potassium for pod quality. Prefers neutral pH and well-drained soils; avoid waterlogged conditions.',
    requirements: { nitrogen: 'LOW', phosphorus: 'MEDIUM', potassium: 'MEDIUM', pH: 'MEDIUM' }
  },
  broccoli: {
    scientificName: 'Brassica oleracea var. italica',
    commonName: 'Broccoli',
    filipinoName: 'Broccoli',
    icon: Leaf,
    description: 'A cool-season cole crop demanding rich soil and consistent fertility. High nitrogen for compact head formation; moderate phosphorus and potassium for stem strength. Performs best at slightly acidic to neutral pH with adequate boron and calcium.',
    requirements: { nitrogen: 'HIGH', phosphorus: 'MEDIUM-HIGH', potassium: 'MEDIUM-HIGH', pH: 'MEDIUM' }
  },
  cauliflower: {
    scientificName: 'Brassica oleracea var. botrytis',
    commonName: 'Cauliflower',
    filipinoName: 'Cauliflower',
    icon: Leaf,
    description: 'A cool-climate brassica producing dense white curds. High nitrogen for vegetative growth, but excess can delay heading; moderate phosphorus and potassium support curd development. Sensitive to micronutrient deficiencies (boron, molybdenum).',
    requirements: { nitrogen: 'HIGH', phosphorus: 'MEDIUM-HIGH', potassium: 'MEDIUM-HIGH', pH: 'MEDIUM' }
  },
  eggplant: {
    scientificName: 'Solanum melongena',
    commonName: 'Eggplant',
    filipinoName: 'Talong',
    icon: Apple,
    description: 'A warm-season fruiting crop tolerant to a range of soil conditions. Moderate to high nitrogen during early growth; balanced phosphorus for flowering; elevated potassium for fruit quality and shelf life. Sensitive to acidic soils below pH 5.5.',
    requirements: { nitrogen: 'MEDIUM-HIGH', phosphorus: 'MEDIUM-HIGH', potassium: 'HIGH', pH: 'MEDIUM' }
  },
  squash: {
    scientificName: 'Cucurbita maxima',
    commonName: 'Squash',
    filipinoName: 'Kalabasa',
    icon: Sprout,
    description: 'A vining cucurbit producing large fruits over 90–120 days. Moderate nitrogen for vine growth; balanced phosphorus and potassium for fruit set and quality. Prefers warm, well-drained sandy loam with high organic matter.',
    requirements: { nitrogen: 'MEDIUM', phosphorus: 'MEDIUM', potassium: 'MEDIUM-HIGH', pH: 'MEDIUM' }
  },
  ampalaya: {
    scientificName: 'Momordica charantia',
    commonName: 'Ampalaya',
    filipinoName: 'Ampalaya',
    icon: Sprout,
    description: 'A vining cucurbit known as bitter gourd. Low to moderate nitrogen; balanced phosphorus and potassium for sustained fruiting. Prefers warm temperatures, trellis support, and slightly acidic to neutral well-drained soil.',
    requirements: { nitrogen: 'MEDIUM', phosphorus: 'MEDIUM', potassium: 'MEDIUM', pH: 'MEDIUM' }
  },
  chayote: {
    scientificName: 'Sechium edule',
    commonName: 'Chayote',
    filipinoName: 'Sayote',
    icon: Sprout,
    description: 'A perennial vining cucurbit highly productive in mid-elevation CAR. Moderate nitrogen for vine vigor; balanced phosphorus and potassium for sustained fruiting over multiple harvest cycles. Prefers cool to mild temperatures and well-drained loamy soil.',
    requirements: { nitrogen: 'MEDIUM', phosphorus: 'MEDIUM', potassium: 'MEDIUM', pH: 'MEDIUM' }
  },
  asparagus: {
    scientificName: 'Asparagus officinalis',
    commonName: 'Asparagus',
    filipinoName: 'Asparagus',
    icon: Sprout,
    description: 'A perennial high-value crop with a 15–20 year productive lifespan. Moderate to high nitrogen split-applied across the season; high phosphorus for crown establishment; moderate potassium for spear quality. Tolerates slightly alkaline soils, unusual among CAR vegetables.',
    requirements: { nitrogen: 'MEDIUM-HIGH', phosphorus: 'HIGH', potassium: 'MEDIUM', pH: 'HIGH' }
  },

  // Generic fallbacks
  rice: {
    scientificName: 'Oryza sativa',
    commonName: 'Rice',
    filipinoName: 'Palay',
    icon: Leaf,
    description: 'A semi-aquatic cereal grass native to Asia, requiring consistent moisture and balanced nutrition. Thrives in flooded paddies with slightly acidic to neutral soil conditions.',
    requirements: { nitrogen: 'HIGH', phosphorus: 'MEDIUM-HIGH', potassium: 'HIGH', pH: 'MEDIUM' }
  },
  corn: {
    scientificName: 'Zea mays',
    commonName: 'Corn',
    filipinoName: 'Mais',
    icon: Sprout,
    description: 'A tall annual grass requiring well-drained soils and full sunlight. Moderate to high nitrogen needs during early growth, with balanced phosphorus for root development.',
    requirements: { nitrogen: 'HIGH', phosphorus: 'MEDIUM', potassium: 'MEDIUM-HIGH', pH: 'MEDIUM' }
  },
  vegetables: {
    scientificName: 'Mixed cultivars',
    commonName: 'Vegetables',
    filipinoName: 'Gulay',
    icon: Leaf,
    description: 'Diverse group of herbaceous plants with varying nutrient requirements. Generally benefit from balanced NPK nutrition and consistent soil moisture. Most vegetable crops prefer slightly acidic to neutral pH for optimal nutrient availability.',
    requirements: { nitrogen: 'MEDIUM-HIGH', phosphorus: 'MEDIUM', potassium: 'MEDIUM', pH: 'MEDIUM' }
  }
};

// Per-crop swatch colors keyed off the same ids PlantSelection sets.
// Picked to evoke the actual vegetable rather than an arbitrary palette
// (carrot orange, tomato red, eggplant aubergine, etc.). Used for both
// the icon stroke and a soft tinted background on the badge circle.
const CROP_COLORS = {
  cabbage:      '#7C9A4D', // pale leafy green
  cabbage_head: '#86A05A', // slightly warmer green-yellow
  pechay:       '#5A8A3A', // bright leaf green
  lettuce:      '#9DB76A', // lime green
  potato:       '#B08A5C', // earthy tan
  carrot:       '#D87E2C', // carrot orange
  tomato:       '#C9442E', // tomato red
  string_beans: '#5D8C4A', // forest green
  baguio_beans: '#7FA260', // mid green
  broccoli:     '#3F6B36', // deep green
  cauliflower:  '#E5DCC2', // ivory cream
  eggplant:     '#6B3D6E', // aubergine purple
  squash:       '#E0832E', // pumpkin orange
  ampalaya:     '#6E9148', // medium green-yellow
  chayote:      '#A8BE7C', // pale jade
  asparagus:    '#6F8B45', // muted green
  rice:         '#C9A867', // wheat gold
  corn:         '#E8B43C', // sweet-corn yellow
  vegetables:   '#7B9B6E'  // generic moss
};

const DEFAULT_CROP_COLOR = '#7B9B6E';

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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

  // The store key is `selectedPlant` (an object {name, id, nameFil, category}).
  // Earlier this screen read a non-existent `selectedCrop` and silently
  // fell back to Rice for every crop the user picked. Fixed.
  const { selectedPlant, soilData } = useAppStore();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!soilData) navigate('/soil-status');
  }, [soilData, navigate]);

  // Look up plant data by the id PlantSelection set. If the picked crop
  // isn't in our PLANT_DATA table, build a graceful fallback using the
  // actual selected name + Filipino name from the store, plus a generic
  // vegetables description, so the screen never silently shows Rice.
  const plant = (() => {
    const id = selectedPlant?.id;
    if (id && PLANT_DATA[id]) return PLANT_DATA[id];
    if (selectedPlant?.name) {
      const generic = PLANT_DATA.vegetables;
      return {
        ...generic,
        scientificName: selectedPlant.name,
        commonName: selectedPlant.name,
        filipinoName: selectedPlant.nameFil || generic.filipinoName,
        description: `A ${selectedPlant.category || 'highland'} crop grown in CAR municipalities. Specific nutrient demands vary; use the rule-based engine on the next screen for the precise prescription. Generic guidance: balanced NPK with a slight phosphorus emphasis at planting and elevated potassium during fruit/tuber set.`
      };
    }
    return PLANT_DATA.vegetables;
  })();
  const PlantIcon = plant.icon;
  const cropColor = CROP_COLORS[selectedPlant?.id] || DEFAULT_CROP_COLOR;

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
      className="min-h-screen relative terrace-page-with-mobile-actions"
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
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-12 gap-6 lg:gap-12 lg:min-h-[70vh]">

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
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: hexToRgba(cropColor, 0.18),
                      border: `1px solid ${hexToRgba(cropColor, 0.45)}`
                    }}
                  >
                    <PlantIcon size={24} style={{ color: cropColor }} />
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
                      color: cropColor,
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

        {/* Continue button — inline on desktop, sticky-bottom on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8, ease: TERRACE_EASING }}
          className="hidden lg:flex justify-center mt-16"
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

      {/* Mobile sticky-bottom CTA */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3 border-t"
        style={{
          background: 'var(--color-paper-card)',
          borderColor: 'var(--color-contour)',
          boxShadow: '0 -8px 20px -8px rgba(45,32,22,0.08)',
          paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0))'
        }}
      >
        <button
          onClick={handleContinue}
          className="terrace-btn w-full justify-center"
          style={{ padding: '0.95rem 1rem', letterSpacing: '0.18em' }}
        >
          CONTINUE → RECOMMENDATIONS
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
}
