// Screen 6: Fertilizer Recommendations - Premium Apple/Linear Aesthetic
// Bilingual (Filipino + English) with GSAP animations

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Droplets, 
  Flame, 
  Leaf, 
  Beaker,
  ChevronLeft,
  Download,
  ShoppingCart
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Premium Recommendation Card Component
const RecommendationCard = ({ 
  nutrient, 
  icon: Icon, 
  currentLevel, 
  currentColor, 
  currentEmoji,
  targetLevel, 
  targetColor,
  targetEmoji,
  recommended,
  purpose,
  dosage,
  delay,
  index
}) => {
  const cardRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const progress = progressRef.current;
    
    if (!card) return;

    // Initial state
    gsap.set(card, { opacity: 0, y: 40 });
    
    // Staggered entrance animation
    const tl = gsap.timeline({ delay: delay });
    
    tl.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out'
    });

    // Progress bar animation
    if (progress) {
      tl.fromTo(progress, 
        { width: '0%' },
        { width: '100%', duration: 1, ease: 'power2.out' },
        '-=0.4'
      );
    }

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -8,
        boxShadow: '0 20px 40px rgba(46, 125, 50, 0.15)',
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="premium-card group relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)',
        borderRadius: '24px',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        padding: '28px'
      }}
    >
      {/* Subtle gradient overlay on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.03) 0%, rgba(132, 147, 74, 0.05) 100%)'
        }}
      />

      {/* Card Content */}
      <div className="relative z-10">
        {/* Header with Icon and Nutrient Name */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${currentColor}20 0%, ${targetColor}20 100%)` }}
            >
              <Icon size={24} style={{ color: targetColor }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">{nutrient}</h3>
              <p className="text-sm text-gray-500">{nutrient === 'Nitrogen' ? 'Nitroheno' : 
                nutrient === 'Phosphorus' ? 'Posporo' :
                nutrient === 'Potassium' ? 'Potasyo' : 'pH Level'}</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div 
            className="px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ 
              background: `${currentColor}15`,
              color: currentColor
            }}
          >
            {currentEmoji} {currentLevel === 'Low' ? 'Mababa' : currentLevel === 'Medium' ? 'Katamtaman' : 'Mataas'}
          </div>
        </div>

        {/* Level Transition Indicator */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full"
                style={{ background: currentColor }}
              />
              <span className="text-sm font-medium text-gray-700">
                {currentLevel} {currentEmoji}
              </span>
              <span className="text-gray-400 text-sm">→</span>
              <span 
                className="w-3 h-3 rounded-full"
                style={{ background: targetColor }}
              />
              <span className="text-sm font-medium text-gray-900">
                {targetLevel} {targetEmoji}
              </span>
            </div>
          </div>
          
          {/* Visual Progress Bar */}
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{ background: `${currentColor}20` }}
          >
            <div
              ref={progressRef}
              className="h-full rounded-full transition-all duration-1000"
              style={{ 
                background: `linear-gradient(90deg, ${currentColor} 0%, ${targetColor} 100%)`,
                width: '0%'
              }}
            />
          </div>
        </div>

        {/* Recommended Fertilizer */}
        <div 
          className="p-4 rounded-xl mb-4"
          style={{ background: 'linear-gradient(135deg, #F8FAF8 0%, #F0F4F0 100%)' }}
        >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Inirerekomenda / Recommended
          </p>
          <p className="text-lg font-bold text-gray-900">{recommended}</p>
          <p className="text-sm text-gray-600 mt-1">{purpose}</p>
        </div>

        {/* Dosage Indicator */}
        {dosage && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-6 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center">
              <Beaker size={14} style={{ color: '#2E7D32' }} />
            </div>
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-[#2E7D32]">{dosage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Status Banner Component
const StatusBanner = ({ requiresAdjustment }) => {
  const bannerRef = useRef(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    gsap.fromTo(bannerRef.current,
      { opacity: 0, y: -20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.2 }
    );
  }, []);

  return (
    <div
      ref={bannerRef}
      className="rounded-2xl p-5 flex items-center gap-4"
      style={{
        background: requiresAdjustment 
          ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
          : 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
        border: `1px solid ${requiresAdjustment ? '#F59E0B' : '#10B981'}30`
      }}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: requiresAdjustment ? '#F59E0B20' : '#10B98120' }}
      >
        {requiresAdjustment ? (
          <AlertTriangle size={24} style={{ color: '#D97706' }} />
        ) : (
          <CheckCircle size={24} style={{ color: '#059669' }} />
        )}
      </div>
      <div>
        <p className="font-bold text-gray-900 text-lg">
          {requiresAdjustment
            ? '⚠ Soil requires adjustment'
            : '✔ Soil is suitable'}
        </p>
        <p className="text-gray-600 text-sm mt-0.5">
          {requiresAdjustment
            ? 'Follow the recommendations below for better harvest'
            : 'Your soil is in good condition for planting'}
        </p>
      </div>
    </div>
  );
};

// Main Component
export default function FertilizerRecommendations() {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const [requiresAdjustment] = useState(true);

  // Recommendation data
  const recommendations = [
    {
      nutrient: 'Nitrogen',
      icon: Droplets,
      currentLevel: 'Low',
      currentColor: '#EF4444',
      currentEmoji: '🔴',
      targetLevel: 'High',
      targetColor: '#10B981',
      targetEmoji: '🟢',
      recommended: 'Urea Fertilizer (46-0-0)',
      purpose: 'Increase nitrogen level for better leaf growth',
      dosage: '2-3 bags per hectare'
    },
    {
      nutrient: 'Phosphorus',
      icon: Flame,
      currentLevel: 'Medium',
      currentColor: '#F59E0B',
      currentEmoji: '🟡',
      targetLevel: 'High',
      targetColor: '#10B981',
      targetEmoji: '🟢',
      recommended: 'DAP Fertilizer (18-46-0)',
      purpose: 'Enhance root development and flowering',
      dosage: '1-2 bags per hectare'
    },
    {
      nutrient: 'Potassium',
      icon: Leaf,
      currentLevel: 'Low',
      currentColor: '#EF4444',
      currentEmoji: '🔴',
      targetLevel: 'High',
      targetColor: '#10B981',
      targetEmoji: '🟢',
      recommended: 'Muriate of Potash (0-0-60)',
      purpose: 'Improve overall plant health and disease resistance',
      dosage: '1-2 bags per hectare'
    },
    {
      nutrient: 'pH Level',
      icon: Beaker,
      currentLevel: 'Low',
      currentColor: '#F59E0B',
      currentEmoji: '🟡',
      targetLevel: 'Medium',
      targetColor: '#10B981',
      targetEmoji: '🟢',
      recommended: 'Agricultural Lime',
      purpose: 'Balance soil pH to optimal levels',
      dosage: '5-10 bags per hectare'
    }
  ];

  useEffect(() => {
    // Header animation
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }

    // Cleanup ScrollTrigger on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownloadReport = () => {
    console.log('Downloading report...');
  };

  const handleContinue = () => {
    navigate('/complete-screen');
  };

  return (
    <div 
      className="min-h-screen pb-24"
      style={{ background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)' }}
    >
      {/* Header Section */}
      <div
        ref={headerRef}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-xl hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
              <span className="font-medium">Back</span>
            </button>

            {/* Step Indicator */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2E7D32] to-[#84934A] flex items-center justify-center shadow-lg shadow-[#2E7D32]/20">
                <Beaker className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-[#84934A] uppercase hidden sm:inline">
                Step 4 of 4
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3"
            style={{ letterSpacing: '-0.02em' }}
          >
            Fertilizer Recommendations
          </h1>
          <p className="text-xl text-gray-500 font-medium">Based on your soil analysis</p>
          <div 
            className="w-24 h-1 mx-auto mt-6 rounded-full"
            style={{ background: 'linear-gradient(90deg, #2E7D32 0%, #84934A 100%)' }}
          />
        </div>

        {/* Status Banner */}
        <div className="mb-10">
          <StatusBanner requiresAdjustment={requiresAdjustment} />
        </div>

        {/* Recommendation Cards Grid */}
        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {recommendations.map((rec, index) => (
            <RecommendationCard
              key={rec.nutrient}
              {...rec}
              index={index}
              delay={0.3 + (index * 0.15)}
            />
          ))}
        </div>

        {/* Summary Section */}
        <div 
          className="rounded-3xl p-8 mb-8"
          style={{
            background: 'linear-gradient(135deg, #2E7D32 0%, #84934A 100%)',
            boxShadow: '0 20px 40px rgba(46, 125, 50, 0.3)'
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-white">
              <p className="text-green-100 text-sm font-medium mb-1">Total Estimate</p>
              <p className="text-4xl font-bold">₱8,435.00</p>
              <p className="text-green-100 text-sm mt-1">For 1 hectare</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => console.log('Add to cart')}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button
                onClick={handleContinue}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg"
              >
                Continue
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Recommendations based on soil analysis for{' '}
            <span className="font-semibold text-gray-700">La Trinidad, Benguet</span>
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Recommendations based on soil analysis
          </p>
        </div>
      </div>
    </div>
  );
}
