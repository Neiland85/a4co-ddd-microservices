const path = require('path');

module.exports = {
  presets: [require('../../packages/design-system/tailwind.preset.js')],
  content: [
    path.join(__dirname, 'app/**/*.{js,ts,jsx,tsx}'),
    path.join(__dirname, 'components/**/*.{js,ts,jsx,tsx}'),
    path.join(__dirname, 'lib/**/*.{js,ts,jsx,tsx}'),
    path.join(__dirname, '../../packages/design-system/src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
