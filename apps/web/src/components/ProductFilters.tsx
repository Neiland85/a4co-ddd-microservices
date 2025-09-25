'use client';

import React, { useState } from 'react';

interface FilterState {
  category: string;
  priceRange: [number, number];
  location: string;
  rating: number;
}

export const ProductFilters: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    priceRange: [0, 1000],
    location: '',
    rating: 0,
  });

  const categories = ['Todos', 'Alimentos', 'Artesanías', 'Tecnología', 'Servicios', 'Moda'];

  const locations = ['Todas las ubicaciones', 'Centro', 'Norte', 'Sur', 'Este', 'Oeste'];

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Filtros</h3>

      {/* Categoría */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">Categoría</label>
        <select
          value={filters.category}
          onChange={e => setFilters({ ...filters, category: e.target.value })}
          className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2"
        >
          {categories.map(category => (
            <option key={category} value={category === 'Todos' ? '' : category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Rango de precio */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Precio: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </label>
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.priceRange[1]}
            onChange={e =>
              setFilters({
                ...filters,
                priceRange: [filters.priceRange[0], parseInt(e.target.value)],
              })
            }
            className="w-full"
          />
        </div>
      </div>

      {/* Ubicación */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">Ubicación</label>
        <select
          value={filters.location}
          onChange={e => setFilters({ ...filters, location: e.target.value })}
          className="focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2"
        >
          {locations.map(location => (
            <option key={location} value={location === 'Todas las ubicaciones' ? '' : location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Calificación mínima */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">Calificación mínima</label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setFilters({ ...filters, rating: star })}
              className={`text-2xl ${
                star <= filters.rating ? 'text-yellow-400' : 'text-gray-300'
              } transition-colors hover:text-yellow-400`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div className="flex space-x-2">
        <button
          onClick={() =>
            setFilters({
              category: '',
              priceRange: [0, 1000],
              location: '',
              rating: 0,
            })
          }
          className="flex-1 rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Limpiar
        </button>
        <button className="bg-primary hover:bg-primary/90 focus:ring-primary flex-1 rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2">
          Aplicar
        </button>
      </div>
    </div>
  );
};
