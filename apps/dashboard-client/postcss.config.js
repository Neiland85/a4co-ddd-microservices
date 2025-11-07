module.exports = {
  plugins: [
    // Tailwind CSS v4 configuration
    require("tailwindcss")({ config: "./tailwind.css" }),
    require("autoprefixer"),
  ],
};
