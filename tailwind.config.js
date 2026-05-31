/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316',
          light: '#FB923C',
          dark: '#EA580C',
        },
        accent: {
          DEFAULT: '#FBBF24',
          light: '#FCD34D',
        },
        cream: {
          DEFAULT: '#FFFBEB',
          dark: '#FEF3C7',
        },
        correct: '#22C55E',
        wrong: '#EF4444',
        textMain: '#1C1917',
        textSub: '#78716C',
      },
    },
  },
  plugins: [],
};
