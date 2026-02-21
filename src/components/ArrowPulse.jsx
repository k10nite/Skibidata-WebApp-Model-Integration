/**
 * ArrowPulse Component
 *
 * Animated arrow showing nutrient level transitions (LOW → HIGH).
 * Features GSAP pulse and translate animations with color-coding.
 *
 * @param {string} from - Starting nutrient level: 'low', 'medium', 'high'
 * @param {string} to - Target nutrient level: 'low', 'medium', 'high'
 * @param {string} nutrient - Nutrient name (e.g., 'Nitrogen', 'Phosphorus')
 * @param {string} className - Additional CSS classes
 */

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ArrowPulse({
  from = 'low',
  to = 'high',
  nutrient = '',
  className = '',
  ...props
}) {
  const containerRef = useRef(null);
  const arrowRef = useRef(null);

  // Color mapping for nutrient levels
  const levelColors = {
    low: '#CD5C5C',      // Red terracotta
    medium: '#DAA520',   // Golden harvest
    high: '#84934A',     // Rice green
  };

  const fromColor = levelColors[from] || levelColors.low;
  const toColor = levelColors[to] || levelColors.high;

  useGSAP(() => {
    const arrow = arrowRef.current;
    if (!arrow) return;

    // Create pulse animation
    const pulseTl = gsap.timeline({ repeat: -1 });

    pulseTl
      .to(arrow, {
        scale: 1.2,
        duration: 0.6,
        ease: 'power2.out',
      })
      .to(arrow, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.in',
      });

    // Horizontal translate animation (left to right)
    gsap.to(arrow, {
      x: 10,
      duration: 0.8,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Color gradient animation
    gsap.to(arrow, {
      color: toColor,
      duration: 1.5,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
    });

    return () => {
      pulseTl.kill();
      gsap.killTweensOf(arrow);
    };
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className={`flex items-center gap-3 ${className}`}
      {...props}
    >
      {/* From Level */}
      <div className="flex flex-col items-center">
        <span
          className="text-xs font-semibold uppercase tracking-wider mb-1"
          style={{ color: fromColor }}
        >
          {from}
        </span>
        {nutrient && (
          <span className="text-[10px] text-[#492828] opacity-60">
            {nutrient}
          </span>
        )}
      </div>

      {/* Animated Arrow */}
      <div
        ref={arrowRef}
        className="text-3xl font-bold"
        style={{ color: fromColor }}
        aria-hidden="true"
      >
        →
      </div>

      {/* To Level */}
      <div className="flex flex-col items-center">
        <span
          className="text-xs font-semibold uppercase tracking-wider mb-1"
          style={{ color: toColor }}
        >
          {to}
        </span>
        {nutrient && (
          <span className="text-[10px] text-[#492828] opacity-60">
            Target
          </span>
        )}
      </div>
    </div>
  );
}
