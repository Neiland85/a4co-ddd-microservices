import type { Config } from 'tailwindcss'
// Importar el preset del Design System
import a4coPreset from '@a4co/design-system/tailwind'

const config: Config = {
  // Usar el preset como base
  presets: [a4coPreset],
  
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Incluir el Design System en el content para que Tailwind procese sus clases
    "../../packages/design-system/src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      // Aquí puedes extender o sobrescribir tokens específicos de esta app
      // Los tokens del Design System ya están incluidos desde el preset
    },
  },
  plugins: [
    // Plugins adicionales específicos de esta app
  ],
}

export default config