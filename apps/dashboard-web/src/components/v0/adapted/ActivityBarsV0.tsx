// apps/dashboard-web/src/components/v0/adapted/ActivityBarsV0.tsx
// Versión adaptada del ActivityBars de v0.dev para estadísticas del dashboard
'use client';

import { useProducts } from '../../../hooks/useProducts';
import { useSalesOpportunities } from '../../../hooks/useSalesOpportunities';
import ActivityBarsV0Raw from '../raw/ActivityBars';

export default function ActivityBarsV0() {
  const { opportunities, loading: opportunitiesLoading } = useSalesOpportunities();
  const { products, loading: productsLoading } = useProducts();

  // El componente raw usa datos hardcodeados sobre actividades alimenticias y IA.
  // Por ahora mostramos la versión original pero con un wrapper que indica
  // que está adaptado para estadísticas del dashboard

  if (opportunitiesLoading || productsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600"></div>
        <span className="ml-3 text-gray-600">Cargando estadísticas del dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 p-4 text-white">
        <h2 className="mb-2 text-xl font-bold">📊 Estadísticas del Mercado Local de Jaén</h2>
        <p className="text-sm opacity-90">Métricas de actividad y rendimiento del marketplace</p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div>📦 {products?.length || 0} productos activos</div>
          <div>💰 {opportunities?.length || 0} oportunidades de venta</div>
        </div>
      </div>

      {/* Nota: El componente raw tiene datos hardcodeados. En una versión futura,
          podríamos modificar el componente raw para aceptar props dinámicas */}
      <div className="relative">
        <ActivityBarsV0Raw />
        <div className="absolute right-4 top-4 rounded-lg bg-white/90 p-3 shadow-lg backdrop-blur-sm">
          <h3 className="mb-2 text-sm font-semibold">Próximamente:</h3>
          <ul className="space-y-1 text-xs">
            <li>• Ventas realizadas</li>
            <li>• Productos más vendidos</li>
            <li>• Crecimiento mensual</li>
            <li>• Satisfacción de usuarios</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
