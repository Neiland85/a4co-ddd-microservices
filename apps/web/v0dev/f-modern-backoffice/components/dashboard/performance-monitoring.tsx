'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface PerformanceData {
  time: string;
  responseTime: number;
  cpuUsage: number;
  memoryUsage: number;
}

interface CurrentMetrics {
  responseTime: number;
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
}

const INITIAL_METRICS: CurrentMetrics = {
  responseTime: 245,
  cpuUsage: 67,
  memoryUsage: 54,
  networkLatency: 12,
};

const DATA_POINTS_LIMIT = 20;
const UPDATE_INTERVAL = 3000;

export function PerformanceMonitoring() {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<CurrentMetrics>(INITIAL_METRICS);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Generador de datos optimizado con useCallback
  const generateInitialData = useCallback((): PerformanceData[] => {
    return Array.from({ length: DATA_POINTS_LIMIT }, (_, i) => ({
      time: new Date(Date.now() - (DATA_POINTS_LIMIT - 1 - i) * 60000).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      responseTime: Math.floor(Math.random() * 100 + 200),
      cpuUsage: Math.floor(Math.random() * 30 + 50),
      memoryUsage: Math.floor(Math.random() * 20 + 40),
    }));
  }, []);

  // Generador de punto de datos optimizado con useCallback
  const generateDataPoint = useCallback(
    (): PerformanceData => ({
      time: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      responseTime: Math.floor(Math.random() * 100 + 200),
      cpuUsage: Math.floor(Math.random() * 30 + 50),
      memoryUsage: Math.floor(Math.random() * 20 + 40),
    }),
    []
  );

  // Función recursiva con setTimeout optimizada
  const scheduleNextUpdate = useCallback(() => {
    if (!mountedRef.current) return;

    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      const newPoint = generateDataPoint();

      setData(prev => [...prev.slice(1), newPoint]);
      setCurrentMetrics({
        responseTime: newPoint.responseTime,
        cpuUsage: newPoint.cpuUsage,
        memoryUsage: newPoint.memoryUsage,
        networkLatency: Math.floor(Math.random() * 10 + 8),
      });

      scheduleNextUpdate();
    }, UPDATE_INTERVAL);
  }, [generateDataPoint]);

  useEffect(() => {
    mountedRef.current = true;
    setData(generateInitialData());
    scheduleNextUpdate();

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [generateInitialData, scheduleNextUpdate]);

  // Función de estado de badge memoizada
  const getStatusBadge = useCallback(
    (value: number, thresholds: { warning: number; critical: number }) => {
      if (value >= thresholds.critical) return <Badge variant="destructive">Crítico</Badge>;
      if (value >= thresholds.warning) return <Badge variant="secondary">Advertencia</Badge>;
      return (
        <Badge variant="default" className="bg-green-500">
          Normal
        </Badge>
      );
    },
    []
  );

  // Thresholds memoizados
  const cpuThresholds = useMemo(() => ({ warning: 70, critical: 85 }), []);
  const memoryThresholds = useMemo(() => ({ warning: 75, critical: 90 }), []);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Monitoreo de Rendimiento
          <Badge variant="outline">Tiempo Real</Badge>
        </CardTitle>
        <CardDescription>Métricas clave del sistema actualizadas cada 3 segundos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métricas actuales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">CPU</span>
              {getStatusBadge(currentMetrics.cpuUsage, cpuThresholds)}
            </div>
            <Progress value={currentMetrics.cpuUsage} className="h-2" />
            <span className="text-muted-foreground text-xs">{currentMetrics.cpuUsage}%</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Memoria</span>
              {getStatusBadge(currentMetrics.memoryUsage, memoryThresholds)}
            </div>
            <Progress value={currentMetrics.memoryUsage} className="h-2" />
            <span className="text-muted-foreground text-xs">{currentMetrics.memoryUsage}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Tiempo de Respuesta</span>
            <div className="text-lg font-semibold">{currentMetrics.responseTime}ms</div>
          </div>
          <div>
            <span className="text-muted-foreground">Latencia de Red</span>
            <div className="text-lg font-semibold">{currentMetrics.networkLatency}ms</div>
          </div>
        </div>

        {/* Gráfico de rendimiento */}
        <div className="h-[200px]">
          <ChartContainer
            config={{
              responseTime: {
                label: 'Tiempo de Respuesta (ms)',
                color: 'hsl(var(--chart-1))',
              },
              cpuUsage: {
                label: 'Uso CPU (%)',
                color: 'hsl(var(--chart-2))',
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="var(--color-responseTime)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="cpuUsage"
                  stroke="var(--color-cpuUsage)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
