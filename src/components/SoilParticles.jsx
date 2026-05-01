/**
 * SoilParticles Component
 *
 * Generates falling soil grain particles with GSAP stagger animation.
 * Used across multiple screens for transitions to reinforce the "Earthy Farm Tech" aesthetic.
 *
 * @param {number} count - Number of particles to generate (default: 25)
 * @param {number} duration - Duration of fall animation in seconds (default: 8)
 * @param {string} color - Particle color (default: clay dark #492828)
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function SoilParticles({
  count = 25,
  duration = 8,
  color = '#492828'
}) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const particles = containerRef.current.querySelectorAll('.particle');

    gsap.set(particles, {
      x: () => gsap.utils.random(0, window.innerWidth),
      y: -10,
      opacity: 0,
      rotation: 0,
    });

    gsap.to(particles, {
      y: window.innerHeight + 10,
      opacity: (i) => gsap.utils.random(0.3, 0.8),
      rotation: 360,
      duration: duration,
      ease: 'none',
      stagger: {
        each: 0.15,
        repeat: -1,
        repeatDelay: gsap.utils.random(0, 2),
      },
      onRepeat: function() {
        gsap.set(this.targets(), {
          x: gsap.utils.random(0, window.innerWidth),
          y: -10,
        });
      }
    });

    // Cleanup
    return () => {
      gsap.killTweensOf(particles);
    };
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="particle absolute"
          style={{
            width: `${gsap.utils.random(2, 4)}px`,
            height: `${gsap.utils.random(2, 4)}px`,
            backgroundColor: color,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );
}
