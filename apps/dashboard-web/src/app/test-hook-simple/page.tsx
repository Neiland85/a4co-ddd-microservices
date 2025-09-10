'use client';

import { useProducts } from '../../hooks/useProducts';
import { useEffect, useRef } from 'react';

// Tipo para la ubicación del producto
type ProductLocation = string | { municipality?: string } | null | undefined;

// Función auxiliar para formatear la ubicación del producto
function formatProductLocation(location: ProductLocation): string {
  if (typeof location === 'string') {
    return location;
  }

  if (location && typeof location === 'object') {
    if (location.municipality) {
      return `Municipio: ${location.municipality}`;
    }
    return JSON.stringify(location);
  }

  return '';
}

export default function TestHookSimple() {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const { products, loading, error } = useProducts({
    autoFetch: true,
    limit: 5,
  });

  useEffect(() => {
    console.log('Hook renderizado:', renderCount.current, 'veces');
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-4 text-2xl font-bold">Prueba Simple del Hook useProducts</h1>

      <div className="mb-4 rounded-lg bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold">Estado del Hook</h2>
        <p>
          Renders: <span className="font-mono text-lg text-green-600">{renderCount.current}</span>
        </p>
        <p>Loading: {loading ? 'Sí' : 'No'}</p>
        <p>Productos: {products.length}</p>
        <p>Error: {error || 'Ninguno'}</p>
      </div>

      {loading && (
        <div className="py-4 text-center">
          <p>Cargando productos...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          Error: {error}
        </div>
      )}

      {products.length > 0 && (
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 font-semibold">Productos ({products.length})</h2>
          <ul className="space-y-2">
            {products.map((product, index) => (
              <li key={product.id || index} className="border-b pb-2">
                <strong>{product.name}</strong> - {product.category}
                <br />
                <span className="text-sm text-gray-600">
                  {formatProductLocation(product.location)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Si ves que el número de renders se mantiene estable (no aumenta constantemente), entonces el
        problema de renders infinitos está solucionado.
      </div>
    </div>
  );
}
