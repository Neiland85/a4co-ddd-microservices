// 🫒 Catálogo de Productos del Mercado Local de Jaén 🫒
// Diseño auténtico inspirado en la tradición olivarera de Jaén
'use client';

import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import type { LocalProduct } from '../../app/api/sales-opportunities/route';

interface ProductCardProps {
  product: LocalProduct;
  onViewDetails?: (product: LocalProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
}) => {
  const getCategoryIcon = (category: string) => {
    const icons = {
      aceite: '🫒',
      queso: '🧀',
      jamón: '🥓',
      miel: '🍯',
      vino: '🍷',
      aceitunas: '🫒',
      artesanía: '🏺',
      conservas: '🥫',
      embutidos: '🥓',
      aceites: '🫒',
    };
    return icons[category as keyof typeof icons] || '🌾';
  };

  const getCategoryGradient = (category: string) => {
    const gradients = {
      aceite: 'from-amber-200 via-yellow-200 to-amber-300',
      aceites: 'from-amber-200 via-yellow-200 to-amber-300',
      queso: 'from-orange-100 via-yellow-100 to-orange-200',
      jamón: 'from-red-100 via-pink-100 to-red-200',
      miel: 'from-yellow-200 via-amber-200 to-yellow-300',
      vino: 'from-purple-100 via-red-100 to-purple-200',
      aceitunas: 'from-green-200 via-olive-200 to-green-300',
      artesanía: 'from-orange-200 via-amber-200 to-orange-300',
      conservas: 'from-green-100 via-lime-100 to-green-200',
      embutidos: 'from-red-200 via-orange-200 to-red-300',
    };
    return (
      gradients[category as keyof typeof gradients] ||
      'from-stone-100 via-amber-50 to-stone-200'
    );
  };

  const getAvailabilityStatus = () => {
    if (!product.available)
      return { text: 'No disponible', color: 'text-red-600' };
    if (product.stock <= 5)
      return { text: 'Pocas unidades', color: 'text-orange-600' };
    return { text: 'Disponible', color: 'text-green-600' };
  };

  const availability = getAvailabilityStatus();

  return (
    <div className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-amber-100">
      <div className="relative overflow-hidden">
        <div
          className={`h-52 bg-gradient-to-br ${getCategoryGradient(product.category)} flex items-center justify-center relative`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-amber-200/20"></div>
          <span className="text-7xl drop-shadow-lg z-10 group-hover:scale-110 transition-transform duration-300">
            {getCategoryIcon(product.category)}
          </span>
          {/* Patrón decorativo tipo Jaén */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"></div>
        </div>

        {/* Badge de categoría mejorado */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg uppercase tracking-wide">
          {product.category}
        </div>

        {product.seasonal && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
            🌿 Temporada
          </div>
        )}

        {/* Indicador de origen Jaén */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-amber-800 border border-amber-200">
          🏛️ Jaén
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-bold text-xl text-amber-900 mb-1 line-clamp-2 group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-amber-700 font-medium">
            👨‍🌾 {product.producer}
          </p>
        </div>

        <div className="flex items-center text-sm text-amber-600">
          <span className="mr-2">📍</span>
          <span>{product.location.municipality}</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <div className="text-right">
            <span className="text-2xl font-bold text-amber-800">
              €{product.price.toFixed(2)}
            </span>
            <span className="text-sm text-amber-600 ml-1">
              / {product.unit}
            </span>
          </div>
          <div className="text-right">
            <span className={`text-sm font-semibold ${availability.color}`}>
              {availability.text}
            </span>
            <p className="text-xs text-amber-600">Stock: {product.stock}</p>
          </div>
        </div>

        {product.certifications.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {product.certifications.slice(0, 2).map((cert) => (
                <span
                  key={cert}
                  className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-medium border border-emerald-200"
                >
                  ✓ {cert}
                </span>
              ))}
              {product.certifications.length > 2 && (
                <span className="text-xs text-amber-600 font-medium">
                  +{product.certifications.length - 2} más certificaciones
                </span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => onViewDetails?.(product)}
          className="w-full bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 hover:from-amber-700 hover:via-yellow-700 hover:to-amber-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          👁️ Ver Detalles
        </button>
      </div>
    </div>
  );
};

interface ProductFiltersProps {
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
  onSeasonalToggle: (seasonal: boolean) => void;
  onAvailableToggle: (available: boolean) => void;
  filters: {
    category?: string;
    location?: string;
    seasonal?: boolean;
    available?: boolean;
  };
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onCategoryChange,
  onLocationChange,
  onSeasonalToggle,
  onAvailableToggle,
  filters,
}) => {
  const categories = [
    { value: '', label: 'Todas las categorías', icon: '🌾' },
    { value: 'aceite', label: 'Aceite de Oliva', icon: '🫒' },
    { value: 'aceites', label: 'Aceites Varietales', icon: '🫒' },
    { value: 'queso', label: 'Quesos Artesanos', icon: '🧀' },
    { value: 'jamón', label: 'Jamón Serrano', icon: '🥓' },
    { value: 'miel', label: 'Miel Natural', icon: '🍯' },
    { value: 'vino', label: 'Vinos de Jaén', icon: '🍷' },
    { value: 'aceitunas', label: 'Aceitunas Frescas', icon: '🫒' },
    { value: 'artesanía', label: 'Artesanía Local', icon: '🏺' },
    { value: 'conservas', label: 'Conservas Gourmet', icon: '🥫' },
    { value: 'embutidos', label: 'Embutidos Caseros', icon: '🥓' },
  ];

  const municipalities = [
    { value: '', label: 'Toda la Provincia', icon: '🏛️' },
    { value: 'Jaén', label: 'Jaén Capital', icon: '🏛️' },
    { value: 'Úbeda', label: 'Úbeda', icon: '🏰' },
    { value: 'Baeza', label: 'Baeza', icon: '⛪' },
    { value: 'Cazorla', label: 'Cazorla', icon: '🏔️' },
    { value: 'Andújar', label: 'Andújar', icon: '🌸' },
    { value: 'Linares', label: 'Linares', icon: '⚒️' },
    { value: 'Martos', label: 'Martos', icon: '🫒' },
  ];

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50 p-6 rounded-2xl shadow-xl mb-8 border border-amber-200">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🔍</span>
        <h3 className="font-bold text-2xl text-amber-900">
          Filtros del Mercado
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-amber-300 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="category-select"
            className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2"
          >
            🏷️ Categoría
          </label>
          <select
            id="category-select"
            value={filters.category || ''}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm transition-all duration-200 hover:border-amber-300"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="location-select"
            className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2"
          >
            📍 Ubicación
          </label>
          <select
            id="location-select"
            value={filters.location || ''}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white shadow-sm transition-all duration-200 hover:border-amber-300"
          >
            {municipalities.map((municipality) => (
              <option key={municipality.value} value={municipality.value}>
                {municipality.icon} {municipality.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center">
          <label className="flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-green-200 hover:border-green-300 transition-all duration-200 cursor-pointer shadow-sm">
            <input
              type="checkbox"
              checked={filters.seasonal || false}
              onChange={(e) => onSeasonalToggle(e.target.checked)}
              className="w-5 h-5 text-green-600 focus:ring-green-500 focus:ring-2 rounded border-2 border-green-300"
            />
            <span className="text-sm font-medium text-green-800 flex items-center gap-2">
              🌿 Solo Temporada
            </span>
          </label>
        </div>

        <div className="flex items-center justify-center">
          <label className="flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-200 cursor-pointer shadow-sm">
            <input
              type="checkbox"
              checked={filters.available || false}
              onChange={(e) => onAvailableToggle(e.target.checked)}
              className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 focus:ring-2 rounded border-2 border-emerald-300"
            />
            <span className="text-sm font-medium text-emerald-800 flex items-center gap-2">
              ✅ Solo Disponibles
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

interface ProductCatalogProps {
  title?: string;
  showFilters?: boolean;
  maxItems?: number;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({
  title = 'Productos Locales de Jaén',
  showFilters = true,
  maxItems,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<LocalProduct | null>(
    null
  );
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    seasonal: false,
    available: true,
  });

  const {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    loadMore,
    canLoadMore,
  } = useProducts({
    ...filters,
    category: filters.category || undefined,
    location: filters.location || undefined,
    limit: maxItems || 12,
    autoFetch: true,
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchProducts(updatedFilters);
  };

  const displayedProducts = maxItems ? products.slice(0, maxItems) : products;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={() => fetchProducts()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header del Catálogo con estilo Jaén */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-800 bg-clip-text text-transparent mb-2">
            {title}
          </h2>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
        </div>
        <p className="text-amber-700 text-lg mt-4 max-w-2xl mx-auto">
          🫒 Descubre los mejores productos artesanales de la provincia de Jaén,
          directamente de nuestros productores locales 🏺
        </p>
      </div>

      {showFilters && (
        <ProductFilters
          filters={filters}
          onCategoryChange={(category) => handleFilterChange({ category })}
          onLocationChange={(location) => handleFilterChange({ location })}
          onSeasonalToggle={(seasonal) => handleFilterChange({ seasonal })}
          onAvailableToggle={(available) => handleFilterChange({ available })}
        />
      )}

      {loading && products.length === 0 ? (
        <div className="text-center py-12">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 mx-auto"></div>
            <span className="absolute inset-0 flex items-center justify-center text-2xl">
              🫒
            </span>
          </div>
          <p className="mt-6 text-amber-700 text-lg font-medium">
            Cargando productos del mercado...
          </p>
          <p className="text-amber-600 text-sm">
            Buscando los mejores productos de Jaén
          </p>
        </div>
      ) : (
        <>
          {/* Estadísticas del catálogo */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 mb-6 border border-amber-200">
            <div className="flex items-center justify-between text-amber-800">
              <span className="flex items-center gap-2 font-medium">
                <span>📊</span>
                {displayedProducts.length} producto
                {displayedProducts.length !== 1 ? 's' : ''} encontrado
                {displayedProducts.length !== 1 ? 's' : ''}
              </span>
              {filters.category && (
                <span className="text-sm bg-amber-200 px-3 py-1 rounded-full">
                  📂 {filters.category}
                </span>
              )}
              {filters.location && (
                <span className="text-sm bg-amber-200 px-3 py-1 rounded-full">
                  📍 {filters.location}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>

          {displayedProducts.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No se encontraron productos con los filtros aplicados.
              </p>
            </div>
          )}

          {canLoadMore && !maxItems && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Cargando...' : 'Cargar más productos'}
              </button>
            </div>
          )}

          {pagination.total > 0 && (
            <div className="text-center mt-4 text-sm text-gray-600">
              Mostrando {displayedProducts.length} de {pagination.total}{' '}
              productos
            </div>
          )}
        </>
      )}

      {/* Modal de detalles del producto (simplificado) */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <p>
                <strong>Productor:</strong> {selectedProduct.producer}
              </p>
              <p>
                <strong>Ubicación:</strong>{' '}
                {selectedProduct.location.municipality}
              </p>
              <p>
                <strong>Precio:</strong> €{selectedProduct.price.toFixed(2)} /{' '}
                {selectedProduct.unit}
              </p>
              <p>
                <strong>Descripción:</strong> {selectedProduct.description}
              </p>
              {selectedProduct.certifications.length > 0 && (
                <div>
                  <strong>Certificaciones:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedProduct.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex space-x-3">
              <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                Contactar Productor
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
export { ProductCard, ProductFilters };
