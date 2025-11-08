/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors.js');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.emerald,
        secondary: colors.slate,
        accent: colors.amber,
      },
    },
  },
  plugins: [],
};

