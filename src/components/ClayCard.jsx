/**
 * ClayCard Component
 *
 * Card with clay-morph hover effect using GSAP.
 * Earth layer slides across card on hover with optional stagger-reveal animation.
 *
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Optional click handler
 * @param {boolean} staggerReveal - Enable stagger reveal animation (default: false)
 */

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ClayCard({
  children,
  className = '',
  onClick,
  staggerReveal = false,
  ...props
}) {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);

  useGSAP(() => {
    const card = cardRef.current;
    const overlay = overlayRef.current;
    if (!card || !overlay) return;

    // Initial state for overlay
    gsap.set(overlay, {
      left: '-100%',
    });

    // Stagger reveal on mount if enabled
    if (staggerReveal) {
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        }
      );
    }

    const handleMouseEnter = () => {
      // Slide overlay across
      gsap.to(overlay, {
        left: '100%',
        duration: 0.6,
        ease: 'power2.inOut',
      });

      // Lift card
      gsap.to(card, {
        y: -4,
        boxShadow: '0 12px 32px rgba(73, 40, 40, 0.2)',
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      // Reset overlay
      gsap.set(overlay, {
        left: '-100%',
      });

      // Lower card
      gsap.to(card, {
        y: 0,
        boxShadow: '0 8px 24px rgba(73, 40, 40, 0.15)',
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`
        clay-card relative overflow-hidden
        bg-[#FAF9F6] rounded-[2.5rem]
        shadow-[0_8px_24px_rgba(73,40,40,0.15)]
        transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Earth layer overlay */}
      <div
        ref={overlayRef}
        className="absolute top-0 w-full h-full pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(132, 147, 74, 0.1), transparent)',
        }}
      />

      {children}
    </div>
  );
}
