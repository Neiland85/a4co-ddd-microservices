'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Importar componentes v0
import ProductCatalogV0Raw from '@/components/v0/raw/ProductCatalogV0Raw';

// Importar estilos v0
import '@/styles/v0/globals.css';

export default function V0DemoPage() {
  const [selectedComponent, setSelectedComponent] = React.useState<string>('');

  // Lista de componentes v0 disponibles
  const v0Components = [
    {
      name: 'ProductCatalog',
      type: 'catalog',
      description: 'Catálogo de productos con filtros y búsqueda',
      status: 'ready',
      url: 'https://v0.dev/r/example-product-catalog',
    },
    {
      name: 'UserDashboard',
      type: 'dashboard',
      description: 'Dashboard de usuario con métricas y gráficos',
      status: 'ready',
      url: 'https://v0.dev/r/example-user-dashboard',
    },
    {
      name: 'ArtisanForm',
      type: 'form',
      description: 'Formulario de registro de artesanos',
      status: 'pending',
      url: null,
    },
    {
      name: 'SalesMetrics',
      type: 'dashboard',
      description: 'Métricas de ventas con visualizaciones',
      status: 'ready',
      url: 'https://v0.dev/r/example-sales-metrics',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return 'Listo';
      case 'pending':
        return 'Pendiente';
      case 'error':
        return 'Error';
      default:
        return 'Desconocido';
    }
  };

  // Funciones para contar componentes
  const readyComponentsCount = v0Components.filter(c => c.status === 'ready').length;
  const pendingComponentsCount = v0Components.filter(c => c.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">🎨 Demo de Componentes V0.dev</h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Visualiza y prueba la integración de componentes generados con v0.dev en tu proyecto
            Next.js con personalización avanzada.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Componentes V0</p>
                  <p className="text-2xl font-bold text-gray-900">{v0Components.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <span className="text-2xl">🎨</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Listos</p>
                  <p className="text-2xl font-bold text-green-600">{readyComponentsCount}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingComponentsCount}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Temas</p>
                  <p className="text-2xl font-bold text-purple-600">3</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <span className="text-2xl">🎭</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Componentes Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {v0Components.map(component => (
            <Card
              key={component.name}
              className={`cursor-pointer bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
                selectedComponent === component.name ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedComponent(component.name)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{component.name}</CardTitle>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(component.status)} text-white`}
                  >
                    {getStatusText(component.status)}
                  </Badge>
                </div>
                <CardDescription>{component.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Tipo:</span>
                    <Badge variant="outline">{component.type}</Badge>
                  </div>

                  {component.url && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">V0.dev:</span>
                      <a
                        href={component.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                        onClick={e => e.stopPropagation()}
                      >
                        Ver original
                      </a>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={e => {
                        e.stopPropagation();
                        console.log(`Abriendo ejemplo de ${component.name}`);
                      }}
                    >
                      Ver Demo
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={e => {
                        e.stopPropagation();
                        console.log(`Integrando ${component.name}`);
                      }}
                    >
                      Integrar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>🚀 Acciones Rápidas</CardTitle>
            <CardDescription>
              Herramientas para integrar y personalizar componentes v0
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-3">
                <h4 className="font-semibold">📋 Integración Manual</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      console.log('Iniciando integración manual');
                    }}
                  >
                    🔧 Crear Componente V0
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      console.log('Configurando adaptador');
                    }}
                  >
                    ⚙️ Configurar Adaptador
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">🎨 Personalización</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      console.log('Aplicando tema minimal');
                    }}
                  >
                    🎭 Aplicar Tema Minimal
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      console.log('Habilitando analytics');
                    }}
                  >
                    📊 Habilitar Analytics
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">🛠️ Herramientas</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      console.log('Ejecutando script de integración');
                    }}
                  >
                    ⚡ Ejecutar Script
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      console.log('Abriendo documentación');
                    }}
                  >
                    📖 Ver Documentación
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo del Componente ProductCatalogV0Raw */}
        <div className="mt-12">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🫒 Demo: ProductCatalogV0Raw
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                  ✅ Implementado
                </Badge>
              </CardTitle>
              <CardDescription>
                Componente de catálogo de productos funcional sin TODO tags. Incluye filtros,
                estados de carga, y datos de ejemplo del mercado local de Jaén.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductCatalogV0Raw
                showFilters={true}
                maxItems={6}
                onProductSelect={product => {
                  console.log('Producto seleccionado:', product);
                  alert(`Producto seleccionado: ${product.name} - ${product.price}€`);
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Separator className="my-6" />
          <p className="text-gray-600">
            💡 <strong>Tip:</strong> Usa el script{' '}
            <code className="rounded bg-gray-100 px-2 py-1">./scripts/integrate-v0.sh</code> para
            automatizar la integración de nuevos componentes v0
          </p>
          <div className="mt-4 space-x-4">
            <Button variant="outline" size="sm">
              📚 Documentación Completa
            </Button>
            <Button variant="outline" size="sm">
              🎯 Ejemplos Prácticos
            </Button>
            <Button variant="outline" size="sm">
              🔧 Configuración Avanzada
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
