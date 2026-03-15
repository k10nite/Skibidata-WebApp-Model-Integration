/**
 * MagneticButton Component
 *
 * Button with magnetic hover effect that follows mouse position.
 * Features smooth GSAP animation with lag and soil shadow enhancement.
 *
 * @param {React.ReactNode} children - Button content
 * @param {function} onClick - Click handler
 * @param {string} variant - Button variant: 'primary' or 'secondary'
 * @param {string} className - Additional CSS classes
 */

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function MagneticButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  ...props
}) {
  const buttonRef = useRef(null);
  const magneticRef = useRef(null);

  const variantStyles = {
    primary: 'bg-[#84934A] hover:bg-[#656D3F] text-white',
    secondary: 'bg-[#FAF9F6] hover:bg-[#ECECEC] text-[#492828] border-2 border-[#84934A]'
  };

  useGSAP(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Enhance shadow on hover
      gsap.to(button, {
        boxShadow: '0 12px 32px rgba(73, 40, 40, 0.25)',
        duration: 0.3,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        boxShadow: '0 8px 24px rgba(73, 40, 40, 0.15)',
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    const handleMouseDown = () => {
      gsap.to(button, {
        scale: 0.98,
        duration: 0.1,
      });
    };

    const handleMouseUp = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.2,
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mousedown', handleMouseDown);
    button.addEventListener('mouseup', handleMouseUp);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('mouseup', handleMouseUp);
    };
  }, { scope: buttonRef });

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`
        px-8 py-4 rounded-[2rem] font-semibold text-lg
        transition-colors duration-300
        shadow-[0_8px_24px_rgba(73,40,40,0.15)]
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
