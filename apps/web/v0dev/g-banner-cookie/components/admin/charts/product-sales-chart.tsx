'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductSalesData } from '../../../types/analytics-types';

interface ProductSalesChartProps {
  readonly data: ProductSalesData[];
  readonly className?: string;
}

const categoryColors: Record<string, string> = {
  panaderia: '#b08968',
  queseria: '#f4d03f',
  aceite: '#8a9b73',
  embutidos: '#cd6155',
  miel: '#f7dc6f',
  conservas: '#85c1e9',
  vinos: '#8e44ad',
  dulces: '#f1948a',
  artesania: '#82e0aa',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    const data = payload[0].payload;
    return (
      <div className="shadow-natural-lg min-w-48 rounded-lg border border-gray-200 bg-white p-4">
        <p className="mb-2 font-medium text-gray-900">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Ventas:</span>
            <span className="text-sm font-semibold text-gray-900">{data.sales}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Ingresos:</span>
            <span className="text-sm font-semibold text-gray-900">€{data.revenue.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Crecimiento:</span>
            <span
              className={cn(
                'flex items-center text-sm font-semibold',
                data.growth >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {data.growth >= 0 ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {Math.abs(data.growth).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ProductSalesChart({ data, className }: ProductSalesChartProps) {
  const [sortBy, setSortBy] = useState<'sales' | 'revenue'>('sales');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const sortedData = [...data].sort((a, b) => b[sortBy] - a[sortBy]);
  const topProducts = sortedData.slice(0, 10);

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
            <CardTitle className="flex items-center">
              <Package className="text-a4co-olive-600 mr-2 h-5 w-5" />
              Productos Más Vendidos
            </CardTitle>
            <CardDescription>Top 10 productos por ventas e ingresos</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={sortBy === 'sales' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('sales')}
              className="transition-all duration-300 hover:scale-105"
            >
              Por Ventas
            </Button>
            <Button
              variant={sortBy === 'revenue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('revenue')}
              className="transition-all duration-300 hover:scale-105"
            >
              Por Ingresos
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Top 3 Products Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {topProducts.slice(0, 3).map((product, index) => (
            <div
              key={product.name}
              className="hover:shadow-natural-md cursor-pointer rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100 p-4 transition-all duration-300 hover:scale-105"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="from-a4co-olive-400 to-a4co-clay-400 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white">
                  {index + 1}
                </div>
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: `${categoryColors[product.category]}20`,
                    borderColor: categoryColors[product.category],
                    color: categoryColors[product.category],
                  }}
                >
                  {product.category}
                </Badge>
              </div>
              <h4 className="mb-1 truncate font-medium text-gray-900">{product.name}</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ventas: {product.sales}</span>
                <span className="font-semibold text-gray-900">€{product.revenue.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProducts}
              layout="horizontal"
              onMouseMove={e =>
                setHoveredBar(
                  typeof e?.activeTooltipIndex === 'number' ? e.activeTooltipIndex : null
                )
              }
              onMouseLeave={() => setHoveredBar(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={value => (sortBy === 'revenue' ? `€${value}` : value.toString())}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={120}
                tickFormatter={value =>
                  value.length > 15 ? `${value.substring(0, 15)}...` : value
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={sortBy} radius={[0, 4, 4, 0]}>
                {topProducts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={categoryColors[entry.category] || '#8a9b73'}
                    style={{
                      filter: hoveredBar === index ? 'brightness(1.1)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product List */}
        <div className="mt-6 space-y-2">
          <h4 className="mb-3 font-medium text-gray-900">Lista Completa de Productos</h4>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {sortedData.map((product, index) => (
              <div
                key={product.name}
                className="hover:scale-102 group flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 transition-all duration-300 hover:bg-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="from-a4co-olive-400 to-a4co-clay-400 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <div className="group-hover:text-a4co-olive-600 font-medium text-gray-900 transition-colors">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {product.sales} ventas
                    </div>
                    <div className="text-sm text-gray-600">€{product.revenue.toFixed(2)}</div>
                  </div>
                  <div
                    className={cn(
                      'flex items-center text-sm font-medium',
                      product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {product.growth >= 0 ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(product.growth).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
