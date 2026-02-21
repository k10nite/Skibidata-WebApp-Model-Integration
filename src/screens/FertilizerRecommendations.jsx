// Screen 6: Fertilizer Recommendations - Clean Product Cards
// PEAK MOMENT 3: Main results reveal with staggered animations
// Airbnb-style professional product listing with clean design

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import useAppStore from '../store/appStore';

export default function FertilizerRecommendations() {
  const navigate = useNavigate();
  const { selectedPlant, recommendations } = useAppStore();

  // Refs for GSAP animations
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const summaryRef = useRef(null);

  // Fertilizer products data
  const fertilizerProducts = [
    {
      id: 'nitrogen',
      name: 'Urea (46-0-0)',
      subtitle: 'Nitrogen Supplement',
      application: '2-3 bags per hectare',
      timing: '2 weeks before planting',
      price: 1450,
      unit: 'per 50kg bag',
      priority: 'high',
      priorityLabel: 'High Priority',
      estimatedBags: 2.5
    },
    {
      id: 'phosphorus',
      name: 'DAP (18-46-0)',
      subtitle: 'Phosphorus Supplement',
      application: '1-2 bags per hectare',
      timing: 'At planting',
      price: 1680,
      unit: 'per 50kg bag',
      priority: 'medium',
      priorityLabel: 'Medium Priority',
      estimatedBags: 1.5
    },
    {
      id: 'potassium',
      name: 'Muriate of Potash (0-0-60)',
      subtitle: 'Potassium Supplement',
      application: '1-2 bags per hectare',
      timing: 'During flowering',
      price: 1580,
      unit: 'per 50kg bag',
      priority: 'high',
      priorityLabel: 'High Priority',
      estimatedBags: 1.5
    },
    {
      id: 'lime',
      name: 'Agricultural Lime',
      subtitle: 'pH Adjustment',
      application: '5-10 bags per hectare',
      timing: '1 month before planting',
      price: 180,
      unit: 'per 50kg bag',
      priority: 'medium',
      priorityLabel: 'Medium Priority',
      estimatedBags: 7.5
    }
  ];

  // Calculate total cost
  const totalCost = fertilizerProducts.reduce(
    (sum, product) => sum + (product.price * product.estimatedBags),
    0
  );

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
      cardsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
      '-=0.3'
    );

    // 3. Summary card
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

  // Priority styling - subtle and professional
  const getPriorityStyles = (priority) => {
    if (priority === 'high') {
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500'
      };
    }
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500'
    };
  };

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
            Recommended for {selectedPlant?.name || 'Kamatis'}
          </p>
          <p
            className="text-sm text-gray-500 mt-1"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            La Trinidad, Benguet · 1 hectare
          </p>
        </div>

        {/* Product Cards */}
        <div className="space-y-4 mb-6">
          {fertilizerProducts.map((product, index) => {
            const priorityStyles = getPriorityStyles(product.priority);

            return (
              <div
                key={product.id}
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
                        {product.name}
                      </h3>
                      <p
                        className="text-sm text-gray-600"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {product.subtitle}
                      </p>
                    </div>

                    {/* Priority Badge - Subtle */}
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${priorityStyles.bg} ${priorityStyles.border} border`}
                    >
                      <div className={`w-2 h-2 rounded-full ${priorityStyles.dot}`}></div>
                      <span
                        className={`text-xs font-medium ${priorityStyles.text}`}
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {product.priorityLabel}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100"></div>

                  {/* Application Instructions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p
                        className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Application
                      </p>
                      <p
                        className="text-sm text-gray-900 font-medium"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {product.application}
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
                        {product.timing}
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
                        ₱{product.price.toLocaleString()}
                      </p>
                      <p
                        className="text-xs text-gray-500"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {product.unit}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddToPlan(product.name)}
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
                Cost Summary
              </p>
              <p
                className="text-4xl font-semibold mb-1"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                ₱{totalCost.toLocaleString()}
              </p>
              <p
                className="text-sm text-gray-400"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Estimated total for 1 hectare
              </p>
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
