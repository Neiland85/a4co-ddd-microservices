'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Locate } from 'lucide-react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MapFilters from './map-filters';
import ProducerMarker from './producer-marker';
import RouteDisplay from './route-display';
import RoutingPanel from './routing-panel';
import { useProducers } from '../hooks/use-producers';
import { useRouting } from '../hooks/use-routing';
import type { MapFilters as MapFiltersType, Producer, RoutePoint } from '../types/producer-types';
import type L from 'leaflet'; // Import L variable

// Component to fit map bounds to markers
function MapBounds({ producers }: { producers: Producer[] }) {
  const map = useMap();

  useEffect(() => {
    if (producers.length > 0) {
      const bounds = new LatLngBounds(producers.map(p => [p.coordinates.lat, p.coordinates.lng]));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [producers, map]);

  return null;
}

interface MapViewProps {
  className?: string;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

export default function MapView({
  className = '',
  defaultCenter = { lat: 38.0138, lng: -3.3706 }, // Úbeda, Jaén
  defaultZoom = 10,
}: MapViewProps) {
  const [filters, setFilters] = useState<MapFiltersType>({
    categories: [],
    maxDistance: 50,
    searchQuery: '',
    minRating: 0,
  });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const {
    route,
    isCalculating,
    error: routingError,
    startPoint,
    endPoint,
    calculateRoute,
    clearRoute,
  } = useRouting();
  const [showRoutingPanel, setShowRoutingPanel] = useState(false);
  const [selectedProducerForRoute, setSelectedProducerForRoute] = useState<Producer | null>(null);

  const { producers, isLoading, error } = useProducers(filters);
  const [isLocating, setIsLocating] = useState(false);

  // Get user location
  const getUserLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
        },
        error => {
          console.warn('Could not get user location:', error);
          setIsLocating(false);
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
      setIsLocating(false);
    }
  };

  const handleProducerClick = (producer: Producer) => {
    setSelectedProducer(producer);
    setSelectedProducerForRoute(producer);
    setShowRoutingPanel(true);
    console.log('Selected producer:', producer);
  };

  const handleCalculateRoute = async (options: any) => {
    if (!userLocation || !selectedProducerForRoute) {
      alert('Necesitamos tu ubicación para calcular la ruta');
      return;
    }

    const start: RoutePoint = {
      lat: userLocation.lat,
      lng: userLocation.lng,
      address: 'Tu ubicación',
    };

    const end: RoutePoint = {
      lat: selectedProducerForRoute.coordinates.lat,
      lng: selectedProducerForRoute.coordinates.lng,
      address: selectedProducerForRoute.address,
    };

    try {
      await calculateRoute(start, end, options);
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  if (error) {
    return (
      <div className={`relative h-96 ${className}`}>
        <Alert className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error al cargar el mapa de productores: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`relative h-96 overflow-hidden rounded-lg bg-gray-100 ${className}`}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-a4co-olive-600 flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="font-medium">Cargando productores...</span>
          </div>
        </div>
      )}

      {/* Map Filters */}
      <MapFilters
        filters={filters}
        onFiltersChange={setFilters}
        isOpen={filtersOpen}
        onToggle={toggleFilters}
      />

      {/* Results Counter */}
      {!isLoading && (
        <div className="shadow-natural border-a4co-olive-200 absolute right-4 top-4 z-[1000] rounded-lg border bg-white/95 px-3 py-2 backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <div className="flex items-center">
              <MapPin className="text-a4co-olive-600 mr-1 h-4 w-4" />
              <span className="font-medium">
                {producers.length} productor{producers.length !== 1 ? 'es' : ''} encontrado
                {producers.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={getUserLocation}
                disabled={isLocating}
                className="border-a4co-olive-300 text-a4co-olive-700 hover:bg-a4co-olive-50 bg-transparent"
                aria-label="Obtener mi ubicación"
              >
                <Locate className={`mr-2 h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? 'Localizando...' : 'Mi ubicación'}
              </Button>

              {route && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearRoute();
                    setShowRoutingPanel(false);
                  }}
                  className="border-red-300 bg-transparent text-red-700 hover:bg-red-50"
                >
                  Limpiar Ruta
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Routing Panel */}
      {showRoutingPanel && selectedProducerForRoute && (
        <RoutingPanel
          route={route}
          isCalculating={isCalculating}
          error={routingError}
          onCalculateRoute={handleCalculateRoute}
          onClearRoute={() => {
            clearRoute();
            setShowRoutingPanel(false);
            setSelectedProducerForRoute(null);
          }}
          startAddress="Tu ubicación"
          endAddress={selectedProducerForRoute.name}
          className="absolute right-4 top-4 z-[1000] max-h-[calc(100vh-2rem)] w-80 overflow-y-auto"
        />
      )}

      {/* Map Container */}
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={defaultZoom}
        className="h-full w-full"
        ref={mapRef}
        aria-label="Mapa interactivo de productores artesanales"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Auto-fit bounds to markers */}
        <MapBounds producers={producers} />

        {/* Producer Markers */}
        {producers.map(producer => (
          <ProducerMarker key={producer.id} producer={producer} onClick={handleProducerClick} />
        ))}

        {/* Route Display */}
        {route && startPoint && endPoint && (
          <RouteDisplay route={route} startPoint={startPoint} endPoint={endPoint} color="#8a9b73" />
        )}
      </MapContainer>

      {/* No Results Message */}
      {!isLoading && producers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="p-6 text-center">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No se encontraron productores
            </h3>
            <p className="mb-4 text-gray-600">
              Intenta ajustar los filtros para encontrar más resultados
            </p>
            <button
              onClick={() =>
                setFilters({
                  categories: [],
                  maxDistance: 50,
                  searchQuery: '',
                  minRating: 0,
                })
              }
              className="text-a4co-olive-600 hover:text-a4co-olive-700 text-sm font-medium"
            >
              Limpiar todos los filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
