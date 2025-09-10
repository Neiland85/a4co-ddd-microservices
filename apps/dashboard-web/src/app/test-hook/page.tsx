'use client';

import React, { useEffect, useState } from 'react';
import { useProducts, useProductSearch } from '../../hooks/useProducts';

export default function TestHookPage() {
  const [renderCount, setRenderCount] = useState(0);
  const products = useProducts({ autoFetch: false });
  const productSearch = useProductSearch();

  // Contador de renders para detectar loops infinitos
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-2xl font-bold">🧪 Test de Hook useProducts</h1>

        <div className="mb-4 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 font-semibold">Estado del Hook</h2>
          <p>
            Renders: <span className="font-mono text-lg">{renderCount}</span>
          </p>
          <p>Loading: {products.loading ? 'Sí' : 'No'}</p>
          <p>Productos: {products.products.length}</p>
          <p>Error: {products.error || 'Ninguno'}</p>
        </div>

        <div className="mb-4 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 font-semibold">Test de Búsqueda</h2>
          <input
            type="text"
            value={productSearch.searchTerm}
            onChange={e => productSearch.setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="mb-2 w-full rounded border px-3 py-2"
          />
          <p>Término de búsqueda: {productSearch.searchTerm}</p>
          <p>Buscando: {productSearch.isSearching ? 'Sí' : 'No'}</p>
          <p>Resultados: {productSearch.products.length}</p>
        </div>

        <div className="space-x-2">
          <button
            onClick={() => products.fetchProducts()}
            disabled={products.loading}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Cargar Productos
          </button>

          <button
            onClick={() => products.filterByCategory('aceite')}
            disabled={products.loading}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            Filtrar Aceites
          </button>

          <button
            onClick={() => products.reset()}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Reset
          </button>
        </div>

        {renderCount > 100 && (
          <div className="mt-4 rounded border border-red-400 bg-red-100 p-4">
            <p className="font-semibold text-red-700">
              ⚠️ ADVERTENCIA: Demasiados re-renders detectados ({renderCount}). Esto indica un
              posible loop infinito.
            </p>
          </div>
        )}

        {products.products.length > 0 && (
          <div className="mt-4 rounded-lg bg-white p-4 shadow">
            <h3 className="mb-2 font-semibold">Productos Cargados:</h3>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {products.products.slice(0, 4).map(product => (
                <div key={product.id} className="rounded border p-2">
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-gray-600">{product.producer}</p>
                  <p className="text-xs">€{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
