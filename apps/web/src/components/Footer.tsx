'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold">🎨 Mercado Local de Jaén</h3>
            <p className="text-gray-400">
              Conectamos artesanos locales con clientes que valoran la calidad y autenticidad.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Productos
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Artesanos
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Categorías</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Cerámica
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Textil
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Joyería
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Mimbre
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Contacto</h4>
            <div className="space-y-2 text-gray-400">
              <p>📧 info@mercadolocaljaen.com</p>
              <p>📱 +34 666 123 456</p>
              <p>📍 Jaén, Andalucía, España</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Mercado Local de Jaén. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
