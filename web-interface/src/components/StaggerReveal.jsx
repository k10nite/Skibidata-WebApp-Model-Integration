/**
 * StaggerReveal Component
 *
 * Wrapper that reveals children with GSAP stagger animation.
 * Animates opacity and position with customizable direction and delay.
 *
 * @param {React.ReactNode} children - Child elements to reveal
 * @param {number} delay - Stagger delay between each child in seconds (default: 0.1)
 * @param {string} direction - Animation direction: 'up', 'down', 'left', 'right' (default: 'up')
 * @param {number} distance - Distance to move in pixels (default: 20)
 * @param {string} className - Additional CSS classes
 */

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function StaggerReveal({
  children,
  delay = 0.1,
  direction = 'up',
  distance = 20,
  className = '',
  ...props
}) {
  const containerRef = useRef(null);

  // Calculate initial position based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { y: distance, x: 0 };
    }
  };

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = gsap.utils.toArray(container.children);
    const initialPos = getInitialPosition();

    // Create timeline for stagger animation
    const tl = gsap.timeline();

    // Set initial state
    gsap.set(children, {
      opacity: 0,
      ...initialPos,
    });

    // Animate with stagger
    tl.to(children, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: {
        each: delay,
        from: 'start',
      },
    });

    return () => {
      tl.kill();
    };
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}
