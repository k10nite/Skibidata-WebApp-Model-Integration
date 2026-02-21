// Screen 2: Plant Selection
// User selects which highland vegetable they want to plant

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import useAppStore from '../store/appStore';
import { PLANTS_DATABASE } from '../data/plantsDatabase';

export default function PlantSelection() {
  const navigate = useNavigate();
  const { setSelectedPlant, municipality } = useAppStore();
  const [selected, setSelected] = useState(null);

  const handlePlantSelect = (plant) => {
    setSelected(plant);
  };

  const handleContinue = () => {
    if (selected) {
      setSelectedPlant(selected, selected.optimalRequirements);
      navigate('/processing');
    }
  };

  const handleBack = () => {
    navigate('/location-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-block mb-4"
          >
            <span className="text-6xl">🌱</span>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Select Your Crop
          </h1>
          <p className="text-lg text-gray-600">
            Choose the highland vegetable you plan to grow in {municipality || 'CAR'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                ✓
              </div>
              <div className="text-sm text-gray-600 ml-2">Location</div>
            </div>
            <div className="w-16 h-1 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="text-sm text-gray-600 ml-2">Plant</div>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="text-sm text-gray-400 ml-2">Analysis</div>
            </div>
          </div>
        </div>

        {/* Plant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {PLANTS_DATABASE.map((plant, index) => (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePlantSelect(plant)}
              className={`
                bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all
                ${selected?.id === plant.id
                  ? 'ring-4 ring-green-500 shadow-xl'
                  : 'hover:shadow-xl'
                }
              `}
              style={{
                borderLeft: `6px solid ${plant.color}`
              }}
            >
              {/* Plant Icon + Name */}
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{plant.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800">{plant.name}</h3>
                <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3">{plant.description}</p>

              {/* Growing Period */}
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                <span>⏱️</span>
                <span>{plant.growingPeriod}</span>
              </div>

              {/* Selected Checkmark */}
              {selected?.id === plant.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl"
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button onClick={handleBack} variant="outline" size="large">
            ← Back
          </Button>

          <Button
            onClick={handleContinue}
            disabled={!selected}
            size="large"
            icon="➡️"
          >
            Analyze Soil
          </Button>
        </div>

        {/* Selected Plant Info Banner */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-green-50 border-2 border-green-300 rounded-lg p-4"
          >
            <p className="text-green-800 text-center">
              <strong>Selected:</strong> {selected.name} - We'll analyze soil conditions and recommend
              fertilizers to meet its nutritional requirements.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
