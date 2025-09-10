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
      category: 'Cerámica',
    },
    {
      id: 2,
      name: 'Manta de Lana Natural',
      price: '89.00',
      artisan: 'Carlos Ruiz',
      image: '/placeholder.svg',
      category: 'Textil',
    },
    {
      id: 3,
      name: 'Cesta de Mimbre',
      price: '32.00',
      artisan: 'Ana Martín',
      image: '/placeholder.svg',
      category: 'Mimbre',
    },
    {
      id: 4,
      name: 'Joya de Plata',
      price: '156.00',
      artisan: 'Pedro Sánchez',
      image: '/placeholder.svg',
      category: 'Joyería',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {featuredProducts.map(product => (
        <div
          key={product.id}
          className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
        >
          <div className="flex h-48 items-center justify-center bg-gray-200">
            <span className="text-sm text-gray-500">Imagen del Producto</span>
          </div>
          <div className="p-4">
            <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
            <p className="mb-2 text-sm text-gray-600">Por {product.artisan}</p>
            <p className="mb-3 text-xs text-gray-500">{product.category}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600">€{product.price}</span>
              <button className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
