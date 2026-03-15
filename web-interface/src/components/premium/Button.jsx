import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Loader2 } from 'lucide-react';

/**
 * Premium Button Component
 * Large tap targets (50px+ height) for farmer-friendly use
 * Multiple variants: primary, secondary, ghost, outline
 * Supports loading states and icons
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon = null,
  iconPosition = 'left',
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  const buttonRef = useRef(null);
  const rippleRef = useRef(null);

  // Entrance animation
  useGSAP(() => {
    if (buttonRef.current) {
      gsap.fromTo(buttonRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.4, 
          ease: 'back.out(1.7)',
          delay: props.delay || 0
        }
      );
    }
  }, { scope: buttonRef });

  // Handle ripple effect
  const handleClick = (e) => {
    if (disabled || loading) return;

    // Create ripple
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = 'absolute inset-0 bg-white/30 rounded-full scale-0';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    gsap.to(ripple, {
      scale: 4,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    });

    onClick?.(e);
  };

  // Variant styles
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-agri-forest to-agri-rice
      text-white
      shadow-lg shadow-agri-forest/25
      hover:shadow-xl hover:shadow-agri-forest/30
      active:scale-[0.98]
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg
    `,
    secondary: `
      bg-white
      text-agri-forest
      border-2 border-agri-forest/20
      shadow-sm
      hover:border-agri-forest/40 hover:bg-agri-forest/5
      active:scale-[0.98]
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    ghost: `
      bg-transparent
      text-agri-forest
      hover:bg-agri-forest/10
      active:scale-[0.98]
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    outline: `
      bg-transparent
      text-gray-700
      border-2 border-gray-200
      hover:border-agri-forest/40 hover:text-agri-forest
      active:scale-[0.98]
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    danger: `
      bg-status-low
      text-white
      shadow-lg shadow-status-low/25
      hover:shadow-xl hover:shadow-status-low/30
      active:scale-[0.98]
      disabled:opacity-50 disabled:cursor-not-allowed
    `
  };

  // Size styles (minimum 50px height for large tap targets)
  const sizeStyles = {
    small: 'h-11 px-4 text-sm rounded-xl gap-2',
    default: 'h-14 px-6 text-base rounded-2xl gap-3',
    large: 'h-16 px-8 text-lg rounded-2xl gap-3'
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative
        inline-flex
        items-center
        justify-center
        font-display
        font-semibold
        transition-all
        duration-200
        overflow-hidden
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="truncate">{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className="w-5 h-5 flex-shrink-0" />
          )}
        </>
      )}
    </button>
  );
}
