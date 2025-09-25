'use client';

import Image from 'next/image';
import React from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  seller: string;
  location: string;
  category: string;
}

interface ProductGridProps {
  products?: Product[];
}

// Datos de ejemplo
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Mermelada Artesanal de Frutos Rojos',
    price: 15.99,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    seller: 'Doña María',
    location: 'Centro',
    category: 'Alimentos',
  },
  {
    id: '2',
    name: 'Bolso Tejido a Mano',
    price: 45.0,
    image: '/api/placeholder/300/300',
    rating: 4.9,
    seller: 'Artesanías López',
    location: 'Norte',
    category: 'Artesanías',
  },
  {
    id: '3',
    name: 'Servicio de Diseño Web',
    price: 150.0,
    image: '/api/placeholder/300/300',
    rating: 5.0,
    seller: 'Tech Solutions',
    location: 'Centro',
    category: 'Servicios',
  },
  {
    id: '4',
    name: 'Vestido Tradicional',
    price: 89.99,
    image: '/api/placeholder/300/300',
    rating: 4.7,
    seller: 'Moda Local',
    location: 'Sur',
    category: 'Moda',
  },
  {
    id: '5',
    name: 'Café Orgánico Local',
    price: 12.5,
    image: '/api/placeholder/300/300',
    rating: 4.6,
    seller: 'Finca El Paraíso',
    location: 'Este',
    category: 'Alimentos',
  },
  {
    id: '6',
    name: 'Maceteros de Cerámica',
    price: 25.0,
    image: '/api/placeholder/300/300',
    rating: 4.5,
    seller: 'Cerámica Artesanal',
    location: 'Oeste',
    category: 'Artesanías',
  },
];

export const ProductGrid: React.FC<ProductGridProps> = ({ products = sampleProducts }) => {
  return (
    <div className="lg:col-span-3">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <div
            key={product.id}
            className="cursor-pointer rounded-lg border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="p-4">
              <div className="mb-2">
                <span className="bg-primary/10 text-primary inline-block rounded-full px-2 py-1 text-xs font-medium">
                  {product.category}
                </span>
              </div>

              <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                {product.name}
              </h3>

              <div className="mb-2 flex items-center justify-between">
                <span className="text-primary text-2xl font-bold">${product.price}</span>
                <div className="flex items-center">
                  <span className="text-sm text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center">
                  <span className="font-medium">Vendedor:</span>
                  <span className="ml-1">{product.seller}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium">Ubicación:</span>
                  <span className="ml-1">{product.location}</span>
                </p>
              </div>

              <button className="bg-primary hover:bg-primary/90 mt-4 w-full rounded-md px-4 py-2 font-medium text-white transition-colors">
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
