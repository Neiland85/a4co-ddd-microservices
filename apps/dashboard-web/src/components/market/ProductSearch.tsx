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
          className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 text-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-green-600"></div>
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

const QuickFilters: React.FC<QuickFiltersProps> = ({ onCategorySelect, selectedCategory }) => {
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
    <div className="mb-6 flex flex-wrap gap-2">
      {categories.map(category => (
        <button
          key={category.value}
          onClick={() => onCategorySelect(category.value)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
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

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm, onClearSearch }) => {
  return (
    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-800">
            Resultados para: <strong>"{searchTerm}"</strong>
          </p>
        </div>
        <button
          onClick={onClearSearch}
          className="text-sm text-blue-600 underline hover:text-blue-800"
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

  const { products, loading, error, searchTerm, setSearchTerm, isSearching, isEmpty, hasData } =
    useProductSearch();

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
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const displayedProducts = maxResults ? filteredProducts.slice(0, maxResults) : filteredProducts;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">{title}</h2>

      {/* Barra de búsqueda */}
      <div className="mx-auto mb-8 max-w-2xl">
        <SearchBar
          onSearch={setSearchTerm}
          loading={loading}
          placeholder="Buscar aceite, queso, miel, artesanía..."
        />
      </div>

      {/* Filtros rápidos */}
      {showQuickFilters && (
        <div className="mb-8 text-center">
          <QuickFilters
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </div>
      )}

      {/* Resultados de búsqueda */}
      {isSearching && <SearchResults searchTerm={searchTerm} onClearSearch={handleClearSearch} />}

      {/* Estados de carga y error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {loading && !hasData && (
        <div className="py-12 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Buscando productos...</p>
        </div>
      )}

      {/* Mensaje cuando no hay búsqueda activa */}
      {!isSearching && !selectedCategory && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 text-xl font-medium text-gray-700">
            Busca productos locales de Jaén
          </h3>
          <p className="mx-auto max-w-md text-gray-500">
            Encuentra aceite de oliva, quesos artesanales, miel, jamón ibérico y productos únicos de
            nuestra región.
          </p>
        </div>
      )}

      {/* Resultados vacíos */}
      {(isSearching || selectedCategory) && isEmpty && !loading && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">🤷‍♂️</div>
          <h3 className="mb-2 text-xl font-medium text-gray-700">No se encontraron productos</h3>
          <p className="mb-4 text-gray-500">
            Intenta con otros términos de búsqueda o explora diferentes categorías.
          </p>
          <button
            onClick={handleClearSearch}
            className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
          >
            Ver todos los productos
          </button>
        </div>
      )}

      {/* Grid de productos */}
      {displayedProducts.length > 0 && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={product => {
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
                Mostrando {displayedProducts.length} de {filteredProducts.length} productos
                encontrados
              </p>
            ) : (
              <p>{displayedProducts.length} productos encontrados</p>
            )}
          </div>
        </>
      )}

      {/* Sugerencias de búsqueda */}
      {!isSearching && !selectedCategory && (
        <div className="mt-12 rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-center text-lg font-medium text-gray-800">
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
            ].map(suggestion => (
              <button
                key={suggestion}
                onClick={() => setSearchTerm(suggestion)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-100"
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
