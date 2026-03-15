import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Leaf, ChevronLeft } from 'lucide-react';
import { useRef } from 'react';

/**
 * Premium Header Component
 * Bilingual header with back button and progress indicator
 * Used across all screens for consistent navigation
 */
export default function Header({ 
  title, 
  subtitle, 
  showBack = false, 
  onBack,
  progress = null,
  progressLabel = null
}) {
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const progressRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    tl.fromTo(headerRef.current, 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5 }
    )
    .fromTo(titleRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.2'
    );

    if (progressRef.current) {
      gsap.fromTo(progressRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: 'power2.out', delay: 0.3 }
      );
    }
  }, { scope: headerRef });

  return (
    <header 
      ref={headerRef}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-4"
    >
      <div className="flex items-center gap-3">
        {/* Back Button */}
        {showBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all duration-200"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-agri-forest" />
          </button>
        )}

        {/* Logo/Icon (when no back button) */}
        {!showBack && (
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-agri-forest to-agri-rice">
            <Leaf className="w-5 h-5 text-white" />
          </div>
        )}

        {/* Title Section */}
        <div ref={titleRef} className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-lg text-gray-900 leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 leading-tight truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Progress Badge */}
        {progress !== null && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-agri-forest bg-agri-forest/10 px-2.5 py-1 rounded-full">
              {progressLabel || `${progress}/7`}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {progress !== null && (
        <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            ref={progressRef}
            className="h-full bg-gradient-to-r from-agri-forest to-agri-rice rounded-full origin-left"
            style={{ width: `${(progress / 7) * 100}%` }}
          />
        </div>
      )}
    </header>
  );
}
