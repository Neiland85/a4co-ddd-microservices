'use client';

import { useApiOrders, useApiProducts, useDashboardStats } from '../../hooks/useApi';

export default function Dashboard(): React.ReactElement {
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { products, loading: productsLoading } = useApiProducts();
  const { orders, loading: ordersLoading } = useApiOrders();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">📊 A4CO Monitoring Dashboard</h1>
              <span className="ml-4 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                Phase 2 - 25% External Beta
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Última actualización: {new Date().toLocaleString('es-ES')}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* System Status */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Estado del Sistema</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Productos</h3>
                  <p className="text-xs text-gray-500">{statsLoading ? '...' : '99.9% uptime'}</p>
                </div>
                <span className="status-healthy rounded-full px-2 py-1 text-xs font-medium">
                  operational
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Pedidos</h3>
                  <p className="text-xs text-gray-500">{statsLoading ? '...' : '99.8% uptime'}</p>
                </div>
                <span className="status-healthy rounded-full px-2 py-1 text-xs font-medium">
                  operational
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Analytics</h3>
                  <p className="text-xs text-gray-500">100% uptime</p>
                </div>
                <span className="status-healthy rounded-full px-2 py-1 text-xs font-medium">
                  operational
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">APIs Externas</h3>
                  <p className="text-xs text-gray-500">{statsLoading ? '...' : '99.5% uptime'}</p>
                </div>
                <span className="status-healthy rounded-full px-2 py-1 text-xs font-medium">
                  operational
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Métricas Clave</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Productos Activos</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? '...' : stats.totalProducts}
                  </p>
                  <p className="text-sm text-green-600">↗️ +12.3%</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Pedidos del Mes</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? '...' : stats.totalOrders}
                  </p>
                  <p className="text-sm text-green-600">↗️ +8.1%</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    €{statsLoading ? '...' : stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">↗️ +25.2%</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-500">Colaboraciones</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? '...' : stats.activeCollaborations}
                  </p>
                  <p className="text-sm text-green-600">↗️ +15.7%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Navegación</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <a
              href="/marketplace"
              className="rounded-lg bg-blue-500 p-6 text-center text-white transition-colors hover:bg-blue-600"
            >
              <div className="mb-2 text-2xl">🛒</div>
              <h3 className="font-semibold">Marketplace</h3>
              <p className="text-sm opacity-90">Explorar productos disponibles</p>
            </a>

            <a
              href="/analytics"
              className="rounded-lg bg-green-500 p-6 text-center text-white transition-colors hover:bg-green-600"
            >
              <div className="mb-2 text-2xl">📊</div>
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-sm opacity-90">Métricas y análisis detallado</p>
            </a>

            <a
              href="/settings"
              className="rounded-lg bg-purple-500 p-6 text-center text-white transition-colors hover:bg-purple-600"
            >
              <div className="mb-2 text-2xl">⚙️</div>
              <h3 className="font-semibold">Configuración</h3>
              <p className="text-sm opacity-90">Administrar tu cuenta</p>
            </a>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Alertas Activas</h2>
          <div className="space-y-3">
            <div className="rounded-lg border-l-4 border-green-400 bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Sistema operativo correctamente
                  </p>
                  <p className="text-xs text-gray-500">2 minutos atrás</p>
                </div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  info
                </span>
              </div>
            </div>

            <div className="rounded-lg border-l-4 border-blue-400 bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Nuevo pedido registrado</p>
                  <p className="text-xs text-gray-500">5 minutos atrás</p>
                </div>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  info
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Actividad Reciente</h2>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="divide-y divide-gray-200">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-3 text-green-500">✅</span>
                    <p className="text-sm font-medium text-gray-900">
                      Producto agregado al marketplace
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">1 hora atrás</p>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-3 text-blue-500">📦</span>
                    <p className="text-sm font-medium text-gray-900">Pedido #1234 procesado</p>
                  </div>
                  <p className="text-sm text-gray-500">2 horas atrás</p>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-3 text-purple-500">👥</span>
                    <p className="text-sm font-medium text-gray-900">Nueva colaboración iniciada</p>
                  </div>
                  <p className="text-sm text-gray-500">3 horas atrás</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .status-healthy {
          @apply bg-green-100 text-green-800;
        }
      `}</style>
    </div>
  );
}
