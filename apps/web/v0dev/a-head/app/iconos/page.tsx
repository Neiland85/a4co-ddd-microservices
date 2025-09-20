"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// Simple icon components to replace lucide-react
const Palette = () => <div className="w-8 h-8 text-white">🎨</div>
const Sparkles = () => <div className="w-5 h-5 text-purple-600">✨</div>
const Download = () => <div className="w-4 h-4 mr-2">⬇️</div>
const Code = () => <div className="w-4 h-4 mr-2">💻</div>
import { IconGrid } from "@/components/icon-grid"
import { iconConfigs } from "@/data/icon-configs"
import type { IconConfig } from "@/types/icon-grid-types"

export default function IconosPage() {
  const [selectedIcon, setSelectedIcon] = useState<IconConfig | null>(null)

  const handleIconClick = (icon: IconConfig) => {
    setSelectedIcon(icon)
  }

  const handleDownload = () => {
    if (selectedIcon) {
      // Simulate download
      console.log("Downloading icon:", selectedIcon.name)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Palette />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Biblioteca de Iconos</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora nuestra colección de iconos diseñados especialmente para la plataforma artesanal
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles />
                  Iconos Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <IconGrid icons={iconConfigs} columns={4} gap={4} showLabels={true} onIconClick={handleIconClick} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Icon Details */}
            {selectedIcon && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detalles del Icono</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div
                      className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: selectedIcon.bgColor }}
                    >
                      <div className="w-8 h-8" style={{ color: selectedIcon.color }}>
                        {/* Icon would be rendered here */}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg">{selectedIcon.name}</h3>
                    <p className="text-sm text-gray-600">{selectedIcon.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Categoría:</span>
                      <Badge className="capitalize">
                        {selectedIcon.category}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tamaño:</span>
                      <span className="text-sm font-medium">{selectedIcon.size.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Color:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border" style={{ backgroundColor: selectedIcon.color }} />
                        <span className="text-sm font-mono">{selectedIcon.color}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <Button onClick={handleDownload} className="w-full">
                      <Download />
                      Descargar SVG
                    </Button>
                    <Button className="w-full bg-transparent border">
                      <Code />
                      Ver Código
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total de iconos:</span>
                  <span className="font-semibold">{iconConfigs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Categorías:</span>
                  <span className="font-semibold">{new Set(iconConfigs.map((icon) => icon.category)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Iconos activos:</span>
                  <span className="font-semibold">{iconConfigs.filter((icon) => icon.isActive).length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
