/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@a4co/design-system/tailwind')],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // Include design system components
    '../../packages/design-system/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Dashboard specific extensions
    },
  },
  plugins: [],
}