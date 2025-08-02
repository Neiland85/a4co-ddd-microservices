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
    id: "1",
    name: "Aceite de Oliva Virgen Extra Picual",
    category: "aceites",
    price: 12.50,
    unit: "500ml",
    producer: "Olivares del Guadalquivir",
    location: "Úbeda",
    stock: 25,
    available: true,
    seasonal: true,
    certifications: ["Ecológico", "DO Jaén", "Primera Cosecha"],
    image: "/images/aceite-picual.jpg"
  },
  {
    id: "2",
    name: "Aceitunas Gordales de Jaén",
    category: "aceitunas",
    price: 8.90,
    unit: "1kg",
    producer: "Aceitunas del Sur",
    location: "Jaén",
    stock: 15,
    available: true,
    seasonal: false,
    certifications: ["Ecológico", "DO Jaén"],
    image: "/images/aceitunas-gordales.jpg"
  },
  {
    id: "3",
    name: "Miel de Romero de Sierra Mágina",
    category: "mieles",
    price: 15.00,
    unit: "500g",
    producer: "Apicultura Mágina",
    location: "Sierra Mágina",
    stock: 8,
    available: true,
    seasonal: true,
    certifications: ["Ecológico", "Miel de Montaña"],
    image: "/images/miel-romero.jpg"
  },
  {
    id: "4",
    name: "Queso de Cabra Artesanal",
    category: "lácteos",
    price: 18.50,
    unit: "400g",
    producer: "Quesería Sierra de Cazorla",
    location: "Cazorla",
    stock: 0,
    available: false,
    seasonal: false,
    certifications: ["Artesanal", "DO Queso de Cabra"],
    image: "/images/queso-cabra.jpg"
  }
];

export default function ProductCatalogV0Raw({
  products = sampleProducts,
  onProductSelect,
  showFilters = true,
  maxItems,
  loading = false,
  title = "🫒 Productos Locales de Jaén"
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
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-amber-800 mb-2">{title}</h2>
          <p className="text-amber-600">Cargando productos...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skeletonIds.map((skeletonId) => (
            <Card key={skeletonId} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-800 bg-clip-text text-transparent mb-2">
          {title}
        </h2>
        <p className="text-amber-700 text-lg">
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
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                <label htmlFor="available-filter" className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="available-filter"
                    type="checkbox"
                    checked={showOnlyAvailable}
                    onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    aria-label="Mostrar solo productos disponibles"
                  />
                  <span className="text-sm">Solo disponibles</span>
                </label>
                <label htmlFor="seasonal-filter" className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="seasonal-filter"
                    type="checkbox"
                    checked={showOnlySeasonal}
                    onChange={(e) => setShowOnlySeasonal(e.target.checked)}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${!product.available ? 'opacity-60' : ''
              }`}
            onClick={() => handleProductClick(product)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-amber-800">
                  {product.name}
                </CardTitle>
                <Badge
                  variant={product.available ? "default" : "secondary"}
                  className={product.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                >
                  {product.available ? "Disponible" : "Agotado"}
                </Badge>
              </div>
              <CardDescription className="text-sm text-gray-600">
                {product.producer} • {product.location}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Imagen placeholder */}
              <div className="w-full h-32 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-amber-600 text-2xl">🫒</span>
              </div>

              {/* Precio */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-amber-800">
                  {product.price.toFixed(2)}€
                </span>
                <span className="text-sm text-gray-500">/{product.unit}</span>
              </div>

              {/* Certificaciones */}
              {product.certifications.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.certifications.slice(0, 2).map((cert) => (
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
              <div className="flex items-center gap-2 mb-4">
                {product.seasonal && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    🌿 Temporada
                  </Badge>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                    ⚠️ Últimas unidades
                  </Badge>
                )}
              </div>

              <Separator className="mb-4" />

              {/* Botón de acción */}
              <Button
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white"
                disabled={!product.available}
              >
                {product.available ? "👁️ Ver Detalles" : "Agotado"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado vacío */}
      {filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">🫒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar los filtros para ver más productos
            </p>
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
        <div className="text-center mt-8 text-sm text-gray-600">
          Mostrando {filteredProducts.length} de {products.length} productos
        </div>
      )}
    </div>
  );
}

// Metadata del componente
ProductCatalogV0Raw.displayName = 'ProductCatalogV0Raw';
