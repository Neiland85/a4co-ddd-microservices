"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Settings,
  Shield,
  Bell,
  Users,
  Database,
  Palette,
  Code,
  Download,
  Upload,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Key,
  Mail,
  Smartphone,
  Globe,
  Server,
  HardDrive,
  Activity,
  Lock,
  Eye,
  Trash2,
  Plus,
  Edit,
} from "lucide-react"

interface SystemConfig {
  siteName: string
  siteDescription: string
  adminEmail: string
  timezone: string
  language: string
  maintenanceMode: boolean
  debugMode: boolean
  cacheEnabled: boolean
  compressionEnabled: boolean
}

interface SecurityConfig {
  twoFactorRequired: boolean
  sessionTimeout: number
  maxLoginAttempts: number
  passwordMinLength: number
  passwordRequireSpecial: boolean
  ipWhitelist: string[]
  sslEnabled: boolean
  corsEnabled: boolean
  rateLimitEnabled: boolean
  rateLimitRequests: number
}

interface NotificationConfig {
  emailEnabled: boolean
  smsEnabled: boolean
  pushEnabled: boolean
  slackEnabled: boolean
  emailProvider: string
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  slackWebhook: string
  twilioSid: string
  twilioToken: string
}

interface BackupConfig {
  autoBackupEnabled: boolean
  backupFrequency: string
  backupRetention: number
  backupLocation: string
  lastBackup: Date
  nextBackup: Date
}

export function SettingsDashboard() {
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    siteName: "Backoffice Pro",
    siteDescription: "Sistema de gestión empresarial avanzado",
    adminEmail: "admin@backoffice.com",
    timezone: "Europe/Madrid",
    language: "es",
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    compressionEnabled: true,
  })

  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>({
    twoFactorRequired: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    ipWhitelist: [],
    sslEnabled: true,
    corsEnabled: true,
    rateLimitEnabled: true,
    rateLimitRequests: 100,
  })

  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    slackEnabled: false,
    emailProvider: "smtp",
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    slackWebhook: "",
    twilioSid: "",
    twilioToken: "",
  })

  const [backupConfig, setBackupConfig] = useState<BackupConfig>({
    autoBackupEnabled: true,
    backupFrequency: "daily",
    backupRetention: 30,
    backupLocation: "cloud",
    lastBackup: new Date(Date.now() - 86400000),
    nextBackup: new Date(Date.now() + 86400000),
  })

  const [apiKeys, setApiKeys] = useState([
    {
      id: "1",
      name: "Production API",
      key: "pk_live_***************",
      created: new Date("2024-01-15"),
      lastUsed: new Date("2024-01-29"),
    },
    {
      id: "2",
      name: "Development API",
      key: "pk_test_***************",
      created: new Date("2024-01-20"),
      lastUsed: new Date("2024-01-28"),
    },
  ])

  const [webhooks, setWebhooks] = useState([
    {
      id: "1",
      name: "Order Notifications",
      url: "https://api.example.com/webhooks/orders",
      events: ["order.created", "order.updated"],
      status: "active",
    },
    {
      id: "2",
      name: "User Events",
      url: "https://api.example.com/webhooks/users",
      events: ["user.created", "user.updated"],
      status: "inactive",
    },
  ])

  const [auditLogs, setAuditLogs] = useState([
    {
      id: "1",
      action: "Config Updated",
      user: "admin@backoffice.com",
      timestamp: new Date(Date.now() - 300000),
      details: "Security settings modified",
    },
    {
      id: "2",
      action: "Backup Created",
      user: "system",
      timestamp: new Date(Date.now() - 86400000),
      details: "Automatic daily backup",
    },
    {
      id: "3",
      action: "User Created",
      user: "admin@backoffice.com",
      timestamp: new Date(Date.now() - 172800000),
      details: "New user account created",
    },
  ])

  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"success" | "error" | null>(null)

  const handleSaveConfig = async (configType: string) => {
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUnsavedChanges(false)
    // Aquí iría la lógica real de guardado
    console.log(`Guardando configuración: ${configType}`)
  }

  const handleTestConnection = async (service: string) => {
    setIsTestingConnection(true)
    setConnectionStatus(null)

    // Simular test de conexión
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simular resultado aleatorio
    const success = Math.random() > 0.3
    setConnectionStatus(success ? "success" : "error")
    setIsTestingConnection(false)
  }

  const handleBackupNow = async () => {
    // Simular backup
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setBackupConfig((prev) => ({
      ...prev,
      lastBackup: new Date(),
      nextBackup: new Date(Date.now() + 86400000),
    }))
  }

  const generateApiKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: "New API Key",
      key: `pk_live_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date(),
      lastUsed: new Date(),
    }
    setApiKeys((prev) => [...prev, newKey])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
          <p className="text-muted-foreground">Administra la configuración global del backoffice</p>
        </div>
        <div className="flex space-x-2">
          {unsavedChanges && (
            <Badge variant="secondary" className="animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Cambios sin guardar
            </Badge>
          )}
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Recargar
          </Button>
        </div>
      </div>

      {/* Tabs principales */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          <TabsTrigger value="advanced">Avanzado</TabsTrigger>
        </TabsList>

        {/* Configuración General */}
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Configuración Básica</span>
                </CardTitle>
                <CardDescription>Configuración fundamental del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nombre del Sitio</Label>
                  <Input
                    id="siteName"
                    value={systemConfig.siteName}
                    onChange={(e) => {
                      setSystemConfig((prev) => ({ ...prev, siteName: e.target.value }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Descripción</Label>
                  <Textarea
                    id="siteDescription"
                    value={systemConfig.siteDescription}
                    onChange={(e) => {
                      setSystemConfig((prev) => ({ ...prev, siteDescription: e.target.value }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email del Administrador</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={systemConfig.adminEmail}
                    onChange={(e) => {
                      setSystemConfig((prev) => ({ ...prev, adminEmail: e.target.value }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select
                      value={systemConfig.timezone}
                      onValueChange={(value) => {
                        setSystemConfig((prev) => ({ ...prev, timezone: value }))
                        setUnsavedChanges(true)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                        <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                        <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokio (GMT+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={systemConfig.language}
                      onValueChange={(value) => {
                        setSystemConfig((prev) => ({ ...prev, language: value }))
                        setUnsavedChanges(true)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={() => handleSaveConfig("general")} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración General
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <span>Estado del Sistema</span>
                </CardTitle>
                <CardDescription>Configuración de rendimiento y mantenimiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo Mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">Desactiva el acceso público al sistema</p>
                  </div>
                  <Switch
                    checked={systemConfig.maintenanceMode}
                    onCheckedChange={(checked) => {
                      setSystemConfig((prev) => ({ ...prev, maintenanceMode: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Modo Debug</Label>
                    <p className="text-sm text-muted-foreground">Muestra información de depuración</p>
                  </div>
                  <Switch
                    checked={systemConfig.debugMode}
                    onCheckedChange={(checked) => {
                      setSystemConfig((prev) => ({ ...prev, debugMode: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cache Habilitado</Label>
                    <p className="text-sm text-muted-foreground">Mejora el rendimiento del sistema</p>
                  </div>
                  <Switch
                    checked={systemConfig.cacheEnabled}
                    onCheckedChange={(checked) => {
                      setSystemConfig((prev) => ({ ...prev, cacheEnabled: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Compresión GZIP</Label>
                    <p className="text-sm text-muted-foreground">Reduce el tamaño de las respuestas</p>
                  </div>
                  <Switch
                    checked={systemConfig.compressionEnabled}
                    onCheckedChange={(checked) => {
                      setSystemConfig((prev) => ({ ...prev, compressionEnabled: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uso de CPU</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} />

                  <div className="flex justify-between text-sm">
                    <span>Uso de Memoria</span>
                    <span>54%</span>
                  </div>
                  <Progress value={54} />

                  <div className="flex justify-between text-sm">
                    <span>Espacio en Disco</span>
                    <span>32%</span>
                  </div>
                  <Progress value={32} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuración de Seguridad */}
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Políticas de Seguridad</span>
                </CardTitle>
                <CardDescription>Configuración de autenticación y acceso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Autenticación de Dos Factores</Label>
                    <p className="text-sm text-muted-foreground">Requerida para todos los usuarios</p>
                  </div>
                  <Switch
                    checked={securityConfig.twoFactorRequired}
                    onCheckedChange={(checked) => {
                      setSecurityConfig((prev) => ({ ...prev, twoFactorRequired: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securityConfig.sessionTimeout}
                    onChange={(e) => {
                      setSecurityConfig((prev) => ({ ...prev, sessionTimeout: Number.parseInt(e.target.value) }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Máximo Intentos de Login</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securityConfig.maxLoginAttempts}
                    onChange={(e) => {
                      setSecurityConfig((prev) => ({ ...prev, maxLoginAttempts: Number.parseInt(e.target.value) }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Longitud Mínima de Contraseña</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securityConfig.passwordMinLength}
                    onChange={(e) => {
                      setSecurityConfig((prev) => ({ ...prev, passwordMinLength: Number.parseInt(e.target.value) }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Caracteres Especiales Requeridos</Label>
                    <p className="text-sm text-muted-foreground">En las contraseñas</p>
                  </div>
                  <Switch
                    checked={securityConfig.passwordRequireSpecial}
                    onCheckedChange={(checked) => {
                      setSecurityConfig((prev) => ({ ...prev, passwordRequireSpecial: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <Button onClick={() => handleSaveConfig("security")} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración de Seguridad
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Configuración de Red</span>
                </CardTitle>
                <CardDescription>SSL, CORS y Rate Limiting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SSL/TLS Habilitado</Label>
                    <p className="text-sm text-muted-foreground">Cifrado de conexiones</p>
                  </div>
                  <Switch
                    checked={securityConfig.sslEnabled}
                    onCheckedChange={(checked) => {
                      setSecurityConfig((prev) => ({ ...prev, sslEnabled: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>CORS Habilitado</Label>
                    <p className="text-sm text-muted-foreground">Cross-Origin Resource Sharing</p>
                  </div>
                  <Switch
                    checked={securityConfig.corsEnabled}
                    onCheckedChange={(checked) => {
                      setSecurityConfig((prev) => ({ ...prev, corsEnabled: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">Limitar solicitudes por IP</p>
                  </div>
                  <Switch
                    checked={securityConfig.rateLimitEnabled}
                    onCheckedChange={(checked) => {
                      setSecurityConfig((prev) => ({ ...prev, rateLimitEnabled: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                {securityConfig.rateLimitEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="rateLimitRequests">Solicitudes por Minuto</Label>
                    <Input
                      id="rateLimitRequests"
                      type="number"
                      value={securityConfig.rateLimitRequests}
                      onChange={(e) => {
                        setSecurityConfig((prev) => ({ ...prev, rateLimitRequests: Number.parseInt(e.target.value) }))
                        setUnsavedChanges(true)
                      }}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Lista Blanca de IPs</Label>
                  <Textarea
                    placeholder="192.168.1.1&#10;10.0.0.1&#10;172.16.0.1"
                    value={securityConfig.ipWhitelist.join("\n")}
                    onChange={(e) => {
                      setSecurityConfig((prev) => ({
                        ...prev,
                        ipWhitelist: e.target.value.split("\n").filter((ip) => ip.trim()),
                      }))
                      setUnsavedChanges(true)
                    }}
                  />
                  <p className="text-xs text-muted-foreground">Una IP por línea</p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Los cambios en la configuración de red pueden afectar la conectividad. Asegúrate de tener acceso
                    alternativo antes de aplicar cambios críticos.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuración de Notificaciones */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Canales de Notificación</span>
                </CardTitle>
                <CardDescription>Configurar métodos de notificación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <div>
                      <Label>Notificaciones por Email</Label>
                      <p className="text-sm text-muted-foreground">Enviar alertas por correo</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationConfig.emailEnabled}
                    onCheckedChange={(checked) => {
                      setNotificationConfig((prev) => ({ ...prev, emailEnabled: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <div>
                      <Label>Notificaciones SMS</Label>
                      <p className="text-sm text-muted-foreground">Enviar alertas por SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationConfig.smsEnabled}
                    onCheckedChange={(checked) => {
                      setNotificationConfig((prev) => ({ ...prev, smsEnabled: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <div>
                      <Label>Notificaciones Push</Label>
                      <p className="text-sm text-muted-foreground">Notificaciones del navegador</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationConfig.pushEnabled}
                    onCheckedChange={(checked) => {
                      setNotificationConfig((prev) => ({ ...prev, pushEnabled: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <div>
                      <Label>Integración Slack</Label>
                      <p className="text-sm text-muted-foreground">Enviar a canal de Slack</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationConfig.slackEnabled}
                    onCheckedChange={(checked) => {
                      setNotificationConfig((prev) => ({ ...prev, slackEnabled: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <Button onClick={() => handleSaveConfig("notifications")} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración de Notificaciones
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Configuración SMTP</span>
                </CardTitle>
                <CardDescription>Configurar servidor de correo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">Servidor SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={notificationConfig.smtpHost}
                    onChange={(e) => {
                      setNotificationConfig((prev) => ({ ...prev, smtpHost: e.target.value }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Puerto SMTP</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={notificationConfig.smtpPort}
                    onChange={(e) => {
                      setNotificationConfig((prev) => ({ ...prev, smtpPort: Number.parseInt(e.target.value) }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Usuario SMTP</Label>
                  <Input
                    id="smtpUser"
                    value={notificationConfig.smtpUser}
                    onChange={(e) => {
                      setNotificationConfig((prev) => ({ ...prev, smtpUser: e.target.value }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Contraseña SMTP</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={notificationConfig.smtpPassword}
                    onChange={(e) => {
                      setNotificationConfig((prev) => ({ ...prev, smtpPassword: e.target.value }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection("smtp")}
                    disabled={isTestingConnection}
                    className="flex-1"
                  >
                    {isTestingConnection ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Activity className="h-4 w-4 mr-2" />
                    )}
                    Probar Conexión
                  </Button>
                </div>

                {connectionStatus && (
                  <Alert variant={connectionStatus === "success" ? "default" : "destructive"}>
                    {connectionStatus === "success" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <AlertDescription>
                      {connectionStatus === "success"
                        ? "Conexión SMTP exitosa"
                        : "Error en la conexión SMTP. Verifica la configuración."}
                    </AlertDescription>
                  </Alert>
                )}

                {notificationConfig.slackEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="slackWebhook">Webhook de Slack</Label>
                    <Input
                      id="slackWebhook"
                      placeholder="https://hooks.slack.com/services/..."
                      value={notificationConfig.slackWebhook}
                      onChange={(e) => {
                        setNotificationConfig((prev) => ({ ...prev, slackWebhook: e.target.value }))
                        setUnsavedChanges(true)
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gestión de Usuarios */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Configuración de Usuarios</span>
              </CardTitle>
              <CardDescription>Gestión de roles y permisos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Roles del Sistema</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Super Admin", users: 1, color: "bg-red-500" },
                      { name: "Admin", users: 3, color: "bg-orange-500" },
                      { name: "Moderador", users: 8, color: "bg-blue-500" },
                      { name: "Usuario", users: 245, color: "bg-green-500" },
                    ].map((role) => (
                      <div key={role.name} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${role.color}`} />
                          <span className="font-medium">{role.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{role.users} usuarios</Badge>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nuevo Rol
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Permisos por Defecto</h4>
                  <div className="space-y-2">
                    {[
                      "Leer usuarios",
                      "Crear usuarios",
                      "Editar usuarios",
                      "Eliminar usuarios",
                      "Gestionar roles",
                      "Ver reportes",
                      "Configurar sistema",
                      "Acceso a logs",
                    ].map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Switch defaultChecked={Math.random() > 0.3} />
                        <Label className="text-sm">{permission}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Configuración de Registro</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Registro Público</Label>
                      <Switch defaultChecked={false} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Verificación de Email</Label>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Aprobación Manual</Label>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="space-y-2">
                      <Label>Rol por Defecto</Label>
                      <Select defaultValue="user">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Usuario</SelectItem>
                          <SelectItem value="moderator">Moderador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integraciones */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Claves API</span>
                </CardTitle>
                <CardDescription>Gestión de claves de API para integraciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={generateApiKey} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Generar Nueva Clave API
                  </Button>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Clave</TableHead>
                        <TableHead>Último Uso</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">{key.name}</TableCell>
                          <TableCell className="font-mono text-sm">{key.key}</TableCell>
                          <TableCell className="text-sm">{key.lastUsed.toLocaleDateString("es-ES")}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Webhooks</span>
                </CardTitle>
                <CardDescription>Configuración de webhooks para eventos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nuevo Webhook
                  </Button>

                  <div className="space-y-3">
                    {webhooks.map((webhook) => (
                      <div key={webhook.id} className="p-3 border rounded space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{webhook.name}</div>
                          <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                            {webhook.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">{webhook.url}</div>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Activity className="h-3 w-3 mr-1" />
                            Probar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Backup y Mantenimiento */}
        <TabsContent value="backup" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Configuración de Backup</span>
                </CardTitle>
                <CardDescription>Gestión de copias de seguridad automáticas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">Crear backups programados</p>
                  </div>
                  <Switch
                    checked={backupConfig.autoBackupEnabled}
                    onCheckedChange={(checked) => {
                      setBackupConfig((prev) => ({ ...prev, autoBackupEnabled: checked }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frecuencia de Backup</Label>
                  <Select
                    value={backupConfig.backupFrequency}
                    onValueChange={(value) => {
                      setBackupConfig((prev) => ({ ...prev, backupFrequency: value }))
                      setUnsavedChanges(true)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Cada hora</SelectItem>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Retención (días)</Label>
                  <Input
                    type="number"
                    value={backupConfig.backupRetention}
                    onChange={(e) => {
                      setBackupConfig((prev) => ({ ...prev, backupRetention: Number.parseInt(e.target.value) }))
                      setUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ubicación de Backup</Label>
                  <Select
                    value={backupConfig.backupLocation}
                    onValueChange={(value) => {
                      setBackupConfig((prev) => ({ ...prev, backupLocation: value }))
                      setUnsavedChanges(true)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Almacenamiento Local</SelectItem>
                      <SelectItem value="cloud">Nube (AWS S3)</SelectItem>
                      <SelectItem value="ftp">Servidor FTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Último Backup:</span>
                    <span>{backupConfig.lastBackup.toLocaleString("es-ES")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Próximo Backup:</span>
                    <span>{backupConfig.nextBackup.toLocaleString("es-ES")}</span>
                  </div>
                </div>

                <Button onClick={handleBackupNow} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Crear Backup Ahora
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5" />
                  <span>Mantenimiento del Sistema</span>
                </CardTitle>
                <CardDescription>Herramientas de limpieza y optimización</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Limpiar Cache</div>
                      <div className="text-sm text-muted-foreground">Eliminar archivos temporales</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Limpiar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Optimizar Base de Datos</div>
                      <div className="text-sm text-muted-foreground">Reorganizar y optimizar tablas</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Database className="h-3 w-3 mr-1" />
                      Optimizar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Limpiar Logs</div>
                      <div className="text-sm text-muted-foreground">Eliminar logs antiguos</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Limpiar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Verificar Integridad</div>
                      <div className="text-sm text-muted-foreground">Comprobar archivos del sistema</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verificar
                    </Button>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Las tareas de mantenimiento pueden afectar el rendimiento temporalmente. Se recomienda ejecutarlas
                    durante horas de menor actividad.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Apariencia */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Personalización de Apariencia</span>
              </CardTitle>
              <CardDescription>Configurar el aspecto visual del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Tema y Colores</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Tema por Defecto</Label>
                      <Select defaultValue="system">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Oscuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Color Primario</Label>
                      <div className="flex space-x-2 mt-2">
                        {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"].map(
                          (color) => (
                            <button
                              key={color}
                              className="w-8 h-8 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: color }}
                            />
                          ),
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Modo Compacto</Label>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Animaciones</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Logotipo y Branding</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Logo Principal</Label>
                      <div className="mt-2 p-4 border-2 border-dashed rounded-lg text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Arrastra una imagen o haz clic para subir</p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          Seleccionar Archivo
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Favicon</Label>
                      <div className="mt-2 p-4 border-2 border-dashed rounded-lg text-center">
                        <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Formato ICO, 32x32px</p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          Subir Favicon
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración Avanzada */}
        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Configuración Avanzada</span>
                </CardTitle>
                <CardDescription>Configuraciones técnicas del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Variables de Entorno</Label>
                  <Textarea
                    className="mt-2 font-mono text-sm"
                    rows={8}
                    placeholder="NODE_ENV=production&#10;DATABASE_URL=postgresql://...&#10;REDIS_URL=redis://..."
                  />
                </div>

                <div>
                  <Label>Configuración JSON</Label>
                  <Textarea
                    className="mt-2 font-mono text-sm"
                    rows={6}
                    defaultValue={JSON.stringify(
                      {
                        maxFileSize: "10MB",
                        allowedFileTypes: ["jpg", "png", "pdf"],
                        sessionDuration: 3600,
                        enableLogging: true,
                      },
                      null,
                      2,
                    )}
                  />
                </div>

                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    ⚠️ Los cambios en la configuración avanzada pueden afectar el funcionamiento del sistema. Solo
                    modifica estos valores si sabes lo que estás haciendo.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Logs de Auditoría</span>
                </CardTitle>
                <CardDescription>Registro de cambios en la configuración</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-3 border rounded text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{log.action}</span>
                        <span className="text-muted-foreground">{log.timestamp.toLocaleString("es-ES")}</span>
                      </div>
                      <div className="text-muted-foreground">Usuario: {log.user}</div>
                      <div className="text-muted-foreground">{log.details}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Logs Completos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
