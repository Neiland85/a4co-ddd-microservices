'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Server, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Metric {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  status: 'up' | 'down' | 'stable';
}

export function MetricsOverview() {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      title: 'Usuarios Activos',
      value: '2,847',
      change: 12.5,
      icon: <Users className="h-4 w-4" />,
      status: 'up',
    },
    {
      title: 'Tiempo de Respuesta',
      value: '245ms',
      change: -8.2,
      icon: <Activity className="h-4 w-4" />,
      status: 'up',
    },
    {
      title: 'Uso del Servidor',
      value: '67%',
      change: 3.1,
      icon: <Server className="h-4 w-4" />,
      status: 'stable',
    },
    {
      title: 'Alertas de Seguridad',
      value: '3',
      change: -50,
      icon: <Shield className="h-4 w-4" />,
      status: 'up',
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev =>
        prev.map(metric => ({
          ...metric,
          value:
            metric.title === 'Usuarios Activos'
              ? `${Math.floor(Math.random() * 1000 + 2500)}`
              : metric.title === 'Tiempo de Respuesta'
                ? `${Math.floor(Math.random() * 100 + 200)}ms`
                : metric.title === 'Uso del Servidor'
                  ? `${Math.floor(Math.random() * 30 + 50)}%`
                  : metric.value,
          change: Math.random() * 20 - 10,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (status: string, change: number) => {
    if (Math.abs(change) < 1) return <Minus className="h-3 w-3" />;
    return change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getTrendColor = (status: string, change: number) => {
    if (Math.abs(change) < 1) return 'text-muted-foreground';
    if (status === 'up') return change > 0 ? 'text-green-600' : 'text-red-600';
    return change > 0 ? 'text-red-600' : 'text-green-600';
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <div className="text-muted-foreground">{metric.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center space-x-1 text-xs">
              <span className={getTrendColor(metric.status, metric.change)}>
                {getTrendIcon(metric.status, metric.change)}
              </span>
              <span className={getTrendColor(metric.status, metric.change)}>
                {Math.abs(metric.change).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs último período</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
