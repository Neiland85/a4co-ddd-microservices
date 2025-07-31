"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Shield,
  BarChart3,
  Target,
  Palette,
  Users,
  Share2,
  Clock,
  Building,
  Scale,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react"
import type { CookieCategory, CookiePreferences } from "../types/cookie-types"

interface CookiePreferencesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (preferences: CookiePreferences) => void
  onAcceptAll: () => void
  onRejectAll: () => void
  companyName: string
  contactEmail: string
}

const cookieCategories: CookieCategory[] = [
  {
    id: "necessary",
    name: "Cookies Estrictamente Necesarias",
    description: "Esenciales para el funcionamiento básico del sitio web. No se pueden desactivar.",
    detailedDescription:
      "Estas cookies son fundamentales para que puedas navegar por el sitio web y utilizar sus funciones básicas. Incluyen cookies de sesión, autenticación y seguridad.",
    purposes: [
      "Mantener tu sesión activa",
      "Recordar tus preferencias de idioma",
      "Garantizar la seguridad del sitio",
      "Funcionalidad del carrito de compras",
    ],
    dataProcessed: ["ID de sesión", "Preferencias de idioma", "Tokens de seguridad", "Estado de autenticación"],
    retention: "Hasta el cierre del navegador o 24 horas",
    required: true,
    enabled: true,
    legalBasis: "Interés legítimo (Art. 6.1.f RGPD)",
  },
  {
    id: "analytics",
    name: "Cookies de Análisis y Rendimiento",
    description: "Nos ayudan a entender cómo interactúas con nuestro sitio para mejorarlo continuamente.",
    detailedDescription:
      "Recopilamos información sobre cómo utilizas nuestro sitio web de forma anónima y agregada para mejorar la experiencia del usuario y optimizar nuestros servicios.",
    purposes: [
      "Analizar patrones de navegación",
      "Medir el rendimiento del sitio",
      "Identificar páginas populares",
      "Detectar errores técnicos",
    ],
    dataProcessed: [
      "Páginas visitadas",
      "Tiempo de permanencia",
      "Fuente de tráfico",
      "Dispositivo y navegador (anonimizado)",
    ],
    retention: "26 meses",
    required: false,
    enabled: false,
    vendors: ["Google Analytics", "Hotjar"],
    legalBasis: "Consentimiento (Art. 6.1.a RGPD)",
  },
  {
    id: "marketing",
    name: "Cookies de Marketing y Publicidad",
    description: "Utilizadas para mostrarte anuncios relevantes y medir la efectividad de nuestras campañas.",
    detailedDescription:
      "Estas cookies nos permiten mostrar publicidad personalizada y medir su efectividad. También nos ayudan a entender tus intereses para ofrecerte contenido más relevante.",
    purposes: [
      "Personalizar anuncios",
      "Medir efectividad publicitaria",
      "Remarketing y retargeting",
      "Análisis de audiencias",
    ],
    dataProcessed: [
      "Historial de navegación",
      "Interacciones con anuncios",
      "Intereses inferidos",
      "Datos demográficos aproximados",
    ],
    retention: "13 meses",
    required: false,
    enabled: false,
    vendors: ["Google Ads", "Facebook Pixel", "LinkedIn Insight"],
    legalBasis: "Consentimiento (Art. 6.1.a RGPD)",
  },
  {
    id: "functional",
    name: "Cookies Funcionales",
    description: "Mejoran la funcionalidad del sitio recordando tus elecciones y preferencias.",
    detailedDescription:
      "Estas cookies permiten que el sitio web recuerde las elecciones que haces y proporcione funciones mejoradas y más personales.",
    purposes: [
      "Recordar preferencias de usuario",
      "Personalizar la interfaz",
      "Mantener configuraciones",
      "Funciones de chat en vivo",
    ],
    dataProcessed: [
      "Preferencias de visualización",
      "Configuraciones personalizadas",
      "Historial de chat",
      "Favoritos y listas guardadas",
    ],
    retention: "12 meses",
    required: false,
    enabled: false,
    legalBasis: "Consentimiento (Art. 6.1.a RGPD)",
  },
  {
    id: "personalization",
    name: "Cookies de Personalización",
    description: "Personalizan tu experiencia basándose en tu comportamiento y preferencias.",
    detailedDescription:
      "Utilizamos estas cookies para adaptar el contenido, las recomendaciones y la experiencia general del sitio a tus intereses y comportamiento de navegación.",
    purposes: [
      "Recomendaciones personalizadas",
      "Contenido adaptado",
      "Experiencia personalizada",
      "Sugerencias relevantes",
    ],
    dataProcessed: [
      "Historial de productos vistos",
      "Preferencias de contenido",
      "Patrones de comportamiento",
      "Interacciones previas",
    ],
    retention: "24 meses",
    required: false,
    enabled: false,
    legalBasis: "Consentimiento (Art. 6.1.a RGPD)",
  },
  {
    id: "social",
    name: "Cookies de Redes Sociales",
    description: "Permiten compartir contenido en redes sociales y mostrar contenido social integrado.",
    detailedDescription:
      "Estas cookies son establecidas por servicios de redes sociales que hemos añadido al sitio para permitirte compartir nuestro contenido con tus amigos y redes.",
    purposes: [
      "Compartir en redes sociales",
      "Mostrar contenido social",
      "Botones de 'Me gusta'",
      "Widgets sociales integrados",
    ],
    dataProcessed: [
      "Información de perfil social",
      "Contenido compartido",
      "Interacciones sociales",
      "Conexiones de red",
    ],
    retention: "Según política de cada red social",
    required: false,
    enabled: false,
    vendors: ["Facebook", "Twitter", "LinkedIn", "Instagram"],
    legalBasis: "Consentimiento (Art. 6.1.a RGPD)",
  },
]

const categoryIcons = {
  necessary: Shield,
  analytics: BarChart3,
  marketing: Target,
  functional: Palette,
  personalization: Users,
  social: Share2,
}

export function CookiePreferencesDialog({
  open,
  onOpenChange,
  onSave,
  onAcceptAll,
  onRejectAll,
  companyName,
  contactEmail,
}: CookiePreferencesDialogProps) {
  const [categories, setCategories] = useState<CookieCategory[]>(cookieCategories)
  const [activeTab, setActiveTab] = useState("overview")

  const handleToggle = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId && !category.required ? { ...category, enabled: !category.enabled } : category,
      ),
    )
  }

  const handleSave = () => {
    const preferences: CookiePreferences = {
      necessary: true,
      analytics: categories.find((c) => c.id === "analytics")?.enabled || false,
      marketing: categories.find((c) => c.id === "marketing")?.enabled || false,
      functional: categories.find((c) => c.id === "functional")?.enabled || false,
      personalization: categories.find((c) => c.id === "personalization")?.enabled || false,
      social: categories.find((c) => c.id === "social")?.enabled || false,
    }
    onSave(preferences)
  }

  const handleAcceptAll = () => {
    setCategories((prev) => prev.map((category) => ({ ...category, enabled: true })))
    onAcceptAll()
  }

  const handleRejectAll = () => {
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        enabled: category.required,
      })),
    )
    onRejectAll()
  }

  const enabledCount = categories.filter((c) => c.enabled).length
  const totalCount = categories.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-amber-50/20">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-green-800 flex items-center gap-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-green-600" />
              <CheckCircle className="h-4 w-4 text-amber-500 absolute -bottom-1 -right-1" />
            </div>
            Centro de Preferencias de Privacidad
          </DialogTitle>
          <DialogDescription className="text-base">
            Gestiona tus preferencias de cookies y privacidad de forma granular. Tienes control total sobre tus datos
            personales según el RGPD.
          </DialogDescription>
          <div className="flex items-center gap-4 pt-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              {enabledCount}/{totalCount} Categorías Activas
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
              RGPD Compliant
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 bg-white/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Categorías
            </TabsTrigger>
            <TabsTrigger value="rights" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Tus Derechos
            </TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[60vh] mt-4">
            <TabsContent value="overview" className="space-y-4">
              <Card className="bg-white/50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    Resumen de Privacidad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">
                    En {companyName}, procesamos tus datos personales de acuerdo con el RGPD. Aquí tienes un resumen de
                    cómo utilizamos las cookies:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((category) => {
                      const Icon = categoryIcons[category.id as keyof typeof categoryIcons]
                      return (
                        <div key={category.id} className="flex items-start gap-3 p-3 bg-white/70 rounded-lg border">
                          <Icon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{category.name}</h4>
                              {category.enabled ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                            {category.required && (
                              <Badge variant="secondary" className="text-xs mt-2">
                                Requerida
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              {categories.map((category) => {
                const Icon = categoryIcons[category.id as keyof typeof categoryIcons]
                return (
                  <Card key={category.id} className="bg-white/50 border-green-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-green-600" />
                          <div>
                            <CardTitle className="text-base">{category.name}</CardTitle>
                            <CardDescription className="text-sm">{category.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {category.required && (
                            <Badge variant="secondary" className="text-xs">
                              Requerida
                            </Badge>
                          )}
                          <Switch
                            id={category.id}
                            checked={category.enabled}
                            onCheckedChange={() => handleToggle(category.id)}
                            disabled={category.required}
                            aria-describedby={`${category.id}-description`}
                          />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="details" className="border-0">
                          <AccordionTrigger className="text-sm py-2 hover:no-underline">
                            Ver detalles técnicos y legales
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div>
                                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  Propósitos
                                </h5>
                                <ul className="space-y-1 text-gray-600">
                                  {category.purposes.map((purpose, idx) => (
                                    <li key={idx} className="flex items-start gap-1">
                                      <span className="text-green-500 mt-1">•</span>
                                      {purpose}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                                  <Info className="h-3 w-3" />
                                  Datos Procesados
                                </h5>
                                <ul className="space-y-1 text-gray-600">
                                  {category.dataProcessed.map((data, idx) => (
                                    <li key={idx} className="flex items-start gap-1">
                                      <span className="text-amber-500 mt-1">•</span>
                                      {data}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Retención
                                </h5>
                                <p className="text-gray-600">{category.retention}</p>
                              </div>

                              <div>
                                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
                                  <Scale className="h-3 w-3" />
                                  Base Legal
                                </h5>
                                <p className="text-gray-600">{category.legalBasis}</p>
                              </div>
                            </div>

                            {category.vendors && (
                              <div>
                                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-1 text-xs">
                                  <Building className="h-3 w-3" />
                                  Terceros Involucrados
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {category.vendors.map((vendor, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {vendor}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

            <TabsContent value="rights" className="space-y-4">
              <Card className="bg-white/50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scale className="h-5 w-5 text-blue-600" />
                    Tus Derechos bajo el RGPD
                  </CardTitle>
                  <CardDescription>
                    Como usuario, tienes derechos específicos sobre tus datos personales según el RGPD.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">🔍 Derecho de Acceso</h4>
                      <p className="text-sm text-blue-700">
                        Puedes solicitar una copia de todos los datos personales que tenemos sobre ti.
                      </p>
                    </div>

                    <div className="p-4 bg-green-50/50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">✏️ Derecho de Rectificación</h4>
                      <p className="text-sm text-green-700">
                        Puedes solicitar la corrección de datos personales inexactos o incompletos.
                      </p>
                    </div>

                    <div className="p-4 bg-red-50/50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">🗑️ Derecho de Supresión</h4>
                      <p className="text-sm text-red-700">
                        Puedes solicitar la eliminación de tus datos personales en ciertas circunstancias.
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-amber-800 mb-2">📦 Derecho de Portabilidad</h4>
                      <p className="text-sm text-amber-700">
                        Puedes solicitar tus datos en un formato estructurado y legible por máquina.
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">⛔ Derecho de Oposición</h4>
                      <p className="text-sm text-purple-700">
                        Puedes oponerte al procesamiento de tus datos para marketing directo.
                      </p>
                    </div>

                    <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-200">
                      <h4 className="font-semibold text-indigo-800 mb-2">⏸️ Derecho de Limitación</h4>
                      <p className="text-sm text-indigo-700">
                        Puedes solicitar la limitación del procesamiento en ciertas circunstancias.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">📧 Ejercer tus Derechos</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Para ejercer cualquiera de estos derechos, contáctanos en:
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-white">
                        <a href={`mailto:${contactEmail}`} className="text-blue-600 hover:text-blue-700">
                          {contactEmail}
                        </a>
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Responderemos a tu solicitud dentro de 30 días según lo establecido por el RGPD.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <Separator className="my-4" />

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleRejectAll}
            className="border-red-300 text-red-700 hover:bg-red-50 bg-white/50 transition-all duration-300"
          >
            ❌ Rechazar No Esenciales
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-white/50 transition-all duration-300"
          >
            💾 Guardar Preferencias
          </Button>
          <Button
            onClick={handleAcceptAll}
            className="bg-gradient-to-r from-green-600 via-green-500 to-amber-500 hover:from-green-700 hover:via-green-600 hover:to-amber-600 text-white transition-all duration-300"
          >
            ✅ Aceptar Todo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
