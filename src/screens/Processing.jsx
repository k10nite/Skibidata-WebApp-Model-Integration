// Screen 3: Processing - Soil Core Drill Animation
// PEAK MOMENT 2: Creates anticipation and engagement
// Earthy Farm Tech aesthetic with Filipino/English bilingual text

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import useAppStore from '../store/appStore';
import { getScenarioByLocation } from '../data/soilScenarios';
import { getRecommendationsForScenario, getRecommendationSummary } from '../data/fertilizerRecommendations';

// Bilingual processing steps (Filipino/English)
const PROCESSING_STEPS = [
  {
    tagalog: 'Kumukunha ng datos ng terrace...',
    english: 'Fetching terrace data...',
    duration: 2
  },
  {
    tagalog: 'Sinusukat ang NPK levels...',
    english: 'Testing NPK levels...',
    duration: 2
  },
  {
    tagalog: 'Itinugma sa pangangailangan ng Kamatis...',
    english: 'Matching Tomato needs...',
    duration: 1.5
  },
  {
    tagalog: 'Bumubuo ng rekomendasyon...',
    english: 'Generating recommendations...',
    duration: 0.5
  }
];

export default function Processing() {
  const navigate = useNavigate();
  const { location, selectedPlant, plantRequirements, setSoilData, setRecommendations } = useAppStore();

  // Refs for GSAP animations
  const drillRef = useRef(null);
  const timelineRef = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const dotsRef = useRef([]);
  const particlesRef = useRef([]);
  const progressBarRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // SOUND DESIGN COMMENT: Play drilling soil ambient sound here
    // Audio cue point: "soil_drill_start.mp3"

    // Create GSAP timeline (sequential, not parallel)
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

        // SOUND DESIGN COMMENT: Play success notification sound
        // Audio cue point: "analysis_complete.mp3"

        // Navigate to soil status after completion
        navigate('/soil-status');
      }
    });

    // Progress bar animation (0 to 100% over 6 seconds)
    tl.to(progressBarRef.current, {
      width: '100%',
      duration: 6,
      ease: 'power1.inOut'
    }, 0);

    // Pulsing dots animation (continuous throughout)
    dotsRef.current.forEach((dot, index) => {
      if (dot) {
        tl.to(dot, {
          scale: [1, 1.5, 1],
          opacity: [0.3, 1, 0.3],
          duration: 1.5,
          repeat: -1,
          delay: index * 0.2,
          ease: 'sine.inOut'
        }, 0);
      }
    });

    // Initial drill speed
    tl.to(drillRef.current, {
      rotation: 360,
      duration: 1.2,
      repeat: 4,
      ease: 'none'
    }, 0);

    let cumulativeTime = 0;

    // Step 1: "Kumukunha ng datos ng terrace..." (2s)
    tl.fromTo(step1Ref.current,
      { width: 0, opacity: 0 },
      {
        width: '100%',
        opacity: 1,
        duration: 1.5,
        ease: 'steps(40)',
        onStart: () => {
          setCurrentStep(1);
          // SOUND DESIGN COMMENT: Typewriter sound effect
          // Audio cue point: "typewriter_step1.mp3"
        }
      },
      cumulativeTime
    );
    cumulativeTime += PROCESSING_STEPS[0].duration;

    // Drill speed increases slightly
    tl.to(drillRef.current, {
      rotation: '+=360',
      duration: 1.0,
      repeat: 1,
      ease: 'none'
    }, cumulativeTime);

    // Step 2: "Sinusukat ang NPK levels..." (2s)
    tl.fromTo(step2Ref.current,
      { width: 0, opacity: 0 },
      {
        width: '100%',
        opacity: 1,
        duration: 1.5,
        ease: 'steps(40)',
        onStart: () => {
          setCurrentStep(2);
          // SOUND DESIGN COMMENT: Typewriter sound effect
          // Audio cue point: "typewriter_step2.mp3"
        }
      },
      cumulativeTime
    );
    cumulativeTime += PROCESSING_STEPS[1].duration;

    // Drill speed increases more
    tl.to(drillRef.current, {
      rotation: '+=360',
      duration: 0.8,
      repeat: 1,
      ease: 'none'
    }, cumulativeTime);

    // Step 3: "Itinugma sa pangangailangan ng Kamatis..." (1.5s)
    tl.fromTo(step3Ref.current,
      { width: 0, opacity: 0 },
      {
        width: '100%',
        opacity: 1,
        duration: 1.2,
        ease: 'steps(40)',
        onStart: () => {
          setCurrentStep(3);
          // SOUND DESIGN COMMENT: Typewriter sound effect
          // Audio cue point: "typewriter_step3.mp3"
        }
      },
      cumulativeTime
    );
    cumulativeTime += PROCESSING_STEPS[2].duration;

    // Drill speed at maximum
    tl.to(drillRef.current, {
      rotation: '+=360',
      duration: 0.5,
      repeat: 1,
      ease: 'none'
    }, cumulativeTime);

    // Step 4: "Bumubuo ng rekomendasyon..." (0.5s)
    tl.fromTo(step4Ref.current,
      { width: 0, opacity: 0 },
      {
        width: '100%',
        opacity: 1,
        duration: 0.4,
        ease: 'steps(40)',
        onStart: () => {
          setCurrentStep(4);
          // SOUND DESIGN COMMENT: Typewriter sound effect
          // Audio cue point: "typewriter_step4.mp3"
        }
      },
      cumulativeTime
    );
    cumulativeTime += PROCESSING_STEPS[3].duration;

    // Final step: Soil particle explosion
    tl.to(particlesRef.current, {
      x: (index) => Math.cos(index * 60 * Math.PI / 180) * 200,
      y: (index) => Math.sin(index * 60 * Math.PI / 180) * 200,
      opacity: 0,
      scale: 0.5,
      duration: 0.8,
      ease: 'power2.out',
      onStart: () => {
        // SOUND DESIGN COMMENT: Soil explosion sound
        // Audio cue point: "soil_explosion.mp3"
      }
    }, cumulativeTime);

    // Fade out drill during explosion
    tl.to(drillRef.current, {
      scale: 1.2,
      opacity: 0.5,
      duration: 0.8
    }, cumulativeTime);

    timelineRef.current = tl;

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [location, selectedPlant, plantRequirements, navigate, setSoilData, setRecommendations]);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#492828', opacity: 0.95 }}
    >
      {/* Dark clay overlay (full screen) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#492828] via-[#3d2222] to-[#492828]" />

      {/* Center Animation Container */}
      <div className="relative z-10 flex flex-col items-center justify-center">

        {/* Soil Drill Spinner with Glow */}
        <div className="relative mb-12">
          {/* Rice green glow effect */}
          <div
            className="absolute inset-0 blur-2xl opacity-60"
            style={{ backgroundColor: '#84934A' }}
          />

          {/* Pulsing dots around drill (6 dots in circle) */}
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              ref={(el) => (dotsRef.current[index] = el)}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: '#84934A',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${index * 60}deg) translateY(-60px)`,
              }}
            />
          ))}

          {/* Rotating soil drill */}
          <div ref={drillRef} className="soil-drill relative z-10" />

          {/* Soil particles for explosion effect (6 particles) */}
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              ref={(el) => (particlesRef.current[index] = el)}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: '#84934A',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        {/* Typewriter Steps */}
        <div className="w-full max-w-2xl px-8 space-y-6">
          {/* Step 1 */}
          <div className="overflow-hidden">
            <div
              ref={step1Ref}
              className="font-mono text-[#FAF9F6] text-lg whitespace-nowrap overflow-hidden border-r-2 border-[#84934A]"
              style={{ fontFamily: 'Roboto Mono, monospace' }}
            >
              {PROCESSING_STEPS[0].tagalog}
              <span className="ml-2 text-[#84934A] text-sm">({PROCESSING_STEPS[0].english})</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="overflow-hidden">
            <div
              ref={step2Ref}
              className="font-mono text-[#FAF9F6] text-lg whitespace-nowrap overflow-hidden border-r-2 border-[#84934A]"
              style={{ fontFamily: 'Roboto Mono, monospace' }}
            >
              {PROCESSING_STEPS[1].tagalog}
              <span className="ml-2 text-[#84934A] text-sm">({PROCESSING_STEPS[1].english})</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="overflow-hidden">
            <div
              ref={step3Ref}
              className="font-mono text-[#FAF9F6] text-lg whitespace-nowrap overflow-hidden border-r-2 border-[#84934A]"
              style={{ fontFamily: 'Roboto Mono, monospace' }}
            >
              {PROCESSING_STEPS[2].tagalog}
              <span className="ml-2 text-[#84934A] text-sm">({PROCESSING_STEPS[2].english})</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="overflow-hidden">
            <div
              ref={step4Ref}
              className="font-mono text-[#FAF9F6] text-lg whitespace-nowrap overflow-hidden border-r-2 border-[#84934A]"
              style={{ fontFamily: 'Roboto Mono, monospace' }}
            >
              {PROCESSING_STEPS[3].tagalog}
              <span className="ml-2 text-[#84934A] text-sm">({PROCESSING_STEPS[3].english})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator at Bottom */}
      <div className="absolute bottom-12 left-0 right-0 px-12">
        <div className="w-full h-2 bg-[#3d2222] rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full rounded-full transition-all"
            style={{
              width: '0%',
              backgroundColor: '#84934A',
              boxShadow: '0 0 12px rgba(132, 147, 74, 0.6)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
