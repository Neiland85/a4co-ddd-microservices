'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, MapPin, Plus, X, RouteIcon } from 'lucide-react';
import type { RoutePoint, RoutingOptions } from '@/types/routing-types';
import { useRouting } from '@/hooks/use-routing';
import { RouteDisplay } from './route-display';

export function RoutingPanel() {
  const { currentRoute, isCalculating, error, calculateRoute, optimizeRoute, clearRoute } =
    useRouting();

  const [startPoint, setStartPoint] = useState<Partial<RoutePoint>>({
    name: '',
    lat: 37.7749,
    lng: -3.7849,
  });

  const [endPoint, setEndPoint] = useState<Partial<RoutePoint>>({
    name: '',
    lat: 37.7849,
    lng: -3.7749,
  });

  const [waypoints, setWaypoints] = useState<Partial<RoutePoint>[]>([]);

  const [options, setOptions] = useState<RoutingOptions>({
    mode: 'driving',
    avoidTolls: false,
    avoidHighways: false,
    optimize: true,
  });

  const addWaypoint = () => {
    setWaypoints([...waypoints, { name: '', lat: 37.7799, lng: -3.7799 }]);
  };

  const removeWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const updateWaypoint = (index: number, field: keyof RoutePoint, value: any) => {
    const updated = [...waypoints];
    updated[index] = { ...updated[index], [field]: value };
    setWaypoints(updated);
  };

  const handleCalculateRoute = async () => {
    if (!startPoint.name || !endPoint.name) return;

    const validWaypoints = waypoints.filter(wp => wp.name) as RoutePoint[];

    if (options.optimize && validWaypoints.length > 0) {
      await optimizeRoute(
        [startPoint as RoutePoint, ...validWaypoints, endPoint as RoutePoint],
        options
      );
    } else {
      await calculateRoute(
        { ...startPoint, type: 'start' } as RoutePoint,
        { ...endPoint, type: 'end' } as RoutePoint,
        validWaypoints.map(wp => ({ ...wp, type: 'waypoint' as const })),
        options
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RouteIcon className="h-5 w-5 text-green-600" />
            Planificador de Rutas Artesanales
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Route Points */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Punto de inicio</Label>
                <Input
                  id="start"
                  placeholder="Ej: Jaén Centro"
                  value={startPoint.name}
                  onChange={e => setStartPoint({ ...startPoint, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">Destino</Label>
                <Input
                  id="end"
                  placeholder="Ej: Úbeda"
                  value={endPoint.name}
                  onChange={e => setEndPoint({ ...endPoint, name: e.target.value })}
                />
              </div>
            </div>

            {/* Waypoints */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Paradas intermedias</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addWaypoint}
                  className="border-green-200 bg-transparent text-green-600 hover:bg-green-50"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Añadir parada
                </Button>
              </div>

              {waypoints.map((waypoint, index) => (
                <div key={index} className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-blue-600" />
                  <Input
                    placeholder={`Parada ${index + 1}`}
                    value={waypoint.name}
                    onChange={e => updateWaypoint(index, 'name', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWaypoint(index)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Route Options */}
          <div className="space-y-4 border-t pt-4">
            <Label className="text-sm font-medium">Opciones de ruta</Label>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mode" className="text-sm">
                  Modo de transporte
                </Label>
                <Select
                  value={options.mode}
                  onValueChange={(value: any) => setOptions({ ...options, mode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walking">🚶 A pie</SelectItem>
                    <SelectItem value="cycling">🚴 En bicicleta</SelectItem>
                    <SelectItem value="driving">🚗 En coche</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="optimize" className="text-sm">
                  Optimizar ruta
                </Label>
                <Switch
                  id="optimize"
                  checked={options.optimize}
                  onCheckedChange={checked => setOptions({ ...options, optimize: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="avoid-tolls" className="text-sm">
                  Evitar peajes
                </Label>
                <Switch
                  id="avoid-tolls"
                  checked={options.avoidTolls}
                  onCheckedChange={checked => setOptions({ ...options, avoidTolls: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="avoid-highways" className="text-sm">
                  Evitar autopistas
                </Label>
                <Switch
                  id="avoid-highways"
                  checked={options.avoidHighways}
                  onCheckedChange={checked => setOptions({ ...options, avoidHighways: checked })}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t pt-4">
            <Button
              onClick={handleCalculateRoute}
              disabled={!startPoint.name || !endPoint.name || isCalculating}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculando...
                </>
              ) : (
                <>
                  <RouteIcon className="mr-2 h-4 w-4" />
                  Calcular Ruta
                </>
              )}
            </Button>

            {currentRoute && (
              <Button
                variant="outline"
                onClick={clearRoute}
                className="border-red-200 bg-transparent text-red-600 hover:bg-red-50"
              >
                Limpiar
              </Button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Route Display */}
      {currentRoute && (
        <RouteDisplay
          route={currentRoute}
          onStartNavigation={() => {
            // Handle navigation start
            console.log('Starting navigation for route:', currentRoute.id);
          }}
        />
      )}
    </div>
  );
}
