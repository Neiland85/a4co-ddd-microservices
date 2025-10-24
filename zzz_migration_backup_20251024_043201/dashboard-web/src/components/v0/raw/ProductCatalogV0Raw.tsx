// 🔒 CÓDIGO ORIGINAL V0.DEV - NO MODIFICAR DIRECTAMENTE
// Fuente: Componente de catálogo de productos para mercado local
// Fecha de creación: 2025-08-02 02:22:33
// Tipo de componente: catalog

'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Tipos de datos para el catálogo
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  producer: string;
  location: string;
  stock: number;
  available: boolean;
  seasonal: boolean;
  certifications: string[];
  image?: string;
}

interface ProductCatalogV0RawProps {
  readonly products?: readonly Product[];
  readonly onProductSelect?: (product: Product) => void;
  readonly showFilters?: boolean;
  readonly maxItems?: number;
  readonly loading?: boolean;
  readonly title?: string;
}

// Datos de ejemplo para demostración
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Aceite de Oliva Virgen Extra Picual',
    category: 'aceites',
    price: 12.5,
    unit: '500ml',
    producer: 'Olivares del Guadalquivir',
    location: 'Úbeda',
    stock: 25,
    available: true,
    seasonal: true,
    certifications: ['Ecológico', 'DO Jaén', 'Primera Cosecha'],
    image: '/images/aceite-picual.jpg',
  },
  {
    id: '2',
    name: 'Aceitunas Gordales de Jaén',
    category: 'aceitunas',
    price: 8.9,
    unit: '1kg',
    producer: 'Aceitunas del Sur',
    location: 'Jaén',
    stock: 15,
    available: true,
    seasonal: false,
    certifications: ['Ecológico', 'DO Jaén'],
    image: '/images/aceitunas-gordales.jpg',
  },
  {
    id: '3',
    name: 'Miel de Romero de Sierra Mágina',
    category: 'mieles',
    price: 15.0,
    unit: '500g',
    producer: 'Apicultura Mágina',
    location: 'Sierra Mágina',
    stock: 8,
    available: true,
    seasonal: true,
    certifications: ['Ecológico', 'Miel de Montaña'],
    image: '/images/miel-romero.jpg',
  },
  {
    id: '4',
    name: 'Queso de Cabra Artesanal',
    category: 'lácteos',
    price: 18.5,
    unit: '400g',
    producer: 'Quesería Sierra de Cazorla',
    location: 'Cazorla',
    stock: 0,
    available: false,
    seasonal: false,
    certifications: ['Artesanal', 'DO Queso de Cabra'],
    image: '/images/queso-cabra.jpg',
  },
];

export default function ProductCatalogV0Raw({
  products = sampleProducts,
  onProductSelect,
  showFilters = true,
  maxItems,
  loading = false,
  title = '🫒 Productos Locales de Jaén',
}: Readonly<ProductCatalogV0RawProps>) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showOnlySeasonal, setShowOnlySeasonal] = useState(false);

  // Generar IDs únicos para los skeleton items
  const skeletonIds = useMemo(() => {
    return Array.from({ length: 8 }, (_, index) => `skeleton-item-${index}`);
  }, []);

  // Filtrado de productos
  const filteredProducts = products
    .filter(product => !selectedCategory || product.category === selectedCategory)
    .filter(product => !showOnlyAvailable || product.available)
    .filter(product => !showOnlySeasonal || product.seasonal)
    .slice(0, maxItems || products.length);

  // Categorías únicas
  const categories = [...new Set(products.map(p => p.category))];

  const handleProductClick = (product: Product) => {
    onProductSelect?.(product);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl p-6">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-amber-800">{title}</h2>
          <p className="text-amber-600">Cargando productos...</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skeletonIds.map(skeletonId => (
            <Card key={skeletonId} className="animate-pulse">
              <CardHeader>
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-3 w-1/2 rounded bg-gray-200"></div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 h-32 rounded bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-3 rounded bg-gray-200"></div>
                  <div className="h-3 w-2/3 rounded bg-gray-200"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-2 bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-800 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
          {title}
        </h2>
        <p className="text-lg text-amber-700">
          Descubre los mejores productos artesanales de la provincia de Jaén
        </p>
      </div>

      {/* Filtros */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {/* Filtro por categoría */}
              <div className="flex flex-col gap-2">
                <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-label="Filtrar por categoría de producto"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtros de disponibilidad */}
              <div className="flex items-center gap-4">
                <label
                  htmlFor="available-filter"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    id="available-filter"
                    type="checkbox"
                    checked={showOnlyAvailable}
                    onChange={e => setShowOnlyAvailable(e.target.checked)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    aria-label="Mostrar solo productos disponibles"
                  />
                  <span className="text-sm">Solo disponibles</span>
                </label>
                <label htmlFor="seasonal-filter" className="flex cursor-pointer items-center gap-2">
                  <input
                    id="seasonal-filter"
                    type="checkbox"
                    checked={showOnlySeasonal}
                    onChange={e => setShowOnlySeasonal(e.target.checked)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    aria-label="Mostrar solo productos de temporada"
                  />
                  <span className="text-sm">De temporada</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid de productos */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map(product => (
          <Card
            key={product.id}
            className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              !product.available ? 'opacity-60' : ''
            }`}
            onClick={() => handleProductClick(product)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-amber-800">
                  {product.name}
                </CardTitle>
                <Badge
                  variant={product.available ? 'default' : 'secondary'}
                  className={
                    product.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }
                >
                  {product.available ? 'Disponible' : 'Agotado'}
                </Badge>
              </div>
              <CardDescription className="text-sm text-gray-600">
                {product.producer} • {product.location}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Imagen placeholder */}
              <div className="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100">
                <span className="text-2xl text-amber-600">🫒</span>
              </div>

              {/* Precio */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-2xl font-bold text-amber-800">
                  {product.price.toFixed(2)}€
                </span>
                <span className="text-sm text-gray-500">/{product.unit}</span>
              </div>

              {/* Certificaciones */}
              {product.certifications.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {product.certifications.slice(0, 2).map(cert => (
                    <Badge key={`${product.id}-cert-${cert}`} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                  {product.certifications.length > 2 && (
                    <Badge key={`${product.id}-cert-more`} variant="outline" className="text-xs">
                      +{product.certifications.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Indicadores especiales */}
              <div className="mb-4 flex items-center gap-2">
                {product.seasonal && (
                  <Badge
                    variant="outline"
                    className="border-green-200 bg-green-50 text-xs text-green-700"
                  >
                    🌿 Temporada
                  </Badge>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <Badge
                    variant="outline"
                    className="border-orange-200 bg-orange-50 text-xs text-orange-700"
                  >
                    ⚠️ Últimas unidades
                  </Badge>
                )}
              </div>

              <Separator className="mb-4" />

              {/* Botón de acción */}
              <Button
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-700 hover:to-yellow-700"
                disabled={!product.available}
              >
                {product.available ? '👁️ Ver Detalles' : 'Agotado'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado vacío */}
      {filteredProducts.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <div className="mb-4 text-6xl">🫒</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No se encontraron productos
            </h3>
            <p className="mb-4 text-gray-600">Intenta ajustar los filtros para ver más productos</p>
            <Button
              onClick={() => {
                setSelectedCategory('');
                setShowOnlyAvailable(false);
                setShowOnlySeasonal(false);
              }}
              variant="outline"
            >
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Contador de productos */}
      {filteredProducts.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-600">
          Mostrando {filteredProducts.length} de {products.length} productos
        </div>
      )}
    </div>
  );
}

// Metadata del componente
ProductCatalogV0Raw.displayName = 'ProductCatalogV0Raw';
