/**
 * TypewriterText Component
 *
 * Text appears character by character with GSAP timeline animation.
 * Includes blinking cursor effect for authentic typewriter feel.
 *
 * @param {string} text - Text to display with typewriter effect
 * @param {number} duration - Duration per character in seconds (default: 0.05)
 * @param {function} onComplete - Callback when animation completes
 * @param {string} className - Additional CSS classes
 */

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function TypewriterText({
  text = '',
  duration = 0.05,
  onComplete,
  className = '',
  ...props
}) {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    const textElement = textRef.current;

    if (!container || !cursor || !textElement) return;

    // Create timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Stop cursor blinking after typing completes
        gsap.to(cursor, {
          opacity: 0,
          duration: 0.3,
        });

        if (onComplete) onComplete();
      }
    });

    // Split text into characters
    const chars = text.split('');
    textElement.textContent = '';

    // Animate each character
    chars.forEach((char, i) => {
      tl.call(() => {
        textElement.textContent += char;
      }, null, i * duration);
    });

    // Cursor blink animation
    gsap.to(cursor, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    return () => {
      tl.kill();
      gsap.killTweensOf(cursor);
    };
  }, { dependencies: [text], scope: containerRef });

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center ${className}`}
      {...props}
    >
      <span
        ref={textRef}
        className="font-mono"
      />
      <span
        ref={cursorRef}
        className="inline-block w-[2px] h-[1.2em] ml-1 bg-[#84934A]"
        aria-hidden="true"
      />
    </div>
  );
}
