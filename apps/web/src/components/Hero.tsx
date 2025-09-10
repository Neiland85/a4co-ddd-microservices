'use client';

import React from 'react';

export function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-20 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold">Descubre las Mejores Artesanías de Jaén</h1>
        <p className="mx-auto mb-8 max-w-3xl text-xl">
          Conectamos artesanos locales con clientes que valoran la calidad y autenticidad. Explora
          nuestra colección única de productos hechos a mano.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-gray-100">
            Explorar Productos
          </button>
          <button className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-blue-600">
            Conocer Artesanos
          </button>
        </div>
      </div>
    </section>
  );
}
