// apps/dashboard-web/src/components/v0/adapted/InteractiveMapV0.tsx
// Versión adaptada del InteractiveMap de v0.dev para el mercado local de Jaén
'use client';

import React from 'react';
import { useGeolocation } from '../../../hooks/useGeolocation';
import { useSalesOpportunities } from '../../../hooks/useSalesOpportunities';
import InteractiveMapV0Raw from '../raw/InteractiveMap';

const InteractiveMapV0: React.FC = () => {
  const { location: userLocation, loading: locationLoading } = useGeolocation();
  const { opportunities, loading: opportunitiesLoading } = useSalesOpportunities();

  const isLoading = locationLoading || opportunitiesLoading;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600"></div>
        <span className="ml-3 text-gray-600">Cargando mapa...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 p-4 text-white">
        <h2 className="mb-2 text-xl font-bold">🗺️ Mapa Interactivo - Mercado Local de Jaén</h2>
        <p className="text-sm opacity-90">
          Descubre comercios locales, productores y puntos de venta en la provincia
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div>📍 {userLocation ? 'Ubicación detectada' : 'Ubicación no disponible'}</div>
          <div>🏪 {opportunities?.length || 0} comercios activos</div>
        </div>
      </div>

      {/* Nota: El componente raw tiene datos hardcodeados. En una versión futura,
          podríamos modificar el componente raw para aceptar props dinámicas */}
      <div className="relative">
        <InteractiveMapV0Raw />
        <div className="absolute right-4 top-4 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur-sm">
          <h3 className="mb-2 text-sm font-semibold">Próximamente:</h3>
          <ul className="space-y-1 text-xs">
            <li>• Comercios locales de Jaén</li>
            <li>• Productores agrícolas</li>
            <li>• Mercados municipales</li>
            <li>• Rutas de distribución</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapV0;
