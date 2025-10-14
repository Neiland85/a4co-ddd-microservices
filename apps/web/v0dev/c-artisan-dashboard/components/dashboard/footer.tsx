'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden border-t border-gray-200/60 bg-white/70 py-6 backdrop-blur-sm"
    >
      {/* Textura del footer */}
      <div className="opacity-4 pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-amber-600/40 via-transparent to-pink-500/30"></div>
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-yellow-50/60 to-transparent"></div>
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="text-sm text-gray-600">
            © 2024 A4CO Dashboard. Todos los derechos reservados.
          </div>
          <div className="mt-4 flex items-center space-x-6 md:mt-0">
            <a href="#" className="text-sm text-gray-600 transition-colors hover:text-gray-900">
              Política de Privacidad
            </a>
            <a href="#" className="text-sm text-gray-600 transition-colors hover:text-gray-900">
              Términos de Servicio
            </a>
            <a href="#" className="text-sm text-gray-600 transition-colors hover:text-gray-900">
              Soporte
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
