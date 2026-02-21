// Screen 4: Soil Status - NPK Gauge Cluster Dashboard
// Displays current soil nutrient levels with "Earthy Farm Tech" aesthetic

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import useAppStore from '../store/appStore';

// Nutrient color mapping
const NUTRIENT_COLORS = {
  LOW: '#CD5C5C',
  MEDIUM: '#DAA520',
  HIGH: '#84934A',
  SLIGHTLY_ACIDIC: '#DAA520'
};

// Nutrient data configuration
const NUTRIENT_CONFIG = {
  nitrogen: {
    icon: '🌱',
    label: 'Nitrogen',
    key: 'nitrogen'
  },
  phosphorus: {
    icon: '🌿',
    label: 'Phosphorus',
    key: 'phosphorus'
  },
  potassium: {
    icon: '🍃',
    label: 'Potassium',
    key: 'potassium'
  },
  pH: {
    icon: '⚖️',
    label: 'pH Level',
    key: 'pH'
  }
};

// Convert status to progress percentage
const getProgressPercentage = (status) => {
  const statusMap = {
    'LOW': 30,
    'MEDIUM': 60,
    'HIGH': 85,
    'SLIGHTLY_ACIDIC': 45,
    'NEUTRAL': 60,
    'ACIDIC': 35
  };
  return statusMap[status] || 30;
};

// Create soil particle element
const createSoilParticle = () => {
  const particle = document.createElement('div');
  particle.className = 'soil-particle';
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.animationDelay = `${Math.random() * 8}s`;
  particle.style.animationDuration = `${8 + Math.random() * 4}s`;
  return particle;
};

export default function SoilStatus() {
  const navigate = useNavigate();
  const { soilData, soilScenario, municipality } = useAppStore();
  const containerRef = useRef(null);
  const gaugeRefs = useRef([]);
  const progressRefs = useRef([]);
  const numberRefs = useRef([]);

  // Redirect if no soil data
  useEffect(() => {
    if (!soilData) {
      navigate('/location-selection');
    }
  }, [soilData, navigate]);

  // GSAP Animations
  useEffect(() => {
    if (!soilData || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Create falling soil particles
      const particleContainer = containerRef.current;
      for (let i = 0; i < 20; i++) {
        particleContainer.appendChild(createSoilParticle());
      }

      // Stagger reveal for gauge cards (top to bottom)
      gsap.fromTo(
        gaugeRefs.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.3
        }
      );

      // Progress bars animate from 0 to target width
      progressRefs.current.forEach((progressBar, index) => {
        if (progressBar) {
          const targetWidth = progressBar.dataset.width;
          gsap.fromTo(
            progressBar,
            {
              width: '0%'
            },
            {
              width: `${targetWidth}%`,
              duration: 1.5,
              ease: 'power2.out',
              delay: 0.5 + (index * 0.15)
            }
          );
        }
      });

      // Number count-up animation
      numberRefs.current.forEach((numberEl, index) => {
        if (numberEl) {
          const targetPercent = parseInt(numberEl.dataset.target);
          gsap.fromTo(
            { value: 0 },
            {
              value: targetPercent,
              duration: 1.5,
              ease: 'power2.out',
              delay: 0.5 + (index * 0.15),
              onUpdate: function() {
                numberEl.textContent = Math.round(this.targets()[0].value) + '%';
              }
            }
          );
        }
      });

      // Header animation
      gsap.fromTo(
        '.header-card',
        {
          opacity: 0,
          y: -20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }
      );

      // Info banner animation
      gsap.fromTo(
        '.info-banner',
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 1.2
        }
      );

      // Continue button animation
      gsap.fromTo(
        '.continue-btn',
        {
          opacity: 0,
          scale: 0.9
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
          delay: 1.4
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [soilData]);

  if (!soilData) {
    return null;
  }

  // Prepare nutrient data
  const nutrients = [
    {
      ...NUTRIENT_CONFIG.nitrogen,
      status: soilData.nitrogen,
      progress: getProgressPercentage(soilData.nitrogen)
    },
    {
      ...NUTRIENT_CONFIG.phosphorus,
      status: soilData.phosphorus,
      progress: getProgressPercentage(soilData.phosphorus)
    },
    {
      ...NUTRIENT_CONFIG.potassium,
      status: soilData.potassium,
      progress: getProgressPercentage(soilData.potassium)
    },
    {
      ...NUTRIENT_CONFIG.pH,
      status: soilData.pH,
      progress: getProgressPercentage(soilData.pH)
    }
  ];

  const handleContinue = () => {
    navigate('/plant-requirements');
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-light p-6 relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Main Container */}
      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header Card */}
        <div className="header-card clay-card terrace-pattern p-6 mb-8">
          <div className="grid grid-cols-3 gap-6">
            {/* Location */}
            <div>
              <p className="text-sm opacity-60 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                Lokasyon
              </p>
              <p className="text-lg font-semibold" style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-earth)'
              }}>
                {soilScenario?.location?.barangay || 'La Trinidad'}, Bahong
              </p>
            </div>

            {/* Elevation */}
            <div>
              <p className="text-sm opacity-60 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                Taas
              </p>
              <p className="text-lg font-semibold" style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-earth)'
              }}>
                {soilScenario?.elevation || '1,400'}m
              </p>
            </div>

            {/* Soil Type */}
            <div>
              <p className="text-sm opacity-60 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                Uri ng Lupa
              </p>
              <p className="text-lg font-semibold" style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-earth)'
              }}>
                {soilScenario?.soilType || 'Clay Loam'}
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6" style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-earth)'
        }}>
          Katayuan ng Sustansya
        </h2>

        {/* Nutrient Gauge Cluster */}
        <div className="space-y-4 mb-8">
          {nutrients.map((nutrient, index) => {
            const color = NUTRIENT_COLORS[nutrient.status] || NUTRIENT_COLORS.LOW;

            return (
              <div
                key={nutrient.key}
                ref={el => gaugeRefs.current[index] = el}
                className="clay-card p-6"
                style={{
                  borderLeft: `4px solid ${color}`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  {/* Icon and Label */}
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{nutrient.icon}</span>
                    <div>
                      <h3
                        className="text-xl concept-text"
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontStyle: 'italic',
                          color: 'var(--color-earth)'
                        }}
                      >
                        {nutrient.label}
                      </h3>
                    </div>
                  </div>

                  {/* Status Value */}
                  <div className="text-right">
                    <p
                      className="text-lg font-bold data-text"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {nutrient.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="progress-bar">
                      <div
                        ref={el => progressRefs.current[index] = el}
                        className="progress-fill"
                        data-width={nutrient.progress}
                        style={{
                          backgroundColor: color,
                          width: '0%'
                        }}
                      />
                    </div>
                  </div>
                  <div
                    ref={el => numberRefs.current[index] = el}
                    data-target={nutrient.progress}
                    className="text-lg font-bold data-text min-w-[3rem] text-right"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: color
                    }}
                  >
                    0%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Banner */}
        <div
          className="info-banner clay-card p-6 mb-6"
          style={{
            borderLeft: '4px solid var(--color-medium)',
            background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.1), rgba(218, 165, 32, 0.05))'
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="font-semibold mb-1" style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-earth)'
              }}>
                Paalala sa Magsasaka
              </h3>
              <p style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-earth)',
                opacity: 0.8
              }}>
                Kailangan ng dagdag pataba para sa mas mataas na ani.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="continue-btn btn-magnetic clay-card px-8 py-4 flex items-center gap-3 hover:shadow-lg transition-all"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              fontFamily: 'var(--font-heading)',
              fontWeight: '600',
              fontSize: '1.125rem'
            }}
          >
            <span>Tingnan ang Pangangailangan ng Tanim</span>
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
