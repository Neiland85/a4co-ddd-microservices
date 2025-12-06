const path = require("path");

module.exports = {
  presets: [require("../../packages/design-system/tailwind.preset.js")],
  content: [
    path.join(__dirname, "app/**/*.{js,ts,jsx,tsx}"),
    path.join(__dirname, "../../packages/design-system/**/*.{js,ts,jsx,tsx}")
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

