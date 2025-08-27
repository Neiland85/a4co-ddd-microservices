'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🎨 Mercado Local de Jaén</h3>
            <p className="text-gray-400">
              Conectamos artesanos locales con clientes que valoran la calidad y autenticidad.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Productos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Artesanos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Cerámica</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Textil</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Joyería</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mimbre</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="space-y-2 text-gray-400">
              <p>📧 info@mercadolocaljaen.com</p>
              <p>📱 +34 666 123 456</p>
              <p>📍 Jaén, Andalucía, España</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Mercado Local de Jaén. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
