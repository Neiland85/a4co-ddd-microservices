import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/Button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Filter, Download, Upload, Eye, Edit, Trash2, Plus } from 'lucide-react';

export default function Invoices(): React.ReactElement {
  const invoices = [
    {
      id: 'INV-2024-001',
      supplier: 'Tech Solutions S.L.',
      amount: '€2,450.00',
      date: '2024-01-15',
      status: 'Procesada',
      tax: '€441.00',
    },
    {
      id: 'INV-2024-002',
      supplier: 'Office Supplies Ltd',
      amount: '€890.50',
      date: '2024-01-14',
      status: 'Pendiente',
      tax: '€160.29',
    },
    {
      id: 'INV-2024-003',
      supplier: 'Cloud Services Inc',
      amount: '€1,250.00',
      date: '2024-01-13',
      status: 'En Revisión',
      tax: '€225.00',
    },
    {
      id: 'INV-2024-004',
      supplier: 'Marketing Agency',
      amount: '€3,200.00',
      date: '2024-01-12',
      status: 'Procesada',
      tax: '€576.00',
    },
    {
      id: 'INV-2024-005',
      supplier: 'Consulting Partners',
      amount: '€1,800.00',
      date: '2024-01-11',
      status: 'Rechazada',
      tax: '€324.00',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Procesada': return 'bg-green-100 text-green-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'En Revisión': return 'bg-blue-100 text-blue-800';
      case 'Rechazada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturas</h1>
          <p className="text-gray-600">Gestión y procesamiento de facturas</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Importar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por proveedor, ID o monto..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            <label htmlFor="invoice-status-filter" className="sr-only">
              Filtrar por estado de factura
            </label>
            <select
              id="invoice-status-filter"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Filtrar por estado de factura"
            >
              <option value="">Todos los estados</option>
              <option value="procesada">Procesada</option>
              <option value="pendiente">Pendiente</option>
              <option value="revision">En Revisión</option>
              <option value="rechazada">Rechazada</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">ID Factura</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Proveedor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Monto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">IVA</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{invoice.id}</td>
                    <td className="py-3 px-4">{invoice.supplier}</td>
                    <td className="py-3 px-4 text-gray-600">{invoice.date}</td>
                    <td className="py-3 px-4 font-medium">{invoice.amount}</td>
                    <td className="py-3 px-4">{invoice.tax}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="p-1">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-1">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-1 text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">€9,590.50</div>
            <p className="text-sm text-gray-600">Total Facturado</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">€1,726.29</div>
            <p className="text-sm text-gray-600">IVA Recuperable</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <p className="text-sm text-gray-600">Pendientes de Procesar</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">1</div>
            <p className="text-sm text-gray-600">En Revisión</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
