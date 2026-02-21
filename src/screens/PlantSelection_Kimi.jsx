/**
 * PlantSelection Screen
 *
 * A stunning crop selection screen for AgriCapture - Filipino Farm App.
 * Features 20+ crops organized by category with premium design,
 * GSAP animations, and Tailwind CSS styling.
 *
 * Design System:
 * - Colors: Rice Green (#84934A), Clay Dark (#492828), Golden Harvest (#DAA520)
 * - Typography: Inter font family with tight tracking
 * - Animations: GSAP stagger reveals, hover effects, selection transitions
 */

import { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Search,
  Leaf,
  Wheat,
  Carrot,
  Apple,
  Cherry,
  Check,
  ArrowRight,
  Sprout,
  Filter,
  X,
  ChevronRight
} from 'lucide-react';

// ============================================
// CROP DATA - 20+ Filipino Crops by Category
// ============================================
const CROP_CATEGORIES = [
  { id: 'all', name: 'Lahat', nameEn: 'All', icon: Filter },
  { id: 'grains', name: 'Palay at Mais', nameEn: 'Rice & Corn', icon: Wheat },
  { id: 'vegetables', name: 'Gulay', nameEn: 'Vegetables', icon: Carrot },
  { id: 'fruits', name: 'Prutas', nameEn: 'Fruits', icon: Apple },
  { id: 'highvalue', name: 'High Value', nameEn: 'High Value Crops', icon: Cherry },
  { id: 'rootcrops', name: 'Root Crops', nameEn: 'Root Crops', icon: Sprout },
];

const CROPS_DATA = [
  // Rice & Grains
  { id: 'rice', name: 'Palay', nameEn: 'Rice', category: 'grains', icon: '🌾', color: '#84A946', season: 'Rainy Season', duration: '3-4 months' },
  { id: 'corn', name: 'Mais', nameEn: 'Corn', category: 'grains', icon: '🌽', color: '#F4D03F', season: 'Dry Season', duration: '2-3 months' },
  { id: 'sorghum', name: 'Sorghum', nameEn: 'Sorghum', category: 'grains', icon: '🌾', color: '#D4A574', season: 'Dry Season', duration: '3-4 months' },

  // Vegetables
  { id: 'tomato', name: 'Kamatis', nameEn: 'Tomato', category: 'vegetables', icon: '🍅', color: '#E74C3C', season: 'Dry Season', duration: '2-3 months' },
  { id: 'eggplant', name: 'Talong', nameEn: 'Eggplant', category: 'vegetables', icon: '🍆', color: '#8E44AD', season: 'Year-round', duration: '3-4 months' },
  { id: 'okra', name: 'Okra', nameEn: 'Okra', category: 'vegetables', icon: '🥬', color: '#27AE60', season: 'Dry Season', duration: '2-3 months' },
  { id: 'ampalaya', name: 'Ampalaya', nameEn: 'Bitter Gourd', category: 'vegetables', icon: '🥒', color: '#2ECC71', season: 'Rainy Season', duration: '3-4 months' },
  { id: 'squash', name: 'Kalabasa', nameEn: 'Squash', category: 'vegetables', icon: '🎃', color: '#E67E22', season: 'Dry Season', duration: '3-4 months' },
  { id: 'pechay', name: 'Pechay', nameEn: 'Peck Choi', category: 'vegetables', icon: '🥬', color: '#16A085', season: 'Year-round', duration: '1-2 months' },
  { id: 'sitaw', name: 'Sitaw', nameEn: 'String Beans', category: 'vegetables', icon: '🫘', color: '#52BE80', season: 'Rainy Season', duration: '2-3 months' },
  { id: 'pepper', name: 'Sili', nameEn: 'Chili Pepper', category: 'vegetables', icon: '🌶️', color: '#C0392B', season: 'Dry Season', duration: '3-4 months' },

  // Fruits
  { id: 'banana', name: 'Saging', nameEn: 'Banana', category: 'fruits', icon: '🍌', color: '#F1C40F', season: 'Year-round', duration: '9-12 months' },
  { id: 'mango', name: 'Mangga', nameEn: 'Mango', category: 'fruits', icon: '🥭', color: '#F39C12', season: 'Dry Season', duration: '3-5 years' },
  { id: 'papaya', name: 'Papaya', nameEn: 'Papaya', category: 'fruits', icon: '🫐', color: '#E74C3C', season: 'Year-round', duration: '6-9 months' },
  { id: 'pineapple', name: 'Pinya', nameEn: 'Pineapple', category: 'fruits', icon: '🍍', color: '#F1C40F', season: 'Dry Season', duration: '12-18 months' },
  { id: 'coconut', name: 'Niyog', nameEn: 'Coconut', category: 'fruits', icon: '🥥', color: '#D7CCC8', season: 'Year-round', duration: '3-5 years' },

  // High Value Crops
  { id: 'coffee', name: 'Kape', nameEn: 'Coffee', category: 'highvalue', icon: '☕', color: '#6D4C41', season: 'Rainy Season', duration: '2-3 years' },
  { id: 'cacao', name: 'Kakaw', nameEn: 'Cacao', category: 'highvalue', icon: '🍫', color: '#5D4037', season: 'Year-round', duration: '2-3 years' },
  { id: 'vanilla', name: 'Vanilla', nameEn: 'Vanilla', category: 'highvalue', icon: '🌿', color: '#D7CCC8', season: 'Dry Season', duration: '2-3 years' },

  // Root Crops
  { id: 'cassava', name: 'Kamoteng Kahoy', nameEn: 'Cassava', category: 'rootcrops', icon: '🍠', color: '#D7CCC8', season: 'Year-round', duration: '8-12 months' },
  { id: 'sweetpotato', name: 'Kamote', nameEn: 'Sweet Potato', category: 'rootcrops', icon: '🍠', color: '#E67E22', season: 'Year-round', duration: '3-4 months' },
  { id: 'ginger', name: 'Luya', nameEn: 'Ginger', category: 'rootcrops', icon: '🫚', color: '#F5DEB3', season: 'Rainy Season', duration: '8-10 months' },
  { id: 'taro', name: 'Gabi', nameEn: 'Taro', category: 'rootcrops', icon: '🥔', color: '#8D6E63', season: 'Rainy Season', duration: '6-9 months' },
  { id: 'carrot', name: 'Karot', nameEn: 'Carrot', category: 'rootcrops', icon: '🥕', color: '#E67E22', season: 'Dry Season', duration: '2-3 months' },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function PlantSelection({ onSelect, onBack }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const categoriesRef = useRef(null);
  const cropsGridRef = useRef(null);
  const floatingButtonRef = useRef(null);

  // Filter crops based on category and search
  const filteredCrops = useMemo(() => {
    return CROPS_DATA.filter(crop => {
      const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
      const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           crop.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Header entrance animation
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Categories stagger animation
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const categories = categoriesRef.current?.querySelectorAll('.category-chip');
      if (!categories) return;

      gsap.fromTo(categories,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(1.7)',
          delay: 0.3
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Crops grid animation
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const cards = cropsGridRef.current?.querySelectorAll('.crop-card');
      if (!cards) return;

      gsap.fromTo(cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out'
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [filteredCrops, selectedCategory]);

  // Floating button animation
  useGSAP(() => {
    const ctx = gsap.context(() => {
      if (selectedCrop) {
        gsap.fromTo(floatingButtonRef.current,
          { opacity: 0, y: 50, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
      } else {
        gsap.to(floatingButtonRef.current,
          { opacity: 0, y: 50, duration: 0.3, ease: 'power2.in' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [selectedCrop]);

  // Handle crop selection with animation
  const handleCropSelect = (crop, cardElement) => {
    // Animate the selected card
    if (cardElement) {
      gsap.to(cardElement, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          setSelectedCrop(crop.id === selectedCrop?.id ? null : crop);
        }
      });
    } else {
      setSelectedCrop(crop.id === selectedCrop?.id ? null : crop);
    }
  };

  // Handle continue button
  const handleContinue = () => {
    if (selectedCrop) {
      gsap.to(floatingButtonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          if (onSelect) {
            onSelect(selectedCrop);
          } else {
            // Navigate to processing screen
            navigate('/processing-screen', { state: { crop: selectedCrop } });
          }
        }
      });
    }
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    // Animate out current crops
    const cards = cropsGridRef.current?.querySelectorAll('.crop-card');
    if (cards) {
      gsap.to(cards, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        stagger: 0.03,
        ease: 'power2.in',
        onComplete: () => setSelectedCategory(categoryId)
      });
    } else {
      setSelectedCategory(categoryId);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-[#FAF9F6] to-[#F5F3EF]"
    >
      {/* Header Section */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center py-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#492828] tracking-tight mb-1">
              Select Your Crop
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Choose what you want to plant
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* Hero Section */}
        <div className="py-8 sm:py-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#84934A]/10 rounded-full text-[#84934A] text-sm font-medium mb-4">
            <Sprout className="w-4 h-4" />
            <span>20+ Crop Varieties</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#492828] tracking-tight mb-4">
            What would you like to <span className="text-[#84934A]">plant</span>?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Select a crop for personalized fertilizer recommendations
            tailored to your farm.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div
            className={`
              relative flex items-center bg-white rounded-2xl shadow-sm border-2 transition-all duration-300
              ${isSearchFocused ? 'border-[#84934A] shadow-lg shadow-[#84934A]/10' : 'border-gray-200'}
            `}
          >
            <Search className="w-5 h-5 text-gray-400 ml-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search for crops..."
              className="flex-1 py-4 px-3 bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-2 mr-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Category Chips */}
        <div
          ref={categoriesRef}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12"
        >
          {CROP_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`
                  category-chip flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full
                  font-medium text-sm sm:text-base transition-all duration-300
                  ${isActive
                    ? 'bg-[#492828] text-white shadow-lg shadow-[#492828]/25 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{category.nameEn}</span>
              </button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-[#492828]">{filteredCrops.length}</span>
            {' '}crops found
          </p>
          {selectedCrop && (
            <div className="flex items-center gap-2 text-[#84934A] font-medium">
              <Check className="w-4 h-4" />
              <span>{selectedCrop.name} napili</span>
            </div>
          )}
        </div>

        {/* Crops Grid */}
        <div
          ref={cropsGridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
        >
          {filteredCrops.map((crop) => {
            const isSelected = selectedCrop?.id === crop.id;

            return (
              <CropCard
                key={crop.id}
                crop={crop}
                isSelected={isSelected}
                onSelect={(e) => handleCropSelect(crop, e.currentTarget)}
              />
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCrops.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No crops found
            </h3>
            <p className="text-gray-500">
              Try searching with different keywords
            </p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div
        ref={floatingButtonRef}
        className="fixed bottom-6 left-0 right-0 px-4 z-50 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div className="max-w-md mx-auto">
          <button
            onClick={handleContinue}
            className="
              w-full pointer-events-auto
              flex items-center justify-center gap-3
              bg-[#492828] hover:bg-[#3d2222] text-white
              py-4 px-8 rounded-2xl
              font-semibold text-lg
              shadow-2xl shadow-[#492828]/30
              transform transition-all duration-200
              hover:scale-[1.02] active:scale-[0.98]
            "
          >
            <span>Continue with {selectedCrop?.nameEn || selectedCrop?.name}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Selected Crop Details Modal (Inline) */}
      {selectedCrop && (
        <CropDetailsBar
          crop={selectedCrop}
          onClose={() => setSelectedCrop(null)}
        />
      )}
    </div>
  );
}

// ============================================
// CROP CARD COMPONENT
// ============================================
function CropCard({ crop, isSelected, onSelect }) {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);

  useGSAP(() => {
    const card = cardRef.current;
    const overlay = overlayRef.current;
    if (!card || !overlay) return;

    // Initial state
    gsap.set(overlay, { x: '-100%' });

    const handleMouseEnter = () => {
      gsap.to(overlay, { x: '100%', duration: 0.5, ease: 'power2.inOut' });
      gsap.to(card, { y: -4, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.set(overlay, { x: '-100%' });
      gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onSelect}
      className={`
        crop-card relative overflow-hidden cursor-pointer
        rounded-2xl sm:rounded-3xl p-4 sm:p-6
        transition-all duration-300
        ${isSelected
          ? 'bg-[#84934A] text-white shadow-xl shadow-[#84934A]/30 ring-2 ring-[#84934A] ring-offset-2'
          : 'bg-white hover:shadow-lg border border-gray-100 hover:border-gray-200'
        }
      `}
    >
      {/* Hover Overlay Effect */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${crop.color}, transparent)`,
        }}
      />

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-[#84934A]" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className={`
            w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-4
            ${isSelected ? 'bg-white/20' : 'bg-gray-50'}
          `}
          style={{ backgroundColor: isSelected ? undefined : `${crop.color}15` }}
        >
          {crop.icon}
        </div>

        {/* Names */}
        <h3 className={`
          font-bold text-base sm:text-lg mb-3
          ${isSelected ? 'text-white' : 'text-[#492828]'}
        `}>
          {crop.nameEn}
        </h3>

        {/* Season Badge */}
        <div className={`
          inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-full text-xs font-medium
          ${isSelected
            ? 'bg-white/20 text-white'
            : 'bg-gray-100 text-gray-600'
          }
        `}>
          <Leaf className="w-3 h-3" />
          <span className="hidden sm:inline">{crop.season}</span>
          <span className="sm:hidden">{crop.duration}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CROP DETAILS BAR COMPONENT
// ============================================
function CropDetailsBar({ crop, onClose }) {
  const barRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(barRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${crop.color}20` }}
            >
              {crop.icon}
            </div>
            <div>
              <h4 className="font-bold text-[#492828] text-lg">{crop.nameEn}</h4>
              <p className="text-gray-500 text-sm">{crop.season} • {crop.duration}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm text-gray-500">Growing Duration</p>
              <p className="font-semibold text-[#492828]">{crop.duration}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
