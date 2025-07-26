'use client';

import { useProducts } from '../../hooks/useProducts';
import { useEffect, useRef } from 'react';

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
      <h1 className="text-2xl font-bold mb-4">
        Prueba Simple del Hook useProducts
      </h1>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="font-semibold mb-2">Estado del Hook</h2>
        <p>
          Renders:{' '}
          <span className="font-mono text-lg text-green-600">
            {renderCount.current}
          </span>
        </p>
        <p>Loading: {loading ? 'Sí' : 'No'}</p>
        <p>Productos: {products.length}</p>
        <p>Error: {error || 'Ninguno'}</p>
      </div>

      {loading && (
        <div className="text-center py-4">
          <p>Cargando productos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {products.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Productos ({products.length})</h2>
          <ul className="space-y-2">
            {products.map((product, index) => (
              <li key={product.id || index} className="border-b pb-2">
                <strong>{product.name}</strong> - {product.category}
                <br />
                <span className="text-sm text-gray-600">
                  {product.location}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Si ves que el número de renders se mantiene estable (no aumenta
        constantemente), entonces el problema de renders infinitos está
        solucionado.
      </div>
    </div>
  );
}
