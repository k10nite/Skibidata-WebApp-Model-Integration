/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Apple/Airbnb Premium Color Palette
      colors: {
        // Primary Colors
        'premium-black': '#000000',
        'premium-white': '#FFFFFF',

        // Gray Scale (Apple-inspired)
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },

        // Accent Colors - Growth & Success
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },

        // Chart Colors
        chart: {
          blue: '#3B82F6',
          amber: '#F59E0B',
          red: '#EF4444',
          green: '#10B981',
          purple: '#8B5CF6',
          pink: '#EC4899',
          indigo: '#6366F1',
          teal: '#14B8A6',
        },

        // Semantic Colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Agricultural Color Palette (Filipino Farming Theme)
        agri: {
          forest: '#2E7D32',      // Primary forest green
          rice: '#84934A',        // Rice green
          clay: '#492828',        // Clay dark
          earth: '#8D6E63',       // Earth brown
          sand: '#F5F5DC',        // Sandy beige
          sky: '#87CEEB',         // Sky blue
        },

        // Status Colors (Soil nutrient levels)
        status: {
          low: '#E74C3C',         // Red - Low/Warning
          medium: '#F39C12',      // Yellow/Amber - Medium/Caution
          high: '#27AE60',        // Green - High/Optimal
        },
      },

      // Typography - Inter + Nunito Font System (SF Pro alternative with friendly display)
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Nunito', 'Inter', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'monospace'],
      },

      // Font Weights
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },

      // Letter Spacing (Apple's tight tracking)
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.02em',
        normal: '0em',
        wide: '0.02em',
        wider: '0.04em',
      },

      // Spacing System (8px base)
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '80px',
        '5xl': '96px',
        '6xl': '128px',
      },

      // Shadows (Subtle Apple-style depth)
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px rgba(0, 0, 0, 0.07)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.08)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.10)',
        '2xl': '0 25px 50px rgba(0, 0, 0, 0.12)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        'none': 'none',

        // Custom shadows for specific use cases
        'card': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'elevated': '0 10px 30px rgba(0, 0, 0, 0.10)',
        'premium': '0 20px 40px rgba(0, 0, 0, 0.12)',
      },

      // Border Radius (Apple's smooth curves)
      borderRadius: {
        'none': '0',
        'xs': '4px',
        'sm': '8px',
        'DEFAULT': '12px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
        'full': '9999px',
      },

      // Transitions (Smooth Apple-like animations)
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'smooth': '300ms',
        'slow': '500ms',
      },

      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'smooth-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'smooth-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // Animation
      animation: {
        'fade-in': 'fadeIn 300ms ease-in-out',
        'slide-up': 'slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'spin-slow': 'spin 2s linear infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        skeleton: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },

      // Backdrop Blur (Glass morphism)
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },

      // Z-Index System
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },

      // Max Width (Container sizes)
      maxWidth: {
        'xs': '320px',
        'sm': '384px',
        'md': '448px',
        'lg': '512px',
        'xl': '576px',
        '2xl': '672px',
        '3xl': '768px',
        '4xl': '896px',
        '5xl': '1024px',
        '6xl': '1152px',
        '7xl': '1280px',
        'container': '1280px',
        'container-narrow': '960px',
        'container-wide': '1440px',
      },

      // Line Heights
      lineHeight: {
        'none': '1',
        'tight': '1.2',
        'snug': '1.4',
        'normal': '1.6',
        'relaxed': '1.75',
        'loose': '2',
      },

      // Grid Template Columns
      gridTemplateColumns: {
        'premium-2': 'repeat(auto-fit, minmax(300px, 1fr))',
        'premium-3': 'repeat(auto-fit, minmax(280px, 1fr))',
        'premium-4': 'repeat(auto-fit, minmax(250px, 1fr))',
      },

      // Opacity
      opacity: {
        '0': '0',
        '5': '0.05',
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
        '100': '1',
      },

      // Scale
      scale: {
        '95': '0.95',
        '98': '0.98',
        '102': '1.02',
        '105': '1.05',
      },
    },
  },
  plugins: [
    // Custom plugin for font feature settings
    function({ addUtilities }) {
      const newUtilities = {
        '.font-feature-tabular': {
          'font-feature-settings': '"tnum" 1',
          'font-variant-numeric': 'tabular-nums',
        },
        '.font-feature-normal': {
          'font-feature-settings': 'normal',
          'font-variant-numeric': 'normal',
        },
        '.font-smooth-antialiased': {
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
      }
      addUtilities(newUtilities)
    },

    // Custom plugin for glass morphism
    function({ addUtilities }) {
      const glassUtilities = {
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.7)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.3)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
      }
      addUtilities(glassUtilities)
    },
  ],
}
