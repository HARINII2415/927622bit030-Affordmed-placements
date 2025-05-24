/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          500: '#0A84FF',
        },
        green: {
          500: '#30D158',
        },
        purple: {
          500: '#BF5AF2',
        },
        red: {
          500: '#FF453A',
        },
        yellow: {
          500: '#FFD60A',
        },
        orange: {
          500: '#FF9F0A',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '100%',
          },
        },
      }),
    },
  },
  plugins: [],
};