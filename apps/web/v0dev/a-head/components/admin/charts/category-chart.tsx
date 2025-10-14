'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, Progress } from '@/components/ui';
import { PieChartIcon, BarChart3, Palette, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CategoryAnalytics } from '../../../types/analytics-types';

interface CategoryChartProps {
  data: CategoryAnalytics[];
  className?: string;
}

const categoryLabels = {
  panaderia: 'Panadería',
  queseria: 'Quesería',
  aceite: 'Aceite',
  embutidos: 'Embutidos',
  miel: 'Miel',
  conservas: 'Conservas',
  vinos: 'Vinos',
  dulces: 'Dulces',
  artesania: 'Artesanía',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="shadow-natural-lg rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-2 flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-medium text-gray-900">
            {categoryLabels[data.category] || data.category}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Ventas:</span>
            <span className="text-sm font-semibold text-gray-900">€{data.value.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Porcentaje:</span>
            <span className="text-sm font-semibold text-gray-900">
              {data.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percentage < 5) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
    >
      {`${percentage.toFixed(0)}%`}
    </text>
  );
};

export default function CategoryChart({ data, className }: CategoryChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
  const maxRevenue = Math.max(...data.map(cat => cat.totalRevenue));

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const totalValue = data.reduce((sum, item) => sum + item.totalRevenue, 0);

  return (
    <Card
      className={cn(
        'shadow-natural-lg hover:shadow-natural-xl transition-all duration-300',
        className
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-600" />
              Rendimiento por Categoría
            </CardTitle>
            <CardDescription>Distribución de ventas por tipo de producto</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'chart' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('chart')}
              className="transition-all duration-300 hover:scale-105"
            >
              <PieChartIcon className="mr-1 h-4 w-4" />
              Gráfico
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="transition-all duration-300 hover:scale-105"
            >
              <BarChart3 className="mr-1 h-4 w-4" />
              Lista
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {viewMode === 'chart' ? (
          <div className="space-y-6">
            {/* Pie Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="totalRevenue"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={activeIndex === index ? '#fff' : 'none'}
                        strokeWidth={activeIndex === index ? 3 : 0}
                        style={{
                          filter:
                            activeIndex === index
                              ? 'brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                              : 'none',
                          transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                          transformOrigin: 'center',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {data.map((item, index) => {
                const revenuePercentage = (item.totalRevenue / maxRevenue) * 100;

                return (
                  <div
                    key={item.category}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    className={cn(
                      'hover:shadow-natural-md flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all duration-300',
                      activeIndex === index
                        ? 'scale-105 border-gray-300 bg-gray-50'
                        : 'border-gray-200 bg-white'
                    )}
                  >
                    <div
                      className="h-4 w-4 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-gray-900">
                        {categoryLabels[item.category] || item.category}
                      </div>
                      <div className="text-xs text-gray-500">
                        €{item.totalRevenue.toLocaleString()} ({item.percentage.toFixed(1)}%)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        €{item.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">{item.totalSales} ventas</div>
                    </div>
                    <Progress value={revenuePercentage} className="mt-2 h-2" />
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span>Precio promedio: €{item.averagePrice.toFixed(2)}</span>
                        <span>Top: {item.topProduct}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        {revenuePercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {data
              .sort((a, b) => b.totalRevenue - a.totalRevenue)
              .map((category, index) => {
                const revenuePercentage = (category.totalRevenue / maxRevenue) * 100;

                return (
                  <div
                    key={category.category}
                    className="hover:scale-102 group flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="from-a4co-olive-400 to-a4co-clay-400 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <div className="group-hover:text-a4co-olive-600 font-medium text-gray-900 transition-colors">
                            {categoryLabels[category.category] || category.category}
                          </div>
                          <div className="text-sm text-gray-500">
                            {category.percentage.toFixed(1)}% del total
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        €{category.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">{category.totalSales} ventas</div>
                    </div>
                    <Progress value={revenuePercentage} className="mt-2 h-2" />
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span>Precio promedio: €{category.averagePrice.toFixed(2)}</span>
                        <span>Top: {category.topProduct}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        {revenuePercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Summary */}
        <div className="from-a4co-olive-50 to-a4co-clay-50 border-a4co-olive-200 mt-6 rounded-lg border bg-gradient-to-r p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Total de Ventas</h4>
              <p className="text-sm text-gray-600">{data.length} categorías activas</p>
            </div>
            <div className="text-right">
              <div className="text-a4co-olive-700 text-2xl font-bold">
                €{totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Ingresos totales</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
