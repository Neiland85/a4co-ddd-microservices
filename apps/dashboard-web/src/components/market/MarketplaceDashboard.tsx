// Página principal integrada del Mercado Local de Jaén
'use client';

import React, { useState } from 'react';
import { useMarketLocations } from '../../hooks/useGeolocation';
import {
  useSalesOpportunities,
  useHighPriorityOpportunities,
} from '../../hooks/useSalesOpportunities';
import {
  useSeasonalProducts,
  useAvailableProducts,
} from '../../hooks/useProducts';
import { useVerifiedArtisans } from '../../hooks/useArtisans';
import ProductCatalog from './ProductCatalog';
import ProductSearch from './ProductSearch';

interface LocationInfoProps {
  location: {
    coordinates: { latitude: number; longitude: number };
    municipality?: string;
    province?: string;
  } | null;
  isInJaen: boolean;
  loading: boolean;
  error: string | null;
  onRequestLocation: () => void;
}

const LocationInfo: React.FC<LocationInfoProps> = ({
  location,
  isInJaen,
  loading,
  error,
  onRequestLocation,
}) => {
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-blue-800">Obteniendo tu ubicación...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-amber-800">📍 {error}</span>
          <button
            onClick={onRequestLocation}
            className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-green-800">
            📍 Habilita la ubicación para ver productos cercanos
          </span>
          <button
            onClick={onRequestLocation}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Activar ubicación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg p-4 mb-6 ${
        isInJaen ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={isInJaen ? 'text-green-800' : 'text-blue-800'}>
          <span className="font-medium">
            📍 {location.municipality ? `${location.municipality}, ` : ''}
            {location.province || 'Tu ubicación'}
          </span>
          {isInJaen && (
            <span className="ml-2 text-sm">
              🎉 ¡Estás en la provincia de Jaén!
            </span>
          )}
        </div>
        {!isInJaen && (
          <span className="text-blue-600 text-sm">
            Visita Jaén para disfrutar de productos locales
          </span>
        )}
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
}) => {
  return (
    <div className={`bg-white border-l-4 ${color} p-4 rounded-lg shadow-sm`}>
      <div className="flex items-center">
        <div className="text-2xl mr-3">{icon}</div>
        <div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          <div className="text-sm font-medium text-gray-600">{title}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

interface MarketStatsProps {
  productsCount: number;
  artisansCount: number;
  opportunitiesCount: number;
  loading: boolean;
}

const MarketStats: React.FC<MarketStatsProps> = ({
  productsCount,
  artisansCount,
  opportunitiesCount,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg shadow-sm animate-pulse"
          >
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatsCard
        title="Productos Locales"
        value={productsCount}
        subtitle="Disponibles ahora"
        icon="🛒"
        color="border-green-500"
      />
      <StatsCard
        title="Productores Verificados"
        value={artisansCount}
        subtitle="En toda la provincia"
        icon="👨‍🌾"
        color="border-blue-500"
      />
      <StatsCard
        title="Oportunidades de Venta"
        value={opportunitiesCount}
        subtitle="Eventos y mercados"
        icon="📅"
        color="border-amber-500"
      />
    </div>
  );
};

interface QuickActionsProps {
  onSearchProducts: () => void;
  onViewOpportunities: () => void;
  onContactArtisans: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onSearchProducts,
  onViewOpportunities,
  onContactArtisans,
}) => {
  const actions = [
    {
      title: 'Buscar Productos',
      description: 'Encuentra productos locales de temporada',
      icon: '🔍',
      action: onSearchProducts,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Ver Oportunidades',
      description: 'Mercados, ferias y eventos locales',
      icon: '📅',
      action: onViewOpportunities,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Conectar Artesanos',
      description: 'Contacta directamente con productores',
      icon: '🤝',
      action: onContactArtisans,
      color: 'bg-amber-600 hover:bg-amber-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {actions.map((action) => (
        <button
          key={action.title}
          onClick={action.action}
          className={`${action.color} text-white p-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105`}
        >
          <div className="text-3xl mb-2">{action.icon}</div>
          <h3 className="font-bold text-lg mb-1">{action.title}</h3>
          <p className="text-sm opacity-90">{action.description}</p>
        </button>
      ))}
    </div>
  );
};

const MarketplaceDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<
    'dashboard' | 'search' | 'catalog'
  >('dashboard');

  // Hooks para datos
  const geolocation = useMarketLocations();
  const seasonalProducts = useSeasonalProducts();
  const availableProducts = useAvailableProducts();
  const verifiedArtisans = useVerifiedArtisans();
  const highPriorityOpportunities = useHighPriorityOpportunities();

  const isLoading =
    seasonalProducts.loading ||
    availableProducts.loading ||
    verifiedArtisans.loading ||
    highPriorityOpportunities.loading;

  const renderContent = () => {
    switch (activeView) {
      case 'search':
        return <ProductSearch title="Buscar Productos Locales de Jaén" />;
      case 'catalog':
        return <ProductCatalog title="Catálogo de Productos Locales" />;
      default:
        return (
          <>
            {/* Información de ubicación */}
            <LocationInfo
              location={geolocation.location}
              isInJaen={geolocation.isLocationInJaen}
              loading={geolocation.loading}
              error={geolocation.error}
              onRequestLocation={geolocation.getCurrentLocation}
            />

            {/* Estadísticas del mercado */}
            <MarketStats
              productsCount={availableProducts.products.length}
              artisansCount={verifiedArtisans.artisans.length}
              opportunitiesCount={highPriorityOpportunities.count}
              loading={isLoading}
            />

            {/* Acciones rápidas */}
            <QuickActions
              onSearchProducts={() => setActiveView('search')}
              onViewOpportunities={() =>
                window.open('/api/sales-opportunities', '_blank')
              }
              onContactArtisans={() => alert('Funcionalidad en desarrollo')}
            />

            {/* Vista previa de productos estacionales */}
            {seasonalProducts.products.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    🌿 Productos de Temporada
                  </h3>
                  <button
                    onClick={() => setActiveView('catalog')}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Ver todos →
                  </button>
                </div>
                <ProductCatalog title="" showFilters={false} maxItems={4} />
              </div>
            )}

            {/* Información sobre ubicaciones cercanas */}
            {geolocation.nearbyLocations.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  📍 Lugares de Interés Cercanos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {geolocation.nearbyLocations
                    .slice(0, 4)
                    .map((location, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800">
                          {location.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {location.description}
                        </p>
                        <p className="text-xs text-blue-600">
                          📍 {location.distance?.toFixed(1)} km de distancia
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`text-2xl font-bold transition-colors ${
                  activeView === 'dashboard'
                    ? 'text-green-700'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                🌿 Mercado Local de Jaén
              </button>
            </div>

            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'dashboard'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                Inicio
              </button>
              <button
                onClick={() => setActiveView('search')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'search'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                Buscar
              </button>
              <button
                onClick={() => setActiveView('catalog')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'catalog'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                Catálogo
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">{renderContent()}</main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              🌿 Mercado Local de Jaén - Conectando productores y consumidores
            </p>
            <p className="text-sm">
              Promoviendo el comercio sostenible y los productos artesanales de
              nuestra región
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketplaceDashboard;
