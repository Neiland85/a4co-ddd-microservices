"use client"

import { motion } from "framer-motion"

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/70 border-t border-gray-200/60 py-6 relative overflow-hidden backdrop-blur-sm"
    >
      {/* Textura del footer */}
      <div className="absolute inset-0 opacity-4 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600/40 via-transparent to-pink-500/30"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-yellow-50/60 to-transparent"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-600">© 2024 A4CO Dashboard. Todos los derechos reservados.</div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Términos de Servicio
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Soporte
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
