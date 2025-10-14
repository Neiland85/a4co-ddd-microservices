'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Palette, Code, Settings, Copy, Check } from 'lucide-react';
import IconGrid from '../../components/icon-grid';
import IconItem from '../../components/icon-item';
import { iconConfigs } from '../../data/icon-configs';
import type { IconConfig } from '../../types/icon-grid-types';

export default function IconosPage() {
  const [selectedIcon, setSelectedIcon] = useState<IconConfig | null>(null);
  const [iconSize, setIconSize] = useState(24);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [showLabels, setShowLabels] = useState(true);
  const [gridVariant, setGridVariant] = useState<'default' | 'outline' | 'ghost' | 'secondary'>(
    'default'
  );
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleIconClick = (config: IconConfig) => {
    setSelectedIcon(config);
    toast({
      title: 'Icono seleccionado',
      description: `Has seleccionado: ${config.label}`,
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);

    toast({
      title: 'Código copiado',
      description: 'El código ha sido copiado al portapapeles',
    });
  };

  const generateImportCode = (config: IconConfig) => {
    return `import { ${config.icon.name} } from "lucide-react"`;
  };

  const generateUsageCode = (config: IconConfig) => {
    return `<${config.icon.name} 
  size={${iconSize}} 
  strokeWidth={${strokeWidth}} 
  className="text-a4co-olive-600"
/>`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="shadow-natural-sm border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
              Biblioteca de Iconos A4CO
            </h1>
            <p className="mx-auto mb-6 max-w-3xl text-xl text-gray-600 dark:text-gray-400">
              Colección completa de iconos Lucide React con componentes reutilizables y
              configurables
            </p>

            {/* Installation Badge */}
            <div className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-700">
              <Code className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
              <code className="font-mono text-sm text-gray-800 dark:text-gray-200">
                pnpm install lucide-react
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard('pnpm install lucide-react', 'install')}
                className="ml-2 h-6 w-6 p-0"
              >
                {copiedCode === 'install' ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="grid" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="grid">Cuadrícula de Iconos</TabsTrigger>
            <TabsTrigger value="playground">Playground</TabsTrigger>
            <TabsTrigger value="documentation">Documentación</TabsTrigger>
          </TabsList>

          {/* Icon Grid Tab */}
          <TabsContent value="grid" className="space-y-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Configuración de la Cuadrícula
                </CardTitle>
                <CardDescription>
                  Personaliza la apariencia y comportamiento de los iconos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {/* Icon Size */}
                  <div className="space-y-2">
                    <Label>Tamaño del icono: {iconSize}px</Label>
                    <Slider
                      value={[iconSize]}
                      onValueChange={value => setIconSize(value[0])}
                      max={48}
                      min={16}
                      step={2}
                      className="w-full"
                    />
                  </div>

                  {/* Stroke Width */}
                  <div className="space-y-2">
                    <Label>Grosor del trazo: {strokeWidth}</Label>
                    <Slider
                      value={[strokeWidth]}
                      onValueChange={value => setStrokeWidth(value[0])}
                      max={4}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                  </div>

                  {/* Variant */}
                  <div className="space-y-2">
                    <Label>Variante</Label>
                    <div className="flex flex-wrap gap-2">
                      {['default', 'outline', 'ghost', 'secondary'].map(variant => (
                        <Button
                          key={variant}
                          variant={gridVariant === variant ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setGridVariant(variant as any)}
                          className="text-xs"
                        >
                          {variant}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Show Labels */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-labels"
                        checked={showLabels}
                        onCheckedChange={setShowLabels}
                      />
                      <Label htmlFor="show-labels">Mostrar etiquetas</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Icon Grid */}
            <IconGrid
              icons={iconConfigs}
              size={iconSize}
              strokeWidth={strokeWidth}
              variant={gridVariant}
              showLabels={showLabels}
              onIconClick={handleIconClick}
              columns={{
                mobile: 2,
                tablet: 4,
                desktop: 6,
              }}
            />
          </TabsContent>

          {/* Playground Tab */}
          <TabsContent value="playground" className="space-y-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Selected Icon Display */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="mr-2 h-5 w-5" />
                    Vista Previa
                  </CardTitle>
                  <CardDescription>
                    {selectedIcon
                      ? `Previsualizando: ${selectedIcon.label}`
                      : 'Selecciona un icono para previsualizar'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedIcon ? (
                    <div className="space-y-6">
                      {/* Large Preview */}
                      <div className="flex items-center justify-center rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
                        <IconItem
                          config={selectedIcon}
                          size={iconSize * 2}
                          strokeWidth={strokeWidth}
                          variant={gridVariant}
                        />
                      </div>

                      {/* Icon Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Nombre:</span>
                          <Badge variant="secondary">{selectedIcon.label}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">ID:</span>
                          <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                            {selectedIcon.id}
                          </code>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Categoría:</span>
                          <Badge variant="outline">{selectedIcon.category}</Badge>
                        </div>
                        {selectedIcon.description && (
                          <div className="pt-2">
                            <span className="font-medium">Descripción:</span>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {selectedIcon.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <Palette className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Selecciona un icono de la cuadrícula para ver la vista previa
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Code Examples */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="mr-2 h-5 w-5" />
                    Código de Ejemplo
                  </CardTitle>
                  <CardDescription>Copia y pega estos ejemplos en tu proyecto</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedIcon ? (
                    <div className="space-y-4">
                      {/* Import Statement */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <Label className="text-sm font-medium">Importación</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(generateImportCode(selectedIcon), 'import')
                            }
                          >
                            {copiedCode === 'import' ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <pre className="overflow-x-auto rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">
                          <code>{generateImportCode(selectedIcon)}</code>
                        </pre>
                      </div>

                      {/* Usage Example */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <Label className="text-sm font-medium">Uso</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(generateUsageCode(selectedIcon), 'usage')
                            }
                          >
                            {copiedCode === 'usage' ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <pre className="overflow-x-auto rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">
                          <code>{generateUsageCode(selectedIcon)}</code>
                        </pre>
                      </div>

                      {/* IconItem Component Usage */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <Label className="text-sm font-medium">Componente IconItem</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(
                                `<IconItem
  config={{
    id: "${selectedIcon.id}",
    icon: ${selectedIcon.icon.name},
    label: "${selectedIcon.label}",
    description: "${selectedIcon.description}",
    category: "${selectedIcon.category}",
    onClick: () => console.log("Clicked!")
  }}
  size={${iconSize}}
  strokeWidth={${strokeWidth}}
  variant="${gridVariant}"
/>`,
                                'component'
                              )
                            }
                          >
                            {copiedCode === 'component' ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <pre className="overflow-x-auto rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">
                          <code>{`<IconItem
  config={{
    id: "${selectedIcon.id}",
    icon: ${selectedIcon.icon.name},
    label: "${selectedIcon.label}",
    description: "${selectedIcon.description}",
    category: "${selectedIcon.category}",
    onClick: () => console.log("Clicked!")
  }}
  size={${iconSize}}
  strokeWidth={${strokeWidth}}
  variant="${gridVariant}"
/>`}</code>
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Code className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Selecciona un icono para ver ejemplos de código
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-6">
            <div className="grid gap-6">
              {/* IconGrid Documentation */}
              <Card>
                <CardHeader>
                  <CardTitle>Componente IconGrid</CardTitle>
                  <CardDescription>
                    Cuadrícula responsiva para mostrar colecciones de iconos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Props principales:</h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        <code>icons</code>: Array de configuraciones de iconos
                      </li>
                      <li>
                        <code>columns</code>: Configuración responsiva de columnas
                      </li>
                      <li>
                        <code>size</code>: Tamaño por defecto de los iconos (24px)
                      </li>
                      <li>
                        <code>strokeWidth</code>: Grosor del trazo (2)
                      </li>
                      <li>
                        <code>variant</code>: Estilo de los botones
                      </li>
                      <li>
                        <code>onIconClick</code>: Callback al hacer clic en un icono
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* IconItem Documentation */}
              <Card>
                <CardHeader>
                  <CardTitle>Componente IconItem</CardTitle>
                  <CardDescription>
                    Botón individual con icono, tooltip y efectos de hover
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Props principales:</h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>
                        <code>config</code>: Configuración del icono (id, icon, label, etc.)
                      </li>
                      <li>
                        <code>size</code>: Tamaño del icono en píxeles
                      </li>
                      <li>
                        <code>color</code>: Color del icono
                      </li>
                      <li>
                        <code>strokeWidth</code>: Grosor del trazo
                      </li>
                      <li>
                        <code>variant</code>: Variante del botón (default, outline, ghost,
                        secondary)
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Examples */}
              <Card>
                <CardHeader>
                  <CardTitle>Ejemplos de Uso</CardTitle>
                  <CardDescription>Casos de uso comunes y mejores prácticas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-medium">Uso básico:</h4>
                      <pre className="overflow-x-auto rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">
                        <code>{`import IconGrid from './components/icon-grid'
import { iconConfigs } from './data/icon-configs'

<IconGrid 
  icons={iconConfigs}
  onIconClick={(config) => console.log(config.label)}
/>`}</code>
                      </pre>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium">Configuración personalizada:</h4>
                      <pre className="overflow-x-auto rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">
                        <code>{`<IconGrid 
  icons={iconConfigs}
  size={32}
  strokeWidth={1.5}
  variant="outline"
  columns={{ mobile: 3, tablet: 5, desktop: 8 }}
  onIconClick={handleIconClick}
/>`}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
