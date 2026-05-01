// Screen 6: Fertilizer Recommendations - Clean Product Cards
// PEAK MOMENT 3: Main results reveal with staggered animations
// Airbnb-style professional product listing with clean design

import { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import useAppStore from '../store/appStore';
import { getRecommendationForCrop } from '../services/recommendationService';

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
  const { selectedPlant, soilData, municipality, setRecommendations } = useAppStore();

  // Refs for GSAP animations
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const phSectionRef = useRef(null);
  const organicSectionRef = useRef(null);
  const summaryRef = useRef(null);

  // Determine crop key from selected plant
  const cropKey = useMemo(() => {
    if (!selectedPlant?.name) return 'cabbage';
    return PLANT_TO_CROP_KEY[selectedPlant.name] || 'cabbage';
  }, [selectedPlant]);

  // Calculate fertilizer recommendations
  const fertilizerData = useMemo(() => {
    const soil = soilData || DEFAULT_SOIL_DATA;
    return getRecommendationForCrop(soil, cropKey, 1);
  }, [soilData, cropKey]);

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

    // GSAP Timeline for smooth entrance animations
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // 1. Header fade in
    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    // 2. Product cards stagger
    tl.fromTo(
      cardsRef.current.filter(Boolean),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
      '-=0.3'
    );

    // 3. pH section
    if (phSectionRef.current) {
      tl.fromTo(
        phSectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.2'
      );
    }

    // 4. Organic section
    if (organicSectionRef.current) {
      tl.fromTo(
        organicSectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.2'
      );
    }

    // 5. Summary card
    tl.fromTo(
      summaryRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.2'
    );

  }, [selectedPlant, navigate]);

  const handleContinue = () => {
    navigate('/complete');
  };

  const handleBack = () => {
    navigate('/plant-requirements');
  };

  const handleDownloadReport = () => {
    console.log('Downloading report...');
  };

  const handleAddToPlan = (productName) => {
    console.log(`Added ${productName} to plan`);
  };

  // Get stage styling
  const getStageStyles = (stage) => {
    if (stage.includes('Basal')) {
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Basal'
      };
    }
    if (stage.includes('First')) {
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
        label: 'Side Dress 1'
      };
    }
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      label: 'Side Dress 2'
    };
  };

  const locationDisplay = municipality || 'La Trinidad, Benguet';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <div ref={headerRef} className="mb-8">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Fertilizer Recommendations
          </h1>
          <p
            className="text-lg text-gray-600"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Recommended for {fertilizerData.crop.name}
          </p>
          <p
            className="text-sm text-gray-500 mt-1"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {locationDisplay} · {fertilizerData.summary.areaHectares} hectare
          </p>
        </div>

        {/* Application Schedule Cards */}
        <div className="space-y-4 mb-6">
          {fertilizerData.recommendations.map((rec, index) => {
            const stageStyles = getStageStyles(rec.stage);

            return (
              <div
                key={`${rec.stage}-${rec.fertilizer.name}-${index}`}
                ref={(el) => (cardsRef.current[index] = el)}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="flex flex-col gap-4">

                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className="text-xl font-semibold text-gray-900 mb-1"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {rec.fertilizer.name}
                      </h3>
                      <p
                        className="text-sm text-gray-600"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {rec.fertilizer.brand}
                      </p>
                    </div>

                    {/* Stage Badge */}
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${stageStyles.bg} ${stageStyles.border} border`}
                    >
                      <div className={`w-2 h-2 rounded-full ${stageStyles.dot}`}></div>
                      <span
                        className={`text-xs font-medium ${stageStyles.text}`}
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {stageStyles.label}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100"></div>

                  {/* Application Instructions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p
                        className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Amount
                      </p>
                      <p
                        className="text-sm text-gray-900 font-medium"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {rec.amountKg} kg
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Timing
                      </p>
                      <p
                        className="text-sm text-gray-900 font-medium"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {rec.timing}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Method
                      </p>
                      <p
                        className="text-sm text-gray-900 font-medium"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {rec.method}
                      </p>
                    </div>
                  </div>

                  {/* Price and Action Row */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p
                        className="text-2xl font-semibold text-gray-900"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        PHP {rec.cost.toLocaleString()}
                      </p>
                      <p
                        className="text-xs text-gray-500"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        PHP {rec.fertilizer.pricePerKg}/kg
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddToPlan(rec.fertilizer.name)}
                      className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Add to Plan
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* pH Adjustment Section */}
        {fertilizerData.phAdjustment.needed && (
          <div
            ref={phSectionRef}
            className="bg-orange-50 rounded-xl border border-orange-200 p-6 mb-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3
                  className="text-lg font-semibold text-orange-900 mb-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  pH Adjustment Required
                </h3>
                <p
                  className="text-sm text-orange-800 mb-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {fertilizerData.phAdjustment.reason}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/50 rounded-lg p-4">
                  <div>
                    <p className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Action</p>
                    <p className="text-sm text-orange-900 font-medium">{fertilizerData.phAdjustment.action}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Amount</p>
                    <p className="text-sm text-orange-900 font-medium">{fertilizerData.phAdjustment.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">Timing</p>
                    <p className="text-sm text-orange-900 font-medium">{fertilizerData.phAdjustment.timing}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Organic Alternative Section */}
        <div
          ref={organicSectionRef}
          className="bg-green-50 rounded-xl border border-green-200 p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3
                className="text-lg font-semibold text-green-900 mb-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Organic Alternative
              </h3>
              <p
                className="text-sm text-green-800 mb-4"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {fertilizerData.organicOption.note}
              </p>
              <div className="space-y-3">
                {fertilizerData.organicOption.materials.map((material, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white/50 rounded-lg p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-green-900">{material.fertilizer.name}</p>
                      <p className="text-xs text-green-700">{material.amountKg} kg needed</p>
                    </div>
                    <p className="text-lg font-semibold text-green-900">
                      PHP {material.cost.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-green-200 flex items-center justify-between">
                <p className="text-sm font-medium text-green-800">Total Organic Option Cost</p>
                <p className="text-xl font-semibold text-green-900">
                  PHP {fertilizerData.organicOption.totalCost.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Summary Card */}
        <div
          ref={summaryRef}
          className="bg-gray-900 rounded-xl p-8 text-white"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* Left: Cost Info */}
            <div>
              <p
                className="text-sm text-gray-400 mb-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Conventional Fertilizer Cost
              </p>
              <p
                className="text-4xl font-semibold mb-1"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                PHP {fertilizerData.summary.totalCostPHP.toLocaleString()}
              </p>
              <p
                className="text-sm text-gray-400"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Estimated total for {fertilizerData.summary.areaHectares} hectare · Expected yield: {fertilizerData.summary.expectedYield}
              </p>
              <div className="mt-3 flex gap-4 text-xs text-gray-400">
                <span>N: {fertilizerData.summary.totalNutrients.n} kg</span>
                <span>P: {fertilizerData.summary.totalNutrients.p} kg</span>
                <span>K: {fertilizerData.summary.totalNutrients.k} kg</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadReport}
                className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Report
              </button>

              <button
                onClick={handleContinue}
                className="px-6 py-3 bg-[#84934A] text-white rounded-lg font-medium hover:bg-[#6d7a3d] transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
