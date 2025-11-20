/* eslint-disable @typescript-eslint/no-require-imports */

module.exports = {
  plugins: [
    // Tailwind CSS v3 configuration
    require('tailwindcss')({ config: './tailwind.config.js' }),
    require('autoprefixer'),
  ],
};
