"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Palette } from "lucide-react"
import { SectionCircles } from "./section-circles"
import { getSettingsAnimationParams } from "@/utils/metrics-to-animation"
import type { DashboardMetrics } from "@/hooks/use-dashboard-metrics"

interface UserSettingsProps {
  metrics: DashboardMetrics["settings"]
}

export function UserSettings({ metrics }: UserSettingsProps) {
  const [settings, setSettings] = useState({
    name: "Juan Pérez",
    email: "juan.perez@a4co.com",
    notifications: true,
    darkMode: false,
    language: "es",
    timezone: "Europe/Madrid",
    bio: "Administrador del sistema con 5 años de experiencia",
  })

  const handleSave = () => {
    // Aquí iría la lógica para guardar las configuraciones
    console.log("Configuraciones guardadas:", settings)
  }

  const animationParams = getSettingsAnimationParams(metrics)

  return (
    <div className="space-y-6 relative">
      {/* Círculos específicos de configuración */}
      <SectionCircles section="settings" animationParams={animationParams} metrics={{ settings: metrics }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Configuración de Usuario</h2>
        <p className="text-gray-600">Personaliza tu experiencia en el dashboard</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Perfil de Usuario */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="lg:col-span-1"
        >
          <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-slate-200/60 hover:shadow-lg transition-all duration-300">
            {/* Textura decorativa animada */}
            <div className="absolute inset-0 opacity-4 pointer-events-none">
              <motion.div
                className="absolute top-0 right-0 w-20 h-20 bg-gradient-radial from-green-600/40 to-transparent rounded-full blur-xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Perfil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex flex-col items-center space-y-4">
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback>JP</AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{settings.name}</h3>
                  <p className="text-gray-600">{settings.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    Administrador
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Configuraciones */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Configuración de Cuenta */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-slate-200/60 hover:shadow-lg transition-all duration-300">
              {/* Textura decorativa */}
              <div className="absolute inset-0 opacity-4 pointer-events-none">
                <motion.div
                  className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-radial from-emerald-500/30 to-transparent rounded-full blur-xl"
                  animate={{
                    x: [0, 50, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Configuración de Cuenta</span>
                </CardTitle>
                <CardDescription>Gestiona tu información personal y de contacto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => setSettings({ ...settings, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferencias */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-slate-200/60 hover:shadow-lg transition-all duration-300">
              {/* Textura decorativa */}
              <div className="absolute inset-0 opacity-4 pointer-events-none">
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 bg-gradient-radial from-teal-600/40 to-transparent rounded-full blur-xl"
                  animate={{
                    rotate: [0, 180, 360],
                    scale: [0.8, 1.1, 0.8],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Preferencias</span>
                </CardTitle>
                <CardDescription>Personaliza la apariencia y comportamiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones</Label>
                    <p className="text-sm text-gray-600">Recibir notificaciones en tiempo real</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Oscuro</Label>
                    <p className="text-sm text-gray-600">Cambiar a tema oscuro</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                      <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                      <SelectItem value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Seguridad */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-slate-200/60 hover:shadow-lg transition-all duration-300">
              {/* Textura decorativa */}
              <div className="absolute inset-0 opacity-4 pointer-events-none">
                <motion.div
                  className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-radial from-green-500/30 to-transparent rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                  }}
                />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Seguridad</span>
                </CardTitle>
                <CardDescription>Configuraciones de seguridad y privacidad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Cambiar Contraseña
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Configurar Autenticación de Dos Factores
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex justify-end space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline">Cancelar</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleSave}>Guardar Cambios</Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
