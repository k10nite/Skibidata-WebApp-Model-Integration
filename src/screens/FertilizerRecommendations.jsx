// Screen 6: Fertilizer Recommendations - CLIMAX
// Field prescription in lab notebook aesthetic
// Editorial-cartographic, Cordillera terraces meet scientific journal

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAppStore from '../store/appStore';
import { getRecommendationForCrop, getRecommendationForCropAsync } from '../services/recommendationService';

// Map plant names to crop keys in CROP_REQUIREMENTS
const PLANT_TO_CROP_KEY = {
  'Cabbage': 'cabbage',
  'Repolyo': 'cabbage',
  'Lettuce': 'lettuce',
  'Litsugas': 'lettuce',
  'Potato': 'potato',
  'Patatas': 'potato',
  'Carrot': 'carrot',
  'Karot': 'carrot',
  'Tomato': 'tomato',
  'Kamatis': 'tomato',
  'Snap Beans': 'beans',
  'Baguio Beans': 'beans',
  'Sweet Potato': 'sweetPotato',
  'Kamote': 'sweetPotato',
  'Chayote': 'chayote',
  'Sayote': 'chayote'
};

// Default soil data for mockup/demo when real data is not available
const DEFAULT_SOIL_DATA = {
  ph: 5.8,
  nitrogen: { value: 0.12, rating: 'Low' },
  phosphorus: { value: 15, rating: 'Medium' },
  potassium: { value: 120, rating: 'Medium' }
};

export default function FertilizerRecommendations() {
  const navigate = useNavigate();
  const {
    selectedPlant,
    soilData,
    municipality,
    setRecommendations,
    areaHectares,
    availableFertilizers
  } = useAppStore();

  // Container animation timing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  // Determine crop key from selected plant
  const cropKey = useMemo(() => {
    if (!selectedPlant?.name) return 'cabbage';
    return PLANT_TO_CROP_KEY[selectedPlant.name] || 'cabbage';
  }, [selectedPlant]);

  // Calculate fertilizer recommendations - sync stub renders instantly, async engine upgrades when reachable
  const [fertilizerData, setFertilizerData] = useState(() => {
    const soil = soilData || DEFAULT_SOIL_DATA;
    return getRecommendationForCrop(soil, cropKey, areaHectares, availableFertilizers);
  });

  useEffect(() => {
    let cancelled = false;
    const soil = soilData || DEFAULT_SOIL_DATA;
    setFertilizerData(getRecommendationForCrop(soil, cropKey, areaHectares, availableFertilizers));
    getRecommendationForCropAsync(soil, cropKey, areaHectares, availableFertilizers)
      .then((data) => { if (!cancelled) setFertilizerData(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [soilData, cropKey, areaHectares, availableFertilizers]);

  // Store recommendations in app store
  useEffect(() => {
    if (fertilizerData) {
      setRecommendations(fertilizerData.recommendations, fertilizerData.summary);
    }
  }, [fertilizerData, setRecommendations]);

  useEffect(() => {
    if (!selectedPlant) {
      navigate('/plant-selection');
      return;
    }
  }, [selectedPlant, navigate]);

  const handleContinue = () => {
    navigate('/complete');
  };

  const handleBack = () => {
    navigate('/plant-requirements');
  };

  const locationDisplay = municipality || 'La Trinidad, Benguet';
  const todayDisplay = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      className="min-h-screen bg-[var(--color-paper)] relative"
      style={{ paddingBottom: '3rem' }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background topographic contours */}
      <svg className="terrace-topo opacity-[0.06]" viewBox="0 0 800 600" fill="none">
        <path
          d="M50 150C150 120, 250 180, 350 150C450 120, 550 180, 650 150"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M30 280C130 250, 230 310, 330 280C430 250, 530 310, 630 280"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M70 420C170 390, 270 450, 370 420C470 390, 570 450, 670 420"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">

        {/* Header Section - paper bg */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="terrace-eyebrow mb-6" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>05 — RECOMMENDATION</div>
          <h1 className="terrace-display text-5xl md:text-6xl mb-4" style={{ fontFamily: '"Fraunces", serif', fontVariationSettings: '"opsz" 144, "wght" 600' }}>
            Field Prescription
          </h1>
          <div className="text-lg leading-relaxed" style={{ fontFamily: '"Fraunces", serif', fontVariationSettings: '"opsz" 14, "wght" 400', color: 'var(--color-moss)' }}>
            {fertilizerData.crop.name} cultivation guidance · {locationDisplay} · {todayDisplay}
          </div>
        </motion.div>


        {/* Recommendation Cards - paper bg hero stratum */}
        <motion.div variants={itemVariants} className="mb-16">
          <div className="terrace-eyebrow mb-8" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>APPLICATION SCHEDULE</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fertilizerData.recommendations.map((rec, index) => (
              <motion.div
                key={`${rec.stage}-${rec.fertilizer.name}-${index}`}
                variants={itemVariants}
                className="terrace-card p-8 hover:scale-[1.01] transition-transform duration-300"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Fertilizer name */}
                <h3 className="terrace-display text-2xl mb-4" style={{ fontFamily: '"Fraunces", serif', fontVariationSettings: '"opsz" 144, "wght" 500' }}>
                  {rec.fertilizer.name}
                </h3>

                {/* Dosage as DisplayNumber */}
                <div className="text-center mb-6">
                  <div className="terrace-display text-4xl" style={{ fontFamily: '"Fraunces", serif', fontVariationSettings: '"opsz" 144, "wght" 700' }}>
                    {rec.amountKg}
                  </div>
                  <div className="terrace-data text-sm mt-1" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--color-moss)' }}>kg/ha</div>
                </div>

                {/* Application details */}
                <div className="terrace-data space-y-3 text-sm leading-relaxed" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                  <div><strong>Timing:</strong> {rec.timing}</div>
                  <div><strong>Method:</strong> {rec.method}</div>
                  {rec.fertilizer.brand && (
                    <div><strong>Brand:</strong> {rec.fertilizer.brand}</div>
                  )}
                </div>

                {/* Cost at bottom */}
                <div className="mt-6 pt-4 border-t border-[var(--color-contour)]">
                  <div className="terrace-data text-lg font-semibold" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                    ₱{rec.cost.toLocaleString()}
                  </div>
                  <div className="text-xs mt-1" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--color-moss)' }}>
                    ₱{rec.fertilizer.pricePerKg}/kg
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty state if no recommendations */}
          {(!fertilizerData.recommendations || fertilizerData.recommendations.length === 0) && (
            <div className="text-center py-12">
              <div className="terrace-display-italic text-xl" style={{ fontFamily: '"Fraunces", serif', fontVariationSettings: '"opsz" 14, "wght" 400', fontStyle: 'italic', color: 'var(--color-moss)' }}>
                No specific recommendations available for current conditions.
              </div>
            </div>
          )}
        </motion.div>

        {/* pH Adjustment if needed */}
        {fertilizerData.phAdjustment?.needed && (
          <motion.div
            variants={itemVariants}
            className="terrace-card-hairline p-6 mb-12"
            style={{ background: 'var(--color-paper-card)', borderColor: 'var(--color-rust)' }}
          >
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-rust)] bg-opacity-20 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-3 h-3 rounded-full bg-[var(--color-rust)]"></div>
              </div>
              <div>
                <h4 className="terrace-display text-lg mb-2" style={{ fontFamily: '"Fraunces", serif', fontVariationSettings: '"opsz" 144, "wght" 500' }}>pH Adjustment Required</h4>
                <p className="text-sm mb-3" style={{ fontFamily: '"Fraunces", serif', fontVariationSettings: '"opsz" 14, "wght" 400' }}>{fertilizerData.phAdjustment.reason}</p>
                <div className="terrace-data text-sm" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                  <strong>{fertilizerData.phAdjustment.action}:</strong> {fertilizerData.phAdjustment.amount} · {fertilizerData.phAdjustment.timing}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Total Summary - paper-deep bg closing stratum */}
        <motion.div
          variants={itemVariants}
          className="p-8 rounded-2xl"
          style={{ background: 'var(--color-paper-deep)' }}
        >
          <div className="terrace-eyebrow mb-6" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>TOTAL</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="terrace-data text-xs uppercase tracking-wider mb-1" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--color-moss)' }}>
                NITROGEN
              </div>
              <div className="terrace-data text-2xl font-semibold" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                {fertilizerData.summary.totalNutrients.n} kg
              </div>
            </div>
            <div>
              <div className="terrace-data text-xs uppercase tracking-wider mb-1" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--color-moss)' }}>
                PHOSPHORUS
              </div>
              <div className="terrace-data text-2xl font-semibold" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                {fertilizerData.summary.totalNutrients.p} kg
              </div>
            </div>
            <div>
              <div className="terrace-data text-xs uppercase tracking-wider mb-1" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--color-moss)' }}>
                POTASSIUM
              </div>
              <div className="terrace-data text-2xl font-semibold" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                {fertilizerData.summary.totalNutrients.k} kg
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pt-6 border-t border-[var(--color-contour)]">
            <div>
              <div className="terrace-data text-xs uppercase tracking-wider mb-1" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--color-moss)' }}>
                TOTAL COST
              </div>
              <div className="terrace-display text-3xl" style={{ fontFamily: '"Fraunces", serif', fontVariationSettings: '"opsz" 144, "wght" 700' }}>
                ₱{fertilizerData.summary.totalCostPHP.toLocaleString()}
              </div>
              <div className="text-sm mt-2" style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums', color: 'var(--color-moss)' }}>
                Coverage: {fertilizerData.summary.areaHectares} ha · Expected yield: {fertilizerData.summary.expectedYield}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBack}
                className="terrace-btn-ghost"
              >
                Edit Inputs
              </button>
              <button
                onClick={handleContinue}
                className="terrace-btn"
              >
                Continue to Summary
              </button>
            </div>
          </div>

          {/* Editorial closing */}
          <div className="mt-8 pt-6 border-t border-[var(--color-contour)]">
            <p className="text-sm" style={{ fontFamily: '"Fraunces", serif', fontVariationSettings: '"opsz" 14, "wght" 400', fontStyle: 'italic', color: 'var(--color-moss)' }}>
              Recommendations based on current soil conditions and selected crop requirements.
              Adjust application timing based on local weather patterns.
            </p>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
