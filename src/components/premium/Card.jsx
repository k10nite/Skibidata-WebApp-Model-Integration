import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/**
 * Premium Card Component
 * Elevated card with smooth hover effects
 * Supports various elevations and styles
 */
export default function Card({
  children,
  variant = 'default',
  elevation = 'default',
  padding = 'default',
  interactive = false,
  selected = false,
  onClick,
  className = '',
  delay = 0,
  ...props
}) {
  const cardRef = useRef(null);

  useGSAP(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.4, 
          ease: 'power2.out',
          delay
        }
      );
    }
  }, { scope: cardRef });

  // Handle hover animation for interactive cards
  const handleMouseEnter = () => {
    if (interactive && cardRef.current) {
      gsap.to(cardRef.current, {
        y: -4,
        scale: 1.01,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    if (interactive && cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
  };

  // Variant styles
  const variantStyles = {
    default: 'bg-white',
    glass: 'glass',
    outlined: 'bg-white border-2 border-gray-100',
    filled: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-agri-forest/5 to-agri-rice/5'
  };

  // Elevation styles
  const elevationStyles = {
    none: 'shadow-none',
    default: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-lg',
    premium: 'shadow-xl'
  };

  // Padding styles
  const paddingStyles = {
    none: 'p-0',
    small: 'p-3',
    default: 'p-4',
    medium: 'p-5',
    large: 'p-6'
  };

  // Interactive styles
  const interactiveStyles = interactive ? `
    cursor-pointer
    transition-shadow
    hover:shadow-md
    active:scale-[0.99]
  ` : '';

  // Selected styles
  const selectedStyles = selected ? `
    ring-2
    ring-agri-forest
    ring-offset-2
    ring-offset-white
  ` : '';

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative
        rounded-2xl
        ${variantStyles[variant]}
        ${elevationStyles[elevation]}
        ${paddingStyles[padding]}
        ${interactiveStyles}
        ${selectedStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
