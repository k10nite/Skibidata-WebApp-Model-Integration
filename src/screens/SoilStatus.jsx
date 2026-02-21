// Screen 4: Soil Status
// Displays current soil nutrient levels (N, P, K, pH) in categorical format

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import NutrientCard from '../components/NutrientCard';
import useAppStore from '../store/appStore';

export default function SoilStatus() {
  const navigate = useNavigate();
  const { soilData, soilScenario, municipality } = useAppStore();

  if (!soilData) {
    navigate('/location-selection');
    return null;
  }

  const handleContinue = () => {
    navigate('/plant-requirements');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
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
            <span className="text-6xl">📊</span>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your Soil Status
          </h1>
          <p className="text-lg text-gray-600">
            Current nutrient levels detected in your farm
          </p>
        </div>

        {/* Location Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📍</span>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold text-gray-800">
                  {soilScenario.location.barangay}, {municipality}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">⛰️</span>
              <div>
                <p className="text-sm text-gray-500">Elevation</p>
                <p className="font-semibold text-gray-800">{soilScenario.elevation}m</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏔️</span>
              <div>
                <p className="text-sm text-gray-500">Soil Type</p>
                <p className="font-semibold text-gray-800">{soilScenario.soilType}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Nutrient Status Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nutrient Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NutrientCard
              nutrient="nitrogen"
              status={soilData.nitrogen}
              animate={true}
              delay={0.1}
            />
            <NutrientCard
              nutrient="phosphorus"
              status={soilData.phosphorus}
              animate={true}
              delay={0.2}
            />
            <NutrientCard
              nutrient="potassium"
              status={soilData.potassium}
              animate={true}
              delay={0.3}
            />
            <NutrientCard
              nutrient="pH"
              status={soilData.pH}
              animate={true}
              delay={0.4}
            />
          </div>
        </motion.div>

        {/* Analysis Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">About This Analysis</h3>
              <p className="text-sm text-gray-700">
                {soilScenario.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Data source: Sentinel-2 satellite imagery with machine learning models (±10m resolution)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            size="large"
            icon="➡️"
          >
            View Plant Requirements
          </Button>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-lg p-6 shadow-md"
        >
          <h3 className="font-semibold text-gray-800 mb-3">Understanding The Levels:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 border-2 border-red-500 rounded-full flex items-center justify-center">
                ⬇️
              </div>
              <div>
                <p className="font-semibold text-red-700">Low</p>
                <p className="text-gray-600 text-xs">Needs fertilizer</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-500 rounded-full flex items-center justify-center">
                ➡️
              </div>
              <div>
                <p className="font-semibold text-yellow-700">Medium</p>
                <p className="text-gray-600 text-xs">Adequate levels</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center">
                ⬆️
              </div>
              <div>
                <p className="font-semibold text-green-700">High</p>
                <p className="text-gray-600 text-xs">Optimal for growth</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
