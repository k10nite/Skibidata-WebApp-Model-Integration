// Screen 3: Crop Selection - Field Journal Redesign
// Dense, tactile field-notebook aesthetic with ornamental composition
// Laboratory data sheets + botanical sketches + editorial typography

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Search icon removed - using terminal-style input instead
import useAppStore from '../store/appStore';

// Complete crop data - 44 entries matching Hans's THESIS_CROP_MAP
const CROPS_DATA = [
  // Vegetables (21 crops)
  { id: 'cabbage', name: 'Cabbage', nameFil: 'Repolyo', category: 'vegetables', engineLabel: 'Cabbage' },
  { id: 'cabbage_head', name: 'Cabbage (Head)', nameFil: 'Repolyong Ulo', category: 'vegetables', engineLabel: 'Cabbage (Head)' },
  { id: 'pechay', name: 'Pechay', nameFil: 'Pechay', category: 'vegetables', engineLabel: 'Pechay' },
  { id: 'mustard', name: 'Mustard', nameFil: 'Mustasa', category: 'vegetables', engineLabel: 'Mustard' },
  { id: 'cauliflower', name: 'Cauliflower', nameFil: 'Cauliflower', category: 'vegetables', engineLabel: 'Cauliflower' },
  { id: 'broccoli', name: 'Broccoli', nameFil: 'Broccoli', category: 'vegetables', engineLabel: 'Broccoli' },
  { id: 'lettuce', name: 'Lettuce', nameFil: 'Lettuce', category: 'vegetables', engineLabel: 'Lettuce' },
  { id: 'celery', name: 'Celery', nameFil: 'Celery', category: 'vegetables', engineLabel: 'Celery' },
  { id: 'eggplant', name: 'Eggplant', nameFil: 'Talong', category: 'vegetables', engineLabel: 'Eggplant' },
  { id: 'tomato', name: 'Tomato', nameFil: 'Kamatis', category: 'vegetables', engineLabel: 'Tomato' },
  { id: 'bell_pepper', name: 'Bell Pepper', nameFil: 'Bell Pepper', category: 'vegetables', engineLabel: 'Bell Pepper' },
  { id: 'pepper', name: 'Pepper', nameFil: 'Sili', category: 'vegetables', engineLabel: 'Pepper' },
  { id: 'green_pepper', name: 'Green (siling-haba) Pepper', nameFil: 'Siling Haba', category: 'vegetables', engineLabel: 'Green (siling-haba) Pepper' },
  { id: 'black_pepper', name: 'Black Pepper', nameFil: 'Paminta', category: 'vegetables', engineLabel: 'Black Pepper' },
  { id: 'squash', name: 'Squash', nameFil: 'Kalabasa', category: 'vegetables', engineLabel: 'Squash' },
  { id: 'cucumber', name: 'Cucumber', nameFil: 'Pepino', category: 'vegetables', engineLabel: 'Cucumber' },
  { id: 'patola', name: 'Patola', nameFil: 'Patola', category: 'vegetables', engineLabel: 'Patola' },
  { id: 'okra_local', name: 'Okra (Local)', nameFil: 'Okra', category: 'vegetables', engineLabel: 'Okra (Local)' },
  { id: 'okra_hybrid', name: 'Okra (Hybrid)', nameFil: 'Okra Hybrid', category: 'vegetables', engineLabel: 'Okra (Hybrid)' },
  { id: 'ampalaya', name: 'Ampalaya', nameFil: 'Ampalaya', category: 'vegetables', engineLabel: 'Ampalaya' },
  { id: 'chayote', name: 'Chayote', nameFil: 'Sayote', category: 'vegetables', engineLabel: 'Chayote' },

  // Root crops (8 crops)
  { id: 'potato', name: 'Potato', nameFil: 'Patatas', category: 'roots', engineLabel: 'Potato' },
  { id: 'carrot', name: 'Carrot', nameFil: 'Karot', category: 'roots', engineLabel: 'Carrot' },
  { id: 'radish', name: 'Radish/Turnips', nameFil: 'Labanos', category: 'roots', engineLabel: 'Radish/Turnips' },
  { id: 'parsnip', name: 'Parsnip', nameFil: 'Parsnip', category: 'roots', engineLabel: 'Parsnip' },
  { id: 'garlic', name: 'Garlic', nameFil: 'Bawang', category: 'roots', engineLabel: 'Garlic' },
  { id: 'onion', name: 'Onion', nameFil: 'Sibuyas', category: 'roots', engineLabel: 'Onion' },
  { id: 'ginger_local', name: 'Ginger (Local)', nameFil: 'Luya', category: 'roots', engineLabel: 'Ginger (Local)' },
  { id: 'ginger_improved', name: 'Ginger (Improved)', nameFil: 'Luyang Bago', category: 'roots', engineLabel: 'Ginger (Improved)' },

  // Beans/Pulses (12 crops)
  { id: 'string_beans', name: 'String Beans', nameFil: 'Sitaw', category: 'beans', engineLabel: 'String Beans' },
  { id: 'snap_bean', name: 'Snap Bean', nameFil: 'Snap Bean', category: 'beans', engineLabel: 'Snap Bean' },
  { id: 'baguio_beans', name: 'Baguio Beans', nameFil: 'Baguio Beans', category: 'beans', engineLabel: 'Baguio Beans' },
  { id: 'lima', name: 'Lima (Patani)', nameFil: 'Patani', category: 'beans', engineLabel: 'Lima (Patani)' },
  { id: 'patani', name: 'Patani', nameFil: 'Patani', category: 'beans', engineLabel: 'Patani' },
  { id: 'winged_beans', name: 'Winged Beans', nameFil: 'Sigarilyas', category: 'beans', engineLabel: 'Winged Beans' },
  { id: 'seguidillas', name: 'Seguidillas', nameFil: 'Seguidillas', category: 'beans', engineLabel: 'Seguidillas' },
  { id: 'dwarf_beans', name: 'Dwarf Beans', nameFil: 'Dwarf Beans', category: 'beans', engineLabel: 'Dwarf Beans' },
  { id: 'batao', name: 'Batao', nameFil: 'Batao', category: 'beans', engineLabel: 'Batao' },
  { id: 'peas', name: 'Peas', nameFil: 'Gisantes', category: 'beans', engineLabel: 'Peas' },

  // Herbs (2 crops)
  { id: 'basil', name: 'Basil', nameFil: 'Balanoy', category: 'herbs', engineLabel: 'Basil' },
  { id: 'mint', name: 'Mint herb', nameFil: 'Mint', category: 'herbs', engineLabel: 'Mint herb' },

  // Highland/Fruits (1 crop)
  { id: 'asparagus', name: 'Asparagus', nameFil: 'Asparagus', category: 'highland', engineLabel: 'Asparagus' }
];

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'vegetables', name: 'Vegetables' },
  { id: 'roots', name: 'Root crops' },
  { id: 'beans', name: 'Beans/Pulses' },
  { id: 'herbs', name: 'Herbs' },
  { id: 'highland', name: 'Highland' }
];

// Hans's complete fertilizer inventory with NPK ratios for lab-tag styling
const HANS_INVENTORY = [
  { name: 'Urea', npk: '46-0-0' },
  { name: 'Ammonium Sulfate', npk: '21-0-0' },
  { name: 'Calcium Nitrate', npk: '15.4-0-0' },
  { name: 'Complete (14-14-14)', npk: '14-14-14' },
  { name: 'Complete (16-16-16)', npk: '16-16-16' },
  { name: 'Ammophos', npk: '16-20-0' },
  { name: '15-9-20 Compound', npk: '15-9-20' },
  { name: '13-33-21 Compound', npk: '13-33-21' },
  { name: '13-31-21 Compound', npk: '13-31-21' },
  { name: '19-4-19 Compound', npk: '19-4-19' },
  { name: 'Single Superphosphate (18)', npk: '0-18-0' },
  { name: 'Single Superphosphate (20)', npk: '0-20-0' },
  { name: 'Single Superphosphate (22)', npk: '0-22-0' },
  { name: 'Muriate of Potash', npk: '0-0-60' }
];

// Orchestrated page arrival sequence - field journal opening
const containerVariants = {
  initial: {},
  animate: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.12
    }
  }
};

const eyebrowVariants = {
  initial: { x: -24, y: -8, opacity: 0 },
  animate: { x: 0, y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const headlineVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.08,
      delayChildren: 0.3
    }
  }
};

const letterVariants = {
  initial: { y: 24, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const panelVariants = {
  initial: { y: 32, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.06,
      delayChildren: 0.2
    }
  }
};

const childVariants = {
  initial: { y: 16, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

// Chip interactions
const chipVariants = {
  initial: { scale: 1, rotate: 0, y: 0 },
  hover: { scale: 1, rotate: 1, y: -1, transition: { duration: 0.2 } },
  tap: { scale: 0.96, transition: { duration: 0.1 } }
};

// chipSelectedVariants removed - using inline animation instead

// Helper to read rating from both flat string and nested object formats
function readRating(field) {
  if (typeof field === 'string') return field;
  if (field && typeof field === 'object' && typeof field.rating === 'string') return field.rating;
  return 'Unknown';
}

export default function PlantSelection() {
  const navigate = useNavigate();
  const {
    setSelectedPlant,
    soilData,
    municipality,
    fieldAreaHa,
    areaHectares,
    setAreaHectares,
    availableFertilizers,
    setAvailableFertilizers
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState(null);

  // Initialize area from polygon if available
  useEffect(() => {
    if (fieldAreaHa > 0 && areaHectares === 1) {
      setAreaHectares(fieldAreaHa);
    }
  }, [fieldAreaHa, areaHectares, setAreaHectares]);

  // Initialize fertilizer selection from store (adapt to new structure)
  const [selectedFertilizers, setSelectedFertilizers] = useState(() => {
    if (!availableFertilizers) return new Set();
    const items = availableFertilizers.split(',').map(s => s.trim()).filter(Boolean);
    const fertilizerNames = HANS_INVENTORY.map(f => f.name);
    return new Set(items.filter(item => fertilizerNames.includes(item)));
  });

  // Update store when selection changes
  const handleFertilizerToggle = (fertilizerName) => {
    setSelectedFertilizers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fertilizerName)) {
        newSet.delete(fertilizerName);
      } else {
        newSet.add(fertilizerName);
      }
      setAvailableFertilizers(Array.from(newSet).join(', '));
      return newSet;
    });
  };

  // Filter crops
  const filteredCrops = useMemo(() => {
    return CROPS_DATA.filter(crop => {
      const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
      const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crop.nameFil.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach(cat => {
      counts[cat.id] = cat.id === 'all'
        ? CROPS_DATA.length
        : CROPS_DATA.filter(crop => crop.category === cat.id).length;
    });
    return counts;
  }, []);

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
  };

  const handleContinue = () => {
    if (selectedCrop) {
      // Store wiring: setSelectedPlant expects { name: engineLabel, id, nameFil, category }
      // The name field MUST be the engineLabel for downstream recommendationService.js
      setSelectedPlant({
        name: selectedCrop.engineLabel,
        id: selectedCrop.id,
        nameFil: selectedCrop.nameFil,
        category: selectedCrop.category
      }, null);
      navigate('/soil-status');
    }
  };

  const locationDisplay = municipality || 'La Trinidad, Benguet';

  // Get category colors for crop list stripes
  const getCategoryColor = (category) => {
    const colors = {
      vegetables: 'var(--color-moss)',
      roots: 'var(--color-earth-deep)',
      beans: 'var(--color-rust)',
      herbs: 'var(--color-paper-deep)',
      highland: 'var(--color-loam)'
    };
    return colors[category] || 'var(--color-contour)';
  };

  return (
    <motion.div
      className="min-h-screen bg-[var(--color-paper)] flex relative overflow-hidden"
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      {/* Layered atmospheric backgrounds */}
      <svg className="terrace-topo opacity-[0.04] fixed inset-0 pointer-events-none" viewBox="0 0 800 600" fill="none">
        <path
          d="M50 150C150 120, 250 180, 350 150C450 120, 550 180, 650 150"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M30 280C130 250, 230 310, 330 280C430 250, 530 310, 630 280"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M70 420C170 390, 270 450, 370 420C470 390, 570 450, 670 420"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      {/* Ornamental botanical sketch - bottom left */}
      <svg
        className="absolute bottom-8 left-8 opacity-50 pointer-events-none"
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        style={{ color: 'var(--color-contour)' }}
      >
        <path
          d="M20 76C20 65 28 55 38 50C45 46 55 45 62 50C70 56 76 66 76 76"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M38 50L42 30L46 50"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M48 45C52 40 58 38 62 42"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="42" cy="32" r="2" fill="currentColor" opacity="0.6"/>
        <circle cx="58" cy="42" r="1.5" fill="currentColor" opacity="0.4"/>
      </svg>

      {/* Vertical hairline divider between rails */}
      <div
        className="absolute top-0 bottom-0 w-px bg-[var(--color-contour)] opacity-30"
        style={{ left: '62%' }}
      />

      {/* Left Rail (62%) - Field Profile + Engine Inputs */}
      <motion.div className="w-[62%] px-8 py-12 relative" variants={panelVariants}>
        <div className="max-w-2xl">
          {/* Hero Section with oversized ornamental number */}
          <div className="relative mb-12">
            {/* Ornamental "02" backdrop */}
            <div
              className="absolute -top-8 -left-4 text-[120px] font-['Fraunces'] opacity-[0.08] pointer-events-none select-none"
              style={{
                fontVariationSettings: '"opsz" 144, "wght" 700'
              }}
            >
              02
            </div>

            <motion.div
              className="terrace-eyebrow mb-6 tracking-[0.2em] uppercase"
              variants={eyebrowVariants}
            >
              CROP
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl mb-4 font-['Fraunces'] leading-tight"
              style={{
                fontVariationSettings: '"opsz" 144, "wght" 600',
                color: 'var(--color-earth-deep)'
              }}
              variants={headlineVariants}
            >
              {"What's ".split('').map((char, i) => (
                <motion.span key={`what-${i}`} variants={letterVariants}>
                  {char === "'" ? "'" : char}
                </motion.span>
              ))}
              <span
                style={{
                  fontStyle: 'italic',
                  fontVariationSettings: '"opsz" 144, "wght" 500'
                }}
              >
                {"growing".split('').map((char, i) => (
                  <motion.span key={`growing-${i}`} variants={letterVariants}>
                    {char}
                  </motion.span>
                ))}
              </span>
              {" here?".split('').map((char, i) => (
                <motion.span key={`here-${i}`} variants={letterVariants}>
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            {/* Editorial sub-line */}
            <motion.div
              className="font-['Fraunces'] text-sm leading-relaxed max-w-md"
              style={{
                fontStyle: 'italic',
                fontVariationSettings: '"opsz" 14, "wght" 400',
                color: 'var(--color-moss)'
              }}
              variants={childVariants}
            >
              The soil has spoken.<br />Now name what you&apos;ll grow.
            </motion.div>

            {/* Typographic ornament */}
            <motion.div
              className="flex items-center mt-6 max-w-xs"
              variants={childVariants}
            >
              <div
                className="h-px flex-1"
                style={{ backgroundColor: 'var(--color-contour)' }}
              />
              <div
                className="mx-3 text-xs"
                style={{ color: 'var(--color-contour)' }}
              >
                •
              </div>
            </motion.div>
          </div>

          {/* Field Profile Card */}
          <motion.div
            className="p-6 mb-8 rounded-sm"
            style={{
              background: 'var(--color-paper-card)',
              border: '1px solid var(--color-contour)',
              boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 24px 48px -32px rgba(73,40,40,0.08)'
            }}
            variants={panelVariants}
          >
            <motion.div className="flex items-center gap-4 mb-6" variants={childVariants}>
              <div
                className="terrace-eyebrow tracking-[0.2em] uppercase"
                style={{ color: 'var(--color-earth-deep)' }}
              >
                FIELD PROFILE
              </div>
              {soilData?.liam && (
                <div
                  className="font-['JetBrains_Mono'] text-xs opacity-60"
                  style={{ color: 'var(--color-earth-deep)' }}
                >
                  {`// SAMPLE NO. ${soilData.liam.sample_count || 1}`}
                </div>
              )}
            </motion.div>

            {soilData ? (
              <motion.div variants={childVariants}>
                {/* Data grid - typewritten style */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div
                      className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider mb-2"
                      style={{ color: 'var(--color-moss)' }}
                    >
                      LOCATION
                    </div>
                    <div
                      className="font-['Fraunces'] text-[18px] tabular-nums"
                      style={{
                        fontVariationSettings: '"opsz" 14, "wght" 500',
                        color: 'var(--color-earth-deep)'
                      }}
                    >
                      {locationDisplay}
                    </div>
                  </div>

                  <div>
                    <div
                      className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider mb-2"
                      style={{ color: 'var(--color-moss)' }}
                    >
                      pH LEVEL
                    </div>
                    <div
                      className="font-['Fraunces'] text-[18px] tabular-nums"
                      style={{
                        fontVariationSettings: '"opsz" 14, "wght" 500',
                        color: 'var(--color-earth-deep)'
                      }}
                    >
                      {typeof soilData.pH === 'string' ? soilData.pH :
                       typeof soilData.ph === 'string' ? soilData.ph :
                       'Neutral'}
                    </div>
                  </div>

                  <div>
                    <div
                      className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider mb-2"
                      style={{ color: 'var(--color-moss)' }}
                    >
                      N
                    </div>
                    <div
                      className="font-['Fraunces'] text-[18px] tabular-nums"
                      style={{
                        fontVariationSettings: '"opsz" 14, "wght" 500',
                        color: 'var(--color-earth-deep)'
                      }}
                    >
                      {readRating(soilData.nitrogen)}
                    </div>
                  </div>

                  <div>
                    <div
                      className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider mb-2"
                      style={{ color: 'var(--color-moss)' }}
                    >
                      P
                    </div>
                    <div
                      className="font-['Fraunces'] text-[18px] tabular-nums"
                      style={{
                        fontVariationSettings: '"opsz" 14, "wght" 500',
                        color: 'var(--color-earth-deep)'
                      }}
                    >
                      {readRating(soilData.phosphorus)}
                    </div>
                  </div>

                  <div>
                    <div
                      className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider mb-2"
                      style={{ color: 'var(--color-moss)' }}
                    >
                      K
                    </div>
                    <div
                      className="font-['Fraunces'] text-[18px] tabular-nums"
                      style={{
                        fontVariationSettings: '"opsz" 14, "wght" 500',
                        color: 'var(--color-earth-deep)'
                      }}
                    >
                      {readRating(soilData.potassium)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div className="text-center py-8" variants={childVariants}>
                <svg
                  className="mx-auto mb-3 opacity-50"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  style={{ color: 'var(--color-contour)' }}
                >
                  <circle cx="16" cy="12" r="4" stroke="currentColor" strokeWidth="1" />
                  <path d="M12 16h8v8h-8z" stroke="currentColor" strokeWidth="1" fill="none" />
                  <path d="M14 18h4" stroke="currentColor" strokeWidth="1" />
                  <path d="M14 22h4" stroke="currentColor" strokeWidth="1" />
                </svg>
                <div
                  className="font-['Fraunces'] text-sm mb-2"
                  style={{
                    fontStyle: 'italic',
                    color: 'var(--color-moss)'
                  }}
                >
                  Soil profile pending
                </div>
              </motion.div>
            )}

            {/* Seismograph-style confidence traces */}
            {soilData?.liam && (
              <motion.div
                className="mt-6 pt-6"
                style={{ borderTop: '1px solid var(--color-contour)' }}
                variants={childVariants}
              >
                {['nitrogen', 'phosphorus', 'potassium'].map((nutrient) => {
                  const data = soilData.liam[nutrient];
                  if (!data?.class_distribution) return null;

                  const distribution = data.class_distribution;
                  const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
                  const dominantClass = Object.entries(distribution)
                    .sort((a, b) => b[1] - a[1])[0];
                  const [, confidence] = dominantClass;
                  const percentage = ((confidence / total) * 100).toFixed(0);

                  // Calculate proportions for seismograph
                  const lowPct = ((distribution.Low || 0) / total) * 100;
                  const mediumPct = ((distribution.Medium || 0) / total) * 100;
                  const highPct = ((distribution.High || 0) / total) * 100;

                  return (
                    <div key={nutrient} className="mb-5 last:mb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider"
                          style={{ color: 'var(--color-moss)' }}
                        >
                          {nutrient.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-right">
                          <div
                            className="font-['Fraunces'] text-sm tabular-nums"
                            style={{
                              fontVariationSettings: '"opsz" 14, "wght" 600',
                              color: 'var(--color-earth-deep)'
                            }}
                          >
                            {percentage}%
                          </div>
                          <div
                            className="font-['JetBrains_Mono'] text-[9px] tracking-wide"
                            style={{ color: 'var(--color-moss)' }}
                          >
                            DOMINANT
                          </div>
                        </div>
                      </div>

                      {/* Seismograph trace */}
                      <div className="relative">
                        <div
                          className="h-1 flex rounded-sm overflow-hidden"
                          style={{ backgroundColor: 'var(--color-paper-deep)' }}
                        >
                          <div
                            className="h-full"
                            style={{
                              width: `${lowPct}%`,
                              backgroundColor: 'var(--color-rust)'
                            }}
                          />
                          <div
                            className="h-full"
                            style={{
                              width: `${mediumPct}%`,
                              backgroundColor: 'var(--color-moss)'
                            }}
                          />
                          <div
                            className="h-full"
                            style={{
                              width: `${highPct}%`,
                              backgroundColor: 'var(--color-earth-deep)'
                            }}
                          />
                        </div>

                        {/* Tick marks at boundaries */}
                        {lowPct > 0 && lowPct < 100 && (
                          <div
                            className="absolute top-0 w-px h-3"
                            style={{
                              left: `${lowPct}%`,
                              backgroundColor: 'var(--color-contour)',
                              transform: 'translateX(-0.5px)'
                            }}
                          />
                        )}
                        {mediumPct > 0 && (lowPct + mediumPct) < 100 && (
                          <div
                            className="absolute top-0 w-px h-3"
                            style={{
                              left: `${lowPct + mediumPct}%`,
                              backgroundColor: 'var(--color-contour)',
                              transform: 'translateX(-0.5px)'
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Telemetry strip - vertical mini-callouts */}
                <div className="flex gap-8 mt-6 pt-4" style={{ borderTop: '1px solid var(--color-contour)' }}>
                  <div className="text-center">
                    <div
                      className="font-['Fraunces'] text-lg tabular-nums"
                      style={{
                        fontVariationSettings: '"opsz" 14, "wght" 600',
                        color: 'var(--color-earth-deep)'
                      }}
                    >
                      {soilData.liam.sample_count || 0}
                    </div>
                    <div
                      className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-wide"
                      style={{ color: 'var(--color-moss)' }}
                    >
                      SAMPLES
                    </div>
                  </div>

                  <div
                    className="h-8 w-px"
                    style={{ backgroundColor: 'var(--color-contour)', opacity: 0.3 }}
                  />

                  <div className="text-center">
                    <div
                      className="font-['Fraunces'] text-lg tabular-nums"
                      style={{
                        fontVariationSettings: '"opsz" 14, "wght" 600',
                        color: 'var(--color-earth-deep)'
                      }}
                    >
                      {soilData.liam.polygon_area_ha?.toFixed(1) || '0.0'}
                    </div>
                    <div
                      className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-wide"
                      style={{ color: 'var(--color-moss)' }}
                    >
                      HECTARES
                    </div>
                  </div>

                  <div
                    className="h-8 w-px"
                    style={{ backgroundColor: 'var(--color-contour)', opacity: 0.3 }}
                  />

                  <div className="text-center">
                    <div
                      className="font-['Fraunces'] text-lg tabular-nums"
                      style={{
                        fontVariationSettings: '"opsz" 14, "wght" 600',
                        color: soilData.liam.warnings?.length > 0 ? 'var(--color-rust)' : 'var(--color-earth-deep)'
                      }}
                    >
                      {soilData.liam.warnings?.length || 0}
                    </div>
                    <div
                      className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-wide"
                      style={{ color: 'var(--color-moss)' }}
                    >
                      WARNINGS
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Engine Inputs Card with graph paper background */}
          <motion.div
            className="p-6 rounded-sm relative overflow-hidden"
            style={{
              background: `
                linear-gradient(to right, var(--color-contour) 1px, transparent 1px),
                linear-gradient(to bottom, var(--color-contour) 1px, transparent 1px),
                var(--color-paper-card)
              `,
              backgroundSize: '8px 8px',
              backgroundPosition: '0 0, 0 0',
              opacity: 0.96,
              border: '1px solid var(--color-contour)',
              boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 24px 48px -32px rgba(73,40,40,0.08)'
            }}
            variants={panelVariants}
          >
{/* Graph paper overlay with proper opacity */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(to right, var(--color-contour) 1px, transparent 1px),
                  linear-gradient(to bottom, var(--color-contour) 1px, transparent 1px)
                `,
                backgroundSize: '8px 8px',
                opacity: 0.04
              }}
            />

            <motion.div
              className="terrace-eyebrow tracking-[0.2em] uppercase mb-6 relative z-10"
              style={{ color: 'var(--color-earth-deep)' }}
              variants={childVariants}
            >
              ENGINE INPUTS
            </motion.div>

            {/* Hero numeric area input */}
            <motion.div className="mb-8 relative z-10" variants={childVariants}>
              <label
                className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider block mb-3"
                style={{ color: 'var(--color-moss)' }}
              >
                FIELD AREA
              </label>
              <div className="flex items-baseline gap-2">
                <input
                  type="number"
                  value={areaHectares}
                  onChange={(e) => setAreaHectares(Number(e.target.value) || 0)}
                  min="0.1"
                  step="0.1"
                  className="bg-transparent border-none outline-none text-4xl tabular-nums font-['Fraunces'] w-32"
                  style={{
                    fontVariationSettings: '"opsz" 144, "wght" 600',
                    color: 'var(--color-earth-deep)',
                    borderBottom: '1px dotted var(--color-contour)'
                  }}
                />
                <div
                  className="font-['JetBrains_Mono'] text-sm"
                  style={{ color: 'var(--color-moss)' }}
                >
                  ha
                </div>
              </div>
              <div
                className="font-['Fraunces'] text-xs mt-2"
                style={{
                  fontStyle: 'italic',
                  color: 'var(--color-moss)'
                }}
              >
                {fieldAreaHa > 0 ? 'from your polygon' : 'set manually'}
              </div>
            </motion.div>

            {/* Lab-tag style fertilizer chips */}
            <motion.div className="relative z-10" variants={childVariants}>
              <label
                className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider block mb-4"
                style={{ color: 'var(--color-moss)' }}
              >
                ON-HAND FERTILIZERS
              </label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {HANS_INVENTORY.map((fertilizer) => {
                  const isSelected = selectedFertilizers.has(fertilizer.name);
                  return (
                    <motion.button
                      key={fertilizer.name}
                      onClick={() => handleFertilizerToggle(fertilizer.name)}
                      variants={chipVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      animate={isSelected ? "animate" : "initial"}
                      className="h-[52px] px-3 py-2 text-left rounded-sm relative transition-colors"
                      style={{
                        backgroundColor: isSelected ? 'var(--color-moss)' : 'var(--color-paper)',
                        border: '1px solid var(--color-contour)',
                        color: isSelected ? 'var(--color-paper)' : 'var(--color-earth-deep)',
                        boxShadow: isSelected
                          ? '0 2px 4px rgba(0,0,0,0.1)'
                          : '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div
                        className="font-['Fraunces'] text-[13px] leading-tight"
                        style={{ fontVariationSettings: '"opsz" 14, "wght" 500' }}
                      >
                        {fertilizer.name}
                      </div>
                      <div
                        className="font-['JetBrains_Mono'] text-[10px] mt-1"
                        style={{
                          opacity: isSelected ? 0.8 : 0.6
                        }}
                      >
                        {fertilizer.npk}
                      </div>
                      {isSelected && (
                        <motion.div
                          className="absolute top-2 right-2 text-xs"
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.2, ease: [0.68, -0.55, 0.265, 1.55] }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div
                className="font-['Fraunces'] text-xs"
                style={{
                  fontStyle: 'italic',
                  color: 'var(--color-moss)'
                }}
              >
                Leaving these blank lets the engine prescribe from any product.
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Rail (38%) - Crop Index */}
      <motion.div
        className="w-[38%] flex flex-col px-6 py-12 relative"
        style={{
          backgroundColor: 'var(--color-paper-card)',
          borderLeft: '1px solid var(--color-contour)'
        }}
        variants={panelVariants}
      >
        {/* Index header with ornamental flourish */}
        <motion.div className="mb-6" variants={childVariants}>
          <div
            className="terrace-eyebrow tracking-[0.2em] uppercase mb-4 text-center"
            style={{ color: 'var(--color-earth-deep)' }}
          >
            INDEX 02 — CROP
          </div>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className="h-px w-8"
              style={{ backgroundColor: 'var(--color-contour)' }}
            />
            <div
              className="text-xs"
              style={{ color: 'var(--color-contour)' }}
            >
              ✦
            </div>
            <div
              className="h-px w-8"
              style={{ backgroundColor: 'var(--color-contour)' }}
            />
          </div>
        </motion.div>

        {/* Terminal-style search */}
        <motion.div className="relative mb-6" variants={childVariants}>
          <div
            className="font-['JetBrains_Mono'] text-sm flex items-center gap-2 pb-1"
            style={{
              borderBottom: '1px solid var(--color-contour)',
              color: 'var(--color-moss)'
            }}
          >
            <span>&gt;</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH..."
              className="bg-transparent border-none outline-none flex-1 placeholder-current placeholder-opacity-40 font-['JetBrains_Mono']"
              style={{ color: 'var(--color-moss)' }}
            />
          </div>
        </motion.div>

        {/* Category lab-tag chips */}
        <motion.div className="mb-6" variants={childVariants}>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variants={chipVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="px-3 py-2 text-xs rounded-sm transition-colors"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-moss)' : 'var(--color-paper)',
                    border: '1px solid var(--color-contour)',
                    color: isSelected ? 'var(--color-paper)' : 'var(--color-earth-deep)',
                    fontVariationSettings: '"opsz" 14, "wght" 500'
                  }}
                >
                  {category.name} ({categoryCounts[category.id]})
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Tall crop list - fills remaining space */}
        <motion.div className="flex-1 overflow-hidden mb-6" variants={childVariants}>
          <div className="h-full overflow-y-auto">
            {filteredCrops.map((crop, index) => {
              const isSelected = selectedCrop?.id === crop.id;
              const categoryColor = getCategoryColor(crop.category);

              return (
                <motion.button
                  key={crop.id}
                  onClick={() => handleCropSelect(crop)}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.3) }}
                  whileHover={{ x: 2, transition: { duration: 0.2 } }}
                  className="w-full text-left py-4 px-4 border-b transition-all relative group"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-paper-deep)' : 'transparent',
                    borderBottomColor: 'var(--color-contour)',
                    borderBottomWidth: '1px'
                  }}
                >
                  {/* Category color stripe */}
                  <div
                    className="absolute left-0 top-0 bottom-0 transition-all"
                    style={{
                      width: isSelected ? '8px' : '4px',
                      backgroundColor: categoryColor,
                      opacity: isSelected ? 1 : 0.6
                    }}
                  />

                  <div className="flex items-center justify-between pl-6">
                    <div className="flex-1">
                      <div
                        className="font-['Fraunces'] text-[16px] leading-tight"
                        style={{
                          fontVariationSettings: '"opsz" 14, "wght" 500',
                          color: 'var(--color-earth-deep)'
                        }}
                      >
                        {crop.name}
                      </div>
                      {crop.nameFil && (
                        <div
                          className="font-['Fraunces'] text-[12px] mt-1 leading-tight"
                          style={{
                            fontStyle: 'italic',
                            color: 'var(--color-moss)'
                          }}
                        >
                          {crop.nameFil}
                        </div>
                      )}
                    </div>

                    {/* Hand-drawn selection indicator */}
                    <div className="relative">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        className="transition-all"
                        style={{
                          color: isSelected ? 'var(--color-moss)' : 'var(--color-contour)',
                          opacity: isSelected ? 1 : 0.3
                        }}
                      >
                        <circle
                          cx="10"
                          cy="10"
                          r="8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill={isSelected ? 'currentColor' : 'none'}
                          fillOpacity={isSelected ? 0.2 : 0}
                          style={{
                            strokeDasharray: isSelected ? '0' : '2,1',
                            transform: isSelected ? 'scale(1)' : 'scale(0.9)',
                            transformOrigin: 'center'
                          }}
                        />
                        {isSelected && (
                          <path
                            d="M6 10l2 2 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}
                      </svg>
                    </div>
                  </div>
                </motion.button>
              );
            })}

            {filteredCrops.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div
                  className="font-['Fraunces'] text-sm mb-2"
                  style={{
                    fontStyle: 'italic',
                    color: 'var(--color-moss)'
                  }}
                >
                  No crops found
                </div>
                <div
                  className="font-['JetBrains_Mono'] text-xs"
                  style={{ color: 'var(--color-contour)' }}
                >
                  Try different keywords
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Enhanced continue button */}
        <motion.div variants={childVariants}>
          <motion.button
            onClick={handleContinue}
            disabled={!selectedCrop}
            className="w-full px-6 py-4 rounded-sm relative overflow-hidden transition-all"
            style={{
              backgroundColor: selectedCrop ? 'var(--color-moss)' : 'var(--color-paper-deep)',
              border: '1px solid var(--color-contour)',
              color: selectedCrop ? 'var(--color-paper)' : 'var(--color-earth-deep)',
              opacity: selectedCrop ? 1 : 0.3,
              cursor: selectedCrop ? 'pointer' : 'not-allowed',
              boxShadow: selectedCrop
                ? '0 2px 8px rgba(0,0,0,0.1)'
                : '0 1px 2px rgba(0,0,0,0.05)'
            }}
            whileHover={selectedCrop ? {
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              transition: { duration: 0.2 }
            } : {}}
          >
            <div className="flex items-center justify-center gap-3">
              <div
                className="font-['Fraunces'] text-sm uppercase tracking-wider"
                style={{ fontVariationSettings: '"opsz" 14, "wght" 600' }}
              >
                Continue
              </div>
              <motion.div
                animate={selectedCrop ? { x: [0, 4, 0] } : { x: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-sm"
              >
                →
              </motion.div>
            </div>

            {selectedCrop && (
              <motion.div
                className="absolute top-2 left-3 font-['JetBrains_Mono'] text-[9px] tracking-wide opacity-60"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                ENTER
              </motion.div>
            )}
          </motion.button>

          {selectedCrop && (
            <motion.div
              className="mt-3 text-center text-xs font-['Fraunces']"
              style={{
                fontStyle: 'italic',
                color: 'var(--color-moss)'
              }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Selected: {selectedCrop.name}
              {selectedCrop.nameFil && ` (${selectedCrop.nameFil})`}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}