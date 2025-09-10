'use client';

import { useState } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, UserCheck, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CustomerData } from '../../../types/analytics-types';

interface CustomerChartProps {
  readonly data: CustomerData[];
  readonly className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="shadow-natural-lg rounded-lg border border-gray-200 bg-white p-4">
        <p className="mb-2 font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-gray-600">{entry.name}:</span>
            <span className="text-sm font-semibold text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CustomerChart({ data, className }: CustomerChartProps) {
  const [chartType, setChartType] = useState<'composed' | 'bar'>('composed');

  const totalNewCustomers = data.reduce((sum, item) => sum + item.newCustomers, 0);
  const totalReturningCustomers = data.reduce((sum, item) => sum + item.returningCustomers, 0);
  const totalCustomers = data.reduce((sum, item) => sum + item.totalCustomers, 0);
  const retentionRate = totalCustomers > 0 ? (totalReturningCustomers / totalCustomers) * 100 : 0;

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
              <Users className="text-a4co-olive-600 mr-2 h-5 w-5" />
              Análisis de Clientes
            </CardTitle>
            <CardDescription>Evolución de clientes nuevos y recurrentes</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setChartType('composed')}
              className={cn(
                'transition-all duration-300 hover:scale-105',
                chartType === 'composed'
                  ? 'bg-a4co-olive-600 text-white'
                  : 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50'
              )}
            >
              Combinado
            </Button>
            <Button
              onClick={() => setChartType('bar')}
              className={cn(
                'transition-all duration-300 hover:scale-105',
                chartType === 'bar'
                  ? 'bg-a4co-olive-600 text-white'
                  : 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50'
              )}
            >
              Barras
            </Button>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Nuevos</p>
                <p className="text-2xl font-bold text-blue-700">{totalNewCustomers}</p>
              </div>
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Recurrentes</p>
                <p className="text-2xl font-bold text-green-700">{totalReturningCustomers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="from-a4co-olive-50 to-a4co-clay-50 border-a4co-olive-200 rounded-lg border bg-gradient-to-r p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-a4co-olive-700 text-2xl font-bold">{totalCustomers}</p>
              </div>
              <Users className="text-a4co-olive-600 h-8 w-8" />
            </div>
          </div>

          <div className="rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Retención</p>
                <p className="flex items-center text-2xl font-bold text-purple-700">
                  <TrendingUp className="mr-1 h-5 w-5" />
                  {retentionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {chartType === 'composed' ? (
                <>
                  <Bar
                    dataKey="newCustomers"
                    name="Clientes Nuevos"
                    fill="#3b82f6"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="returningCustomers"
                    name="Clientes Recurrentes"
                    fill="#10b981"
                    radius={[2, 2, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalCustomers"
                    name="Total Clientes"
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
                </>
              ) : (
                <>
                  <Bar
                    dataKey="newCustomers"
                    name="Clientes Nuevos"
                    fill="#3b82f6"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="returningCustomers"
                    name="Clientes Recurrentes"
                    fill="#10b981"
                    radius={[2, 2, 0, 0]}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Insights */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 font-medium text-gray-900">Tendencias de Adquisición</h4>
            <div className="space-y-2">
              {data.slice(-3).map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{month.month}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                      +{month.newCustomers}
                    </Badge>
                    <span className="text-sm text-gray-500">nuevos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 font-medium text-gray-900">Retención por Mes</h4>
            <div className="space-y-2">
              {data.slice(-3).map((month, index) => {
                const monthRetention =
                  month.totalCustomers > 0
                    ? (month.returningCustomers / month.totalCustomers) * 100
                    : 0;
                return (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{month.month}</span>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          'border-green-200',
                          monthRetention >= 50
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        )}
                      >
                        {monthRetention.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
