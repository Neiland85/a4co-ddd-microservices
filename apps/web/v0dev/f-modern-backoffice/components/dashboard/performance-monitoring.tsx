"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface PerformanceData {
  time: string
  responseTime: number
  cpuUsage: number
  memoryUsage: number
}

export function PerformanceMonitoring() {
  const [data, setData] = useState<PerformanceData[]>([])
  const [currentMetrics, setCurrentMetrics] = useState({
    responseTime: 245,
    cpuUsage: 67,
    memoryUsage: 54,
    networkLatency: 12,
  })

  useEffect(() => {
    // Generar datos iniciales
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      responseTime: Math.floor(Math.random() * 100 + 200),
      cpuUsage: Math.floor(Math.random() * 30 + 50),
      memoryUsage: Math.floor(Math.random() * 20 + 40),
    }))
    setData(initialData)

    const interval = setInterval(() => {
      const newPoint = {
        time: new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        responseTime: Math.floor(Math.random() * 100 + 200),
        cpuUsage: Math.floor(Math.random() * 30 + 50),
        memoryUsage: Math.floor(Math.random() * 20 + 40),
      }

      setData((prev) => [...prev.slice(1), newPoint])
      setCurrentMetrics({
        responseTime: newPoint.responseTime,
        cpuUsage: newPoint.cpuUsage,
        memoryUsage: newPoint.memoryUsage,
        networkLatency: Math.floor(Math.random() * 10 + 8),
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <Badge variant="destructive">Crítico</Badge>
    if (value >= thresholds.warning) return <Badge variant="secondary">Advertencia</Badge>
    return (
      <Badge variant="default" className="bg-green-500">
        Normal
      </Badge>
    )
  }

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
              {getStatusBadge(currentMetrics.cpuUsage, { warning: 70, critical: 85 })}
            </div>
            <Progress value={currentMetrics.cpuUsage} className="h-2" />
            <span className="text-xs text-muted-foreground">{currentMetrics.cpuUsage}%</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Memoria</span>
              {getStatusBadge(currentMetrics.memoryUsage, { warning: 75, critical: 90 })}
            </div>
            <Progress value={currentMetrics.memoryUsage} className="h-2" />
            <span className="text-xs text-muted-foreground">{currentMetrics.memoryUsage}%</span>
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
                label: "Tiempo de Respuesta (ms)",
                color: "hsl(var(--chart-1))",
              },
              cpuUsage: {
                label: "Uso CPU (%)",
                color: "hsl(var(--chart-2))",
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
                <Line type="monotone" dataKey="cpuUsage" stroke="var(--color-cpuUsage)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
