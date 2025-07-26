// Componente para búsqueda de productos con integración API
'use client';

import React, { useState } from 'react';
import { useProductSearch } from '../../hooks/useProducts';
import { ProductCard } from './ProductCatalog';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Buscar productos locales...',
  loading = false,
}) => {
  const [localTerm, setLocalTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localTerm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalTerm(value);
    onSearch(value); // Búsqueda en tiempo real
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={localTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
          ) : (
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
      </div>
    </form>
  );
};

interface QuickFiltersProps {
  onCategorySelect: (category: string) => void;
  selectedCategory?: string;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({
  onCategorySelect,
  selectedCategory,
}) => {
  const categories = [
    { value: '', label: 'Todo', icon: '🛒' },
    { value: 'aceite', label: 'Aceite', icon: '🫒' },
    { value: 'queso', label: 'Quesos', icon: '🧀' },
    { value: 'jamón', label: 'Jamón', icon: '🥓' },
    { value: 'miel', label: 'Miel', icon: '🍯' },
    { value: 'vino', label: 'Vinos', icon: '🍷' },
    { value: 'artesanía', label: 'Artesanía', icon: '🏺' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategorySelect(category.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === category.value
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="mr-1">{category.icon}</span>
          {category.label}
        </button>
      ))}
    </div>
  );
};

interface SearchResultsProps {
  searchTerm: string;
  onClearSearch: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchTerm,
  onClearSearch,
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-800">
            Resultados para: <strong>"{searchTerm}"</strong>
          </p>
        </div>
        <button
          onClick={onClearSearch}
          className="text-blue-600 hover:text-blue-800 text-sm underline"
        >
          Limpiar búsqueda
        </button>
      </div>
    </div>
  );
};

interface ProductSearchProps {
  title?: string;
  showQuickFilters?: boolean;
  maxResults?: number;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  title = 'Buscar Productos Locales',
  showQuickFilters = true,
  maxResults = 20,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    products,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    isSearching,
    isEmpty,
    hasData,
  } = useProductSearch();

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Si hay un término de búsqueda, mantenerlo y filtrar por categoría
    // En una implementación real, aquí combinarías la búsqueda con el filtro de categoría
    if (searchTerm) {
      setSearchTerm(searchTerm); // Trigger re-search with category
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const displayedProducts = maxResults
    ? filteredProducts.slice(0, maxResults)
    : filteredProducts;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {title}
      </h2>

      {/* Barra de búsqueda */}
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar
          onSearch={setSearchTerm}
          loading={loading}
          placeholder="Buscar aceite, queso, miel, artesanía..."
        />
      </div>

      {/* Filtros rápidos */}
      {showQuickFilters && (
        <div className="text-center mb-8">
          <QuickFilters
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </div>
      )}

      {/* Resultados de búsqueda */}
      {isSearching && (
        <SearchResults
          searchTerm={searchTerm}
          onClearSearch={handleClearSearch}
        />
      )}

      {/* Estados de carga y error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mb-6">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {loading && !hasData && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Buscando productos...</p>
        </div>
      )}

      {/* Mensaje cuando no hay búsqueda activa */}
      {!isSearching && !selectedCategory && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Busca productos locales de Jaén
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Encuentra aceite de oliva, quesos artesanales, miel, jamón ibérico y
            productos únicos de nuestra región.
          </p>
        </div>
      )}

      {/* Resultados vacíos */}
      {(isSearching || selectedCategory) && isEmpty && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤷‍♂️</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-500 mb-4">
            Intenta con otros términos de búsqueda o explora diferentes
            categorías.
          </p>
          <button
            onClick={handleClearSearch}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Ver todos los productos
          </button>
        </div>
      )}

      {/* Grid de productos */}
      {displayedProducts.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={(product) => {
                  // Aquí podrías abrir un modal o navegar a una página de detalle
                  console.log('Ver detalles de:', product.name);
                }}
              />
            ))}
          </div>

          {/* Información de resultados */}
          <div className="text-center text-sm text-gray-600">
            {filteredProducts.length > maxResults ? (
              <p>
                Mostrando {displayedProducts.length} de{' '}
                {filteredProducts.length} productos encontrados
              </p>
            ) : (
              <p>{displayedProducts.length} productos encontrados</p>
            )}
          </div>
        </>
      )}

      {/* Sugerencias de búsqueda */}
      {!isSearching && !selectedCategory && (
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
            Productos populares
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Aceite Picual',
              'Queso de cabra',
              'Miel de azahar',
              'Jamón ibérico',
              'Cerámica de Úbeda',
              'Aceitunas aliñadas',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setSearchTerm(suggestion)}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
export { SearchBar, QuickFilters, SearchResults };
