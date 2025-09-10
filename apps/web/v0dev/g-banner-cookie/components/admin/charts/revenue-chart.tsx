'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Euro, Calendar, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SalesData } from '../../../types/analytics-types';
import { useRealTimeData } from '../../../hooks/use-websocket';
import type { RealTimeSalesUpdate } from '../../../types/websocket-types';

interface RevenueChartProps {
  readonly data: SalesData[];
  readonly className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="shadow-natural-lg rounded-lg border border-gray-200 bg-white p-4">
        <p className="mb-2 font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-gray-600">{entry.dataKey}:</span>
            <span className="text-sm font-semibold text-gray-900">
              {entry.dataKey === 'revenue' ? `€${entry.value.toFixed(2)}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ data, className }: RevenueChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const [realtimeData, setRealtimeData] = useState<SalesData[]>(data);
  const [isLive, setIsLive] = useState(false);
  const salesUpdates = useRealTimeData<RealTimeSalesUpdate>('SALES_UPDATE');

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const previousRevenue = data.slice(0, -7).reduce((sum, item) => sum + item.revenue, 0);
  const growth =
    previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  // Handle real-time updates
  useEffect(() => {
    if (!isLive || salesUpdates.data.length === 0) return;

    const latestUpdate = salesUpdates.data[0];
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newDataPoint: SalesData = {
      date: timeString,
      revenue: latestUpdate.revenue,
      orders: latestUpdate.orders,
      customers: latestUpdate.customers,
    };

    setRealtimeData(prevData => {
      const updatedData = [...prevData, newDataPoint];
      // Keep only last 20 points for performance
      return updatedData.slice(-20);
    });
  }, [salesUpdates.data, isLive]);

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
              <Euro className="text-a4co-olive-600 mr-2 h-5 w-5" />
              Ingresos por Ventas
            </CardTitle>
            <CardDescription>Evolución de los ingresos en el tiempo</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              className="transition-all duration-300 hover:scale-105"
            >
              Línea
            </Button>
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
              className="transition-all duration-300 hover:scale-105"
            >
              Área
            </Button>
            <Button
              variant={isLive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className={cn(
                'transition-all duration-300 hover:scale-105',
                isLive && 'animate-pulse bg-green-600 text-white hover:bg-green-700'
              )}
            >
              <Activity className="mr-1 h-3 w-3" />
              {isLive ? 'En Vivo' : 'Activar Live'}
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="from-a4co-olive-50 to-a4co-clay-50 border-a4co-olive-200 rounded-lg border bg-gradient-to-r p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-a4co-olive-700 text-2xl font-bold">€{totalRevenue.toFixed(2)}</p>
              </div>
              <Euro className="text-a4co-olive-600 h-8 w-8" />
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio Diario</p>
                <p className="text-2xl font-bold text-blue-700">
                  €{(totalRevenue / data.length).toFixed(2)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crecimiento</p>
                <p
                  className={cn(
                    'flex items-center text-2xl font-bold',
                    growth >= 0 ? 'text-green-700' : 'text-red-700'
                  )}
                >
                  {growth >= 0 ? (
                    <TrendingUp className="mr-1 h-5 w-5" />
                  ) : (
                    <TrendingDown className="mr-1 h-5 w-5" />
                  )}
                  {Math.abs(growth).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          {isLive && (
            <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estado</p>
                  <p className="flex items-center text-lg font-bold text-green-700">
                    <Activity className="mr-1 h-4 w-4 animate-pulse" />
                    Tiempo Real
                  </p>
                </div>
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart
                data={realtimeData}
                onMouseMove={e =>
                  setHoveredPoint(
                    typeof e?.activeTooltipIndex === 'number' ? e.activeTooltipIndex : null
                  )
                }
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8a9b73" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8a9b73" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={value => `€${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8a9b73"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={{ fill: '#8a9b73', strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: '#8a9b73',
                    strokeWidth: 2,
                    stroke: '#fff',
                    style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' },
                  }}
                />
              </AreaChart>
            ) : (
              <LineChart
                data={realtimeData}
                onMouseMove={e =>
                  setHoveredPoint(
                    typeof e?.activeTooltipIndex === 'number' ? e.activeTooltipIndex : null
                  )
                }
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={value => `€${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8a9b73"
                  strokeWidth={3}
                  dot={{ fill: '#8a9b73', strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: '#8a9b73',
                    strokeWidth: 2,
                    stroke: '#fff',
                    style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' },
                  }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
