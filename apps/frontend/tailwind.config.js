/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors.js');

module.exports = {
  content: [
    './index.html',
    './*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './contexts/**/*.{js,ts,jsx,tsx}',
    './auth/**/*.{js,ts,jsx,tsx}',
    './user/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.emerald,
        secondary: colors.slate,
        accent: colors.amber,
        a4coGreen: '#27FF9F',
        a4coYellow: '#FFC82C',
        a4coBlack: '#0E0E0E',
        anthracite: '#282B30',
        sandstone: '#EADDC6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
