'use client';

import { Filter, Search, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  description: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Artesanía de Cerámica',
    price: 45000,
    category: 'Cerámica',
    rating: 4.8,
    image: '/api/placeholder/300/200',
    description: 'Hermosa pieza de cerámica hecha a mano por artesanos locales'
  },
  {
    id: '2',
    name: 'Textil Wayuu',
    price: 120000,
    category: 'Textiles',
    rating: 4.9,
    image: '/api/placeholder/300/200',
    description: 'Auténtico textil Wayuu con patrones tradicionales'
  },
  {
    id: '3',
    name: 'Joyería en Filigrana',
    price: 85000,
    category: 'Joyería',
    rating: 4.7,
    image: '/api/placeholder/300/200',
    description: 'Delicada joyería en filigrana con técnicas ancestrales'
  },
  {
    id: '4',
    name: 'Cuero Artesanal',
    price: 95000,
    category: 'Cuero',
    rating: 4.6,
    image: '/api/placeholder/300/200',
    description: 'Productos de cuero trabajados con técnicas tradicionales'
  },
  {
    id: '5',
    name: 'Madera Tallada',
    price: 150000,
    category: 'Madera',
    rating: 4.8,
    image: '/api/placeholder/300/200',
    description: 'Esculturas y objetos decorativos en madera local'
  },
  {
    id: '6',
    name: 'Cestería Tradicional',
    price: 35000,
    category: 'Cestería',
    rating: 4.5,
    image: '/api/placeholder/300/200',
    description: 'Cestas tejidas con fibras naturales de la región'
  }
];

const categories = ['Todos', 'Cerámica', 'Textiles', 'Joyería', 'Cuero', 'Madera', 'Cestería'];

export function ProductCatalogV0() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('name');

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header con búsqueda y filtros */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Barra de búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Nombre A-Z</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Calificado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="mb-4">
        <p className="text-gray-600">
          Mostrando {sortedProducts.length} de {mockProducts.length} productos
        </p>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-w-16 aspect-h-10 bg-gray-200 rounded-t-lg">
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">{product.category}</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 ml-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron productos</h3>
          <p className="text-gray-500">Intenta ajustar los filtros o términos de búsqueda</p>
        </div>
      )}
    </div>
  );
}
