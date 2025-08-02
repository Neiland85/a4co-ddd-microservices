"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Bar, BarChart } from "recharts"
import {
  Shield,
  AlertTriangle,
  Eye,
  Ban,
  Lock,
  Zap,
  Activity,
  Globe,
  Database,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Skull,
  Target,
  Radar,
  Settings,
} from "lucide-react"

interface ThreatData {
  id: string
  type: "malware" | "phishing" | "ddos" | "brute_force" | "sql_injection" | "xss"
  severity: "low" | "medium" | "high" | "critical"
  source: string
  target: string
  timestamp: Date
  status: "detected" | "blocked" | "investigating" | "resolved"
  description: string
}

interface SecurityMetrics {
  threatLevel: number
  blockedAttacks: number
  vulnerabilities: number
  securityScore: number
  uptime: number
  lastScan: Date
}

export function CybersecurityDashboard() {
  const [threats, setThreats] = useState<ThreatData[]>([
    {
      id: "1",
      type: "brute_force",
      severity: "high",
      source: "192.168.1.100",
      target: "/api/auth/login",
      timestamp: new Date(Date.now() - 300000),
      status: "blocked",
      description: "Múltiples intentos de login fallidos desde IP sospechosa",
    },
    {
      id: "2",
      type: "sql_injection",
      severity: "critical",
      source: "10.0.0.50",
      target: "/api/users",
      timestamp: new Date(Date.now() - 600000),
      status: "blocked",
      description: "Intento de inyección SQL detectado y bloqueado",
    },
    {
      id: "3",
      type: "ddos",
      severity: "medium",
      source: "Multiple IPs",
      target: "Main Server",
      timestamp: new Date(Date.now() - 900000),
      status: "investigating",
      description: "Tráfico anómalo detectado desde múltiples fuentes",
    },
  ])

  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatLevel: 75,
    blockedAttacks: 1247,
    vulnerabilities: 3,
    securityScore: 92,
    uptime: 99.97,
    lastScan: new Date(),
  })

  const [realTimeData, setRealTimeData] = useState<any[]>([])

  useEffect(() => {
    // Generar datos de tiempo real
    const generateRealTimeData = () => {
      const data = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i.toString().padStart(2, "0")}:00`,
        threats: Math.floor(Math.random() * 50 + 10),
        blocked: Math.floor(Math.random() * 45 + 5),
        allowed: Math.floor(Math.random() * 1000 + 500),
      }))
      setRealTimeData(data)
    }

    generateRealTimeData()

    // Simular actualizaciones en tiempo real
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        threatLevel: Math.max(0, Math.min(100, prev.threatLevel + (Math.random() - 0.5) * 10)),
        blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 3),
        securityScore: Math.max(80, Math.min(100, prev.securityScore + (Math.random() - 0.5) * 2)),
        lastScan: new Date(),
      }))

      // Simular nuevas amenazas ocasionalmente
      if (Math.random() < 0.1) {
        const newThreat: ThreatData = {
          id: Date.now().toString(),
          type: ["malware", "phishing", "ddos", "brute_force", "sql_injection", "xss"][
            Math.floor(Math.random() * 6)
          ] as any,
          severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
          source: `192.168.1.${Math.floor(Math.random() * 255)}`,
          target: ["/api/auth", "/api/users", "/api/data", "Main Server"][Math.floor(Math.random() * 4)],
          timestamp: new Date(),
          status: ["detected", "blocked", "investigating"][Math.floor(Math.random() * 3)] as any,
          description: "Nueva amenaza detectada por el sistema de monitoreo",
        }
        setThreats((prev) => [newThreat, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getThreatIcon = (type: string) => {
    switch (type) {
      case "malware":
        return <Skull className="h-4 w-4" />
      case "phishing":
        return <Target className="h-4 w-4" />
      case "ddos":
        return <Zap className="h-4 w-4" />
      case "brute_force":
        return <Lock className="h-4 w-4" />
      case "sql_injection":
        return <Database className="h-4 w-4" />
      case "xss":
        return <Globe className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "blocked":
        return <Ban className="h-3 w-3 text-red-500" />
      case "resolved":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "investigating":
        return <Eye className="h-3 w-3 text-yellow-500" />
      case "detected":
        return <AlertTriangle className="h-3 w-3 text-orange-500" />
      default:
        return <Clock className="h-3 w-3 text-gray-500" />
    }
  }

  const getThreatLevelColor = (level: number) => {
    if (level >= 80) return "text-red-500"
    if (level >= 60) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="space-y-6">
      {/* Panel de estado general */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel de Amenaza</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getThreatLevelColor(metrics.threatLevel)}`}>
              {metrics.threatLevel}%
            </div>
            <Progress value={metrics.threatLevel} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.threatLevel >= 80 ? "Crítico" : metrics.threatLevel >= 60 ? "Alto" : "Normal"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ataques Bloqueados</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{metrics.blockedAttacks}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +15% últimas 24h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilidades</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{metrics.vulnerabilities}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              -2 resueltas hoy
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntuación Seguridad</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{metrics.securityScore}/100</div>
            <Progress value={metrics.securityScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Excelente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibilidad</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{metrics.uptime}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              Sistema operativo
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitoring">Monitoreo en Tiempo Real</TabsTrigger>
          <TabsTrigger value="threats">Detección de Amenazas</TabsTrigger>
          <TabsTrigger value="firewall">Firewall y Protección</TabsTrigger>
          <TabsTrigger value="analysis">Análisis Forense</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Radar className="h-5 w-5" />
                  <span>Monitoreo de Tráfico</span>
                </CardTitle>
                <CardDescription>Análisis de tráfico en tiempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    threats: { label: "Amenazas", color: "hsl(var(--chart-4))" },
                    blocked: { label: "Bloqueadas", color: "hsl(var(--chart-1))" },
                    allowed: { label: "Permitidas", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={realTimeData}>
                      <XAxis dataKey="hour" fontSize={10} />
                      <YAxis fontSize={10} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="allowed"
                        stackId="1"
                        stroke="var(--color-allowed)"
                        fill="var(--color-allowed)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="blocked"
                        stackId="1"
                        stroke="var(--color-blocked)"
                        fill="var(--color-blocked)"
                        fillOpacity={0.8}
                      />
                      <Area
                        type="monotone"
                        dataKey="threats"
                        stackId="1"
                        stroke="var(--color-threats)"
                        fill="var(--color-threats)"
                        fillOpacity={0.9}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Amenazas Activas</span>
                </CardTitle>
                <CardDescription>Últimas amenazas detectadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {threats.slice(0, 5).map((threat) => (
                    <Alert key={threat.id} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          {getThreatIcon(threat.type)}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant={getSeverityColor(threat.severity)} className="text-xs">
                                {threat.severity.toUpperCase()}
                              </Badge>
                              {getStatusIcon(threat.status)}
                              <span className="text-xs text-muted-foreground capitalize">{threat.status}</span>
                            </div>
                            <AlertDescription className="text-xs">
                              <div className="font-medium">{threat.description}</div>
                              <div className="text-muted-foreground mt-1">
                                {threat.source} → {threat.target}
                              </div>
                              <div className="text-muted-foreground">{threat.timestamp.toLocaleString("es-ES")}</div>
                            </AlertDescription>
                          </div>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de estado de servicios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Firewall</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Activo
                  </Badge>
                  <span className="text-sm text-muted-foreground">1,247 bloqueados</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Última actualización: {new Date().toLocaleTimeString("es-ES")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Radar className="h-4 w-4" />
                  <span>IDS/IPS</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="bg-green-500">
                    <Eye className="h-3 w-3 mr-1" />
                    Monitoreando
                  </Badge>
                  <span className="text-sm text-muted-foreground">3 amenazas activas</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Sensibilidad: Alta</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Cifrado</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="bg-green-500">
                    <Lock className="h-3 w-3 mr-1" />
                    TLS 1.3
                  </Badge>
                  <span className="text-sm text-muted-foreground">256-bit AES</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Certificado válido hasta 2025</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Centro de Detección de Amenazas</span>
                </div>
                <Button>
                  <Zap className="h-4 w-4 mr-2" />
                  Escaneo Completo
                </Button>
              </CardTitle>
              <CardDescription>Sistema avanzado de detección y análisis de amenazas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Origen</TableHead>
                    <TableHead>Objetivo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {threats.map((threat) => (
                    <TableRow key={threat.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getThreatIcon(threat.type)}
                          <span className="capitalize">{threat.type.replace("_", " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(threat.severity)}>{threat.severity}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{threat.source}</TableCell>
                      <TableCell className="font-mono text-sm">{threat.target}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(threat.status)}
                          <span className="capitalize text-sm">{threat.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{threat.timestamp.toLocaleString("es-ES")}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Ban className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firewall" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Configuración del Firewall</span>
                </CardTitle>
                <CardDescription>Reglas y políticas de seguridad activas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Bloqueo de IPs Sospechosas</div>
                      <div className="text-sm text-muted-foreground">Bloqueo automático tras 5 intentos fallidos</div>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      Activo
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Filtrado de Contenido</div>
                      <div className="text-sm text-muted-foreground">Análisis de payloads maliciosos</div>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      Activo
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Rate Limiting</div>
                      <div className="text-sm text-muted-foreground">100 requests/min por IP</div>
                    </div>
                    <Badge variant="default" className="bg-green-500">
                      Activo
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Geo-blocking</div>
                      <div className="text-sm text-muted-foreground">Bloqueo de países de alto riesgo</div>
                    </div>
                    <Badge variant="secondary">Configurar</Badge>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar Reglas
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Activity className="h-4 w-4 mr-2" />
                    Ver Logs del Firewall
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Ban className="h-5 w-5" />
                  <span>IPs Bloqueadas</span>
                </CardTitle>
                <CardDescription>Lista de direcciones IP bloqueadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {[
                    { ip: "192.168.1.100", reason: "Brute force attack", time: "2 min ago" },
                    { ip: "10.0.0.50", reason: "SQL injection attempt", time: "5 min ago" },
                    { ip: "172.16.0.25", reason: "Suspicious activity", time: "12 min ago" },
                    { ip: "203.0.113.45", reason: "DDoS attempt", time: "18 min ago" },
                    { ip: "198.51.100.30", reason: "Malware distribution", time: "25 min ago" },
                  ].map((blocked, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                      <div>
                        <div className="font-mono font-medium">{blocked.ip}</div>
                        <div className="text-muted-foreground">{blocked.reason}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-muted-foreground">{blocked.time}</div>
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          Desbloquear
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Análisis Forense y Tendencias</span>
              </CardTitle>
              <CardDescription>Análisis detallado de patrones de ataque y tendencias de seguridad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Tipos de Amenazas (Últimos 30 días)</h4>
                  <ChartContainer
                    config={{
                      count: { label: "Cantidad", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-[250px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { type: "Brute Force", count: 45 },
                          { type: "SQL Injection", count: 23 },
                          { type: "XSS", count: 18 },
                          { type: "DDoS", count: 12 },
                          { type: "Malware", count: 8 },
                          { type: "Phishing", count: 5 },
                        ]}
                      >
                        <XAxis dataKey="type" fontSize={10} />
                        <YAxis fontSize={10} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Estadísticas de Seguridad</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 border rounded">
                        <div className="text-2xl font-bold text-red-500">1,247</div>
                        <div className="text-sm text-muted-foreground">Ataques Bloqueados</div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-2xl font-bold text-green-500">99.2%</div>
                        <div className="text-sm text-muted-foreground">Tasa de Detección</div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-2xl font-bold text-blue-500">0.8s</div>
                        <div className="text-sm text-muted-foreground">Tiempo de Respuesta</div>
                      </div>
                      <div className="p-3 border rounded">
                        <div className="text-2xl font-bold text-purple-500">156</div>
                        <div className="text-sm text-muted-foreground">IPs Bloqueadas</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full">
                        <Activity className="h-4 w-4 mr-2" />
                        Generar Reporte Completo
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Exportar Métricas
                      </Button>
                    </div>
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
