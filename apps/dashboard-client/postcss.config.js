/* eslint-disable @typescript-eslint/no-require-imports */

module.exports = {
  plugins: [
    // Tailwind CSS v4 configuration
    require("@tailwindcss/postcss")({ config: "./tailwind.css" }),
    require("autoprefixer"),
  ],
};
