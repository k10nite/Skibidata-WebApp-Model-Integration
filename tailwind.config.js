/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Filipino Farm Palette
        earth: {
          DEFAULT: '#492828',     // Clay soil dark
          light: '#ECECEC',       // Light earth background
          card: '#FAF9F6',        // Off-white card
        },
        rice: {
          DEFAULT: '#84934A',     // Rice field green (primary)
          dark: '#656D3F',        // Deep crop green (secondary)
        },
        nutrient: {
          low: '#CD5C5C',         // Red terracotta
          medium: '#DAA520',      // Golden harvest
          high: '#84934A',        // Rice green
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      boxShadow: {
        'soil-sm': '0 4px 12px rgba(73, 40, 40, 0.1)',
        'soil-md': '0 8px 24px rgba(73, 40, 40, 0.15)',
        'soil-lg': '0 12px 32px rgba(73, 40, 40, 0.2)',
      },
      borderRadius: {
        'clay-sm': '1.5rem',
        'clay-md': '2rem',
        'clay-lg': '2.5rem',
      },
      animation: {
        'soil-fall': 'soil-fall 8s infinite linear',
        'drill-spin': 'drill-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        'clay-shake': 'clay-shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'shimmer': 'shimmer 2s infinite',
        'typewriter': 'typewriter 1.5s steps(40) forwards',
      },
      keyframes: {
        'soil-fall': {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '0' },
          '50%': { opacity: '0.6' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        'drill-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'clay-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'typewriter': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
