'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { RevenueData } from '@/types/analytics-types';
import { BarChart3, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

const DollarSignIcon = DollarSign as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const TrendingUpIcon = TrendingUp as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const TrendingDownIcon = TrendingDown as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const BarChart3Icon = BarChart3 as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

interface RevenueChartProps {
  readonly data: RevenueData;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const isPositiveGrowth = data.growthRate >= 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSignIcon className="h-5 w-5 text-green-600" />
            Análisis de Ingresos
          </CardTitle>
          <Badge
            className={isPositiveGrowth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
          >
            {isPositiveGrowth ? (
              <TrendingUpIcon className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDownIcon className="mr-1 h-3 w-3" />
            )}
            {Math.abs(data.growthRate).toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Revenue Summary */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="text-sm font-medium text-green-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-900">
                €{data.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <p className="text-sm font-medium text-blue-600">Proyección</p>
              <p className="text-2xl font-bold text-blue-900">
                €{data.projectedRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <p className="text-sm font-medium text-purple-600">Crecimiento</p>
              <p
                className={`text-2xl font-bold ${
                  isPositiveGrowth ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {data.growthRate > 0 ? '+' : ''}
                {data.growthRate.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Revenue Charts */}
          <Tabs defaultValue="monthly" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="daily">Diario</TabsTrigger>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
              <TabsTrigger value="yearly">Anual</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3Icon className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">Gráfico de ingresos diarios</p>
                  <p className="text-sm text-gray-500">{data.daily.length} puntos de datos</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3Icon className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">Gráfico de ingresos semanales</p>
                  <p className="text-sm text-gray-500">{data.weekly.length} puntos de datos</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3Icon className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">Gráfico de ingresos mensuales</p>
                  <p className="text-sm text-gray-500">{data.monthly.length} puntos de datos</p>
                </div>
              </div>

              {/* Monthly Data Table */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Datos Mensuales</h4>
                <div className="space-y-1">
                  {data.monthly
                    .slice(0, 6)
                    .map((point: { date: string; revenue: number; growthRate: number }) => (
                      <div
                        key={point.date} // Usar 'point.date' como clave única
                        className="grid grid-cols-3 gap-4 rounded-lg bg-white p-4 shadow-sm"
                      >
                        <div className="text-sm text-gray-500">
                          {new Intl.DateTimeFormat('es-ES', {
                            month: 'short',
                            year: 'numeric',
                          }).format(new Date(point.date))}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          €{point.revenue.toLocaleString()}
                        </div>
                        <div className="text-sm">
                          <div
                            className={`flex items-center ${
                              point.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {point.growthRate >= 0 ? (
                              <TrendingUpIcon className="mr-1 h-4 w-4" />
                            ) : (
                              <TrendingDownIcon className="mr-1 h-4 w-4" />
                            )}
                            {Math.abs(point.growthRate).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="yearly" className="space-y-4">
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3Icon className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">Gráfico de ingresos anuales</p>
                  <p className="text-sm text-gray-500">{data.yearly.length} puntos de datos</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
