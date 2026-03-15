/**
 * Screen 7: CompleteScreen - Premium Success Celebration
 * Apple-inspired success state with confetti animation and bilingual support
 * Colors: #2E7D32 (green), #84934A (rice green), white
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  RefreshCw, 
  Sprout, 
  FileText, 
  Share2, 
  Check,
  MapPin,
  Calendar,
  Leaf,
  Download,
  X
} from 'lucide-react';
import useAppStore from '../store/appStore';

// Confetti Particle Component
function ConfettiParticles({ count = 60 }) {
  const containerRef = useRef(null);
  const colors = ['#2E7D32', '#84934A', '#4CAF50', '#81C784', '#FFD700', '#FFC107', '#FFFFFF'];

  useGSAP(() => {
    const particles = containerRef.current.querySelectorAll('.confetti-particle');
    
    particles.forEach((particle, i) => {
      const angle = (i / count) * Math.PI * 2;
      const velocity = gsap.utils.random(200, 600);
      const rotationSpeed = gsap.utils.random(-360, 360);
      
      gsap.set(particle, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        scale: gsap.utils.random(0.5, 1.5),
        opacity: 1,
      });

      gsap.to(particle, {
        x: window.innerWidth / 2 + Math.cos(angle) * velocity,
        y: window.innerHeight / 2 + Math.sin(angle) * velocity + gsap.utils.random(100, 300),
        rotation: rotationSpeed,
        opacity: 0,
        duration: gsap.utils.random(2, 4),
        ease: 'power2.out',
        delay: gsap.utils.random(0, 0.5),
      });

      // Gravity effect
      gsap.to(particle, {
        y: '+=300',
        duration: 2,
        ease: 'power2.in',
        delay: gsap.utils.random(1, 2),
      });
    });

    return () => {
      gsap.killTweensOf(particles);
    };
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="confetti-particle absolute w-3 h-3"
          style={{
            backgroundColor: colors[i % colors.length],
            borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '0%' : '30%',
          }}
        />
      ))}
    </div>
  );
}

// Success Checkmark with Bounce Animation
function SuccessCheckmark() {
  const checkRef = useRef(null);
  const circleRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Circle scale animation
    tl.fromTo(
      circleRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
    );

    // Checkmark draw animation
    tl.fromTo(
      checkRef.current,
      { strokeDashoffset: 100 },
      { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    );

    // Subtle pulse
    tl.to(circleRef.current, {
      scale: 1.05,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <div
        ref={circleRef}
        className="w-28 h-28 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 50%, #84934A 100%)',
          boxShadow: '0 10px 40px rgba(46, 125, 50, 0.4)',
        }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            ref={checkRef}
            d="M5 13l4 4L19 7"
            strokeDasharray="100"
            strokeDashoffset="100"
          />
        </svg>
      </div>
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-50 -z-10"
        style={{ background: 'radial-gradient(circle, #4CAF50 0%, transparent 70%)' }}
      />
    </div>
  );
}

// Premium Action Button
function ActionButton({ icon: Icon, label, sublabel, onClick, delay = 0, variant = 'primary' }) {
  const buttonRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay, ease: 'power3.out' }
    );
  }, []);

  const variants = {
    primary: 'bg-white hover:bg-gray-50 border-gray-200',
    success: 'bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white border-transparent hover:shadow-lg',
    outline: 'bg-transparent border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white',
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 group ${variants[variant]}`}
      style={{ boxShadow: variant === 'primary' ? '0 4px 15px rgba(0,0,0,0.08)' : 'none' }}
    >
      <div className={`p-3 rounded-xl ${variant === 'success' ? 'bg-white/20' : 'bg-[#E8F5E9] group-hover:bg-[#C8E6C9]'} transition-colors`}>
        <Icon 
          size={24} 
          className={variant === 'success' ? 'text-white' : 'text-[#2E7D32]'} 
        />
      </div>
      <div className="flex-1 text-left">
        <div className={`font-semibold ${variant === 'success' ? 'text-white' : 'text-gray-900'}`}>
          {label}
        </div>
        <div className={`text-sm ${variant === 'success' ? 'text-white/80' : 'text-gray-500'}`}>
          {sublabel}
        </div>
      </div>
      <div className={`transform group-hover:translate-x-1 transition-transform ${variant === 'success' ? 'text-white' : 'text-gray-400'}`}>
        →
      </div>
    </button>
  );
}

// Summary Card Item
function SummaryItem({ icon: Icon, label, value, subvalue, delay = 0 }) {
  const itemRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      itemRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, delay: delay + 0.5, ease: 'power2.out' }
    );
  }, []);

  return (
    <div ref={itemRef} className="flex items-center gap-4 p-4 rounded-xl bg-[#F1F8E9] hover:bg-[#E8F5E9] transition-colors">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2E7D32] to-[#84934A] flex items-center justify-center shadow-md">
        <Icon size={24} className="text-white" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-semibold text-gray-900">{value}</div>
        {subvalue && <div className="text-xs text-[#84934A] mt-0.5">{subvalue}</div>}
      </div>
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
        <Check size={16} className="text-[#2E7D32]" />
      </div>
    </div>
  );
}

// Share Modal
function ShareModal({ isOpen, onClose, onShare }) {
  const modalRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { name: 'Messenger', icon: '💬', color: '#0084FF' },
    { name: 'SMS', icon: '💬', color: '#34B7F1' },
    { name: 'Copy Link', icon: '🔗', color: '#6B7280' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div ref={modalRef} className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Share</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-3">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.name === 'Copy Link' ? handleCopy : onShare}
              className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-[#2E7D32] hover:bg-[#F1F8E9] transition-all flex items-center gap-3"
            >
              <span className="text-2xl">{option.icon}</span>
              <span className="font-medium text-gray-900">
                {option.name === 'Copy Link' && copied ? 'Copied!' : option.name}
              </span>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Share your results with other farmers
        </p>
      </div>
    </div>
  );
}

// Main CompleteScreen Component
export default function CompleteScreen() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardRef = useRef(null);

  const {
    selectedPlant,
    municipality,
    recommendations,
    recommendationSummary,
    soilData,
    resetApp,
  } = useAppStore();

  // Format current date/time in English
  const currentDate = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Entry animations
  useGSAP(() => {
    const tl = gsap.timeline();

    // Title animation
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
    );

    // Subtitle animation
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    );

    // Card animation
    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' },
      '-=0.3'
    );

    return () => {
      tl.kill();
    };
  }, []);

  // Hide confetti after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Exit animation handler
  const handleNavigation = (path, shouldReset = false) => {
    setIsExiting(true);
    
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        if (shouldReset) resetApp();
        navigate(path);
      },
    });
  };

  const handleDownloadReport = () => {
    const summary = generateTextSummary();
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fertilizer-report-${selectedPlant?.name || 'analysis'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateTextSummary = () => {
    return `
================================================================================
FERTILIZER RECOMMENDATION REPORT
================================================================================
Date: ${currentDate}
Location: ${municipality || 'CAR Region'}
Plant: ${selectedPlant?.name || 'Not specified'} (${selectedPlant?.scientificName || ''})

SOIL STATUS
--------------------------------------------------------------------------------
Nitrogen (N):        ${soilData?.nitrogen || 'N/A'}
Phosphorus (P):      ${soilData?.phosphorus || 'N/A'}
Potassium (K):       ${soilData?.potassium || 'N/A'}
Soil pH:             ${soilData?.pH || 'N/A'}

RECOMMENDATIONS SUMMARY
--------------------------------------------------------------------------------
Total Products:      ${recommendationSummary?.totalProducts || 0}
High Priority:       ${recommendationSummary?.highPriority || 0}
Medium Priority:     ${recommendationSummary?.mediumPriority || 0}
Estimated Cost:      ₱${(recommendationSummary?.estimatedCost || 0).toLocaleString()} (1 hectare)

FERTILIZER PRODUCTS
--------------------------------------------------------------------------------
${recommendations?.map((rec, i) => `
${i + 1}. ${rec.fertilizer.name} (${rec.fertilizer.formula})
   Priority: ${rec.priority}
   Nutrient: ${rec.nutrient}
   Reason: ${rec.reason}
   Application: ${rec.fertilizer.applicationRate}
`).join('\n') || 'No fertilizer needed - soil is in perfect condition!'}

================================================================================
Created by LupAI - Powered by Sentinel-2 Satellite & AI
For CAR Highland Farmers
================================================================================
    `.trim();
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 30%, #FFFFFF 100%)',
      }}
    >
      {/* Confetti Animation */}
      {showConfetti && <ConfettiParticles count={60} />}

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #4CAF50 0%, transparent 70%)' }}
        />
        <div 
          className="absolute top-1/2 -left-20 w-60 h-60 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #84934A 0%, transparent 70%)' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg">
          
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <SuccessCheckmark />
          </div>

          {/* Title - Bilingual */}
          <div ref={titleRef} className="text-center mb-3">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ 
                color: '#2E7D32',
                textShadow: '0 2px 10px rgba(46, 125, 50, 0.2)',
                letterSpacing: '-0.02em'
              }}
            >
              Complete!
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
              Analysis Finished
            </h2>
          </div>

          {/* Subtitle */}
          <p 
            ref={subtitleRef}
            className="text-center text-gray-600 text-lg mb-10"
          >
            <span className="block">Your fertilizer recommendation is ready</span>
            <span className="text-gray-500">Download or share your results below</span>
          </p>

          {/* Summary Card */}
          <div 
            ref={cardRef}
            className="bg-white rounded-3xl p-6 mb-8 shadow-xl"
            style={{ boxShadow: '0 20px 60px rgba(46, 125, 50, 0.15)' }}
          >
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E7D32] to-[#84934A] flex items-center justify-center">
                <Leaf size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Analysis Summary</h3>
                <p className="text-sm text-gray-500">Results overview</p>
              </div>
              <div className="ml-auto">
                <span className="badge-premium badge-success">Success</span>
              </div>
            </div>

            {/* Summary Items */}
            <div className="space-y-3 mb-6">
              <SummaryItem
                icon={Sprout}
                label="Plant"
                value={selectedPlant?.name || 'Rice'}
                subvalue={selectedPlant?.scientificName || 'Oryza sativa'}
                delay={0}
              />
              <SummaryItem
                icon={MapPin}
                label="Location"
                value={municipality || 'La Trinidad, Benguet'}
                subvalue="CAR Region"
                delay={0.1}
              />
              <SummaryItem
                icon={FileText}
                label="Recommendations"
                value={`${recommendationSummary?.totalProducts || 3} Products Ready`}
                subvalue={`Est. Cost: ₱${(recommendationSummary?.estimatedCost || 5000).toLocaleString()}`}
                delay={0.2}
              />
            </div>

            {/* Date/Time Stamp */}
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
              <Calendar size={16} className="text-[#84934A]" />
              <span>{currentDate}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <ActionButton
              icon={RefreshCw}
              label="Analyze Another Location"
              sublabel="Start new analysis"
              onClick={() => handleNavigation('/location-selection', true)}
              delay={0.8}
              variant="primary"
            />
            
            <ActionButton
              icon={Sprout}
              label="Change Plant"
              sublabel="Select different crop"
              onClick={() => handleNavigation('/plant-selection-kimi')}
              delay={0.9}
              variant="primary"
            />
            
            <ActionButton
              icon={Download}
              label="Export Results"
              sublabel="Download as text file"
              onClick={handleDownloadReport}
              delay={1.0}
              variant="success"
            />
          </div>

          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full mt-6 flex items-center justify-center gap-2 text-[#2E7D32] hover:text-[#1B5E20] transition-colors group"
          >
            <Share2 size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Share Results</span>
          </button>

          {/* Footer Branding */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
              <span className="text-sm text-gray-600">
                Powered by <span className="font-semibold text-[#2E7D32]">SkibiDATA</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Sentinel-2 Satellite & AI Technology
            </p>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={() => {
          // Handle share action
          setShowShareModal(false);
        }}
      />
    </div>
  );
}
