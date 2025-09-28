export default function Dashboard(): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen general de tu actividad tributaria</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Exportar
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Nueva Factura
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <h3 className="text-sm font-medium opacity-90">Facturas Procesadas</h3>
          <div className="text-2xl font-bold">1,247</div>
          <p className="text-xs opacity-75">+12% vs mes anterior</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <h3 className="text-sm font-medium opacity-90">Subvenciones Identificadas</h3>
          <div className="text-2xl font-bold">€45,230</div>
          <p className="text-xs opacity-75">+8% vs mes anterior</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <h3 className="text-sm font-medium opacity-90">IVA Recuperado</h3>
          <div className="text-2xl font-bold">€12,450</div>
          <p className="text-xs opacity-75">+15% vs mes anterior</p>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
          <h3 className="text-sm font-medium opacity-90">Alertas Activas</h3>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs opacity-75">Requieren atención</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Facturas Recientes</h3>
          <div className="space-y-4">
            {[
              { id: "INV-001", amount: "€1,250.00", status: "Procesada", date: "2024-01-15" },
              { id: "INV-002", amount: "€890.50", status: "Pendiente", date: "2024-01-14" },
              { id: "INV-003", amount: "€2,100.00", status: "Revisión", date: "2024-01-13" },
            ].map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-gray-600">{invoice.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{invoice.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    invoice.status === 'Procesada' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              Subir Nueva Factura
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              Ver Analytics Detallado
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              Configurar Alertas
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              Generar Reporte Fiscal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}