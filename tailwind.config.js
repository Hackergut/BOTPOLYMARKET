/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cybernetic Finance Theme
        background: {
          DEFAULT: '#0A0A0F',
          surface: '#121218',
        },
        primary: {
          DEFAULT: '#00F5A0',
          dark: '#00CC88',
        },
        secondary: '#FF3CAC',
        accent: '#00D5FF',
        
        // Market Colors
        bullish: '#00F5A0',
        bearish: '#FF5252',
        neutral: '#7F8190',
        
        danger: '#FF1744',
        info: '#00D5FF',
        inactive: '#4A4A55',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 10px rgba(0, 245, 160, 0.3)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 245, 160, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}