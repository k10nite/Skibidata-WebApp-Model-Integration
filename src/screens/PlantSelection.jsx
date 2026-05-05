// Screen 3: Crop Selection - Terrace Design System
// Direct dropdown + filters interface following Hans's rule-based engine UI philosophy
// Editorial-cartographic, topographic-map vibes with 62/38 hero+rail layout

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
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

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const itemVariants = {
  initial: { y: 16, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

// Helper to read rating from both flat string and nested object formats
function readRating(field) {
  if (typeof field === 'string') return field;
  if (field && typeof field === 'object' && typeof field.rating === 'string') return field.rating;
  return 'Unknown';
}

export default function PlantSelection() {
  const navigate = useNavigate();
  const { setSelectedPlant, soilData, municipality } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState(null);

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

  return (
    <motion.div
      className="min-h-screen bg-[var(--color-paper)] flex"
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      {/* Background topographic contours */}
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

      {/* Left Column (62%) - Soil Profile */}
      <motion.div className="w-[62%] px-8 py-12" variants={itemVariants}>
        <div className="max-w-2xl">
          <div className="terrace-eyebrow mb-6">02 — CROP</div>
          <h1 className="terrace-display text-5xl md:text-6xl mb-8">
            What&apos;s growing here?
          </h1>

          {/* Field Profile Panel */}
          <motion.div
            className="terrace-card-hairline p-6 mb-8"
            style={{ background: 'var(--color-paper-card)' }}
            variants={itemVariants}
          >
            <div className="terrace-eyebrow mb-4">FIELD PROFILE</div>

            {soilData ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="terrace-data text-xs text-[var(--color-moss)] uppercase tracking-wider mb-1">
                    LOCATION
                  </div>
                  <div className="font-mono text-sm text-[var(--color-earth-deep)]">
                    {locationDisplay}
                  </div>
                </div>

                <div>
                  <div className="terrace-data text-xs text-[var(--color-moss)] uppercase tracking-wider mb-1">
                    pH LEVEL
                  </div>
                  <div className="font-mono text-sm text-[var(--color-earth-deep)]">
                    {typeof soilData.pH === 'string' ? soilData.pH :
                     typeof soilData.ph === 'string' ? soilData.ph :
                     'Neutral'}
                  </div>
                </div>

                <div>
                  <div className="terrace-data text-xs text-[var(--color-moss)] uppercase tracking-wider mb-1">
                    N STATUS
                  </div>
                  <div className="font-mono text-sm text-[var(--color-earth-deep)]">
                    {readRating(soilData.nitrogen)}
                  </div>
                </div>

                <div>
                  <div className="terrace-data text-xs text-[var(--color-moss)] uppercase tracking-wider mb-1">
                    P STATUS
                  </div>
                  <div className="font-mono text-sm text-[var(--color-earth-deep)]">
                    {readRating(soilData.phosphorus)}
                  </div>
                </div>

                <div>
                  <div className="terrace-data text-xs text-[var(--color-moss)] uppercase tracking-wider mb-1">
                    K STATUS
                  </div>
                  <div className="font-mono text-sm text-[var(--color-earth-deep)]">
                    {readRating(soilData.potassium)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-[var(--color-moss)] text-sm mb-2">Soil profile pending</div>
                <div className="terrace-data text-xs text-[var(--color-contour)]">
                  Machine learning analysis in progress
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Column (38%) - Crop Selection */}
      <motion.div
        className="w-[38%] bg-[var(--color-paper-deep)] px-6 py-12 border-l"
        style={{ borderColor: 'var(--color-contour)' }}
        variants={itemVariants}
      >
        <div className="terrace-eyebrow mb-4">SELECT CROP</div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-moss)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crops..."
            className="terrace-input pl-10 w-full"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-3 py-1 rounded text-xs font-medium transition-colors
                  ${selectedCategory === category.id
                    ? 'bg-[var(--color-moss)] text-white'
                    : 'bg-[var(--color-paper-card)] text-[var(--color-earth-deep)] hover:bg-[var(--color-moss)] hover:text-white'
                  }
                `}
              >
                {category.name} ({categoryCounts[category.id]})
              </button>
            ))}
          </div>
        </div>

        {/* Crops List */}
        <div className="mb-6 flex-1 overflow-hidden">
          <div className="h-80 overflow-y-auto">
            {filteredCrops.map((crop) => (
              <button
                key={crop.id}
                onClick={() => handleCropSelect(crop)}
                className={`
                  w-full text-left px-3 py-3 border-b transition-colors
                  ${selectedCrop?.id === crop.id
                    ? 'bg-[var(--color-paper-deep)] border-l-2 border-l-[var(--color-moss)]'
                    : 'hover:bg-[var(--color-paper-card)]'
                  }
                `}
                style={{
                  borderBottomColor: 'var(--color-contour)',
                  borderLeftColor: selectedCrop?.id === crop.id ? 'var(--color-moss)' : 'transparent'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-[var(--color-earth-deep)]">
                      {crop.name}
                    </div>
                    {crop.nameFil && (
                      <div className="text-xs text-[var(--color-moss)] mt-0.5">
                        {crop.nameFil}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--color-contour)]" />
                </div>
              </button>
            ))}

            {filteredCrops.length === 0 && (
              <div className="text-center py-8">
                <div className="text-[var(--color-moss)] text-sm mb-1">No crops found</div>
                <div className="terrace-data text-xs text-[var(--color-contour)]">
                  Try different keywords
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedCrop}
          className={`
            terrace-btn w-full flex items-center justify-center gap-2
            ${!selectedCrop ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span>Continue</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {selectedCrop && (
          <div className="mt-3 text-center text-xs text-[var(--color-moss)]">
            Selected: {selectedCrop.name}
            {selectedCrop.nameFil && ` (${selectedCrop.nameFil})`}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}