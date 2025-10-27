import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Download, Filter } from 'lucide-react';

export default function Analytics(): React.ReactElement {
  const monthlyData = [
    { month: 'Ene', facturas: 45, subvenciones: 12000, iva: 8100 },
    { month: 'Feb', facturas: 52, subvenciones: 15000, iva: 9360 },
    { month: 'Mar', facturas: 48, subvenciones: 18000, iva: 8640 },
    { month: 'Abr', facturas: 61, subvenciones: 22000, iva: 10980 },
    { month: 'May', facturas: 55, subvenciones: 19000, iva: 9900 },
    { month: 'Jun', facturas: 67, subvenciones: 25000, iva: 12060 },
  ];

  const categoryData = [
    { category: 'Tecnología', amount: 45000, percentage: 35 },
    { category: 'Formación', amount: 32000, percentage: 25 },
    { category: 'Marketing', amount: 28000, percentage: 22 },
    { category: 'Infraestructura', amount: 18000, percentage: 14 },
    { category: 'Otros', amount: 5000, percentage: 4 },
  ];

  const kpis = [
    {
      title: 'Facturas Procesadas',
      value: '328',
      change: '+12.5%',
      trend: 'up',
      period: 'vs mes anterior',
    },
    {
      title: 'Subvenciones Obtenidas',
      value: '€111K',
      change: '+8.2%',
      trend: 'up',
      period: 'vs mes anterior',
    },
    {
      title: 'IVA Recuperado',
      value: '€58K',
      change: '+15.3%',
      trend: 'up',
      period: 'vs mes anterior',
    },
    {
      title: 'Tiempo Promedio',
      value: '2.3 días',
      change: '-0.4 días',
      trend: 'down',
      period: 'vs mes anterior',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Métricas y análisis de rendimiento tributario</p>
        </div>
        <div className="flex gap-3">
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500">{kpi.period}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Tendencias Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium w-12">{data.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex gap-1">
                      <div
                        className="bg-blue-500 h-6 rounded"
                        style={{ width: `${(data.facturas / 70) * 100}%` }}
                      ></div>
                      <div
                        className="bg-green-500 h-6 rounded"
                        style={{ width: `${(data.subvenciones / 30000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium">{data.facturas} facturas</div>
                    <div className="text-gray-500">€{data.subvenciones.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Facturas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Subvenciones</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Distribución por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                    ></div>
                    <span className="text-sm font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      €{item.amount.toLocaleString()}
                    </span>
                    <Badge variant="secondary" className="w-12 text-center">
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Processing Times */}
        <Card>
          <CardHeader>
            <CardTitle>Tiempos de Procesamiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Facturas OCR</span>
              <span className="font-medium">1.2 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Validación IVA</span>
              <span className="font-medium">3.5 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Aprobación Manual</span>
              <span className="font-medium">2.1 días</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Subvenciones</span>
              <span className="font-medium">5.8 días</span>
            </div>
          </CardContent>
        </Card>

        {/* Success Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Tasas de Éxito</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">OCR Precisión</span>
              <Badge className="bg-green-100 text-green-800">98.5%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">IVA Automático</span>
              <Badge className="bg-green-100 text-green-800">94.2%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Subvenciones Aprobadas</span>
              <Badge className="bg-blue-100 text-blue-800">76.8%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Procesamiento Completo</span>
              <Badge className="bg-green-100 text-green-800">91.3%</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Top Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insights Principales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">📈 Crecimiento Sostenido</p>
              <p className="text-xs text-green-600">Incremento del 15% en subvenciones obtenidas</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">⚡ Eficiencia Mejorada</p>
              <p className="text-xs text-blue-600">Reducción del 20% en tiempos de procesamiento</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">🎯 Oportunidad</p>
              <p className="text-xs text-yellow-600">3 nuevas subvenciones identificadas esta semana</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
