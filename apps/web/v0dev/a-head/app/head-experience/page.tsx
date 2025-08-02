"use client"

import { useState } from "react"
import HeadExperience from "../../components/head-experience/head-experience"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SoundSettings } from "../../types/head-experience-types"

export default function HeadExperiencePage() {
  const [soundSettings, setSoundSettings] = useState<SoundSettings>({
    enabled: true,
    volume: 0.3,
    clickSound: true,
    hoverSound: true,
    menuSound: true,
  })

  const handleSearch = (query: string) => {
    console.log("Búsqueda realizada:", query)
    // Aquí implementarías la lógica de búsqueda real
  }

  const handleLanguageChange = (language: string) => {
    console.log("Idioma cambiado a:", language)
    // Aquí implementarías el cambio de idioma real
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <HeadExperience
        companyName="A4CO"
        logo="/images/logo-green.jpeg"
        onSearch={handleSearch}
        onLanguageChange={handleLanguageChange}
        soundSettings={soundSettings}
        onSoundSettingsChange={setSoundSettings}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-a4co-olive-200 shadow-natural-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-a4co-olive-700">HeadExperience - Demostración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Este componente HeadExperience incluye todas las características solicitadas:
              </p>

              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>Navegación responsiva</strong> con menú móvil animado
                </li>
                <li>
                  <strong>Búsqueda avanzada</strong> con resultados en tiempo real y sugerencias
                </li>
                <li>
                  <strong>Selector de idioma</strong> con animaciones fluidas
                </li>
                <li>
                  <strong>Conmutador de tema</strong> claro/oscuro con transiciones suaves
                </li>
                <li>
                  <strong>Controles de sonido</strong> con efectos de audio personalizables
                </li>
                <li>
                  <strong>Banner de cookies GDPR</strong> con configuración detallada
                </li>
                <li>
                  <strong>Animaciones con Motion</strong> y gestos táctiles
                </li>
                <li>
                  <strong>Accesibilidad completa</strong> con roles ARIA y navegación por teclado
                </li>
                <li>
                  <strong>Arquitectura modular</strong> con componentes reutilizables
                </li>
              </ul>

              <div className="mt-6 p-4 bg-a4co-olive-50 rounded-lg border border-a4co-olive-200">
                <h3 className="font-semibold text-a4co-olive-700 mb-2">Características Técnicas:</h3>
                <ul className="text-sm text-a4co-olive-600 space-y-1">
                  <li>• Next.js 15 con App Router</li>
                  <li>• Tailwind CSS v4.1 con colores personalizados A4CO</li>
                  <li>• shadcn/ui para componentes base</li>
                  <li>• Framer Motion para animaciones de alto rendimiento</li>
                  <li>• Audio Web API para efectos de sonido (7kB footprint)</li>
                  <li>• TypeScript para type safety</li>
                  <li>• Diseño completamente responsivo</li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-a4co-clay-50 rounded-lg border border-a4co-clay-200">
                <h3 className="font-semibold text-a4co-clay-700 mb-2">Interacciones Disponibles:</h3>
                <ul className="text-sm text-a4co-clay-600 space-y-1">
                  <li>• Haz clic en el menú móvil para ver las animaciones deslizantes</li>
                  <li>• Prueba la búsqueda con términos como "ochío" o "aceite"</li>
                  <li>• Cambia el idioma y observa las transiciones</li>
                  <li>• Alterna entre tema claro y oscuro</li>
                  <li>• Configura los efectos de sonido en el panel de audio</li>
                  <li>• Arrastra hacia arriba en el menú móvil para cerrarlo</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-a4co-clay-200 shadow-warm-lg">
            <CardHeader>
              <CardTitle className="text-xl text-a4co-clay-700">Configuración Actual de Sonido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Estado:</span>{" "}
                  <span className={soundSettings.enabled ? "text-green-600" : "text-red-600"}>
                    {soundSettings.enabled ? "Activado" : "Desactivado"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Volumen:</span>{" "}
                  <span className="text-a4co-olive-600">{Math.round(soundSettings.volume * 100)}%</span>
                </div>
                <div>
                  <span className="font-medium">Clicks:</span>{" "}
                  <span className={soundSettings.clickSound ? "text-green-600" : "text-gray-400"}>
                    {soundSettings.clickSound ? "Sí" : "No"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Hover:</span>{" "}
                  <span className={soundSettings.hoverSound ? "text-green-600" : "text-gray-400"}>
                    {soundSettings.hoverSound ? "Sí" : "No"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
