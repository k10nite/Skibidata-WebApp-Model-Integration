// Screen 5: Plant Requirements
// Shows what the selected plant needs vs what the soil has

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import StatusIndicator from '../components/StatusIndicator';
import useAppStore from '../store/appStore';

export default function PlantRequirements() {
  const navigate = useNavigate();
  const { selectedPlant, plantRequirements, soilData } = useAppStore();

  if (!selectedPlant || !plantRequirements || !soilData) {
    navigate('/location-selection');
    return null;
  }

  const handleContinue = () => {
    navigate('/recommendations');
  };

  const nutrients = [
    { key: 'nitrogen', name: 'Nitrogen (N)', icon: '🌱' },
    { key: 'phosphorus', name: 'Phosphorus (P)', icon: '🌿' },
    { key: 'potassium', name: 'Potassium (K)', icon: '🍃' },
    { key: 'pH', name: 'Soil pH', icon: '⚖️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-block mb-4"
          >
            <span className="text-6xl">{selectedPlant.icon}</span>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {selectedPlant.name} Requirements
          </h1>
          <p className="text-lg text-gray-600">
            Comparing your soil with optimal conditions for {selectedPlant.name.toLowerCase()}
          </p>
        </div>

        {/* Plant Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Scientific Name</p>
              <p className="font-semibold text-gray-800 italic">{selectedPlant.scientificName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Growing Period</p>
              <p className="font-semibold text-gray-800">{selectedPlant.growingPeriod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Crop Type</p>
              <p className="font-semibold text-gray-800">Highland Vegetable</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">{selectedPlant.description}</p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
            <h2 className="text-2xl font-bold">Nutrient Comparison</h2>
            <p className="text-sm opacity-90">Your Soil vs Plant Needs</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Nutrient</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Current Soil Level</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Plant Needs</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {nutrients.map((nutrient, index) => {
                  const currentLevel = soilData[nutrient.key];
                  const requiredLevel = plantRequirements[nutrient.key];
                  const isMatch = currentLevel === requiredLevel;

                  return (
                    <motion.tr
                      key={nutrient.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      {/* Nutrient Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{nutrient.icon}</span>
                          <span className="font-semibold text-gray-800">{nutrient.name}</span>
                        </div>
                      </td>

                      {/* Current Level */}
                      <td className="px-6 py-4 text-center">
                        <StatusIndicator status={currentLevel} size="medium" />
                      </td>

                      {/* Required Level */}
                      <td className="px-6 py-4 text-center">
                        <StatusIndicator status={requiredLevel} size="medium" />
                      </td>

                      {/* Match Status */}
                      <td className="px-6 py-4 text-center">
                        {isMatch ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                            <span>✓</span>
                            <span>Match</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">
                            <span>⚠</span>
                            <span>Gap</span>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            size="large"
            icon="💊"
          >
            Get Fertilizer Recommendations
          </Button>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center text-sm text-purple-800"
        >
          Any nutrient gaps will be addressed in the next step with specific fertilizer products and application guidelines.
        </motion.div>
      </motion.div>
    </div>
  );
}
