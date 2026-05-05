// PlantSelection: Editorial magazine spread with marginalia
// Dense botanical-journal aesthetic - NO hollow space allowed
// Penguin Classics frontispiece + soil-survey datasheet + 19th-century field guide

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAppStore from '../store/appStore';

// Complete crop data - 42 entries matching Hans's engine contract
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

  // Beans/Pulses (10 crops - verified from engine data)
  { id: 'string_beans', name: 'String Beans', nameFil: 'Sitaw', category: 'beans', engineLabel: 'String Beans' },
  { id: 'snap_bean', name: 'Snap Bean', nameFil: 'Snap Bean', category: 'beans', engineLabel: 'Snap Bean' },
  { id: 'baguio_beans', name: 'Baguio Beans', nameFil: 'Baguio Beans', category: 'beans', engineLabel: 'Baguio Beans' },
  { id: 'lima', name: 'Lima (Patani)', nameFil: 'Patani', category: 'beans', engineLabel: 'Lima (Patani)' },
  { id: 'winged_beans', name: 'Winged Beans', nameFil: 'Sigarilyas', category: 'beans', engineLabel: 'Winged Beans' },
  { id: 'seguidillas', name: 'Seguidillas', nameFil: 'Seguidillas', category: 'beans', engineLabel: 'Seguidillas' },
  { id: 'dwarf_beans', name: 'Dwarf Beans', nameFil: 'Dwarf Beans', category: 'beans', engineLabel: 'Dwarf Beans' },
  { id: 'batao', name: 'Batao', nameFil: 'Batao', category: 'beans', engineLabel: 'Batao' },
  { id: 'peas', name: 'Peas', nameFil: 'Gisantes', category: 'beans', engineLabel: 'Peas' },

  // Herbs (2 crops)
  { id: 'basil', name: 'Basil', nameFil: 'Balanoy', category: 'herbs', engineLabel: 'Basil' },
  { id: 'mint', name: 'Mint herb', nameFil: 'Mint', category: 'herbs', engineLabel: 'Mint herb' },

  // Highland (1 crop)
  { id: 'asparagus', name: 'Asparagus', nameFil: 'Asparagus', category: 'highland', engineLabel: 'Asparagus' }
];

// Fertilizer inventory - organized by type for group headers
const NITROGEN_PURE = [
  { name: 'Urea', npk: '46-0-0', group: 'nitrogen' },
  { name: 'Ammonium Sulfate', npk: '21-0-0', group: 'nitrogen' },
  { name: 'Calcium Nitrate', npk: '15.4-0-0', group: 'nitrogen' }
];

const COMPOUND_COMPLETE = [
  { name: 'Complete (14-14-14)', npk: '14-14-14', group: 'compound' },
  { name: 'Complete (16-16-16)', npk: '16-16-16', group: 'compound' },
  { name: 'Ammophos', npk: '16-20-0', group: 'compound' },
  { name: '15-9-20 Compound', npk: '15-9-20', group: 'compound' },
  { name: '13-33-21 Compound', npk: '13-33-21', group: 'compound' },
  { name: '13-31-21 Compound', npk: '13-31-21', group: 'compound' },
  { name: '19-4-19 Compound', npk: '19-4-19', group: 'compound' }
];

const PHOSPHORUS_POTASSIUM = [
  { name: 'Single Superphosphate (18)', npk: '0-18-0', group: 'pk' },
  { name: 'Single Superphosphate (20)', npk: '0-20-0', group: 'pk' },
  { name: 'Single Superphosphate (22)', npk: '0-22-0', group: 'pk' },
  { name: 'Muriate of Potash', npk: '0-0-60', group: 'pk' }
];

const ALL_FERTILIZERS = [...NITROGEN_PURE, ...COMPOUND_COMPLETE, ...PHOSPHORUS_POTASSIUM];

// Motion variants - orchestrated arrival sequence under 1.6s
const containerVariants = {
  initial: {},
  animate: {
    transition: { delayChildren: 0.1, staggerChildren: 0.08 }
  }
};

const heroVariants = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const ornamentVariants = {
  initial: { opacity: 0, scale: 0.8, x: -20 },
  animate: {
    opacity: 0.08,
    scale: 1,
    x: 0,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
  }
};

const panelVariants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.04,
      delayChildren: 0.1
    }
  }
};

const childVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const chipVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: { scale: 1.02, rotate: 0.5, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

// Group crops by category for sticky headers
const groupedCrops = (() => {
  const groups = {};
  CROPS_DATA.forEach(crop => {
    if (!groups[crop.category]) groups[crop.category] = [];
    groups[crop.category].push(crop);
  });
  return groups;
})();

const categoryLabels = {
  vegetables: 'VEGETABLES',
  roots: 'ROOT CROPS',
  beans: 'BEANS/PULSES',
  herbs: 'HERBS',
  highland: 'HIGHLAND'
};

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

  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedFertilizers, setSelectedFertilizers] = useState(() => {
    if (!availableFertilizers) return new Set();
    const items = availableFertilizers.split(',').map(s => s.trim()).filter(Boolean);
    const fertilizerNames = ALL_FERTILIZERS.map(f => f.name);
    return new Set(items.filter(item => fertilizerNames.includes(item)));
  });

  // Initialize area from polygon
  useEffect(() => {
    if (fieldAreaHa > 0 && areaHectares === 1) {
      setAreaHectares(fieldAreaHa);
    }
  }, [fieldAreaHa, areaHectares, setAreaHectares]);

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

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
  };

  const handleContinue = () => {
    if (selectedCrop) {
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
  const getCropCount = (category) => groupedCrops[category]?.length || 0;

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, var(--color-paper-deep) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, var(--color-contour) 0%, transparent 30%),
          var(--color-paper)
        `
      }}
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      {/* Background atmospheric texture layer */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Topographic contour lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M0 300Q300 200 600 250T1200 300" stroke="var(--color-earth-deep)" strokeWidth="1"/>
        <path d="M0 450Q300 350 600 400T1200 450" stroke="var(--color-earth-deep)" strokeWidth="1"/>
        <path d="M0 600Q300 500 600 550T1200 600" stroke="var(--color-earth-deep)" strokeWidth="1"/>
      </svg>

      {/* Giant "02" ornament - compositional anchor bleeding left */}
      <motion.div
        className="absolute pointer-events-none select-none z-0"
        style={{
          top: '8%',
          left: '-40px',
          fontSize: 'clamp(280px, 25vw, 360px)',
          fontFamily: 'Fraunces',
          fontVariationSettings: '"opsz" 144, "wght" 200',
          color: 'var(--color-earth-deep)',
          lineHeight: 0.8
        }}
        variants={ornamentVariants}
      >
        02
      </motion.div>

      {/* Marginalia caption for ornament */}
      <motion.div
        className="absolute z-10 opacity-60"
        style={{
          top: '8%',
          left: '8px',
          fontSize: '9px',
          fontFamily: 'JetBrains Mono',
          color: 'var(--color-earth-deep)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          writingMode: 'vertical-lr',
          textOrientation: 'mixed'
        }}
        variants={childVariants}
      >
        ROUTINE VOL. II / FOLIO 02
      </motion.div>

      <div className="flex min-h-screen">
        {/* Left Rail - Dense content, no gaps */}
        <div className="w-[64%] px-8 py-8 relative z-10">
          {/* Hero section - compact */}
          <motion.div className="mb-6" variants={heroVariants}>
            <div
              className="text-xs font-['JetBrains_Mono'] uppercase tracking-[0.3em] mb-3 opacity-70"
              style={{ color: 'var(--color-earth-deep)' }}
            >
              CROP SELECTION
            </div>

            <h1
              className="text-4xl lg:text-5xl mb-3 leading-tight z-20 relative"
              style={{
                fontFamily: 'Fraunces',
                fontVariationSettings: '"opsz" 144, "wght" 600',
                color: 'var(--color-earth-deep)'
              }}
            >
              What&apos;s growing here?
            </h1>

            <div
              className="text-sm leading-relaxed max-w-md mb-4"
              style={{
                fontFamily: 'Fraunces',
                fontStyle: 'italic',
                fontVariationSettings: '"opsz" 14, "wght" 400',
                color: 'var(--color-moss)'
              }}
            >
              The soil has spoken. Now name what you&apos;ll grow.
            </div>

            {/* Hairline rule with ornament */}
            <div className="flex items-center gap-3 max-w-sm">
              <div className="h-px flex-1 bg-[var(--color-contour)]" />
              <div className="text-xs opacity-50" style={{ color: 'var(--color-contour)' }}>§</div>
            </div>
          </motion.div>

          {/* FIELD PROFILE - enhanced empty state */}
          <motion.div
            className="p-5 mb-4 rounded-sm border border-[var(--color-contour)]"
            style={{
              background: 'var(--color-paper-card)',
              boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 24px 48px -32px rgba(73,40,40,0.08)'
            }}
            variants={panelVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="text-xs font-['JetBrains_Mono'] uppercase tracking-[0.2em]"
                style={{ color: 'var(--color-earth-deep)' }}
              >
                FIELD PROFILE
              </div>
              {soilData?.liam && (
                <div
                  className="text-xs font-['JetBrains_Mono'] opacity-60"
                  style={{ color: 'var(--color-earth-deep)' }}
                >
                  {`// SAMPLE ${soilData.liam.sample_count || 1}`}
                </div>
              )}
            </div>

            {soilData ? (
              <motion.div variants={childVariants}>
                {/* Compact data grid */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div
                      className="text-[9px] font-['JetBrains_Mono'] uppercase tracking-wide mb-1 opacity-60"
                      style={{ color: 'var(--color-moss)' }}
                    >
                      LOCATION
                    </div>
                    <div
                      className="text-sm font-['Fraunces'] tabular-nums"
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
                      className="text-[9px] font-['JetBrains_Mono'] uppercase tracking-wide mb-1 opacity-60"
                      style={{ color: 'var(--color-moss)' }}
                    >
                      pH
                    </div>
                    <div
                      className="text-sm font-['Fraunces'] tabular-nums"
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
                      className="text-[9px] font-['JetBrains_Mono'] uppercase tracking-wide mb-1 opacity-60"
                      style={{ color: 'var(--color-moss)' }}
                    >
                      N-P-K
                    </div>
                    <div
                      className="text-sm font-['Fraunces'] tabular-nums"
                      style={{
                        fontVariationSettings: '"opsz" 14, "wght" 500',
                        color: 'var(--color-earth-deep)'
                      }}
                    >
                      {readRating(soilData.nitrogen)}-{readRating(soilData.phosphorus)}-{readRating(soilData.potassium)}
                    </div>
                  </div>
                </div>

                {/* Confidence bars - compact */}
                {soilData?.liam && (
                  <div className="border-t border-[var(--color-contour)] pt-3">
                    {['nitrogen', 'phosphorus', 'potassium'].map((nutrient) => {
                      const data = soilData.liam[nutrient];
                      if (!data?.class_distribution) return null;

                      const distribution = data.class_distribution;
                      const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
                      const confidence = Math.max(
                        distribution.Low || 0,
                        distribution.Medium || 0,
                        distribution.High || 0
                      );
                      const percentage = ((confidence / total) * 100).toFixed(0);

                      return (
                        <div key={nutrient} className="flex items-center gap-3 mb-2 last:mb-0">
                          <div
                            className="w-4 text-[9px] font-['JetBrains_Mono'] uppercase opacity-60"
                            style={{ color: 'var(--color-moss)' }}
                          >
                            {nutrient.charAt(0)}
                          </div>
                          <div className="flex-1 h-1 bg-[var(--color-paper-deep)] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--color-moss)] rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div
                            className="text-xs font-['Fraunces'] tabular-nums w-8 text-right"
                            style={{
                              fontVariationSettings: '"opsz" 14, "wght" 600',
                              color: 'var(--color-earth-deep)'
                            }}
                          >
                            {percentage}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div className="py-6 text-center" variants={childVariants}>
                {/* Enhanced illustration */}
                <svg
                  className="mx-auto mb-3 opacity-40"
                  width="140"
                  height="140"
                  viewBox="0 0 140 140"
                  fill="none"
                  style={{ color: 'var(--color-contour)' }}
                >
                  {/* Soil horizon cross-section */}
                  <path d="M20 120h100v8H20z" fill="currentColor" opacity="0.3"/>
                  <path d="M20 110h100v10H20z" fill="currentColor" opacity="0.2"/>
                  <path d="M20 95h100v15H20z" fill="currentColor" opacity="0.15"/>

                  {/* Microscope lens */}
                  <circle cx="70" cy="50" r="25" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <circle cx="70" cy="50" r="18" stroke="currentColor" strokeWidth="1" fill="none"/>
                  <path d="M45 50h8m34 0h8" stroke="currentColor" strokeWidth="1"/>
                  <path d="M70 25v8m0 34v8" stroke="currentColor" strokeWidth="1"/>

                  {/* Sample points */}
                  <circle cx="60" cy="45" r="2" fill="currentColor" opacity="0.6"/>
                  <circle cx="80" cy="55" r="1.5" fill="currentColor" opacity="0.5"/>
                  <circle cx="75" cy="42" r="1" fill="currentColor" opacity="0.4"/>
                </svg>

                <div
                  className="text-sm font-['Fraunces'] mb-3"
                  style={{
                    fontStyle: 'italic',
                    color: 'var(--color-moss)'
                  }}
                >
                  <em>Awaiting Sentinel-2 sample.</em>
                </div>

                {/* What's coming list */}
                <div className="text-left max-w-xs mx-auto space-y-1">
                  {[
                    'class distribution',
                    'mean probability',
                    'sample count',
                    'polygon area',
                    'warnings (if any)'
                  ].map((item) => (
                    <div
                      key={item}
                      className="text-xs font-['Fraunces'] opacity-50 flex items-center gap-2"
                      style={{
                        fontStyle: 'italic',
                        color: 'var(--color-earth-deep)'
                      }}
                    >
                      <span>·</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div
                  className="text-xs font-['Fraunces'] mt-3 opacity-60"
                  style={{
                    fontStyle: 'italic',
                    color: 'var(--color-moss)'
                  }}
                >
                  expected ~3s after the polygon clears
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* MARGINAL NOTES section - fills the gap */}
          <motion.div
            className="mb-4 border-l-2 border-[var(--color-contour)] pl-3"
            style={{ borderLeftStyle: 'dashed' }}
            variants={panelVariants}
          >
            <div
              className="text-[9px] font-['JetBrains_Mono'] uppercase tracking-wide mb-2 opacity-60"
              style={{ color: 'var(--color-earth-deep)' }}
            >
              MARGINAL NOTES
            </div>

            <div className="space-y-2">
              {[
                `${selectedCrop?.name || 'Cabbage'} tolerates pH 6.0–7.0. Below 5.5, lime first.`,
                'Highland N targets typically 120–150 kg/ha at the Low band.',
                'Sample density rises with smaller sample_spacing_m.',
                'Mapbox satellite tile last refreshed: 2024-04-15.'
              ].map((note, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className="text-xs font-['Fraunces'] opacity-40 flex-shrink-0"
                    style={{ color: 'var(--color-contour)' }}
                  >
                    §
                  </div>
                  <div
                    className="text-xs font-['Fraunces'] leading-relaxed opacity-70"
                    style={{
                      fontStyle: 'italic',
                      color: 'var(--color-earth-deep)'
                    }}
                  >
                    {note}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ENGINE INPUTS - tightened */}
          <motion.div
            className="p-5 rounded-sm border border-[var(--color-contour)] relative"
            style={{
              background: `
                linear-gradient(to right, var(--color-contour) 1px, transparent 1px),
                linear-gradient(to bottom, var(--color-contour) 1px, transparent 1px),
                var(--color-paper-card)
              `,
              backgroundSize: '8px 8px',
              opacity: 0.96,
              boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 24px 48px -32px rgba(73,40,40,0.08)'
            }}
            variants={panelVariants}
          >
            <div
              className="text-xs font-['JetBrains_Mono'] uppercase tracking-[0.2em] mb-4"
              style={{ color: 'var(--color-earth-deep)' }}
            >
              ENGINE INPUTS
            </div>

            {/* Area input with inline description */}
            <div className="mb-5">
              <div
                className="text-xs font-['Fraunces'] mb-2 opacity-70"
                style={{
                  fontStyle: 'italic',
                  color: 'var(--color-moss)'
                }}
              >
                <em>The polygon&apos;s hectarage. Override if needed.</em>
              </div>

              <div className="flex items-baseline gap-2">
                <input
                  type="number"
                  value={areaHectares}
                  onChange={(e) => setAreaHectares(Number(e.target.value) || 0)}
                  min="0.1"
                  step="0.1"
                  className="bg-transparent border-none outline-none text-3xl tabular-nums font-['Fraunces'] w-28 border-b border-dotted border-[var(--color-contour)]"
                  style={{
                    fontVariationSettings: '"opsz" 144, "wght" 600',
                    color: 'var(--color-earth-deep)'
                  }}
                />
                <div
                  className="text-sm font-['JetBrains_Mono']"
                  style={{ color: 'var(--color-moss)' }}
                >
                  ha
                </div>
              </div>
            </div>

            {/* Grouped fertilizer chips */}
            <div>
              {/* PURE NITROGEN group */}
              <div className="mb-3">
                <div
                  className="text-[9px] font-['JetBrains_Mono'] uppercase tracking-wide mb-2 opacity-50"
                  style={{ color: 'var(--color-earth-deep)' }}
                >
                  PURE NITROGEN
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {NITROGEN_PURE.map((fertilizer) => {
                    const isSelected = selectedFertilizers.has(fertilizer.name);
                    return (
                      <motion.button
                        key={fertilizer.name}
                        onClick={() => handleFertilizerToggle(fertilizer.name)}
                        variants={chipVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        className="h-[44px] px-3 py-2 text-left rounded-sm relative transition-colors"
                        style={{
                          backgroundColor: isSelected ? 'var(--color-moss)' : 'var(--color-paper)',
                          border: '1px solid var(--color-contour)',
                          color: isSelected ? 'var(--color-paper)' : 'var(--color-earth-deep)'
                        }}
                      >
                        <div
                          className="text-xs font-['Fraunces'] leading-tight"
                          style={{ fontVariationSettings: '"opsz" 14, "wght" 500' }}
                        >
                          {fertilizer.name}
                        </div>
                        <div
                          className="text-[9px] font-['JetBrains_Mono'] mt-1 opacity-60"
                        >
                          {fertilizer.npk}
                        </div>
                        {isSelected && (
                          <motion.div
                            className="absolute top-1 right-2 text-xs"
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
              </div>

              {/* COMPOUND / COMPLETE group */}
              <div className="mb-3">
                <div
                  className="text-[9px] font-['JetBrains_Mono'] uppercase tracking-wide mb-2 opacity-50"
                  style={{ color: 'var(--color-earth-deep)' }}
                >
                  COMPOUND / COMPLETE
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {COMPOUND_COMPLETE.map((fertilizer) => {
                    const isSelected = selectedFertilizers.has(fertilizer.name);
                    return (
                      <motion.button
                        key={fertilizer.name}
                        onClick={() => handleFertilizerToggle(fertilizer.name)}
                        variants={chipVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        className="h-[44px] px-3 py-2 text-left rounded-sm relative transition-colors"
                        style={{
                          backgroundColor: isSelected ? 'var(--color-moss)' : 'var(--color-paper)',
                          border: '1px solid var(--color-contour)',
                          color: isSelected ? 'var(--color-paper)' : 'var(--color-earth-deep)'
                        }}
                      >
                        <div
                          className="text-xs font-['Fraunces'] leading-tight"
                          style={{ fontVariationSettings: '"opsz" 14, "wght" 500' }}
                        >
                          {fertilizer.name}
                        </div>
                        <div
                          className="text-[9px] font-['JetBrains_Mono'] mt-1 opacity-60"
                        >
                          {fertilizer.npk}
                        </div>
                        {isSelected && (
                          <motion.div
                            className="absolute top-1 right-2 text-xs"
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
              </div>

              {/* PHOSPHORUS / POTASSIUM group */}
              <div className="mb-4">
                <div
                  className="text-[9px] font-['JetBrains_Mono'] uppercase tracking-wide mb-2 opacity-50"
                  style={{ color: 'var(--color-earth-deep)' }}
                >
                  PHOSPHORUS / POTASSIUM
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PHOSPHORUS_POTASSIUM.map((fertilizer) => {
                    const isSelected = selectedFertilizers.has(fertilizer.name);
                    return (
                      <motion.button
                        key={fertilizer.name}
                        onClick={() => handleFertilizerToggle(fertilizer.name)}
                        variants={chipVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        className="h-[44px] px-3 py-2 text-left rounded-sm relative transition-colors"
                        style={{
                          backgroundColor: isSelected ? 'var(--color-moss)' : 'var(--color-paper)',
                          border: '1px solid var(--color-contour)',
                          color: isSelected ? 'var(--color-paper)' : 'var(--color-earth-deep)'
                        }}
                      >
                        <div
                          className="text-xs font-['Fraunces'] leading-tight"
                          style={{ fontVariationSettings: '"opsz" 14, "wght" 500' }}
                        >
                          {fertilizer.name}
                        </div>
                        <div
                          className="text-[9px] font-['JetBrains_Mono'] mt-1 opacity-60"
                        >
                          {fertilizer.npk}
                        </div>
                        {isSelected && (
                          <motion.div
                            className="absolute top-1 right-2 text-xs"
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
              </div>

              <div
                className="text-xs font-['Fraunces']"
                style={{
                  fontStyle: 'italic',
                  color: 'var(--color-moss)'
                }}
              >
                <em>Selected products constrain the engine&apos;s prescription. Leave empty to recommend from any of the 14.</em>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Rail - Crop selection with sticky headers */}
        <div
          className="w-[36%] border-l border-[var(--color-contour)] relative"
          style={{ backgroundColor: 'var(--color-paper-card)' }}
        >
          <div className="px-6 py-8 h-full flex flex-col">
            {/* Header */}
            <motion.div className="mb-4" variants={heroVariants}>
              {selectedCrop ? (
                <div
                  className="p-3 rounded border border-[var(--color-moss)] bg-[var(--color-moss)] text-[var(--color-paper)] mb-4"
                  style={{
                    fontFamily: 'Fraunces',
                    fontVariationSettings: '"opsz" 14, "wght" 500'
                  }}
                >
                  <div className="text-sm">
                    Picked: {selectedCrop.name}
                    {selectedCrop.nameFil && ` / ${selectedCrop.nameFil}`}
                  </div>
                  <div
                    className="text-xs mt-1 opacity-80 font-['JetBrains_Mono']"
                    style={{ textTransform: 'lowercase' }}
                  >
                    category: {selectedCrop.category}
                  </div>
                </div>
              ) : (
                <div
                  className="text-sm font-['Fraunces'] mb-4 opacity-60 text-center"
                  style={{
                    fontStyle: 'italic',
                    color: 'var(--color-moss)'
                  }}
                >
                  <em>Choose what&apos;s growing on this field.</em>
                </div>
              )}

              <div
                className="text-xs font-['JetBrains_Mono'] uppercase tracking-[0.2em] text-center"
                style={{ color: 'var(--color-earth-deep)' }}
              >
                CROP INDEX
              </div>
            </motion.div>

            {/* Scrollable grouped crop list */}
            <motion.div className="flex-1 overflow-y-auto mb-4" variants={panelVariants}>
              {Object.entries(groupedCrops).map(([category, crops]) => (
                <div key={category} className="mb-1">
                  {/* Sticky category header */}
                  <div
                    className="sticky top-0 z-10 py-2 border-b border-[var(--color-contour)] text-xs font-['JetBrains_Mono'] uppercase tracking-wide"
                    style={{
                      backgroundColor: 'var(--color-paper-card)',
                      color: 'var(--color-earth-deep)'
                    }}
                  >
                    {categoryLabels[category]} — {getCropCount(category)}
                  </div>

                  {crops.map((crop) => {
                    const isSelected = selectedCrop?.id === crop.id;
                    const categoryColors = {
                      vegetables: 'var(--color-moss)',
                      roots: 'var(--color-earth-deep)',
                      beans: 'var(--color-rust)',
                      herbs: 'var(--color-paper-deep)',
                      highland: 'var(--color-rust)'
                    };
                    const stripeColor = categoryColors[crop.category] || 'var(--color-contour)';

                    return (
                      <motion.button
                        key={crop.id}
                        onClick={() => handleCropSelect(crop)}
                        className="w-full text-left py-3 px-4 border-b border-[var(--color-contour)] relative transition-all group hover:bg-[var(--color-paper-deep)]"
                        style={{
                          backgroundColor: isSelected ? 'var(--color-paper-deep)' : 'transparent'
                        }}
                        whileHover={{ x: 2 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Color stripe */}
                        <div
                          className="absolute left-0 top-0 bottom-0 transition-all"
                          style={{
                            width: isSelected ? '6px' : '3px',
                            backgroundColor: stripeColor,
                            opacity: isSelected ? 1 : 0.4
                          }}
                        />

                        <div className="pl-4 flex items-center justify-between">
                          <div>
                            <div
                              className="text-sm font-['Fraunces'] leading-tight"
                              style={{
                                fontVariationSettings: '"opsz" 14, "wght" 500',
                                color: 'var(--color-earth-deep)'
                              }}
                            >
                              {crop.name}
                            </div>
                            <div
                              className="text-xs font-['Fraunces'] mt-1 opacity-60"
                              style={{
                                fontStyle: 'italic',
                                color: 'var(--color-moss)'
                              }}
                            >
                              {crop.nameFil}
                            </div>
                          </div>

                          {isSelected && (
                            <div className="text-sm" style={{ color: 'var(--color-moss)' }}>✦</div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </motion.div>

            {/* Footer with continue */}
            <motion.div variants={childVariants}>
              <div
                className="text-xs font-['Fraunces'] mb-3 text-center opacity-60"
                style={{
                  fontStyle: 'italic',
                  color: 'var(--color-moss)'
                }}
              >
                <em>Continue to brief Hans&apos;s engine. ~1.2s engine call.</em>
              </div>

              <motion.button
                onClick={handleContinue}
                disabled={!selectedCrop}
                className="w-full px-6 py-4 rounded-sm transition-all"
                style={{
                  backgroundColor: selectedCrop ? 'var(--color-moss)' : 'var(--color-paper-deep)',
                  border: '1px solid var(--color-contour)',
                  color: selectedCrop ? 'var(--color-paper)' : 'var(--color-earth-deep)',
                  opacity: selectedCrop ? 1 : 0.3,
                  cursor: selectedCrop ? 'pointer' : 'not-allowed',
                  fontFamily: 'Fraunces',
                  fontVariationSettings: '"opsz" 14, "wght" 600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em'
                }}
                whileHover={selectedCrop ? {
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                } : {}}
              >
                Continue
              </motion.button>

              <div
                className="text-[10px] font-['JetBrains_Mono'] text-center mt-2 opacity-50"
                style={{ color: 'var(--color-earth-deep)' }}
              >
                {selectedCrop
                  ? `→ ${selectedCrop.name} · ${areaHectares} ha · ${selectedFertilizers.size} fertilizers`
                  : '→ — · — · —'
                }
              </div>

              <div
                className="text-xs font-['Fraunces'] mt-4 text-center opacity-50"
                style={{
                  fontStyle: 'italic',
                  color: 'var(--color-moss)'
                }}
              >
                <em>42 crops aligned to PhilRice + BSU recommendations.</em>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}