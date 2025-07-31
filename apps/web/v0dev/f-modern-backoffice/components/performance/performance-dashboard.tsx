"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Area,
  AreaChart,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Activity,
  Cpu,
  HardDrive,
  Server,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface PerformanceMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  responseTime: number
  throughput: number
  errorRate: number
  uptime: number
}

interface ChartData {
  time: string
  cpu: number
  memory: number
  responseTime: number
  requests: number
  errors: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpu: 67,
    memory: 54,
    disk: 32,
    network: 45,
    responseTime: 245,
    throughput: 1250,
    errorRate: 0.8,
    uptime: 99.97,
  })

  const [chartData, setChartData] = useState<ChartData[]>([])
  const [realTimeData, setRealTimeData] = useState<any[]>([])

  useEffect(() => {
    // Generar datos iniciales
    const initialData = Array.from({ length: 30 }, (_, i) => ({
      time: new Date(Date.now() - (29 - i) * 60000).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      cpu: Math.floor(Math.random() * 30 + 50),
      memory: Math.floor(Math.random() * 20 + 40),
      responseTime: Math.floor(Math.random() * 100 + 200),
      requests: Math.floor(Math.random() * 500 + 1000),
      errors: Math.floor(Math.random() * 10 + 2),
    }))
    setChartData(initialData)

    // Datos para gráfico de distribución
    const distributionData = [
      { name: "API Calls", value: 45, color: "#0088FE" },
      { name: "Database", value: 25, color: "#00C49F" },
      { name: "Cache", value: 15, color: "#FFBB28" },
      { name: "External", value: 10, color: "#FF8042" },
      { name: "Other", value: 5, color: "#8884D8" },
    ]
    setRealTimeData(distributionData)

    // Actualizar datos en tiempo real
    const interval = setInterval(() => {
      const newPoint = {
        time: new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        cpu: Math.floor(Math.random() * 30 + 50),
        memory: Math.floor(Math.random() * 20 + 40),
        responseTime: Math.floor(Math.random() * 100 + 200),
        requests: Math.floor(Math.random() * 500 + 1000),
        errors: Math.floor(Math.random() * 10 + 2),
      }

      setChartData((prev) => [...prev.slice(1), newPoint])
      setMetrics((prev) => ({
        ...prev,
        cpu: newPoint.cpu,
        memory: newPoint.memory,
        responseTime: newPoint.responseTime,
        throughput: newPoint.requests,
        errorRate: (newPoint.errors / newPoint.requests) * 100,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "text-red-500"
    if (value >= thresholds.warning) return "text-yellow-500"
    return "text-green-500"
  }

  const getStatusIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <AlertTriangle className="h-4 w-4 text-red-500" />
    if (value >= thresholds.warning) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{metrics.cpu}%</div>
              {getStatusIcon(metrics.cpu, { warning: 70, critical: 85 })}
            </div>
            <Progress value={metrics.cpu} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              <span className={getStatusColor(metrics.cpu, { warning: 70, critical: 85 })}>
                {metrics.cpu < 70 ? "Normal" : metrics.cpu < 85 ? "Advertencia" : "Crítico"}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memoria</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{metrics.memory}%</div>
              {getStatusIcon(metrics.memory, { warning: 75, critical: 90 })}
            </div>
            <Progress value={metrics.memory} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              <span className={getStatusColor(metrics.memory, { warning: 75, critical: 90 })}>
                {metrics.memory < 75 ? "Normal" : metrics.memory < 90 ? "Advertencia" : "Crítico"}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo de Respuesta</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
            <div className="flex items-center mt-2">
              {metrics.responseTime < 300 ? (
                <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className="text-xs text-muted-foreground">
                {metrics.responseTime < 300 ? "Excelente" : "Necesita atención"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilidad</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uptime}%</div>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-muted-foreground">Operativo</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos detallados */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="requests">Solicitudes</TabsTrigger>
          <TabsTrigger value="distribution">Distribución</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Métricas del Sistema</CardTitle>
                <CardDescription>CPU y Memoria en tiempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    cpu: { label: "CPU (%)", color: "hsl(var(--chart-1))" },
                    memory: { label: "Memoria (%)", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <XAxis dataKey="time" fontSize={10} />
                      <YAxis fontSize={10} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="cpu"
                        stackId="1"
                        stroke="var(--color-cpu)"
                        fill="var(--color-cpu)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="memory"
                        stackId="1"
                        stroke="var(--color-memory)"
                        fill="var(--color-memory)"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tiempo de Respuesta</CardTitle>
                <CardDescription>Latencia promedio por minuto</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    responseTime: { label: "Tiempo (ms)", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="time" fontSize={10} />
                      <YAxis fontSize={10} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="responseTime"
                        stroke="var(--color-responseTime)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Rendimiento Detallado</CardTitle>
              <CardDescription>Métricas avanzadas del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Recursos del Sistema</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>CPU</span>
                        <span>{metrics.cpu}%</span>
                      </div>
                      <Progress value={metrics.cpu} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Memoria</span>
                        <span>{metrics.memory}%</span>
                      </div>
                      <Progress value={metrics.memory} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Disco</span>
                        <span>{metrics.disk}%</span>
                      </div>
                      <Progress value={metrics.disk} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Red</span>
                        <span>{metrics.network}%</span>
                      </div>
                      <Progress value={metrics.network} className="mt-1" />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <ChartContainer
                    config={{
                      cpu: { label: "CPU", color: "hsl(var(--chart-1))" },
                      memory: { label: "Memoria", color: "hsl(var(--chart-2))" },
                      responseTime: { label: "Respuesta", color: "hsl(var(--chart-3))" },
                    }}
                    className="h-[250px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="time" fontSize={10} />
                        <YAxis fontSize={10} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="cpu" stroke="var(--color-cpu)" strokeWidth={2} dot={false} />
                        <Line
                          type="monotone"
                          dataKey="memory"
                          stroke="var(--color-memory)"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Solicitudes</CardTitle>
              <CardDescription>Tráfico y errores en tiempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  requests: { label: "Solicitudes", color: "hsl(var(--chart-1))" },
                  errors: { label: "Errores", color: "hsl(var(--chart-4))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="time" fontSize={10} />
                    <YAxis fontSize={10} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="requests" fill="var(--color-requests)" />
                    <Bar dataKey="errors" fill="var(--color-errors)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Carga</CardTitle>
              <CardDescription>Análisis de uso por componente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ChartContainer
                    config={{
                      value: { label: "Porcentaje", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={realTimeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {realTimeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Desglose por Componente</h4>
                  <div className="space-y-3">
                    {realTimeData.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <div className="text-sm font-medium">{item.value}%</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-2">
                    <Button className="w-full" size="sm">
                      <Zap className="h-4 w-4 mr-2" />
                      Optimizar Rendimiento
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      <Activity className="h-4 w-4 mr-2" />
                      Generar Reporte
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
