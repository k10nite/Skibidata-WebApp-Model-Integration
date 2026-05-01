/**
 * DrillSpinner Component
 *
 * Rotating soil drill loading spinner with pulsing dots in sequence.
 * Used in processing screens for soil analysis visualization.
 *
 * @param {number} size - Spinner size in pixels (default: 80)
 * @param {number} speed - Rotation speed multiplier (default: 1)
 * @param {string} className - Additional CSS classes
 */

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function DrillSpinner({
  size = 80,
  speed = 1,
  className = '',
  ...props
}) {
  const containerRef = useRef(null);
  const drillRef = useRef(null);
  const dotsRef = useRef([]);

  useGSAP(() => {
    const drill = drillRef.current;
    const dots = dotsRef.current.filter(Boolean);

    if (!drill) return;

    // Drill rotation animation
    gsap.to(drill, {
      rotation: 360,
      duration: 1.2 / speed,
      ease: 'none',
      repeat: -1,
    });

    // Pulsing dots in sequence
    if (dots.length > 0) {
      dots.forEach((dot, index) => {
        gsap.to(dot, {
          scale: 1.5,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          repeat: -1,
          repeatDelay: 0.8,
          delay: index * 0.2,
          yoyo: true,
        });
      });
    }

    return () => {
      gsap.killTweensOf([drill, ...dots]);
    };
  }, { scope: containerRef });

  // Calculate dot positions in a circle
  const dotCount = 8;
  const dotPositions = Array.from({ length: dotCount }).map((_, i) => {
    const angle = (i / dotCount) * Math.PI * 2 - Math.PI / 2;
    const radius = size / 2 - 8;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      {/* Main drill circle */}
      <div
        ref={drillRef}
        className="soil-drill absolute"
        style={{
          width: size,
          height: size,
          border: `${size / 10}px solid rgba(132, 147, 74, 0.2)`,
          borderTopColor: '#84934A',
          borderRadius: '50%',
        }}
      />

      {/* Center icon */}
      <div className="absolute text-[#84934A] font-bold" style={{ fontSize: size / 4 }}>
        ◉
      </div>

      {/* Pulsing dots around the drill */}
      {dotPositions.map((pos, i) => (
        <div
          key={i}
          ref={(el) => (dotsRef.current[i] = el)}
          className="absolute w-2 h-2 bg-[#84934A] rounded-full"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
            opacity: 0.5,
          }}
        />
      ))}

      {/* Loading text */}
      <div
        className="absolute font-mono text-xs text-[#492828] opacity-60"
        style={{ top: size + 12 }}
      >
        Analyzing soil...
      </div>
    </div>
  );
}
