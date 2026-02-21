// Screen 7: Complete / End Actions - Field Return Dashboard
// END MOMENT of Peak-End Rule - Satisfying conclusion with clear actions
// Celebration screen with Filipino labels and Earthy Farm Tech aesthetic

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
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
    setLocation
  } = useAppStore();

  const celebrationRef = useRef(null);
  const particlesRef = useRef([]);
  const cardsRef = useRef([]);
  const buttonsRef = useRef([]);

  useEffect(() => {
    // Celebration burst animation - soil particles shoot up
    if (celebrationRef.current) {
      const particles = [];
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-2 h-2 bg-earth rounded-full';
        particle.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
        particle.style.top = '50%';
        celebrationRef.current.appendChild(particle);
        particles.push(particle);
      }

      gsap.to(particles, {
        y: -200,
        x: () => (Math.random() - 0.5) * 400,
        opacity: 0,
        scale: () => Math.random() * 2,
        rotation: () => Math.random() * 720,
        duration: 1.5,
        ease: 'power2.out',
        stagger: 0.02,
        onComplete: () => {
          particles.forEach(p => p.remove());
        }
      });
    }

    // Summary cards stagger-appear
    if (cardsRef.current.length > 0) {
      gsap.from(cardsRef.current, {
        y: 50,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        delay: 0.5
      });
    }

    // Buttons pulse with magnetic attraction
    if (buttonsRef.current.length > 0) {
      gsap.from(buttonsRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 1
      });

      // Continuous pulse animation
      gsap.to(buttonsRef.current, {
        scale: 1.02,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.2
      });
    }
  }, []);

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

  // Calculate estimated savings (mock calculation)
  const estimatedSavings = recommendationSummary?.estimatedCost
    ? Math.round(recommendationSummary.estimatedCost * 0.25)
    : 0;

  // Magnetic button hover effect
  const handleMouseMove = (e, buttonRef) => {
    if (!buttonRef) return;

    const rect = buttonRef.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < 150) {
      const strength = (150 - distance) / 150;
      gsap.to(buttonRef, {
        x: deltaX * strength * 0.3,
        y: deltaY * strength * 0.3,
        duration: 0.3
      });
    }
  };

  const handleMouseLeave = (buttonRef) => {
    if (!buttonRef) return;
    gsap.to(buttonRef, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-light via-amber-50 to-rice-dark/10 p-6 relative overflow-hidden">
      {/* Celebration particles container */}
      <div ref={celebrationRef} className="absolute inset-0 pointer-events-none z-10" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto relative z-20"
      >
        {/* Celebration Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="inline-block mb-6"
          >
            <span className="text-9xl">🎉</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-7xl font-bold text-earth mb-4"
            style={{ fontSize: '3.5rem' }}
          >
            Tapos Na!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl text-rice-dark font-heading"
          >
            Handa na ang iyong plano sa pataba
          </motion.p>
        </div>

        {/* Summary Cards - 3 horizontal cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Your Crop Card */}
          <div
            ref={el => cardsRef.current[0] = el}
            className="bg-earth-card rounded-clay-md shadow-soil-lg p-8 text-center border-4 border-earth/10 hover:shadow-soil-md transition-all"
          >
            <div className="text-6xl mb-4">{selectedPlant?.icon || '🍅'}</div>
            <p className="text-sm text-rice-dark font-heading uppercase tracking-wider mb-2">
              Iyong Tanim
            </p>
            <p className="text-2xl font-display font-bold text-earth">
              {selectedPlant?.name || 'Kamatis'}
            </p>
            {selectedPlant?.scientificName && (
              <p className="text-sm text-earth/60 italic mt-1">
                {selectedPlant.scientificName}
              </p>
            )}
          </div>

          {/* Location Card */}
          <div
            ref={el => cardsRef.current[1] = el}
            className="bg-earth-card rounded-clay-md shadow-soil-lg p-8 text-center border-4 border-earth/10 hover:shadow-soil-md transition-all"
          >
            <div className="text-6xl mb-4">📍</div>
            <p className="text-sm text-rice-dark font-heading uppercase tracking-wider mb-2">
              Lokasyon
            </p>
            <p className="text-2xl font-display font-bold text-earth">
              {municipality || 'La Trinidad, Benguet'}
            </p>
          </div>

          {/* Products Needed Card */}
          <div
            ref={el => cardsRef.current[2] = el}
            className="bg-earth-card rounded-clay-md shadow-soil-lg p-8 text-center border-4 border-earth/10 hover:shadow-soil-md transition-all"
          >
            <div className="text-6xl mb-4">💊</div>
            <p className="text-sm text-rice-dark font-heading uppercase tracking-wider mb-2">
              Mga Kailangan
            </p>
            <p className="text-2xl font-display font-bold text-earth">
              {recommendationSummary?.totalProducts || 4} Pataba
            </p>
          </div>
        </div>

        {/* Action Buttons - Large Magnetic Buttons */}
        <div className="space-y-6 mb-12">
          {/* Download Report Button */}
          <div
            ref={el => buttonsRef.current[0] = el}
            onClick={handleDownloadReport}
            onMouseMove={(e) => handleMouseMove(e, buttonsRef.current[0])}
            onMouseLeave={() => handleMouseLeave(buttonsRef.current[0])}
            className="relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-earth rounded-clay-md blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative bg-rice hover:bg-rice-dark rounded-clay-md shadow-soil-lg hover:shadow-soil-md p-8 transition-all group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-6xl group-hover:scale-110 transition-transform">📥</div>
                  <div>
                    <h3 className="text-3xl font-display font-bold text-white mb-2">
                      I-download ang Ulat
                    </h3>
                    <p className="text-white/90 text-lg font-heading">
                      Kunin ang buong detalye ng iyong plano sa pataba
                    </p>
                  </div>
                </div>
                <div className="text-5xl text-white/75 group-hover:text-white group-hover:translate-x-3 transition-all">
                  →
                </div>
              </div>
            </div>
          </div>

          {/* Analyze Another Crop Button */}
          <div
            ref={el => buttonsRef.current[1] = el}
            onClick={handleAnalyzeAnother}
            onMouseMove={(e) => handleMouseMove(e, buttonsRef.current[1])}
            onMouseLeave={() => handleMouseLeave(buttonsRef.current[1])}
            className="relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-earth rounded-clay-md blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative bg-rice-dark hover:bg-rice rounded-clay-md shadow-soil-lg hover:shadow-soil-md p-8 transition-all group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-6xl group-hover:scale-110 group-hover:rotate-180 transition-all duration-500">🔄</div>
                  <div>
                    <h3 className="text-3xl font-display font-bold text-white mb-2">
                      Pumili ng Ibang Tanim
                    </h3>
                    <p className="text-white/90 text-lg font-heading">
                      Magsimula ng bagong pagsusuri sa ibang pananim
                    </p>
                  </div>
                </div>
                <div className="text-5xl text-white/75 group-hover:text-white group-hover:translate-x-3 transition-all">
                  →
                </div>
              </div>
            </div>
          </div>

          {/* New Location Button */}
          <div
            ref={el => buttonsRef.current[2] = el}
            onClick={handleNewLocation}
            onMouseMove={(e) => handleMouseMove(e, buttonsRef.current[2])}
            onMouseLeave={() => handleMouseLeave(buttonsRef.current[2])}
            className="relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-earth rounded-clay-md blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-white hover:bg-earth-light border-4 border-rice rounded-clay-md shadow-soil-lg hover:shadow-soil-md p-8 transition-all group-hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-6xl group-hover:scale-110 transition-transform">🗺️</div>
                  <div>
                    <h3 className="text-3xl font-display font-bold text-rice-dark mb-2">
                      Bagong Lokasyon
                    </h3>
                    <p className="text-earth/80 text-lg font-heading">
                      Simulan muli sa ibang lugar
                    </p>
                  </div>
                </div>
                <div className="text-5xl text-rice/60 group-hover:text-rice group-hover:translate-x-3 transition-all">
                  →
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-gradient-to-r from-rice-dark to-rice rounded-clay-md shadow-soil-lg p-6 mb-8"
        >
          <div className="flex items-center justify-center gap-8 text-white">
            <div className="text-center">
              <p className="text-3xl font-display font-bold mb-1">
                ₱{estimatedSavings.toLocaleString()}
              </p>
              <p className="text-sm font-heading opacity-90">
                Nakatipid ka ng
              </p>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div className="text-center">
              <p className="text-3xl font-display font-bold mb-1">
                20-30%
              </p>
              <p className="text-sm font-heading opacity-90">
                Taasan ang ani ng
              </p>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div className="text-4xl">
              👨‍🌾
            </div>
          </div>
        </motion.div>

        {/* Branding Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center"
        >
          <div className="bg-earth-card rounded-clay-md shadow-soil-md p-6 border-2 border-earth/10">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="bg-rice-dark text-white px-4 py-2 rounded-full text-sm font-heading font-bold">
                CAR Highland Farms
              </div>
              <div className="text-2xl">🏔️</div>
            </div>
            <p className="text-sm text-earth/80 font-heading mb-1">
              <strong className="text-earth">SkibiDATA</strong> - Powered by Sentinel-2 Satellite
            </p>
            <p className="text-xs text-earth/60 font-mono">
              AI-Driven Fertilizer Recommendations for Filipino Farmers
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
