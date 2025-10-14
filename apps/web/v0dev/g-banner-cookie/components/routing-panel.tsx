'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Navigation,
  Car,
  Bike,
  MapPin,
  Clock,
  RouteIcon,
  X,
  AlertCircle,
  Loader2,
  Settings,
} from 'lucide-react';
import type { Route, TransportMode, RoutingOptions } from '../types/routing-types';

interface RoutingPanelProps {
  route: Route | null;
  isCalculating: boolean;
  error: string | null;
  onCalculateRoute: (options: RoutingOptions) => void;
  onClearRoute: () => void;
  startAddress?: string;
  endAddress?: string;
  className?: string;
}

const transportModes: { value: TransportMode; label: string; icon: React.ReactNode }[] = [
  { value: 'driving-car', label: 'Coche', icon: <Car className="h-4 w-4" /> },
  { value: 'cycling-regular', label: 'Bicicleta', icon: <Bike className="h-4 w-4" /> },
  { value: 'foot-walking', label: 'A pie', icon: <MapPin className="h-4 w-4" /> },
];

export default function RoutingPanel({
  route,
  isCalculating,
  error,
  onCalculateRoute,
  onClearRoute,
  startAddress = 'Tu ubicación',
  endAddress = 'Destino seleccionado',
  className = '',
}: RoutingPanelProps) {
  const [selectedMode, setSelectedMode] = useState<TransportMode>('driving-car');
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [avoidHighways, setAvoidHighways] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCalculateRoute = () => {
    onCalculateRoute({
      mode: selectedMode,
      avoidTolls,
      avoidHighways,
    });
  };

  const getModeIcon = (mode: TransportMode) => {
    return transportModes.find(m => m.value === mode)?.icon || <Car className="h-4 w-4" />;
  };

  return (
    <Card className={`shadow-natural-lg border-a4co-olive-200 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <Navigation className="text-a4co-olive-600 mr-2 h-5 w-5" />
            Cómo Llegar
          </CardTitle>
          {route && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearRoute}
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
              aria-label="Limpiar ruta"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Route Summary */}
        {route && (
          <div className="bg-a4co-olive-50 border-a4co-olive-200 rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getModeIcon(selectedMode)}
                <span className="text-a4co-olive-700 font-medium">
                  {transportModes.find(m => m.value === selectedMode)?.label}
                </span>
              </div>
              <Badge variant="secondary" className="bg-a4co-olive-100 text-a4co-olive-700">
                <RouteIcon className="mr-1 h-3 w-3" />
                Ruta calculada
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="text-a4co-olive-600 h-4 w-4" />
                <div>
                  <div className="font-medium text-gray-900">{route.summary.distance}</div>
                  <div className="text-gray-600">Distancia</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="text-a4co-olive-600 h-4 w-4" />
                <div>
                  <div className="font-medium text-gray-900">{route.summary.duration}</div>
                  <div className="text-gray-600">Tiempo estimado</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Route Points */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-green-500"></div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900">Origen</div>
              <div className="truncate text-xs text-gray-600">{startAddress}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-red-500"></div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900">Destino</div>
              <div className="truncate text-xs text-gray-600">{endAddress}</div>
            </div>
          </div>
        </div>

        {/* Transport Mode Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Medio de transporte</Label>
          <Select
            value={selectedMode}
            onValueChange={(value: TransportMode) => setSelectedMode(value)}
          >
            <SelectTrigger className="focus:border-a4co-olive-500 focus:ring-a4co-olive-500 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {transportModes.map(mode => (
                <SelectItem key={mode.value} value={mode.value}>
                  <div className="flex items-center space-x-2">
                    {mode.icon}
                    <span>{mode.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Options */}
        {selectedMode === 'driving-car' && (
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-a4co-olive-600 hover:text-a4co-olive-700 hover:bg-a4co-olive-50 h-auto p-0 font-normal"
            >
              <Settings className="mr-1 h-4 w-4" />
              Opciones avanzadas
            </Button>

            {showAdvanced && (
              <div className="border-a4co-olive-200 space-y-3 border-l-2 pl-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="avoid-tolls" className="text-sm text-gray-700">
                    Evitar peajes
                  </Label>
                  <Switch
                    id="avoid-tolls"
                    checked={avoidTolls}
                    onCheckedChange={setAvoidTolls}
                    className="shadow-natural-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="avoid-highways" className="text-sm text-gray-700">
                    Evitar autopistas
                  </Label>
                  <Switch
                    id="avoid-highways"
                    checked={avoidHighways}
                    onCheckedChange={setAvoidHighways}
                    className="shadow-natural-sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleCalculateRoute}
          disabled={isCalculating}
          className="from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 shadow-mixed hover:shadow-mixed-lg w-full bg-gradient-to-r text-white transition-all duration-300"
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculando ruta...
            </>
          ) : (
            <>
              <Navigation className="mr-2 h-4 w-4" />
              {route ? 'Recalcular Ruta' : 'Calcular Ruta'}
            </>
          )}
        </Button>

        {/* Route Instructions */}
        {route && route.segments.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Instrucciones</Label>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {route.segments.slice(0, 5).map((segment, index) => (
                <div key={index} className="rounded bg-gray-50 p-2 text-xs text-gray-600">
                  <div className="font-medium">
                    {index + 1}. {segment.instruction}
                  </div>
                  <div className="mt-1 text-gray-500">
                    {(segment.distance / 1000).toFixed(1)} km • {Math.round(segment.duration / 60)}{' '}
                    min
                  </div>
                </div>
              ))}
              {route.segments.length > 5 && (
                <div className="py-1 text-center text-xs text-gray-500">
                  +{route.segments.length - 5} instrucciones más
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
