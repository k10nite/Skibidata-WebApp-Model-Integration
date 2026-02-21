// Screen 5: Plant Requirements - Optimal Harvest Table
// Shows what the selected plant needs in Filipino farmer-friendly format

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import useAppStore from '../store/appStore';

export default function PlantRequirements() {
  const navigate = useNavigate();
  const { selectedPlant, plantRequirements, soilData } = useAppStore();

  // GSAP animation refs
  const cardsRef = useRef([]);
  const arrowsRef = useRef([]);
  const heroRef = useRef(null);
  const bannerRef = useRef(null);

  // Redirect if no plant selected
  useEffect(() => {
    if (!selectedPlant || !plantRequirements) {
      navigate('/plant-selection');
      return;
    }
  }, [selectedPlant, plantRequirements, navigate]);

  // GSAP Animations on mount
  useEffect(() => {
    if (!selectedPlant) return;

    const ctx = gsap.context(() => {
      // Hero image reveal
      gsap.from(heroRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 1.2,
        ease: 'power2.out'
      });

      // Stagger cards from right with fade
      gsap.from(cardsRef.current, {
        opacity: 0,
        x: 100,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3
      });

      // Arrow pulse animation (loop)
      arrowsRef.current.forEach((arrow) => {
        if (arrow) {
          gsap.to(arrow, {
            scale: 1.2,
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
          });
        }
      });

      // Comparison banner slide up
      gsap.from(bannerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 1.2,
        ease: 'power2.out'
      });
    });

    return () => ctx.revert();
  }, [selectedPlant]);

  if (!selectedPlant || !plantRequirements) {
    return null;
  }

  // Filipino plant name mapping
  const filipinoNames = {
    'Tomato': 'Kamatis',
    'Cabbage': 'Repolyo',
    'Potato': 'Patatas',
    'Carrots': 'Karot',
    'Lettuce': 'Litsugas'
  };

  // Nutrient level mapping with Filipino descriptions
  const getLevelBadge = (level) => {
    switch(level) {
      case 'High':
        return { color: '#84934A', text: 'MATAAS', arrow: '⬆️', gradient: false };
      case 'Medium-High':
        return { color: '#A4B852', text: 'KATAMTAMAN-MATAAS', arrow: '➡️', gradient: true };
      case 'Medium':
        return { color: '#C4BC5A', text: 'KATAMTAMAN', arrow: '➡️', gradient: false };
      case 'Low':
        return { color: '#9E9E9E', text: 'MABABA', arrow: '⬇️', gradient: false };
      default:
        return { color: '#84934A', text: level.toUpperCase(), arrow: '➡️', gradient: false };
    }
  };

  // pH level badge
  const getpHBadge = (pHLevel) => {
    if (pHLevel === 'Slightly Acidic') {
      return { color: '#DAA520', text: 'MEDYO ASIDO', icon: '🟡', range: '6.0-6.8' };
    } else if (pHLevel === 'Neutral') {
      return { color: '#84934A', text: 'NEUTRAL', icon: '🟢', range: '6.5-7.5' };
    }
    return { color: '#DAA520', text: pHLevel.toUpperCase(), icon: '⚖️', range: '6.0-7.0' };
  };

  const requirements = [
    {
      nutrient: 'Nitrogen',
      tagalog: 'Nitroheno',
      level: plantRequirements.nitrogen,
      description: 'Para sa malakas na dahon at tangkay',
      icon: '🌱'
    },
    {
      nutrient: 'Phosphorus',
      tagalog: 'Posporo',
      level: plantRequirements.phosphorus,
      description: 'Para sa ugat at bulaklak',
      icon: '🌿'
    },
    {
      nutrient: 'Potassium',
      tagalog: 'Potasyo',
      level: plantRequirements.potassium,
      description: 'Para sa kalidad ng bunga',
      icon: '🍃'
    }
  ];

  const pHInfo = getpHBadge(plantRequirements.pH);

  // Calculate gaps (if soil data available)
  const hasGaps = soilData && (
    soilData.nitrogen !== plantRequirements.nitrogen ||
    soilData.phosphorus !== plantRequirements.phosphorus ||
    soilData.potassium !== plantRequirements.potassium
  );

  const handleContinue = () => {
    navigate('/recommendations');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-green-50">
      {/* Hero Section with Plant Image */}
      <div className="relative h-80 overflow-hidden" ref={heroRef}>
        <img
          src="https://images.unsplash.com/photo-1592841200221-a6898f307baa"
          alt="Thriving tomato plant"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/40 to-amber-50"></div>

        {/* Plant name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
          <h1
            className="text-5xl md:text-6xl font-bold text-clay-dark mb-2"
            style={{ fontFamily: "'Outfit', sans-serif", color: '#492828' }}
          >
            {filipinoNames[selectedPlant.name] || selectedPlant.name}
          </h1>
          <p
            className="text-xl md:text-2xl italic text-stone-700"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {selectedPlant.scientificName}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-semibold text-stone-800 mb-3"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Kinakailangang Sustansya
          </h2>
          <p className="text-stone-600">
            Optimal harvest requirements para sa {filipinoNames[selectedPlant.name] || selectedPlant.name}
          </p>
        </div>

        {/* Requirements Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* NPK Cards */}
          {requirements.map((req, index) => {
            const badge = getLevelBadge(req.level);
            return (
              <div
                key={req.nutrient}
                ref={el => cardsRef.current[index] = el}
                className="bg-white rounded-xl shadow-lg p-6 border-t-4 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                style={{ borderTopColor: badge.color }}
              >
                {/* Icon */}
                <div className="text-5xl mb-3 text-center">
                  {req.icon}
                </div>

                {/* Nutrient Name */}
                <h3
                  className="text-lg font-semibold text-stone-800 text-center mb-2"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {req.tagalog}
                </h3>

                {/* Level Badge */}
                <div
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-full mb-3"
                  style={{
                    backgroundColor: badge.gradient
                      ? 'linear-gradient(135deg, #84934A, #C4BC5A)'
                      : badge.color + '20',
                    border: `2px solid ${badge.color}`
                  }}
                >
                  <span
                    ref={el => arrowsRef.current[index] = el}
                    className="text-xl"
                  >
                    {badge.arrow}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{
                      fontFamily: "'Roboto Mono', monospace",
                      color: badge.color
                    }}
                  >
                    {badge.text}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-stone-600 text-center leading-relaxed">
                  {req.description}
                </p>
              </div>
            );
          })}

          {/* pH Level Card */}
          <div
            ref={el => cardsRef.current[3] = el}
            className="bg-white rounded-xl shadow-lg p-6 border-t-4 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            style={{ borderTopColor: pHInfo.color }}
          >
            {/* Icon */}
            <div className="text-5xl mb-3 text-center">
              {pHInfo.icon}
            </div>

            {/* pH Label */}
            <h3
              className="text-lg font-semibold text-stone-800 text-center mb-2"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Antas ng pH
            </h3>

            {/* pH Badge */}
            <div
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full mb-2"
              style={{
                backgroundColor: pHInfo.color + '20',
                border: `2px solid ${pHInfo.color}`
              }}
            >
              <span
                className="text-sm font-bold"
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  color: pHInfo.color
                }}
              >
                {pHInfo.text}
              </span>
            </div>

            {/* pH Range */}
            <p
              className="text-center text-lg font-semibold mb-2"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                color: '#492828'
              }}
            >
              {pHInfo.range}
            </p>

            {/* Description */}
            <p className="text-xs text-stone-600 text-center leading-relaxed">
              Pinakamabuting kondisyon
            </p>
          </div>
        </div>

        {/* Comparison Hint Banner */}
        {soilData && (
          <div
            ref={bannerRef}
            className="rounded-xl p-6 mb-8 border-l-4"
            style={{
              backgroundColor: hasGaps ? '#FFF8E1' : '#E8F5E9',
              borderLeftColor: hasGaps ? '#F57C00' : '#84934A'
            }}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">
                {hasGaps ? '⚠️' : '✅'}
              </span>
              <div>
                <h4
                  className="text-lg font-semibold mb-1"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    color: '#492828'
                  }}
                >
                  Ihambing sa iyong lupa
                </h4>
                <p className="text-sm text-stone-700">
                  {hasGaps
                    ? 'May mga kulang sa iyong lupa. Tingnan ang rekomendasyon para sa tamang pataba.'
                    : 'Ang iyong lupa ay angkop para sa taniman na ito!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="group px-10 py-4 rounded-xl font-semibold text-white text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: '#84934A',
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            <span className="flex items-center gap-3">
              <span>Kumuha ng Rekomendasyon</span>
              <span className="text-2xl group-hover:translate-x-2 transition-transform">
                🌾
              </span>
            </span>
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-stone-500 max-w-2xl mx-auto">
            Ang mga rekomendasyon ay batay sa pag-aaral mula sa CAR highland farms.
            Konsultahin ang inyong lokal na agrikultura opisyal para sa mas tiyak na payo.
          </p>
        </div>
      </div>

      {/* Custom styles for fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,600&family=Roboto+Mono:wght@500;700&display=swap');

        .text-clay-dark {
          color: #492828;
        }

        .bg-rice-green {
          background-color: #84934A;
        }
      `}</style>
    </div>
  );
}
