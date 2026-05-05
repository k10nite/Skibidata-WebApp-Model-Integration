// Screen 7: Complete / End Actions - Field Return Dashboard
// END MOMENT of Peak-End Rule - Satisfying conclusion with clear actions
// Clean Apple-style success state with clear actions

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAppStore from '../store/appStore';

export default function Complete() {
  const navigate = useNavigate();
  const {
    selectedPlant,
    municipality,
    recommendations,
    recommendationSummary,
    soilData,
    resetApp,
  } = useAppStore();

  const handleDownloadReport = () => {
    const summary = generateTextSummary();
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ulat-pataba-${selectedPlant?.name}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAnalyzeAnother = () => {
    // Keep location, reset everything else
    navigate('/plant-selection');
  };

  const handleNewLocation = () => {
    resetApp();
    navigate('/location-selection');
  };

  const generateTextSummary = () => {
    return `
================================================================================
ULAT NG REKOMENDASYON SA PATABA
(Fertilizer Recommendation Report)
================================================================================
Petsa: ${new Date().toLocaleString('fil-PH')}
Lokasyon: ${municipality}
Tanim: ${selectedPlant?.name} (${selectedPlant?.scientificName || ''})

KALAGAYAN NG LUPA (Soil Status)
--------------------------------------------------------------------------------
Nitrogen (N):        ${soilData?.nitrogen}
Phosphorus (P):      ${soilData?.phosphorus}
Potassium (K):       ${soilData?.potassium}
pH ng Lupa:          ${soilData?.pH}

BUOD NG REKOMENDASYON (Recommendations Summary)
--------------------------------------------------------------------------------
Kabuuang Produkto:   ${recommendationSummary?.totalProducts}
Mataas na Priyoridad: ${recommendationSummary?.highPriority}
Katamtamang Priyoridad: ${recommendationSummary?.mediumPriority}
Tinatayang Gastos:   ₱${recommendationSummary?.estimatedCost?.toLocaleString()} (1 ektarya)

MGA PRODUKTONG PATABA (Fertilizer Products)
--------------------------------------------------------------------------------
${recommendations?.map((rec, i) => `
${i + 1}. ${rec.fertilizer.name} (${rec.fertilizer.formula})
   Priyoridad: ${rec.priority}
   Nutrient: ${rec.nutrient}
   Dahilan: ${rec.reason}
   Paggamit: ${rec.fertilizer.applicationRate}
   Takdang Panahon: ${rec.fertilizer.applicationTiming}
   Presyo: ₱${rec.fertilizer.pricePerBag} bawat ${rec.fertilizer.bagSize}
`).join('\n') || 'Walang kailangang pataba - perpekto na ang lupa!'}

================================================================================
Ginawa ng SkibiDATA - Powered by Sentinel-2 Satellite & AI
Para sa mga Magsasaka ng CAR Highland Farms
================================================================================
    `.trim();
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center" style={{ background: 'var(--color-paper)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Success Icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6"
          >
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <h1 className="font-semibold text-3xl mb-2" style={{ fontFamily: '"Fraunces", serif', fontVariationSettings: '"opsz" 144, "wght" 600', color: 'var(--color-earth-deep)' }}>
            Analysis Complete
          </h1>

          <p className="text-base" style={{ color: 'var(--color-earth-deep)', opacity: 0.7 }}>
            Your fertilizer plan is ready
          </p>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm" style={{ background: 'var(--color-paper)' }}
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--color-earth-deep)', opacity: 0.6 }}>
            Summary
          </h2>

          <div className="space-y-4">
            {/* Crop */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedPlant?.icon || '🍅'}</span>
              <span className="font-medium" style={{ color: 'var(--color-earth-deep)' }}>
                {selectedPlant?.name || 'Kamatis'}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <span className="font-medium" style={{ color: 'var(--color-earth-deep)' }}>
                {municipality || 'La Trinidad, Benguet'}
              </span>
            </div>

            {/* Products */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">💊</span>
              <span className="font-medium" style={{ color: 'var(--color-earth-deep)' }}>
                {recommendationSummary?.totalProducts || 4} Products Recommended
              </span>
            </div>

            {/* Cost */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <span className="font-medium" style={{ color: 'var(--color-earth-deep)' }}>
                Estimated Cost: ₱<span style={{ fontFamily: '"JetBrains Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>{recommendationSummary?.estimatedCost?.toLocaleString() || '8,395'}</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Download Report Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleDownloadReport}
            className="w-full border border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm" style={{ background: 'var(--color-paper)' }}
          >
            <span className="text-2xl">📥</span>
            <span className="font-medium text-left flex-1" style={{ color: 'var(--color-earth-deep)' }}>
              Download Full Report
            </span>
          </motion.button>

          {/* Analyze Another Crop Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleAnalyzeAnother}
            className="w-full border border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm" style={{ background: 'var(--color-paper)' }}
          >
            <span className="text-2xl">🔄</span>
            <span className="font-medium text-left flex-1" style={{ color: 'var(--color-earth-deep)' }}>
              Analyze Another Crop
            </span>
          </motion.button>

          {/* New Location Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleNewLocation}
            className="w-full border border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm" style={{ background: 'var(--color-paper)' }}
          >
            <span className="text-2xl">🗺️</span>
            <span className="font-medium text-left flex-1" style={{ color: 'var(--color-earth-deep)' }}>
              New Location
            </span>
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
}
