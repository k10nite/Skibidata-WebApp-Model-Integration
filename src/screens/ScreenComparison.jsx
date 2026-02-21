import { useState } from 'react';
import { Link } from 'react-router-dom';

const SCREEN_COMPARISONS = [
  {
    id: 1,
    name: 'Location Selection',
    kimi: '/location-selection',
    mine: null, // Overwritten
    description: 'Interactive map with GPS and pin drop'
  },
  {
    id: 2,
    name: 'Plant Selection',
    kimi: '/plant-selection-kimi',
    mine: '/plant-selection',
    description: '20+ crops with categories and filters'
  },
  {
    id: 3,
    name: 'Processing/Loading',
    kimi: '/processing-screen',
    mine: '/processing',
    description: 'Loading animation with progress steps'
  },
  {
    id: 4,
    name: 'Soil Status',
    kimi: '/soil-status-screen',
    mine: '/soil-status',
    description: 'NPK & pH dashboard with gauges'
  },
  {
    id: 5,
    name: 'Plant Requirements',
    kimi: '/plant-requirements',
    mine: null,
    description: 'Optimal soil conditions for selected plant'
  },
  {
    id: 6,
    name: 'Fertilizer Recommendations',
    kimi: '/fertilizer-recommendations-premium',
    mine: '/fertilizer-recommendations',
    description: 'Product recommendations with dosages'
  },
  {
    id: 7,
    name: 'Complete/Success',
    kimi: '/complete-screen',
    mine: '/complete',
    description: 'Success celebration and next actions'
  }
];

export default function ScreenComparison() {
  const [selectedScreen, setSelectedScreen] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🎨 Screen Comparison
          </h1>
          <p className="text-xl text-gray-600">
            Compare <span className="text-[#2E7D32] font-semibold">Kimi's Premium Design</span> vs{' '}
            <span className="text-[#84934A] font-semibold">Original Design</span>
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 gap-6">
          {SCREEN_COMPARISONS.map((screen) => (
            <div
              key={screen.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Screen {screen.id}: {screen.name}
                  </h3>
                  <p className="text-gray-600">{screen.description}</p>
                </div>
              </div>

              <div className="flex gap-4">
                {/* Kimi Version */}
                {screen.kimi && (
                  <Link
                    to={screen.kimi}
                    className="flex-1 bg-gradient-to-br from-[#2E7D32] to-[#84934A] text-white rounded-xl p-6 hover:scale-[1.02] transition-transform group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold uppercase tracking-wide">
                        Kimi Premium
                      </span>
                      <span className="text-2xl">🤖</span>
                    </div>
                    <p className="text-white/90 text-sm mb-3">
                      Airbnb/Apple-style design with GSAP animations
                    </p>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <span>View Screen</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                )}

                {/* My Version */}
                {screen.mine ? (
                  <Link
                    to={screen.mine}
                    className="flex-1 bg-gradient-to-br from-[#492828] to-[#84934A] text-white rounded-xl p-6 hover:scale-[1.02] transition-transform group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold uppercase tracking-wide">
                        Original Design
                      </span>
                      <span className="text-2xl">🌾</span>
                    </div>
                    <p className="text-white/90 text-sm mb-3">
                      Earthy Farm Tech aesthetic
                    </p>
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <span>View Screen</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1 bg-gray-100 text-gray-400 rounded-xl p-6 border-2 border-dashed border-gray-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold uppercase tracking-wide">
                        Not Available
                      </span>
                      <span className="text-2xl">—</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {screen.id === 1 ? 'Overwritten by Kimi' : 'Not created yet'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">🚀 Quick Navigation</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/plant-selection-kimi"
              className="bg-[#2E7D32] text-white rounded-xl p-4 hover:bg-[#246129] transition-colors text-center font-semibold"
            >
              🤖 Start Kimi Flow
            </Link>
            <Link
              to="/plant-selection"
              className="bg-[#492828] text-white rounded-xl p-4 hover:bg-[#3d2222] transition-colors text-center font-semibold"
            >
              🌾 Start Original Flow
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
