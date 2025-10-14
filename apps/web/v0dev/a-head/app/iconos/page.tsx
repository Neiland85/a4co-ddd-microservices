'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles, Download, Code } from 'lucide-react';
import { IconGrid } from '@/components/icon-grid';
import { iconConfigs } from '@/data/icon-configs';
import type { IconConfig } from '@/types/icon-grid-types';

export default function IconosPage() {
  const [selectedIcon, setSelectedIcon] = useState<IconConfig | null>(null);

  const handleIconClick = (icon: IconConfig) => {
    setSelectedIcon(icon);
  };

  const handleDownload = () => {
    if (selectedIcon) {
      // Simulate download
      console.log('Downloading icon:', selectedIcon.name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-3">
              <Palette className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Biblioteca de Iconos</h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Explora nuestra colección de iconos diseñados especialmente para la plataforma artesanal
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Iconos Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <IconGrid
                  icons={iconConfigs}
                  columns={4}
                  gap={4}
                  showLabels={true}
                  onIconClick={handleIconClick}
                />
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
                      className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-lg"
                      style={{ backgroundColor: selectedIcon.bgColor }}
                    >
                      <div className="h-8 w-8" style={{ color: selectedIcon.color }}>
                        {/* Icon would be rendered here */}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold">{selectedIcon.name}</h3>
                    <p className="text-sm text-gray-600">{selectedIcon.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Categoría:</span>
                      <Badge variant="secondary" className="capitalize">
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
                        <div
                          className="h-4 w-4 rounded border"
                          style={{ backgroundColor: selectedIcon.color }}
                        />
                        <span className="font-mono text-sm">{selectedIcon.color}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    <Button onClick={handleDownload} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar SVG
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Code className="mr-2 h-4 w-4" />
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
                  <span className="font-semibold">
                    {new Set(iconConfigs.map(icon => icon.category)).size}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Iconos activos:</span>
                  <span className="font-semibold">
                    {iconConfigs.filter(icon => icon.isActive).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
