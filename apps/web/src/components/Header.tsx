'use client';

import React from 'react';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              🎨 Mercado Local de Jaén
            </h1>
            <span className="text-sm text-gray-600">
              Artesanías y Productos Locales
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              Inicio
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              Productos
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              Artesanos
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
              Contacto
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
