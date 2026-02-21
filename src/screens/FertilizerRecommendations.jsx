// Screen 6: Fertilizer Recommendations - Fertilizer Sack Stack
// PEAK MOMENT 3: Main results reveal with staggered animations
// Shows specific fertilizer products to address nutrient gaps

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import useAppStore from '../store/appStore';

export default function FertilizerRecommendations() {
  const navigate = useNavigate();
  const { selectedPlant, recommendations } = useAppStore();

  // Refs for GSAP animations
  const bannerRef = useRef(null);
  const sacksRef = useRef([]);
  const summaryRef = useRef(null);
  const advisoryRef = useRef(null);

  // Fertilizer products data with Filipino labels
  const fertilizerProducts = [
    {
      id: 'nitrogen',
      name: 'Urea (46-0-0)',
      nutrient: 'NITROGEN',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      currentLevel: 'LOW',
      targetLevel: 'HIGH',
      currentBadgeColor: '#EF4444', // Red
      targetArrow: '↑',
      purpose: 'Palakasin ang dahon at tangkay',
      purposeEn: 'Strengthen leaves and stems',
      application: '2-3 sako bawat ektarya',
      applicationEn: '2-3 bags per hectare',
      timing: '2 linggo bago magtanim',
      timingEn: '2 weeks before planting',
      price: 1450,
      bagSize: '50kg',
      priority: 'HIGH',
      priorityIcon: '🔴'
    },
    {
      id: 'phosphorus',
      name: 'DAP (18-46-0)',
      nutrient: 'PHOSPHORUS',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      currentLevel: 'MEDIUM',
      targetLevel: 'MEDIUM-HIGH',
      currentBadgeColor: '#F59E0B', // Yellow
      targetArrow: '↗',
      purpose: 'Para sa malakas na ugat',
      purposeEn: 'For strong roots',
      application: '1-2 sako bawat ektarya',
      applicationEn: '1-2 bags per hectare',
      timing: 'Sa pagtatanim',
      timingEn: 'At planting',
      price: 1680,
      bagSize: '50kg',
      priority: 'MEDIUM',
      priorityIcon: '🟡'
    },
    {
      id: 'potassium',
      name: 'Muriate of Potash (0-0-60)',
      nutrient: 'POTASSIUM',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      currentLevel: 'LOW',
      targetLevel: 'HIGH',
      currentBadgeColor: '#EF4444', // Red
      targetArrow: '↑',
      purpose: 'Gawing mataas ang kalidad ng bunga',
      purposeEn: 'Improve fruit quality',
      application: '1-2 sako bawat ektarya',
      applicationEn: '1-2 bags per hectare',
      timing: 'Sa pamumulaklak',
      timingEn: 'During flowering',
      price: 1580,
      bagSize: '50kg',
      priority: 'HIGH',
      priorityIcon: '🔴'
    },
    {
      id: 'ph',
      name: 'Agricultural Lime',
      nutrient: 'pH ADJUSTMENT',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      currentLevel: 'SLIGHTLY ACIDIC',
      targetLevel: 'NEUTRAL',
      currentBadgeColor: '#F59E0B', // Yellow
      targetArrow: '→',
      purpose: 'Itama ang asido ng lupa',
      purposeEn: 'Correct soil acidity',
      application: '5-10 sako bawat ektarya',
      applicationEn: '5-10 bags per hectare',
      timing: '1 buwan bago magtanim',
      timingEn: '1 month before planting',
      price: 180,
      bagSize: '50kg',
      priority: 'MEDIUM',
      priorityIcon: '🟡'
    }
  ];

  // Calculate total cost
  const calculateTotalCost = () => {
    // Average bags for calculation
    const costs = [
      2.5 * 1450, // Nitrogen: 2-3 bags avg 2.5
      1.5 * 1680, // Phosphorus: 1-2 bags avg 1.5
      1.5 * 1580, // Potassium: 1-2 bags avg 1.5
      7.5 * 180   // Lime: 5-10 bags avg 7.5
    ];
    return costs.reduce((sum, cost) => sum + cost, 0);
  };

  const totalCost = calculateTotalCost();

  useEffect(() => {
    if (!selectedPlant) {
      navigate('/plant-selection');
      return;
    }

    // GSAP Timeline for animations
    const tl = gsap.timeline();

    // 1. Clay-shake banner animation on load
    tl.to(bannerRef.current, {
      x: -4,
      duration: 0.1,
      yoyo: true,
      repeat: 5,
      ease: 'power1.inOut'
    })
    .to(bannerRef.current, {
      x: 0,
      duration: 0.1
    });

    // 2. Sack cards cascade from top with 0.2s stagger
    tl.fromTo(
      sacksRef.current,
      {
        opacity: 0,
        y: -50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'back.out(1.2)'
      },
      '-=0.3'
    );

    // 3. Total cost summary animation
    tl.fromTo(
      summaryRef.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
      },
      '-=0.2'
    );

    // 4. Advisory banner with clay-shake
    tl.fromTo(
      advisoryRef.current,
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4
      }
    )
    .to(advisoryRef.current, {
      x: -3,
      duration: 0.08,
      yoyo: true,
      repeat: 5,
      ease: 'power1.inOut'
    });

    // Arrow pulse animation (continuous)
    gsap.to('.arrow-pulse', {
      scale: 1.2,
      duration: 0.8,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
      stagger: 0.2
    });

  }, [selectedPlant, navigate]);

  const handleContinue = () => {
    navigate('/complete');
  };

  const handleBack = () => {
    navigate('/plant-requirements');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100 p-6 pb-24">
      <div className="max-w-4xl mx-auto">

        {/* Header Banner */}
        <div
          ref={bannerRef}
          className="bg-gradient-to-r from-[#84934A] to-[#656D3F] text-white rounded-2xl shadow-lg p-8 mb-8 text-center relative overflow-hidden"
          style={{
            boxShadow: '0 8px 24px rgba(73, 40, 40, 0.2)'
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="terrace-pattern w-full h-full"></div>
          </div>
          <h1 className="text-4xl font-bold mb-2 relative z-10" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Mga Inirerekomendang Pataba
          </h1>
          <p className="text-xl opacity-90 relative z-10" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Para sa iyong {selectedPlant?.name || 'Kamatis'}
          </p>
          <div className="text-sm opacity-80 mt-1 relative z-10">
            (Recommended Fertilizers for your {selectedPlant?.name || 'Tomato'})
          </div>
        </div>

        {/* Fertilizer Stack - Vertical */}
        <div className="space-y-6 mb-8">
          {fertilizerProducts.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => (sacksRef.current[index] = el)}
              className="sack-card p-6 relative group cursor-pointer"
              onMouseEnter={(e) => {
                // Clay-morph hover effect
                gsap.to(e.currentTarget, {
                  y: -8,
                  boxShadow: '0 12px 32px rgba(73, 40, 40, 0.25)',
                  duration: 0.3,
                  ease: 'power2.out'
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  boxShadow: '0 4px 12px rgba(73, 40, 40, 0.1)',
                  duration: 0.3,
                  ease: 'power2.out'
                });
              }}
            >
              {/* Priority Badge - Top Right */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-2xl">{product.priorityIcon}</span>
                <span
                  className="px-3 py-1 rounded-full text-sm font-bold text-white"
                  style={{
                    backgroundColor: product.priority === 'HIGH' ? '#EF4444' : '#F59E0B'
                  }}
                >
                  {product.priority}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left: Product Image */}
                <div className="md:col-span-1">
                  <div className="aspect-square rounded-xl overflow-hidden shadow-md">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="font-bold text-lg text-[#492828]">{product.name}</p>
                    <p className="text-sm text-[#656D3F] font-mono">{product.nutrient}</p>
                  </div>
                </div>

                {/* Middle: Status & Details */}
                <div className="md:col-span-2 space-y-4">

                  {/* Current → Target Status */}
                  <div className="flex items-center justify-start gap-4 bg-white/80 rounded-lg p-4">
                    <div className="text-center">
                      <span
                        className="inline-block px-4 py-2 rounded-lg text-white font-bold text-sm"
                        style={{ backgroundColor: product.currentBadgeColor }}
                      >
                        {product.currentLevel}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">Kasalukuyan</p>
                    </div>

                    <div className="arrow-pulse text-4xl text-[#84934A] font-bold">
                      {product.targetArrow}
                    </div>

                    <div className="text-center">
                      <span
                        className="inline-block px-4 py-2 rounded-lg text-white font-bold text-sm"
                        style={{ backgroundColor: '#10B981' }}
                      >
                        {product.targetLevel}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">Target</p>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="bg-[#84934A]/10 rounded-lg p-3 border-l-4 border-[#84934A]">
                    <p className="font-semibold text-[#492828] mb-1">
                      🎯 Layunin (Purpose):
                    </p>
                    <p className="text-[#656D3F] font-medium">{product.purpose}</p>
                    <p className="text-sm text-gray-600 italic">({product.purposeEn})</p>
                  </div>

                  {/* Application Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                    {/* Application Rate */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                        📦 Dami (Application)
                      </p>
                      <p className="font-bold text-[#492828]">{product.application}</p>
                      <p className="text-xs text-gray-600">({product.applicationEn})</p>
                    </div>

                    {/* Timing */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">
                        ⏰ Kailan (Timing)
                      </p>
                      <p className="font-bold text-[#492828]">{product.timing}</p>
                      <p className="text-xs text-gray-600">({product.timingEn})</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-3 text-white">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">💰 Presyo (Price):</span>
                      <span className="text-2xl font-bold">₱{product.price.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-green-100 text-right">per {product.bagSize} bag</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Cost Summary */}
        <div
          ref={summaryRef}
          className="clay-card bg-gradient-to-br from-[#492828] to-[#656D3F] text-white p-8 mb-6"
        >
          <div className="text-center">
            <p className="text-lg font-semibold mb-2 opacity-90">
              💵 Kabuuang Gastos
            </p>
            <p className="text-5xl font-bold mb-2">
              ₱{totalCost.toLocaleString()}
            </p>
            <p className="text-sm opacity-80">
              Para sa 1 ektarya (For 1 hectare)
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-center text-sm">
              <span className="font-semibold">Nota:</span> Mga average na presyo batay sa merkado.
              Maaaring mag-iba depende sa lokasyon.
            </p>
            <p className="text-center text-xs opacity-70 mt-1">
              (Note: Average market prices. May vary by location.)
            </p>
          </div>
        </div>

        {/* Advisory Banner */}
        <div
          ref={advisoryRef}
          className="clay-card bg-amber-50 border-2 border-amber-400 p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="text-5xl">👨‍🌾</div>
            <div className="flex-1">
              <p className="font-bold text-lg text-[#492828] mb-2">
                Paalala ng Magsasaka (Farmer's Advisory)
              </p>
              <p className="text-[#656D3F] font-semibold">
                ✓ Isama sa lupa bago magtanim
              </p>
              <p className="text-sm text-gray-600 italic">
                (Mix into soil before planting)
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Sundin ang tamang dami at oras ng paggamit para sa pinakamahusay na resulta.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            className="btn-magnetic px-6 py-3 bg-white border-2 border-[#84934A] text-[#84934A] rounded-xl font-bold hover:bg-[#84934A] hover:text-white transition-colors duration-300"
          >
            ← Bumalik (Back)
          </button>

          <button
            onClick={handleContinue}
            className="btn-magnetic px-8 py-3 bg-gradient-to-r from-[#84934A] to-[#656D3F] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            📥 Download Report →
          </button>
        </div>
      </div>
    </div>
  );
}
