import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/**
 * Premium Badge Component
 * Status indicators with icons and colors
 * Used for nutrient levels and status indicators
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'default',
  icon: Icon = null,
  pulse = false,
  className = '',
  delay = 0,
  ...props
}) {
  const badgeRef = useRef(null);

  useGSAP(() => {
    if (badgeRef.current) {
      gsap.fromTo(badgeRef.current,
        { opacity: 0, scale: 0.8 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.3, 
          ease: 'back.out(1.7)',
          delay
        }
      );
    }
  }, { scope: badgeRef });

  // Variant styles - status colors for nutrient levels
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    low: 'bg-status-low/10 text-status-low',
    medium: 'bg-status-medium/10 text-status-medium',
    high: 'bg-status-high/10 text-status-high',
    forest: 'bg-agri-forest/10 text-agri-forest',
    rice: 'bg-agri-rice/10 text-agri-rice',
    clay: 'bg-agri-clay/10 text-agri-clay',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  };

  // Size styles
  const sizeStyles = {
    small: 'px-2 py-0.5 text-xs gap-1',
    default: 'px-2.5 py-1 text-sm gap-1.5',
    medium: 'px-3 py-1.5 text-sm gap-1.5',
    large: 'px-4 py-2 text-base gap-2'
  };

  // Pulse animation
  const pulseStyles = pulse ? 'animate-pulse' : '';

  return (
    <span
      ref={badgeRef}
      className={`
        inline-flex
        items-center
        justify-center
        font-display
        font-semibold
        rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${pulseStyles}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      {children}
    </span>
  );
}
