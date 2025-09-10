// Página principal integrada del Mercado Local de Jaén
'use client';

import React, { useState } from 'react';
import { useMarketLocations } from '../../hooks/useGeolocation';
import { useHighPriorityOpportunities } from '../../hooks/useSalesOpportunities';
import { useSeasonalProducts, useAvailableProducts } from '../../hooks/useProducts';
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
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center">
          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span className="text-blue-800">Obteniendo tu ubicación...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-amber-800">📍 {error}</span>
          <button
            onClick={onRequestLocation}
            className="rounded bg-amber-600 px-3 py-1 text-sm text-white hover:bg-amber-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-green-800">
            📍 Habilita la ubicación para ver productos cercanos
          </span>
          <button
            onClick={onRequestLocation}
            className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
          >
            Activar ubicación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mb-6 rounded-lg border p-4 ${
        isInJaen ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={isInJaen ? 'text-green-800' : 'text-blue-800'}>
          <span className="font-medium">
            📍 {location.municipality ? `${location.municipality}, ` : ''}
            {location.province || 'Tu ubicación'}
          </span>
          {isInJaen && <span className="ml-2 text-sm">🎉 ¡Estás en la provincia de Jaén!</span>}
        </div>
        {!isInJaen && (
          <span className="text-sm text-blue-600">
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

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className={`border-l-4 bg-white ${color} rounded-lg p-4 shadow-sm`}>
      <div className="flex items-center">
        <div className="mr-3 text-2xl">{icon}</div>
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
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 h-8 rounded bg-gray-200"></div>
            <div className="h-4 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
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
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {actions.map(action => (
        <button
          key={action.title}
          onClick={action.action}
          className={`${action.color} transform rounded-lg p-6 text-white shadow-md transition-all duration-200 hover:scale-105`}
        >
          <div className="mb-2 text-3xl">{action.icon}</div>
          <h3 className="mb-1 text-lg font-bold">{action.title}</h3>
          <p className="text-sm opacity-90">{action.description}</p>
        </button>
      ))}
    </div>
  );
};

const MarketplaceDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'search' | 'catalog'>('dashboard');

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
              onViewOpportunities={() => window.open('/api/sales-opportunities', '_blank')}
              onContactArtisans={() => alert('Funcionalidad en desarrollo')}
            />

            {/* Vista previa de productos estacionales */}
            {seasonalProducts.products.length > 0 && (
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">🌿 Productos de Temporada</h3>
                  <button
                    onClick={() => setActiveView('catalog')}
                    className="font-medium text-green-600 hover:text-green-700"
                  >
                    Ver todos →
                  </button>
                </div>
                <ProductCatalog title="" showFilters={false} maxItems={4} />
              </div>
            )}

            {/* Información sobre ubicaciones cercanas */}
            {geolocation.nearbyLocations.length > 0 && (
              <div className="rounded-lg bg-blue-50 p-6">
                <h3 className="mb-4 text-xl font-bold text-blue-800">
                  📍 Lugares de Interés Cercanos
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {geolocation.nearbyLocations.slice(0, 4).map(location => {
                    // Destructuración segura para evitar problemas de tipos
                    const { name, type, distance, ...extraProps } = location as any;
                    const description = extraProps.description;

                    return (
                      <div key={name} className="rounded-lg bg-white p-4">
                        <h4 className="font-medium text-gray-800">{name}</h4>
                        <p className="mb-1 text-sm text-gray-600">{type}</p>
                        {description && <p className="mb-2 text-xs text-gray-500">{description}</p>}
                        <p className="text-xs text-blue-600">
                          📍 {distance?.toFixed(1)} km de distancia
                        </p>
                      </div>
                    );
                  })}
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
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
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
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  activeView === 'dashboard'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                Inicio
              </button>
              <button
                onClick={() => setActiveView('search')}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  activeView === 'search'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                Buscar
              </button>
              <button
                onClick={() => setActiveView('catalog')}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
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
      <main className="mx-auto max-w-7xl px-4 py-8">{renderContent()}</main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">🌿 Mercado Local de Jaén - Conectando productores y consumidores</p>
            <p className="text-sm">
              Promoviendo el comercio sostenible y los productos artesanales de nuestra región
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketplaceDashboard;
