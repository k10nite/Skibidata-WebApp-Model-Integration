/**
 * EXAMPLE: Processing Screen Implementation
 *
 * This file demonstrates how to use multiple GSAP components together
 * in a real screen for the Filipino Fertilizer App.
 *
 * Copy this pattern to your actual screen files.
 */

import { useState, useEffect } from 'react';
import {
  SoilParticles,
  DrillSpinner,
  TypewriterText,
  StaggerReveal,
  ClayCard,
  ProgressBarAnimated
} from '../components';

export default function ProcessingScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const processingSteps = [
    'Analyzing soil composition',
    'Measuring nutrient levels',
    'Calculating pH balance',
    'Matching with crop database',
    'Generating recommendations'
  ];

  const mockResults = {
    nitrogen: { value: 65, status: 'medium' },
    phosphorus: { value: 45, status: 'low' },
    potassium: { value: 80, status: 'high' }
  };

  // Simulate processing steps
  useEffect(() => {
    if (currentStep < processingSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // Processing complete - show results
      const timer = setTimeout(() => {
        setShowResults(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const getProgressColor = (status) => {
    const colors = {
      low: '#CD5C5C',
      medium: '#DAA520',
      high: '#84934A'
    };
    return colors[status] || '#84934A';
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#ECECEC] overflow-hidden">
      {/* 1. SOIL PARTICLES - Ambient background effect */}
      <SoilParticles count={20} duration={12} color="#492828" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 w-full">
        {!showResults ? (
          /* PROCESSING STATE */
          <>
            {/* 2. DRILL SPINNER - Main loading indicator */}
            <div className="flex justify-center mb-8">
              <DrillSpinner size={120} speed={1.2} />
            </div>

            {/* 3. TYPEWRITER TEXT - Status message */}
            <div className="mb-12">
              <TypewriterText
                text={
                  currentStep < processingSteps.length
                    ? processingSteps[currentStep]
                    : 'Analysis complete!'
                }
                duration={0.06}
                className="text-2xl text-center text-[#492828] font-semibold"
              />
            </div>

            {/* 4. STAGGER REVEAL - Processing steps list */}
            <StaggerReveal delay={0.2} direction="up" className="space-y-3">
              {processingSteps.map((step, i) => (
                <ClayCard
                  key={i}
                  className={`p-4 transition-colors duration-300 ${
                    i === currentStep
                      ? 'bg-[#FFF8E1] border-l-4 border-[#DAA520]'
                      : i < currentStep
                      ? 'bg-[#E8F5E9] border-l-4 border-[#84934A]'
                      : 'bg-[#FAF9F6]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Step indicator */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        i < currentStep
                          ? 'bg-[#84934A] text-white'
                          : i === currentStep
                          ? 'bg-[#DAA520] text-white animate-pulse'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {i < currentStep ? '✓' : i + 1}
                    </div>

                    {/* Step text */}
                    <span className={`font-medium ${
                      i <= currentStep ? 'text-[#492828]' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                </ClayCard>
              ))}
            </StaggerReveal>
          </>
        ) : (
          /* RESULTS STATE */
          <>
            {/* Success header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✓</div>
              <TypewriterText
                text="Soil Analysis Complete"
                duration={0.08}
                className="text-3xl font-bold text-[#84934A]"
              />
            </div>

            {/* 5. CLAY CARD + PROGRESS BARS - Results display */}
            <StaggerReveal delay={0.15} direction="up" className="space-y-4">
              <ClayCard className="p-6">
                <h3 className="text-xl font-bold text-[#492828] mb-4">
                  NPK Nutrient Levels
                </h3>

                <div className="space-y-4">
                  <ProgressBarAnimated
                    value={mockResults.nitrogen.value}
                    color={getProgressColor(mockResults.nitrogen.status)}
                    label="Nitrogen (N)"
                    unit="%"
                  />

                  <ProgressBarAnimated
                    value={mockResults.phosphorus.value}
                    color={getProgressColor(mockResults.phosphorus.status)}
                    label="Phosphorus (P)"
                    unit="%"
                  />

                  <ProgressBarAnimated
                    value={mockResults.potassium.value}
                    color={getProgressColor(mockResults.potassium.status)}
                    label="Potassium (K)"
                    unit="%"
                  />
                </div>
              </ClayCard>

              {/* Status summary */}
              <ClayCard className="p-6 bg-[#FFF8E1]">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">⚠️</div>
                  <div>
                    <h4 className="font-bold text-[#492828] mb-2">
                      Action Required
                    </h4>
                    <p className="text-sm text-[#492828] opacity-80">
                      Your soil has low phosphorus levels. We recommend
                      fertilizers rich in P to optimize crop growth.
                    </p>
                  </div>
                </div>
              </ClayCard>

              {/* Action button */}
              <div className="text-center pt-4">
                <button
                  onClick={onComplete}
                  className="px-8 py-4 bg-[#84934A] text-white rounded-[2rem] font-semibold text-lg shadow-lg hover:bg-[#656D3F] transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  View Recommendations
                </button>
              </div>
            </StaggerReveal>
          </>
        )}
      </div>
    </div>
  );
}


/**
 * EXAMPLE: Recommendations Screen Implementation
 */

import {
  SoilParticles,
  MagneticButton,
  ClayCard,
  StaggerReveal,
  ArrowPulse
} from '../components';

export function RecommendationsScreen({ soilData, recommendations }) {
  return (
    <div className="relative min-h-screen bg-[#ECECEC] py-8">
      {/* Subtle particles */}
      <SoilParticles count={15} duration={15} color="#492828" />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-[#492828] mb-8">
          Fertilizer Recommendations
        </h1>

        {/* Nutrient improvements */}
        <ClayCard className="p-6 mb-8">
          <h2 className="text-xl font-bold text-[#492828] mb-4">
            Expected Improvements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ArrowPulse from="low" to="high" nutrient="Nitrogen" />
            <ArrowPulse from="low" to="medium" nutrient="Phosphorus" />
            <ArrowPulse from="medium" to="high" nutrient="Potassium" />
          </div>
        </ClayCard>

        {/* Fertilizer cards */}
        <StaggerReveal delay={0.15} direction="up" className="space-y-4">
          {recommendations.map((rec, index) => (
            <ClayCard key={rec.id} className="p-6">
              {index === 0 && (
                <div className="absolute -top-3 right-4 bg-[#84934A] text-white px-4 py-1 rounded-full text-sm font-bold">
                  ⭐ RECOMMENDED
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#492828]">
                    {rec.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-mono">
                    NPK: {rec.npkRatio}
                  </p>
                </div>

                <p className="text-[#492828] opacity-80">
                  {rec.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-600">
                      Dosage:
                    </span>
                    <br />
                    <span className="font-bold">{rec.dosage}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">
                      Frequency:
                    </span>
                    <br />
                    <span className="font-bold">{rec.frequency}</span>
                  </div>
                </div>

                <MagneticButton
                  variant={index === 0 ? 'primary' : 'secondary'}
                  onClick={() => console.log('Selected:', rec.name)}
                  className="w-full"
                >
                  Select This Fertilizer
                </MagneticButton>
              </div>
            </ClayCard>
          ))}
        </StaggerReveal>
      </div>
    </div>
  );
}


/**
 * USAGE NOTES:
 *
 * 1. Import only the components you need
 * 2. Combine components for rich interactions
 * 3. Use color system consistently:
 *    - Low: #CD5C5C (red)
 *    - Medium: #DAA520 (gold)
 *    - High: #84934A (green)
 *
 * 4. Animation timing recommendations:
 *    - TypewriterText: 0.05-0.08 duration per char
 *    - StaggerReveal: 0.1-0.2 delay between items
 *    - DrillSpinner: 1-1.5 speed multiplier
 *    - SoilParticles: 10-15 duration for subtle, 5-8 for active
 *
 * 5. Mobile optimization:
 *    - Reduce particle count on mobile
 *    - Use smaller spinner sizes
 *    - Increase stagger delays slightly
 *
 * 6. Performance:
 *    - All animations auto-cleanup on unmount
 *    - GSAP is optimized for 60fps
 *    - Use max 25-30 particles simultaneously
 */
