'use client';

import React from 'react';

export function InteractiveMap() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-200">
        <div className="text-center">
          <div className="mb-4 text-4xl">🗺️</div>
          <h3 className="mb-2 text-xl font-semibold">Mapa Interactivo</h3>
          <p className="mb-4 text-gray-600">
            Visualiza la ubicación de nuestros artesanos y productores locales
          </p>
          <button className="rounded bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700">
            Cargar Mapa
          </button>
        </div>
      </div>
    </div>
  );
}
