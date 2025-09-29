import { useApiOrders, useApiProducts, useDashboardStats } from '../../hooks/useApi';

export default function Dashboard(): React.ReactElement {
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { products, loading: productsLoading } = useApiProducts();
  const { orders, loading: ordersLoading } = useApiOrders();
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard A4CO</h1>
          <p className="text-gray-600">
            Resumen de tu actividad en la plataforma de comercio andaluz
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
            Exportar Datos
          </button>
          <button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Productos Activos</h3>
          <div className="text-2xl font-bold">{statsLoading ? '...' : stats.totalProducts}</div>
          <p className="text-xs opacity-75">+12% vs mes anterior</p>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Pedidos del Mes</h3>
          <div className="text-2xl font-bold">{statsLoading ? '...' : stats.totalOrders}</div>
          <p className="text-xs opacity-75">+8% vs mes anterior</p>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Ingresos Totales</h3>
          <div className="text-2xl font-bold">
            €{statsLoading ? '...' : stats.totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs opacity-75">+25% vs mes anterior</p>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Colaboraciones</h3>
          <div className="text-2xl font-bold">
            {statsLoading ? '...' : stats.activeCollaborations}
          </div>
          <p className="text-xs opacity-75">Activas actualmente</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Invoices */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Facturas Recientes</h3>
          <div className="space-y-4">
            {[
              { id: 'INV-001', amount: '€1,250.00', status: 'Procesada', date: '2024-01-15' },
              { id: 'INV-002', amount: '€890.50', status: 'Pendiente', date: '2024-01-14' },
              { id: 'INV-003', amount: '€2,100.00', status: 'Revisión', date: '2024-01-13' },
            ].map(invoice => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
              >
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-gray-600">{invoice.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{invoice.amount}</p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      invoice.status === 'Procesada'
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'Pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50">
              Subir Nueva Factura
            </button>
            <button className="w-full rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50">
              Ver Analytics Detallado
            </button>
            <button className="w-full rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50">
              Configurar Alertas
            </button>
            <button className="w-full rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50">
              Generar Reporte Fiscal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
