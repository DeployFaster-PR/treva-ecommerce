/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // TREVA Brand Colors
        'treva-primary': '#0A2342',
        'treva-secondary': '#F5F5F0',
        'treva-accent': '#046A38',
        'treva-text': '#0E0F13',
        'treva-disabled': '#F5F5F5',
        'treva-gold': {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#EDBA13',
          500: '#D4AF37',
          600: '#c19b26',
          700: '#a78516',
          800: '#8a6914',
          900: '#735617',
        },
        // Override default colors to ensure light theme
        background: '#ffffff',
        foreground: '#0e0f13',
        white: '#ffffff',
        black: '#0e0f13',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #EDBA13 100%)',
        'gradient-gold-hover':
          'linear-gradient(135deg, #C19B26 0%, #D4A813 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'hover-lift': 'hover-lift 0.3s ease-in-out',
      },
      keyframes: {
        'hover-lift': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-2px)' },
        },
      },
      boxShadow: {
        gold: '0 4px 12px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 8px 24px rgba(212, 175, 55, 0.4)',
      },
    },
  },
  plugins: [],
  // Force light mode - prevent dark mode from ever activating
  darkMode: 'class',
};
