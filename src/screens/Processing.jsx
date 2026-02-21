// Screen 3: Processing
// Animated loading screen while "analyzing" soil data
// PEAK MOMENT 2: Creates anticipation and engagement

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../store/appStore';
import { getScenarioByLocation } from '../data/soilScenarios';
import { getRecommendationsForScenario, getRecommendationSummary } from '../data/fertilizerRecommendations';

const PROCESSING_STEPS = [
  { text: 'Analyzing satellite imagery...', duration: 2000, icon: '🛰️' },
  { text: 'Calculating soil nutrient levels...', duration: 2000, icon: '🧪' },
  { text: 'Matching plant requirements...', duration: 1500, icon: '🌱' },
  { text: 'Generating recommendations...', duration: 500, icon: '✨' }
];

export default function Processing() {
  const navigate = useNavigate();
  const { location, selectedPlant, plantRequirements, setSoilData, setRecommendations } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate processing steps
    let stepTimer;
    let progressTimer;

    // Progress animation (smooth 0-100%)
    const totalDuration = PROCESSING_STEPS.reduce((sum, step) => sum + step.duration, 0);
    const progressInterval = 50; // Update every 50ms
    const progressIncrement = 100 / (totalDuration / progressInterval);

    progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return Math.min(prev + progressIncrement, 100);
      });
    }, progressInterval);

    // Step progression
    let cumulativeTime = 0;
    PROCESSING_STEPS.forEach((step, index) => {
      cumulativeTime += index > 0 ? PROCESSING_STEPS[index - 1].duration : 0;

      setTimeout(() => {
        setCurrentStep(index);
      }, cumulativeTime);
    });

    // Complete processing and navigate to results
    const totalTime = PROCESSING_STEPS.reduce((sum, step) => sum + step.duration, 0);

    stepTimer = setTimeout(() => {
      // Get soil scenario based on location
      const scenario = getScenarioByLocation(location.lat, location.lng);

      // Generate recommendations
      const recommendations = getRecommendationsForScenario(
        scenario.status,
        plantRequirements,
        selectedPlant.name
      );
      const summary = getRecommendationSummary(recommendations);

      // Store in app state
      setSoilData(scenario.status, scenario);
      setRecommendations(recommendations, summary);

      // Navigate to soil status screen
      navigate('/soil-status');
    }, totalTime);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
    };
  }, [location, selectedPlant, plantRequirements, navigate, setSoilData, setRecommendations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="inline-block text-8xl mb-4"
          >
            🔬
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Analyzing Your Farm
          </h1>
          <p className="text-gray-600">
            Processing satellite data and soil parameters...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-2 font-mono">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {PROCESSING_STEPS.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: currentStep >= index ? 1 : 0.3,
                  x: 0
                }}
                className={`
                  flex items-center gap-4 p-4 rounded-lg transition-all
                  ${currentStep >= index ? 'bg-green-50' : 'bg-gray-50'}
                `}
              >
                {/* Icon */}
                <motion.div
                  animate={currentStep === index ? {
                    scale: [1, 1.2, 1],
                  } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-3xl"
                >
                  {step.icon}
                </motion.div>

                {/* Text */}
                <div className="flex-1">
                  <p className={`
                    font-medium
                    ${currentStep >= index ? 'text-gray-800' : 'text-gray-400'}
                  `}>
                    {step.text}
                  </p>
                </div>

                {/* Status */}
                <div>
                  {currentStep > index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
                    >
                      ✓
                    </motion.div>
                  )}
                  {currentStep === index && (
                    <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>Using Sentinel-2 satellite imagery and machine learning models</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
