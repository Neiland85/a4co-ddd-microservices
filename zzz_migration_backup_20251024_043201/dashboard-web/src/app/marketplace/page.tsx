'use client';

import { ProductCatalogV0 } from '../../components/ProductCatalogSimple';
import { useApiProducts } from '../../hooks/useApi';

export default function Marketplace(): React.ReactElement {
  const { products, loading, error } = useApiProducts();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Error al cargar productos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Marketplace A4CO</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Descubre productos únicos del pequeño comercio andaluz. Cada pieza representa la
            tradición, calidad y artesanía de nuestros comercios locales.
          </p>
          <p className="mt-2 text-sm text-gray-500">{products.length} productos disponibles</p>
        </div>
        <ProductCatalogV0 products={products} />
      </div>
    </div>
  );
}
