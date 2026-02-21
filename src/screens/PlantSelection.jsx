// Screen 2: PLANT SELECTION - Filipino Harvest Card Carousel
// Earthy Farm Tech Aesthetic with Philippine Farm Fields Background

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import useAppStore from '../store/appStore';

// Filipino crop data with real Unsplash images
const FILIPINO_CROPS = [
  {
    id: 'tomato',
    name: 'Kamatis',
    englishName: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop',
    growingPeriod: '90-120 araw',
    optimalRequirements: {
      nitrogen: 'High',
      phosphorus: 'Medium',
      potassium: 'High',
      pH: 'Slightly Acidic'
    }
  },
  {
    id: 'rice',
    name: 'Palay',
    englishName: 'Rice',
    scientificName: 'Oryza sativa',
    image: 'https://images.unsplash.com/photo-1536304929831-8b0d4e6a2ff0?w=600&h=400&fit=crop',
    growingPeriod: '120-150 araw',
    optimalRequirements: {
      nitrogen: 'High',
      phosphorus: 'Medium',
      potassium: 'Medium',
      pH: 'Neutral'
    }
  },
  {
    id: 'corn',
    name: 'Mais',
    englishName: 'Corn',
    scientificName: 'Zea mays',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=400&fit=crop',
    growingPeriod: '60-100 araw',
    optimalRequirements: {
      nitrogen: 'High',
      phosphorus: 'High',
      potassium: 'Medium',
      pH: 'Slightly Acidic'
    }
  },
  {
    id: 'eggplant',
    name: 'Talong',
    englishName: 'Eggplant',
    scientificName: 'Solanum melongena',
    image: 'https://images.unsplash.com/photo-1622421170932-d1e5501e3fc5?w=600&h=400&fit=crop',
    growingPeriod: '70-90 araw',
    optimalRequirements: {
      nitrogen: 'Medium',
      phosphorus: 'High',
      potassium: 'High',
      pH: 'Slightly Acidic'
    }
  },
  {
    id: 'chili',
    name: 'Sili',
    englishName: 'Chili',
    scientificName: 'Capsicum annuum',
    image: 'https://images.unsplash.com/photo-1583454155184-870a1f63b6c5?w=600&h=400&fit=crop',
    growingPeriod: '75-90 araw',
    optimalRequirements: {
      nitrogen: 'Medium',
      phosphorus: 'Medium',
      potassium: 'High',
      pH: 'Neutral'
    }
  }
];

export default function PlantSelection() {
  const navigate = useNavigate();
  const { setSelectedPlant, municipality, barangay } = useAppStore();
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [canContinue, setCanContinue] = useState(false);

  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const continueButtonRef = useRef(null);
  const particlesRef = useRef([]);

  // GSAP stagger reveal animation on load
  useGSAP(() => {
    // Stagger-reveal cards with 0.1s delay
    gsap.fromTo(
      cardsRef.current,
      {
        opacity: 0,
        y: 60,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      }
    );
  }, []);

  // Handle crop selection with clay-shake animation
  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);

    // Find the card element
    const cardIndex = FILIPINO_CROPS.findIndex(c => c.id === crop.id);
    const cardElement = cardsRef.current[cardIndex];

    if (cardElement) {
      // Clay-shake animation
      gsap.timeline()
        .to(cardElement, {
          x: -8,
          duration: 0.1,
          ease: 'power2.inOut'
        })
        .to(cardElement, {
          x: 8,
          duration: 0.1,
          ease: 'power2.inOut'
        })
        .to(cardElement, {
          x: -8,
          duration: 0.1,
          ease: 'power2.inOut'
        })
        .to(cardElement, {
          x: 0,
          duration: 0.1,
          ease: 'power2.inOut'
        });

      // Scale up selected card
      gsap.to(cardElement, {
        scale: 1.2,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });

      // Scale down other cards
      cardsRef.current.forEach((card, idx) => {
        if (idx !== cardIndex && card) {
          gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    }

    // Unlock continue button with soil particle burst
    if (!canContinue) {
      setCanContinue(true);
      createParticleBurst();
    }
  };

  // Soil particle burst animation
  const createParticleBurst = () => {
    if (!continueButtonRef.current) return;

    const buttonRect = continueButtonRef.current.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    // Create 12 particles
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'soil-particle';
      particle.style.position = 'fixed';
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.width = '6px';
      particle.style.height = '6px';
      particle.style.backgroundColor = '#84934A';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1000';

      document.body.appendChild(particle);
      particlesRef.current.push(particle);

      const angle = (Math.PI * 2 * i) / 12;
      const distance = 80;
      const targetX = centerX + Math.cos(angle) * distance;
      const targetY = centerY + Math.sin(angle) * distance;

      gsap.to(particle, {
        x: targetX - centerX,
        y: targetY - centerY,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove();
        }
      });
    }
  };

  // Magnetic hover effect
  const handleCardHover = (index, isHovering) => {
    const card = cardsRef.current[index];
    if (!card) return;

    if (isHovering && selectedCrop?.id !== FILIPINO_CROPS[index].id) {
      gsap.to(card, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else if (!isHovering && selectedCrop?.id !== FILIPINO_CROPS[index].id) {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleContinue = () => {
    if (selectedCrop) {
      setSelectedPlant(selectedCrop, selectedCrop.optimalRequirements);
      navigate('/processing');
    }
  };

  const handleBack = () => {
    navigate('/location-selection');
  };

  // Cleanup particles on unmount
  useEffect(() => {
    return () => {
      particlesRef.current.forEach(p => p.remove());
    };
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&h=1080&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Terrace pattern overlay */}
      <div className="absolute inset-0 terrace-pattern bg-earth/30 backdrop-blur-sm"></div>

      {/* Content Container */}
      <div ref={containerRef} className="relative z-10 min-h-screen p-6 md:p-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold text-center mb-3"
            style={{
              fontFamily: 'Outfit, sans-serif',
              color: '#FAF9F6',
              textShadow: '2px 2px 8px rgba(73, 40, 40, 0.6)'
            }}
          >
            Pumili ng Tanim
          </h1>
          <p
            className="text-center text-lg"
            style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              color: '#ECECEC',
              textShadow: '1px 1px 4px rgba(73, 40, 40, 0.8)'
            }}
          >
            {barangay && municipality
              ? `${barangay}, ${municipality}`
              : municipality || 'La Trinidad, Benguet'}
          </p>
        </div>

        {/* Crop Cards - Horizontal Scrollable */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="overflow-x-auto pb-6 scrollbar-hide">
            <div className="flex gap-6 px-4" style={{ minWidth: 'min-content' }}>
              {FILIPINO_CROPS.map((crop, index) => (
                <div
                  key={crop.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  onClick={() => handleCropSelect(crop)}
                  onMouseEnter={() => handleCardHover(index, true)}
                  onMouseLeave={() => handleCardHover(index, false)}
                  className={`
                    clay-card cursor-pointer flex-shrink-0 w-80 overflow-hidden
                    transition-all duration-300
                    ${selectedCrop?.id === crop.id ? 'ring-4 ring-primary' : ''}
                  `}
                  style={{
                    boxShadow: selectedCrop?.id === crop.id
                      ? '0 12px 32px rgba(132, 147, 74, 0.4)'
                      : '0 8px 24px rgba(73, 40, 40, 0.15)'
                  }}
                >
                  {/* Crop Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedCrop?.id === crop.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                          style={{
                            backgroundColor: '#84934A',
                            color: '#FAF9F6',
                            boxShadow: '0 4px 12px rgba(132, 147, 74, 0.6)'
                          }}
                        >
                          ✓
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Crop Name */}
                    <h3
                      className="text-2xl mb-1"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        fontStyle: 'italic',
                        color: '#492828'
                      }}
                    >
                      {crop.name}
                    </h3>
                    <p
                      className="text-sm mb-1"
                      style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        color: '#656D3F',
                        fontWeight: 500
                      }}
                    >
                      {crop.englishName}
                    </p>
                    <p
                      className="text-xs mb-4"
                      style={{
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#84934A',
                        fontSize: '11px'
                      }}
                    >
                      {crop.scientificName}
                    </p>

                    {/* Growing Period Badge */}
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: '#84934A',
                        color: '#FAF9F6'
                      }}
                    >
                      <span className="text-xs">⏱️</span>
                      <span
                        className="text-xs font-medium"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                      >
                        {crop.growingPeriod}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          {/* Back Arrow */}
          <button
            onClick={handleBack}
            className="btn-magnetic px-6 py-3 rounded-[2rem] font-medium transition-all"
            style={{
              backgroundColor: '#FAF9F6',
              color: '#492828',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              boxShadow: '0 4px 12px rgba(73, 40, 40, 0.2)'
            }}
          >
            ← Bumalik
          </button>

          {/* Continue Button */}
          <button
            ref={continueButtonRef}
            onClick={handleContinue}
            disabled={!canContinue}
            className={`
              btn-magnetic px-8 py-3 rounded-[2rem] font-bold transition-all
              ${canContinue ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}
            `}
            style={{
              backgroundColor: '#84934A',
              color: '#FAF9F6',
              fontFamily: 'Outfit, sans-serif',
              boxShadow: canContinue
                ? '0 8px 24px rgba(132, 147, 74, 0.4)'
                : '0 4px 12px rgba(73, 40, 40, 0.2)'
            }}
          >
            Magpatuloy →
          </button>
        </div>

        {/* Selected Crop Info */}
        {selectedCrop && (
          <div
            className="max-w-7xl mx-auto mt-8 p-4 rounded-[2rem] text-center"
            style={{
              backgroundColor: 'rgba(250, 249, 246, 0.95)',
              boxShadow: '0 8px 24px rgba(73, 40, 40, 0.15)'
            }}
          >
            <p
              className="text-sm md:text-base"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                color: '#492828'
              }}
            >
              <strong style={{ color: '#84934A' }}>Napili:</strong> {selectedCrop.name} ({selectedCrop.englishName}) -
              Susuriin namin ang kondisyon ng iyong lupa para sa pinakamahusay na ani.
            </p>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
