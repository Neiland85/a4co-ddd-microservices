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

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
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
      gradients[category as keyof typeof gradients] || 'from-stone-100 via-amber-50 to-stone-200'
    );
  };

  const getAvailabilityStatus = () => {
    if (!product.available) return { text: 'No disponible', color: 'text-red-600' };
    if (product.stock <= 5) return { text: 'Pocas unidades', color: 'text-orange-600' };
    return { text: 'Disponible', color: 'text-green-600' };
  };

  const availability = getAvailabilityStatus();

  return (
    <div className="group transform overflow-hidden rounded-xl border border-amber-100 bg-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <div
          className={`h-52 bg-gradient-to-br ${getCategoryGradient(product.category)} relative flex items-center justify-center`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-amber-200/20"></div>
          <span className="z-10 text-7xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
            {getCategoryIcon(product.category)}
          </span>
          {/* Patrón decorativo tipo Jaén */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"></div>
        </div>

        {/* Badge de categoría mejorado */}
        <div className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
          {product.category}
        </div>

        {product.seasonal && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
            🌿 Temporada
          </div>
        )}

        {/* Indicador de origen Jaén */}
        <div className="absolute bottom-3 left-3 rounded-full border border-amber-200 bg-white/90 px-2 py-1 text-xs font-medium text-amber-800 backdrop-blur-sm">
          🏛️ Jaén
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="mb-1 line-clamp-2 text-xl font-bold text-amber-900 transition-colors group-hover:text-amber-800">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-amber-700">👨‍🌾 {product.producer}</p>
        </div>

        <div className="flex items-center text-sm text-amber-600">
          <span className="mr-2">📍</span>
          <span>{product.location.municipality}</span>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="text-right">
            <span className="text-2xl font-bold text-amber-800">€{product.price.toFixed(2)}</span>
            <span className="ml-1 text-sm text-amber-600">/ {product.unit}</span>
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
              {product.certifications.slice(0, 2).map(cert => (
                <span
                  key={cert}
                  className="rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800"
                >
                  ✓ {cert}
                </span>
              ))}
              {product.certifications.length > 2 && (
                <span className="text-xs font-medium text-amber-600">
                  +{product.certifications.length - 2} más certificaciones
                </span>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => onViewDetails?.(product)}
          className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-amber-700 hover:via-yellow-700 hover:to-amber-700 hover:shadow-xl"
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
    <div className="mb-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50 p-6 shadow-xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl">🔍</span>
        <h3 className="text-2xl font-bold text-amber-900">Filtros del Mercado</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label
            htmlFor="category-select"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800"
          >
            🏷️ Categoría
          </label>
          <select
            id="category-select"
            value={filters.category || ''}
            onChange={e => onCategoryChange(e.target.value)}
            className="w-full rounded-xl border-2 border-amber-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-amber-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="location-select"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-800"
          >
            📍 Ubicación
          </label>
          <select
            id="location-select"
            value={filters.location || ''}
            onChange={e => onLocationChange(e.target.value)}
            className="w-full rounded-xl border-2 border-amber-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-amber-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {municipalities.map(municipality => (
              <option key={municipality.value} value={municipality.value}>
                {municipality.icon} {municipality.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-green-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-green-300">
            <input
              type="checkbox"
              checked={filters.seasonal || false}
              onChange={e => onSeasonalToggle(e.target.checked)}
              className="h-5 w-5 rounded border-2 border-green-300 text-green-600 focus:ring-2 focus:ring-green-500"
            />
            <span className="flex items-center gap-2 text-sm font-medium text-green-800">
              🌿 Solo Temporada
            </span>
          </label>
        </div>

        <div className="flex items-center justify-center">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-emerald-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-emerald-300">
            <input
              type="checkbox"
              checked={filters.available || false}
              onChange={e => onAvailableToggle(e.target.checked)}
              className="h-5 w-5 rounded border-2 border-emerald-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
            />
            <span className="flex items-center gap-2 text-sm font-medium text-emerald-800">
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
  const [selectedProduct, setSelectedProduct] = useState<LocalProduct | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    seasonal: false,
    available: true,
  });

  const { products, loading, error, pagination, fetchProducts, loadMore, canLoadMore } =
    useProducts({
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
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={() => fetchProducts()}
          className="mt-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Header del Catálogo con estilo Jaén */}
      <div className="mb-8 text-center">
        <div className="relative inline-block">
          <h2 className="mb-2 bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-800 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            {title}
          </h2>
          <div className="absolute -bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        </div>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-amber-700">
          🫒 Descubre los mejores productos artesanales de la provincia de Jaén, directamente de
          nuestros productores locales 🏺
        </p>
      </div>

      {showFilters && (
        <ProductFilters
          filters={filters}
          onCategoryChange={category => handleFilterChange({ category })}
          onLocationChange={location => handleFilterChange({ location })}
          onSeasonalToggle={seasonal => handleFilterChange({ seasonal })}
          onAvailableToggle={available => handleFilterChange({ available })}
        />
      )}

      {loading && products.length === 0 ? (
        <div className="py-12 text-center">
          <div className="relative inline-block">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600"></div>
            <span className="absolute inset-0 flex items-center justify-center text-2xl">🫒</span>
          </div>
          <p className="mt-6 text-lg font-medium text-amber-700">
            Cargando productos del mercado...
          </p>
          <p className="text-sm text-amber-600">Buscando los mejores productos de Jaén</p>
        </div>
      ) : (
        <>
          {/* Estadísticas del catálogo */}
          <div className="mb-6 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4">
            <div className="flex items-center justify-between text-amber-800">
              <span className="flex items-center gap-2 font-medium">
                <span>📊</span>
                {displayedProducts.length} producto
                {displayedProducts.length !== 1 ? 's' : ''} encontrado
                {displayedProducts.length !== 1 ? 's' : ''}
              </span>
              {filters.category && (
                <span className="rounded-full bg-amber-200 px-3 py-1 text-sm">
                  📂 {filters.category}
                </span>
              )}
              {filters.location && (
                <span className="rounded-full bg-amber-200 px-3 py-1 text-sm">
                  📍 {filters.location}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedProducts.map(product => (
              <ProductCard key={product.id} product={product} onViewDetails={setSelectedProduct} />
            ))}
          </div>

          {displayedProducts.length === 0 && !loading && (
            <div className="py-8 text-center">
              <p className="text-gray-600">
                No se encontraron productos con los filtros aplicados.
              </p>
            </div>
          )}

          {canLoadMore && !maxItems && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Cargando...' : 'Cargar más productos'}
              </button>
            </div>
          )}

          {pagination.total > 0 && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Mostrando {displayedProducts.length} de {pagination.total} productos
            </div>
          )}
        </>
      )}

      {/* Modal de detalles del producto (simplificado) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
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
                <strong>Ubicación:</strong> {selectedProduct.location.municipality}
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
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedProduct.certifications.map(cert => (
                      <span
                        key={cert}
                        className="rounded-full bg-green-100 px-2 py-1 text-sm text-green-800"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex space-x-3">
              <button className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                Contactar Productor
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
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
