import tailwind from "tailwindcss"
import autoprefixer from "autoprefixer"
import tailwindConfig from "../../tailwind.config.ts" // 👈 apunta a la raíz del monorepo

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config

