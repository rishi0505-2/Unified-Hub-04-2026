/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'rain-fall': 'rainFall 1s linear infinite',
        'snow-fall': 'snowFall 4s linear infinite',
        'cloud-drift': 'cloudDrift 20s linear infinite',
        'lightning-flash': 'lightningFlash 5s ease-in-out infinite',
        'wind-blow': 'windBlow 2.5s ease-in-out infinite',
        'fog-drift': 'fogDrift 10s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        rainFall: {
          '0%': { transform: 'translateY(-20px)', opacity: '0.7' },
          '100%': { transform: 'translateY(110vh)', opacity: '0.3' },
        },
        snowFall: {
          '0%': { transform: 'translateY(-10px) translateX(0px)', opacity: '0.9' },
          '33%': { transform: 'translateY(33vh) translateX(15px)', opacity: '0.8' },
          '66%': { transform: 'translateY(66vh) translateX(-10px)', opacity: '0.7' },
          '100%': { transform: 'translateY(110vh) translateX(8px)', opacity: '0.2' },
        },
        cloudDrift: {
          '0%': { transform: 'translateX(-350px)' },
          '100%': { transform: 'translateX(110vw)' },
        },
        lightningFlash: {
          '0%, 84%, 100%': { opacity: '0' },
          '86%, 90%': { opacity: '0.9' },
          '88%, 92%': { opacity: '0' },
          '94%': { opacity: '0.5' },
        },
        windBlow: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '20%': { opacity: '0.6' },
          '80%': { opacity: '0.6' },
          '100%': { transform: 'translateX(110vw)', opacity: '0' },
        },
        fogDrift: {
          '0%, 100%': { transform: 'translateX(0) scaleX(1)', opacity: '0.35' },
          '50%': { transform: 'translateX(60px) scaleX(1.08)', opacity: '0.55' },
        },
      },
    },
  },
  plugins: [],
}

