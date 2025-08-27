'use client';

import React from 'react';

export function FeaturedProducts() {
  const featuredProducts = [
    {
      id: 1,
      name: 'Jarrón de Cerámica Artesanal',
      price: '45.00',
      artisan: 'María González',
      image: '/placeholder.svg',
      category: 'Cerámica'
    },
    {
      id: 2,
      name: 'Manta de Lana Natural',
      price: '89.00',
      artisan: 'Carlos Ruiz',
      image: '/placeholder.svg',
      category: 'Textil'
    },
    {
      id: 3,
      name: 'Cesta de Mimbre',
      price: '32.00',
      artisan: 'Ana Martín',
      image: '/placeholder.svg',
      category: 'Mimbre'
    },
    {
      id: 4,
      name: 'Joya de Plata',
      price: '156.00',
      artisan: 'Pedro Sánchez',
      image: '/placeholder.svg',
      category: 'Joyería'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Imagen del Producto</span>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">Por {product.artisan}</p>
            <p className="text-gray-500 text-xs mb-3">{product.category}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">€{product.price}</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
