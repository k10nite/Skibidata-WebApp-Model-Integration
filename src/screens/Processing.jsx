// Screen 3: Processing - Apple-Style Loading Animation
// PEAK MOMENT 2: Creates anticipation and engagement
// Clean, minimal design with elegant loading indicators

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import useAppStore from '../store/appStore';
import { getScenarioByLocation } from '../data/soilScenarios';
import { getRecommendationsForScenario, getRecommendationSummary } from '../data/fertilizerRecommendations';

// Processing steps with clean, minimal descriptions
const PROCESSING_STEPS = [
  {
    text: 'Location data fetched',
    duration: 1.5
  },
  {
    text: 'Satellite imagery loaded',
    duration: 1.5
  },
  {
    text: 'Testing NPK levels',
    duration: 2
  },
  {
    text: 'Generating recommendations',
    duration: 1.5
  }
];

export default function Processing() {
  const navigate = useNavigate();
  const { location, selectedPlant, plantRequirements, setSoilData, setRecommendations } = useAppStore();

  // Refs for GSAP animations
  const timelineRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);
  const spinnerDotsRef = useRef([]);
  const stepRefs = useRef([]);

  const [currentStep, setCurrentStep] = useState(-1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Create GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Process soil scenario and recommendations
        const scenario = getScenarioByLocation(location.lat, location.lng);
        const recommendations = getRecommendationsForScenario(
          scenario.status,
          plantRequirements,
          selectedPlant.name
        );
        const summary = getRecommendationSummary(recommendations);

        // Store in app state
        setSoilData(scenario.status, scenario);
        setRecommendations(recommendations, summary);

        // Navigate to soil status after completion
        setTimeout(() => navigate('/soil-status'), 300);
      }
    });

    // Circular spinner dots animation (4 dots continuously rotating)
    spinnerDotsRef.current.forEach((dot, index) => {
      if (dot) {
        tl.to(dot, {
          rotation: 360,
          duration: 1.2,
          repeat: -1,
          ease: 'linear',
          transformOrigin: '50% 50%'
        }, 0);

        // Stagger the opacity pulsing
        tl.to(dot, {
          opacity: [0.3, 1, 0.3],
          duration: 1.2,
          repeat: -1,
          delay: index * 0.3,
          ease: 'sine.inOut'
        }, 0);
      }
    });

    const totalDuration = PROCESSING_STEPS.reduce((acc, step) => acc + step.duration, 0);
    let cumulativeTime = 0;

    // Animate through each step
    PROCESSING_STEPS.forEach((step, index) => {
      const stepProgress = ((index + 1) / PROCESSING_STEPS.length) * 100;

      // Update current step at the start of each step
      tl.call(() => setCurrentStep(index), null, cumulativeTime);

      // Animate progress bar
      tl.to(progressBarRef.current, {
        width: `${stepProgress}%`,
        duration: step.duration,
        ease: 'power2.out'
      }, cumulativeTime);

      // Update progress percentage
      tl.to({}, {
        duration: step.duration,
        onUpdate: function() {
          const currentProgress = Math.round(
            ((cumulativeTime + (this.progress() * step.duration)) / totalDuration) * 100
          );
          setProgress(currentProgress);
        }
      }, cumulativeTime);

      cumulativeTime += step.duration;
    });

    // Final animation: Complete all steps
    tl.call(() => setCurrentStep(PROCESSING_STEPS.length), null, cumulativeTime);
    tl.to(progressBarRef.current, {
      width: '100%',
      duration: 0.3,
      ease: 'power2.out'
    }, cumulativeTime);
    tl.to({}, {
      duration: 0.3,
      onUpdate: function() {
        setProgress(100);
      }
    }, cumulativeTime);

    timelineRef.current = tl;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [location, selectedPlant, plantRequirements, navigate, setSoilData, setRecommendations]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white" />

      {/* Center Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-8">

        {/* Circular Spinner (Apple-style) */}
        <div className="relative w-16 h-16 mb-12">
          {/* 4 dots in circular pattern */}
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              ref={(el) => (spinnerDotsRef.current[index] = el)}
              className="absolute w-2.5 h-2.5 rounded-full bg-black"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${index * 90}deg) translateY(-24px)`,
              }}
            />
          ))}
        </div>

        {/* Progress Bar Container */}
        <div className="w-full mb-8">
          <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 h-full bg-black rounded-full transition-all duration-300"
              style={{ width: '0%' }}
            />
          </div>
          {/* Progress Percentage */}
          <div className="text-center mt-3 text-sm text-gray-500 font-medium" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {progress}%
          </div>
        </div>

        {/* Current Step Description */}
        <div className="text-center mb-12 h-6">
          <p
            className="text-base text-gray-700 font-normal transition-opacity duration-300"
            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            {currentStep >= 0 && currentStep < PROCESSING_STEPS.length
              ? `${PROCESSING_STEPS[currentStep].text}...`
              : ''}
          </p>
        </div>

        {/* Progress Steps List */}
        <div className="w-full space-y-4">
          {PROCESSING_STEPS.map((step, index) => {
            const isCompleted = currentStep > index;
            const isActive = currentStep === index;
            const isPending = currentStep < index;

            return (
              <div
                key={index}
                className={`flex items-center space-x-3 transition-all duration-300 ${
                  isPending ? 'opacity-40' : 'opacity-100'
                }`}
                ref={(el) => (stepRefs.current[index] = el)}
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {isCompleted && (
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isActive && (
                    <svg
                      className="w-5 h-5 text-black"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  {isPending && (
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>

                {/* Step Text */}
                <p
                  className={`text-sm font-normal transition-colors duration-300 ${
                    isCompleted ? 'text-gray-900' : isActive ? 'text-black font-medium' : 'text-gray-400'
                  }`}
                  style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
                >
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
