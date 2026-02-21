/**
 * ProcessingScreen - Screen 3: Loading/Processing Screen
 *
 * Premium Apple/Airbnb-inspired loading screen with bilingual (Filipino + English) support.
 * Features beautiful particle/wave loading animation, 4-step progress with GSAP stagger reveal,
 * animated icons per step, and smooth progress bar.
 *
 * COLORS: #2E7D32 (primary green), #84934A (rice green), #492828 (clay dark)
 * AUTO-ADVANCE: 3-5 seconds between steps
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Database,
  FlaskConical,
  Sprout,
  ClipboardCheck,
  CheckCircle2,
  Loader2
} from 'lucide-react';

// Processing steps with bilingual labels
const PROCESSING_STEPS = [
  {
    id: 1,
    filipino: 'Kumukuha ng data ng lupa...',
    english: 'Retrieving soil data...',
    icon: Database,
    color: '#2E7D32',
    duration: 1200
  },
  {
    id: 2,
    filipino: 'Sinusuri ang antas ng nutrients...',
    english: 'Analyzing nutrient levels...',
    icon: FlaskConical,
    color: '#84934A',
    duration: 1300
  },
  {
    id: 3,
    filipino: 'Tinitimbang ang pangangailangan ng halaman...',
    english: 'Matching plant requirements...',
    icon: Sprout,
    color: '#2E7D32',
    duration: 1400
  },
  {
    id: 4,
    filipino: 'Inihahanda ang mga rekomendasyon...',
    english: 'Preparing recommendations...',
    icon: ClipboardCheck,
    color: '#84934A',
    duration: 1200
  }
];

/**
 * WaveParticles Component - Beautiful wave/particle loading animation
 */
function WaveParticles({ isActive = true }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!isActive) return;
    
    const waves = containerRef.current.querySelectorAll('.wave-particle');
    
    gsap.to(waves, {
      y: -30,
      opacity: 0.8,
      duration: 1.2,
      ease: 'sine.inOut',
      stagger: {
        each: 0.15,
        repeat: -1,
        yoyo: true,
      },
    });

    return () => {
      gsap.killTweensOf(waves);
    };
  }, { scope: containerRef, dependencies: [isActive] });

  return (
    <div ref={containerRef} className="flex items-end justify-center gap-2 h-16">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="wave-particle w-2 rounded-full"
          style={{
            height: `${16 + i * 4}px`,
            backgroundColor: i % 2 === 0 ? '#2E7D32' : '#84934A',
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
}

/**
 * ProgressStep Component - Individual step with animated icon
 */
function ProgressStep({ step, index, currentStep, isCompleted, isActive }) {
  const stepRef = useRef(null);
  const Icon = step.icon;

  useGSAP(() => {
    if (!stepRef.current) return;

    if (isActive) {
      gsap.fromTo(
        stepRef.current,
        { scale: 0.95, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, { scope: stepRef, dependencies: [isActive] });

  return (
    <div
      ref={stepRef}
      className={`
        flex items-center gap-4 p-4 rounded-2xl transition-all duration-500
        ${isCompleted ? 'bg-emerald-50/80' : isActive ? 'bg-white shadow-lg scale-[1.02]' : 'bg-white/50'}
        ${isActive ? 'ring-2 ring-[#2E7D32]/20' : ''}
      `}
    >
      {/* Icon Container */}
      <div
        className={`
          relative w-12 h-12 rounded-xl flex items-center justify-center
          transition-all duration-500
          ${isCompleted ? 'bg-[#2E7D32]' : isActive ? 'bg-[#2E7D32]' : 'bg-gray-200'}
        `}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-6 h-6 text-white" />
        ) : isActive ? (
          <>
            <Icon className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#DAA520] rounded-full animate-ping" />
          </>
        ) : (
          <Icon className="w-6 h-6 text-gray-400" />
        )}
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`
            text-sm font-medium transition-colors duration-300
            ${isCompleted || isActive ? 'text-[#492828]' : 'text-gray-400'}
          `}
        >
          {step.english}
        </p>
      </div>

      {/* Status Indicator */}
      <div className="flex-shrink-0">
        {isCompleted ? (
          <span className="text-[#2E7D32] text-lg">✓</span>
        ) : isActive ? (
          <Loader2 className="w-5 h-5 text-[#2E7D32] animate-spin" />
        ) : (
          <span className="text-gray-300 text-lg">○</span>
        )}
      </div>
    </div>
  );
}

/**
 * Main ProcessingScreen Component
 */
export default function ProcessingScreen({ onComplete }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const progressBarRef = useRef(null);
  const titleRef = useRef(null);
  const stepsContainerRef = useRef(null);

  // Title animation on mount
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );

    return () => tl.kill();
  }, { scope: titleRef });

  // Stagger reveal steps on mount
  useGSAP(() => {
    const steps = stepsContainerRef.current?.querySelectorAll('.step-item');
    if (!steps) return;

    gsap.fromTo(
      steps,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3,
      }
    );
  }, { scope: stepsContainerRef });

  // Progress bar animation
  useGSAP(() => {
    if (!progressBarRef.current) return;

    gsap.to(progressBarRef.current, {
      width: `${progress}%`,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, [progress]);

  // Auto-advance through steps
  useEffect(() => {
    if (isComplete) return;

    if (currentStep < PROCESSING_STEPS.length) {
      const currentStepData = PROCESSING_STEPS[currentStep];
      
      // Update progress based on current step
      const stepProgress = ((currentStep + 1) / PROCESSING_STEPS.length) * 100;
      setProgress(stepProgress);

      // Advance to next step after duration
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, currentStepData.duration);

      return () => clearTimeout(timer);
    } else {
      // All steps complete
      setProgress(100);
      setIsComplete(true);
      
      // Trigger onComplete callback after a short delay
      const completeTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 800);

      return () => clearTimeout(completeTimer);
    }
  }, [currentStep, isComplete, onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] via-white to-[#E8F5E9] flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${30 + i * 10}px`,
              height: `${30 + i * 10}px`,
              backgroundColor: i % 2 === 0 ? '#2E7D32' : '#84934A',
              left: `${10 + (i * 8) % 80}%`,
              top: `${20 + (i * 12) % 60}%`,
              animation: `float ${6 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content Card */}
      <div className="relative w-full max-w-lg">
        {/* Glass Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(46,125,50,0.15)] border border-white/50 overflow-hidden">
          
          {/* Header Section */}
          <div className="pt-8 pb-6 px-8 text-center">
            {/* Wave Animation */}
            <div className="mb-6">
              <WaveParticles isActive={!isComplete} />
            </div>

            {/* Title */}
            <div ref={titleRef}>
              <h1 className="text-2xl md:text-3xl font-bold text-[#492828] tracking-tight mb-2">
                Processing Your Selection
              </h1>
              <p className="text-[#84934A] font-medium">
                Analyzing crop and soil compatibility...
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-8 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-500">
                {isComplete ? 'Complete!' : 'Processing...'}
              </span>
              <span className="text-xs font-bold text-[#2E7D32] font-mono">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full rounded-full bg-gradient-to-r from-[#2E7D32] to-[#84934A]"
                style={{ width: '0%' }}
              >
                {/* Shimmer Effect */}
                <div
                  className="h-full w-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    animation: 'shimmer 2s infinite',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Processing Steps */}
          <div ref={stepsContainerRef} className="px-6 pb-8 space-y-3">
            {PROCESSING_STEPS.map((step, index) => (
              <div key={step.id} className="step-item">
                <ProgressStep
                  step={step}
                  index={index}
                  currentStep={currentStep}
                  isCompleted={index < currentStep}
                  isActive={index === currentStep && !isComplete}
                />
              </div>
            ))}
          </div>

          {/* Success State */}
          {isComplete && (
            <div className="px-6 pb-8 space-y-4">
              <div
                className="bg-gradient-to-r from-[#2E7D32] to-[#84934A] rounded-2xl p-6 text-center text-white"
                style={{
                  animation: 'slideUp 0.5s ease-out',
                }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1">Analysis Complete!</h3>
                <p className="text-white/80 text-sm">Ready to view your results</p>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => onComplete ? onComplete() : navigate('/soil-status-screen')}
                className="w-full bg-[#492828] hover:bg-[#3d2222] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>View Soil Status</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Info */}
        <p className="text-center text-gray-400 text-xs mt-6">
          FertilizerAI • CAR Region Optimized
        </p>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
