/**
 * ProgressBarAnimated Component
 *
 * Horizontal progress bar with GSAP ease-out animation and shimmer effect.
 * Used for NPK soil status gauges and nutrient level displays.
 *
 * @param {number} value - Progress value (0-100)
 * @param {string} color - Bar color (default: rice green #84934A)
 * @param {string} label - Optional label text
 * @param {string} unit - Optional unit to display with value
 * @param {string} className - Additional CSS classes
 */

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ProgressBarAnimated({
  value = 0,
  color = '#84934A',
  label = '',
  unit = '',
  className = '',
  ...props
}) {
  const fillRef = useRef(null);
  const shimmerRef = useRef(null);
  const containerRef = useRef(null);

  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  useGSAP(() => {
    const fill = fillRef.current;
    const shimmer = shimmerRef.current;

    if (!fill || !shimmer) return;

    // Animate progress bar fill
    gsap.fromTo(fill,
      {
        width: '0%',
      },
      {
        width: `${clampedValue}%`,
        duration: 1.5,
        ease: 'power2.out',
      }
    );

    // Shimmer effect animation
    gsap.fromTo(shimmer,
      {
        x: '-100%',
      },
      {
        x: '200%',
        duration: 2,
        ease: 'none',
        repeat: -1,
        repeatDelay: 0.5,
      }
    );

    return () => {
      gsap.killTweensOf([fill, shimmer]);
    };
  }, { dependencies: [clampedValue], scope: containerRef });

  return (
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      {...props}
    >
      {/* Label and Value */}
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-[#492828]">
            {label}
          </span>
          <span className="text-sm font-bold text-[#492828] font-mono">
            {clampedValue}{unit}
          </span>
        </div>
      )}

      {/* Progress Bar Track */}
      <div className="progress-bar relative w-full h-6 bg-[rgba(73,40,40,0.1)] rounded-[12px] overflow-hidden">
        {/* Progress Fill */}
        <div
          ref={fillRef}
          className="progress-fill absolute top-0 left-0 h-full rounded-[12px]"
          style={{ backgroundColor: color }}
        >
          {/* Shimmer Overlay */}
          <div
            ref={shimmerRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
