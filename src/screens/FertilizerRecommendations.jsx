// Screen 6: Fertilizer Recommendations
// PEAK MOMENT 3: Main results reveal with staggered animations
// Shows specific fertilizer products to address nutrient gaps

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import FertilizerCard from '../components/FertilizerCard';
import useAppStore from '../store/appStore';

export default function FertilizerRecommendations() {
  const navigate = useNavigate();
  const { recommendations, recommendationSummary, selectedPlant } = useAppStore();

  if (!recommendations || !recommendationSummary) {
    navigate('/location-selection');
    return null;
  }

  const handleContinue = () => {
    navigate('/complete');
  };

  const handleBack = () => {
    navigate('/plant-requirements');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 360] }}
            transition={{
              type: 'spring',
              stiffness: 200,
              delay: 0.1,
              rotate: { duration: 0.6 }
            }}
            className="inline-block mb-4"
          >
            <span className="text-6xl">💊</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-800 mb-2"
          >
            Your Fertilizer Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600"
          >
            Customized recommendations for growing {selectedPlant?.name}
          </motion.p>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold mb-1">{recommendationSummary.totalProducts}</p>
              <p className="text-sm opacity-90">Fertilizer Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1 text-red-200">{recommendationSummary.highPriority}</p>
              <p className="text-sm opacity-90">High Priority</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1 text-yellow-200">{recommendationSummary.mediumPriority}</p>
              <p className="text-sm opacity-90">Medium Priority</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">₱{recommendationSummary.estimatedCost.toLocaleString()}</p>
              <p className="text-sm opacity-90">Estimated Cost (1 ha)</p>
            </div>
          </div>
          <p className="text-center mt-4 text-sm opacity-90">
            {recommendationSummary.message}
          </p>
        </motion.div>

        {/* No Recommendations Case */}
        {recommendations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Excellent Soil Conditions!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Your soil already meets all the nutritional requirements for growing {selectedPlant?.name}.
              No additional fertilizers needed at this time.
            </p>
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-green-800">
                <strong>Recommendation:</strong> Continue with good farming practices and regular soil monitoring
                to maintain these optimal conditions.
              </p>
            </div>
          </motion.div>
        ) : (
          /* Recommendation Cards */
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-gray-800 mb-6"
            >
              Recommended Products
            </motion.h2>

            <div className="space-y-6 mb-8">
              {recommendations.map((rec, index) => (
                <FertilizerCard
                  key={index}
                  recommendation={rec}
                  animate={true}
                  delay={0.6 + (index * 0.15)}
                />
              ))}
            </div>

            {/* Application Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + (recommendations.length * 0.15) }}
              className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>💡</span>
                <span>Application Tips</span>
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">1.</span>
                  <span>Apply fertilizers according to the timing specified for each product</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">2.</span>
                  <span>Water the soil after application to help nutrients penetrate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">3.</span>
                  <span>Split applications into multiple doses for better absorption</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">4.</span>
                  <span>Monitor plant growth and adjust applications as needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">5.</span>
                  <span>Store fertilizers in a cool, dry place away from direct sunlight</span>
                </li>
              </ul>
            </motion.div>
          </>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-between items-center mt-12"
        >
          <Button onClick={handleBack} variant="outline" size="large">
            ← Back
          </Button>

          <Button onClick={handleContinue} size="large" icon="📥">
            Download Report
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
