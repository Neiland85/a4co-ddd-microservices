"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettingsIcon, Save, Mail, Shield, Bell, Globe } from "lucide-react"
import type { AdminSettings } from "@/types/admin-types"

interface AdminSettingsProps {
  settings: AdminSettings
  onSave?: (settings: AdminSettings) => void
}

export function AdminSettingsComponent({ settings, onSave }: AdminSettingsProps) {
  const [formData, setFormData] = useState<AdminSettings>(settings)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      onSave?.(formData)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: keyof AdminSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
        <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Configuración General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nombre del Sitio</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) => updateSetting("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de Contacto</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateSetting("contactEmail", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descripción del Sitio</Label>
                <Textarea
                  id="siteDescription"
                  value={formData.siteDescription}
                  onChange={(e) => updateSetting("siteDescription", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Modo de Mantenimiento</h3>
                  <p className="text-sm text-gray-600">Activar para realizar mantenimiento del sitio</p>
                </div>
                <Switch
                  checked={formData.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Permitir Registro</h3>
                  <p className="text-sm text-gray-600">Permitir que nuevos usuarios se registren</p>
                </div>
                <Switch
                  checked={formData.allowRegistration}
                  onCheckedChange={(checked) => updateSetting("allowRegistration", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Configuración de Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Email de Soporte</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => updateSetting("supportEmail", e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Configuración SMTP</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Servidor SMTP</Label>
                    <Input placeholder="smtp.ejemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Puerto</Label>
                    <Input placeholder="587" />
                  </div>
                  <div className="space-y-2">
                    <Label>Usuario</Label>
                    <Input placeholder="usuario@ejemplo.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contraseña</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configuración de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Políticas de Contraseña</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Longitud mínima</h4>
                      <p className="text-sm text-gray-600">Requerir al menos 8 caracteres</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Caracteres especiales</h4>
                      <p className="text-sm text-gray-600">Requerir al menos un carácter especial</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Autenticación de dos factores</h4>
                      <p className="text-sm text-gray-600">Habilitar 2FA para administradores</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Sesiones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tiempo de expiración (minutos)</Label>
                    <Input defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Máximo de sesiones concurrentes</Label>
                    <Input defaultValue="3" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Configuración de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Notificaciones por Email</h3>
                  <p className="text-sm text-gray-600">Recibir notificaciones importantes por email</p>
                </div>
                <Switch
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Notificaciones SMS</h3>
                  <p className="text-sm text-gray-600">Recibir alertas críticas por SMS</p>
                </div>
                <Switch
                  checked={formData.smsNotifications}
                  onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Tipos de Notificaciones</h3>
                <div className="space-y-3">
                  {[
                    { label: "Nuevos pedidos", description: "Notificar cuando se reciba un nuevo pedido" },
                    { label: "Productos agotados", description: "Alertar cuando un producto se quede sin stock" },
                    { label: "Nuevos usuarios", description: "Notificar registros de nuevos usuarios" },
                    { label: "Errores del sistema", description: "Alertas de errores críticos del sistema" },
                    { label: "Actualizaciones", description: "Notificaciones de actualizaciones disponibles" },
                  ].map((notification, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{notification.label}</h4>
                        <p className="text-xs text-gray-600">{notification.description}</p>
                      </div>
                      <Switch defaultChecked={index < 3} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
