'use client';

import React from 'react';

export function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Descubre las Mejores Artesanías de Jaén
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Conectamos artesanos locales con clientes que valoran la calidad y autenticidad. 
          Explora nuestra colección única de productos hechos a mano.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Explorar Productos
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Conocer Artesanos
          </button>
        </div>
      </div>
    </section>
  );
}
