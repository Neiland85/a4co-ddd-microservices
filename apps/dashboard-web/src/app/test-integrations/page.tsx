// Página de demostración y testing de todas las integraciones
'use client';

import React, { useState } from 'react';
import { useSalesOpportunities } from '../../hooks/useSalesOpportunities';
import { useProducts, useProductSearch } from '../../hooks/useProducts';
import { useArtisans } from '../../hooks/useArtisans';
import { useGeolocation } from '../../hooks/useGeolocation';
import V0ComponentExample from '../../components/v0/V0ComponentTemplate';

interface TestSectionProps {
  title: string;
  children: React.ReactNode;
}

const TestSection: React.FC<TestSectionProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
    {children}
  </div>
);

interface ApiTestProps {
  title: string;
  endpoint: string;
  onTest: () => Promise<void>;
  loading: boolean;
  data: any;
  error: string | null;
}

const ApiTest: React.FC<ApiTestProps> = ({
  title,
  endpoint,
  onTest,
  loading,
  data,
  error,
}) => (
  <div className="border rounded-lg p-4 mb-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-medium text-gray-800">{title}</h3>
      <button
        onClick={onTest}
        disabled={loading}
        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test API'}
      </button>
    </div>
    <p className="text-sm text-gray-600 mb-2">
      Endpoint: <code>{endpoint}</code>
    </p>

    {error && (
      <div className="bg-red-50 border border-red-200 rounded p-2 mb-2">
        <p className="text-red-600 text-sm">Error: {error}</p>
      </div>
    )}

    {data && (
      <div className="bg-green-50 border border-green-200 rounded p-2">
        <p className="text-green-600 text-sm mb-1">✅ Respuesta exitosa:</p>
        <pre className="text-xs text-gray-600 overflow-x-auto">
          {JSON.stringify(data, null, 2).slice(0, 200)}...
        </pre>
      </div>
    )}
  </div>
);

const IntegrationTestPage: React.FC = () => {
  const [apiResults, setApiResults] = useState<{ [key: string]: any }>({});
  const [apiLoading, setApiLoading] = useState<{ [key: string]: boolean }>({});
  const [apiErrors, setApiErrors] = useState<{ [key: string]: string }>({});

  // Hooks para testing
  const salesOpportunities = useSalesOpportunities({ autoFetch: false });
  const products = useProducts({ autoFetch: false });
  const productSearch = useProductSearch();
  const artisans = useArtisans({ autoFetch: false });
  const geolocation = useGeolocation({ autoStart: false });

  const testApi = async (key: string, endpoint: string, params?: string) => {
    setApiLoading((prev) => ({ ...prev, [key]: true }));
    setApiErrors((prev) => ({ ...prev, [key]: '' }));

    try {
      const url = params ? `${endpoint}?${params}` : endpoint;
      const response = await fetch(url);
      const data = await response.json();
      setApiResults((prev) => ({ ...prev, [key]: data }));
    } catch (error) {
      setApiErrors((prev) => ({
        ...prev,
        [key]: error instanceof Error ? error.message : 'Error desconocido',
      }));
    } finally {
      setApiLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const testGeolocation = async () => {
    await geolocation.getCurrentLocation();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Test de Integraciones API + Hooks + UI
          </h1>
          <p className="text-gray-600">
            Demostración completa de todas las funcionalidades implementadas
          </p>
        </div>

        {/* Tests de APIs */}
        <TestSection title="🌐 Tests de APIs Backend">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ApiTest
              title="Sales Opportunities API"
              endpoint="/api/sales-opportunities"
              onTest={() =>
                testApi('opportunities', '/api/sales-opportunities')
              }
              loading={apiLoading.opportunities || false}
              data={apiResults.opportunities}
              error={apiErrors.opportunities || null}
            />

            <ApiTest
              title="Products API"
              endpoint="/api/products"
              onTest={() => testApi('products', '/api/products')}
              loading={apiLoading.products || false}
              data={apiResults.products}
              error={apiErrors.products || null}
            />

            <ApiTest
              title="Artisans API"
              endpoint="/api/artisans"
              onTest={() => testApi('artisans', '/api/artisans')}
              loading={apiLoading.artisans || false}
              data={apiResults.artisans}
              error={apiErrors.artisans || null}
            />

            <ApiTest
              title="Products with Filters"
              endpoint="/api/products?category=aceite"
              onTest={() =>
                testApi(
                  'productsFiltered',
                  '/api/products',
                  'category=aceite&available=true'
                )
              }
              loading={apiLoading.productsFiltered || false}
              data={apiResults.productsFiltered}
              error={apiErrors.productsFiltered || null}
            />
          </div>
        </TestSection>

        {/* Tests de Hooks */}
        <TestSection title="🎣 Tests de Hooks Personalizados">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Opportunities Hook */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">
                useSalesOpportunities
              </h3>
              <button
                onClick={() => salesOpportunities.fetchOpportunities()}
                disabled={salesOpportunities.loading}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 mb-2"
              >
                {salesOpportunities.loading
                  ? 'Cargando...'
                  : 'Cargar Oportunidades'}
              </button>

              <div className="text-sm space-y-1">
                <p>📊 Total: {salesOpportunities.total}</p>
                <p>🔄 Loading: {salesOpportunities.loading ? 'Sí' : 'No'}</p>
                <p>❌ Error: {salesOpportunities.error || 'Ninguno'}</p>
                <p>
                  📋 Datos:{' '}
                  {salesOpportunities.hasData ? 'Disponibles' : 'Sin datos'}
                </p>
              </div>

              {salesOpportunities.opportunities.length > 0 && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                  <p>
                    Última oportunidad:{' '}
                    {salesOpportunities.opportunities[0].title}
                  </p>
                </div>
              )}
            </div>

            {/* Products Hook */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">useProducts</h3>
              <div className="space-x-2 mb-2">
                <button
                  onClick={() => products.fetchProducts()}
                  disabled={products.loading}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  Cargar Productos
                </button>
                <button
                  onClick={() => products.filterByCategory('aceite')}
                  disabled={products.loading}
                  className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700 disabled:opacity-50"
                >
                  Filtrar Aceite
                </button>
              </div>

              <div className="text-sm space-y-1">
                <p>📦 Productos: {products.products.length}</p>
                <p>📄 Total: {products.pagination.total}</p>
                <p>➕ Más páginas: {products.canLoadMore ? 'Sí' : 'No'}</p>
                <p>🔍 Filtrado: {products.isFiltered ? 'Sí' : 'No'}</p>
              </div>
            </div>

            {/* Artisans Hook */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">useArtisans</h3>
              <button
                onClick={() => artisans.fetchArtisans()}
                disabled={artisans.loading}
                className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 mb-2"
              >
                {artisans.loading ? 'Cargando...' : 'Cargar Artesanos'}
              </button>

              <div className="text-sm space-y-1">
                <p>👨‍🌾 Artesanos: {artisans.artisans.length}</p>
                <p>✅ Verificados: {artisans.verifiedArtisans.length}</p>
                <p>⭐ Top rated: {artisans.topRatedArtisans.length}</p>
                <p>
                  🏘️ Ubicaciones:{' '}
                  {
                    new Set(
                      artisans.artisans.map((a) => a.location.municipality)
                    ).size
                  }
                </p>
              </div>
            </div>

            {/* Geolocation Hook */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">useGeolocation</h3>
              <button
                onClick={testGeolocation}
                disabled={geolocation.loading}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 mb-2"
              >
                {geolocation.loading ? 'Obteniendo...' : 'Obtener Ubicación'}
              </button>

              <div className="text-sm space-y-1">
                <p>
                  📍 Ubicación:{' '}
                  {geolocation.hasLocation ? 'Disponible' : 'No disponible'}
                </p>
                <p>🏛️ En Jaén: {geolocation.isLocationInJaen ? 'Sí' : 'No'}</p>
                <p>❌ Error: {geolocation.error || 'Ninguno'}</p>
                {geolocation.location && (
                  <p>
                    📌 Municipio:{' '}
                    {geolocation.location.municipality || 'Desconocido'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </TestSection>

        {/* Test de búsqueda en tiempo real */}
        <TestSection title="🔍 Test de Búsqueda en Tiempo Real">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar productos (con debounce):
              </label>
              <input
                type="text"
                value={productSearch.searchTerm}
                onChange={(e) => productSearch.setSearchTerm(e.target.value)}
                placeholder="Escribe 'aceite', 'queso', 'miel'..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-sm text-gray-600">
              <p>Resultados encontrados: {productSearch.products.length}</p>
              {productSearch.loading && <p>🔄 Buscando...</p>}
              {productSearch.isSearching && (
                <p>🔍 Búsqueda activa: "{productSearch.searchTerm}"</p>
              )}
            </div>

            {productSearch.products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productSearch.products.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-600">{product.producer}</p>
                    <p className="text-xs text-gray-600">
                      📍 {product.location.municipality}
                    </p>
                    <p className="text-sm font-medium text-green-600">
                      €{product.price}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TestSection>

        {/* Test de filtros combinados */}
        <TestSection title="🎛️ Test de Filtros Combinados">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría:
                </label>
                <select
                  onChange={(e) => products.filterByCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Todas</option>
                  <option value="aceite">Aceite</option>
                  <option value="queso">Queso</option>
                  <option value="miel">Miel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación:
                </label>
                <select
                  onChange={(e) => products.filterByLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Todas</option>
                  <option value="Úbeda">Úbeda</option>
                  <option value="Cazorla">Cazorla</option>
                  <option value="Andújar">Andújar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especiales:
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => products.getSeasonalProducts()}
                    className="w-full px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                  >
                    Solo Temporada
                  </button>
                  <button
                    onClick={() => products.getAvailableProducts()}
                    className="w-full px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Solo Disponibles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TestSection>

        {/* Resumen de estado */}
        <TestSection title="📊 Resumen de Estado Global">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {salesOpportunities.opportunities.length}
              </div>
              <div className="text-sm text-blue-800">Oportunidades</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {products.products.length}
              </div>
              <div className="text-sm text-green-800">Productos</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {artisans.artisans.length}
              </div>
              <div className="text-sm text-purple-800">Artesanos</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {geolocation.hasLocation ? '✅' : '❌'}
              </div>
              <div className="text-sm text-red-800">Geolocalización</div>
            </div>
          </div>
        </TestSection>

        {/* Sección V0 Integration Testing */}
        <TestSection title="🎨 V0 Integration Testing">
          <div className="space-y-4">
            <p className="text-gray-600">
              Ejemplo de integración con componentes generados en V0.dev
            </p>
            <V0ComponentExample />
          </div>
        </TestSection>

        {/* Link al dashboard principal */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🏠 Volver al Dashboard Principal
          </a>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTestPage;
