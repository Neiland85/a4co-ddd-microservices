'use client';

import { Filter, Search, ShoppingCart, Star } from 'lucide-react';
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCatalogV0Props {
  products?: Product[];
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Aceite de Oliva Virgen Extra',
    description: 'Aceite de oliva virgen extra de Jaén, premiado en concursos internacionales',
    price: 12.5,
    category: 'Alimentación',
    stock: 100,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Cerámica de Talavera',
    description: 'Hermosa pieza de cerámica de Talavera con diseños tradicionales andaluces',
    price: 45.0,
    category: 'Artesanía',
    stock: 25,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Jamón Ibérico de Bellota',
    description: 'Jamón ibérico de bellota curado tradicionalmente en las sierras andaluzas',
    price: 85.0,
    category: 'Alimentación',
    stock: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Vino de Jerez Fino',
    description: 'Vino fino de Jerez con denominación de origen protegida',
    price: 15.0,
    category: 'Bebidas',
    stock: 50,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Productos de Cuero',
    description: 'Productos de cuero trabajados con técnicas tradicionales',
    price: 75.0,
    category: 'Artesanía',
    stock: 15,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Madera Tallada',
    description: 'Esculturas y objetos decorativos en madera local',
    price: 150.0,
    category: 'Artesanía',
    stock: 8,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Cestería Tradicional',
    description: 'Cestas tejidas con fibras naturales de la región',
    price: 35.0,
    category: 'Artesanía',
    stock: 20,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const categories = ['Todos', 'Alimentación', 'Artesanía', 'Bebidas'];

export function ProductCatalogV0({ products }: ProductCatalogV0Props): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('name');

  // Use provided products or fallback to mock data
  const productsToDisplay = products || mockProducts;

  const filteredProducts = productsToDisplay.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Header con búsqueda y filtros */}
      <div className="mb-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Barra de búsqueda */}
          <div className="relative max-w-md flex-1">
            {React.createElement(Search, {
              className: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4',
            })}
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <select
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="name">Nombre A-Z</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="mb-4">
        <p className="text-gray-600">
          Mostrando {sortedProducts.length} de {productsToDisplay.length} productos
        </p>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map(product => (
          <div
            key={product.id}
            className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="aspect-w-16 aspect-h-10 rounded-t-lg bg-gray-200">
              <div className="flex h-48 w-full items-center justify-center rounded-t-lg bg-gradient-to-br from-blue-100 to-purple-100">
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">{product.name}</h3>
                <div className="ml-2 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    4.{Math.floor(Math.random() * 9) + 1}
                  </span>
                </div>
              </div>

              <p className="mb-3 line-clamp-2 text-sm text-gray-600">{product.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="text-sm">Agregar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {sortedProducts.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-2 text-gray-400">
            <Search className="mx-auto h-12 w-12" />
          </div>
          <h3 className="mb-1 text-lg font-medium text-gray-900">No se encontraron productos</h3>
          <p className="text-gray-500">Intenta ajustar los filtros o términos de búsqueda</p>
        </div>
      )}
    </div>
  );
}
