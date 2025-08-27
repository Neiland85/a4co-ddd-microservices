'use client';

import React from 'react';

export function InteractiveMap() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold mb-2">Mapa Interactivo</h3>
          <p className="text-gray-600 mb-4">
            Visualiza la ubicación de nuestros artesanos y productores locales
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
            Cargar Mapa
          </button>
        </div>
      </div>
    </div>
  );
}
