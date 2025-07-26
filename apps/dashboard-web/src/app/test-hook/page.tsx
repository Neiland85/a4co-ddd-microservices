'use client';

import React, { useEffect, useState } from 'react';
import { useProducts, useProductSearch } from '../../hooks/useProducts';

export default function TestHookPage() {
  const [renderCount, setRenderCount] = useState(0);
  const products = useProducts({ autoFetch: false });
  const productSearch = useProductSearch();

  // Contador de renders para detectar loops infinitos
  useEffect(() => {
    setRenderCount((prev) => prev + 1);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">🧪 Test de Hook useProducts</h1>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="font-semibold mb-2">Estado del Hook</h2>
          <p>
            Renders: <span className="font-mono text-lg">{renderCount}</span>
          </p>
          <p>Loading: {products.loading ? 'Sí' : 'No'}</p>
          <p>Productos: {products.products.length}</p>
          <p>Error: {products.error || 'Ninguno'}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="font-semibold mb-2">Test de Búsqueda</h2>
          <input
            type="text"
            value={productSearch.searchTerm}
            onChange={(e) => productSearch.setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <p>Término de búsqueda: {productSearch.searchTerm}</p>
          <p>Buscando: {productSearch.isSearching ? 'Sí' : 'No'}</p>
          <p>Resultados: {productSearch.products.length}</p>
        </div>

        <div className="space-x-2">
          <button
            onClick={() => products.fetchProducts()}
            disabled={products.loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Cargar Productos
          </button>

          <button
            onClick={() => products.filterByCategory('aceite')}
            disabled={products.loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Filtrar Aceites
          </button>

          <button
            onClick={() => products.reset()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reset
          </button>
        </div>

        {renderCount > 100 && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
            <p className="text-red-700 font-semibold">
              ⚠️ ADVERTENCIA: Demasiados re-renders detectados ({renderCount}).
              Esto indica un posible loop infinito.
            </p>
          </div>
        )}

        {products.products.length > 0 && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Productos Cargados:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {products.products.slice(0, 4).map((product) => (
                <div key={product.id} className="border p-2 rounded">
                  <p className="font-medium text-sm">{product.name}</p>
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
