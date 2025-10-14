'use client';

import { Marker, Tooltip } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Star, MapPin, Phone, Award, Clock, Navigation } from 'lucide-react';
import type { Producer } from '../types/producer-types';

interface ProducerMarkerProps {
  producer: Producer;
  onClick?: (producer: Producer) => void;
}

// Custom marker icons for different categories
const createCustomIcon = (category: string, isSelected = false) => {
  const iconColor = isSelected ? '#4a934a' : getCategoryColor(category);
  const iconSize = isSelected ? 35 : 30;

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${iconColor}" stroke="white" strokeWidth="2"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          ${getCategoryEmoji(category)}
        </text>
      </svg>
    `)}`,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize],
    popupAnchor: [0, -iconSize],
  });
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    panaderia: '#b08968',
    queseria: '#f4d03f',
    aceite: '#8a9b73',
    embutidos: '#cd6155',
    miel: '#f7dc6f',
    conservas: '#85c1e9',
    vinos: '#8e44ad',
    dulces: '#f1948a',
    artesania: '#82e0aa',
  };
  return colors[category] || '#8a9b73';
};

const getCategoryEmoji = (category: string): string => {
  const emojis: Record<string, string> = {
    panaderia: '🥖',
    queseria: '🧀',
    aceite: '🫒',
    embutidos: '🥓',
    miel: '🍯',
    conservas: '🥫',
    vinos: '🍷',
    dulces: '🍰',
    artesania: '🏺',
  };
  return emojis[category] || '🏪';
};

const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    panaderia: 'Panadería',
    queseria: 'Quesería',
    aceite: 'Almazara',
    embutidos: 'Embutidos',
    miel: 'Apicultor',
    conservas: 'Conservas',
    vinos: 'Bodega',
    dulces: 'Repostería',
    artesania: 'Artesanía',
  };
  return names[category] || 'Productor';
};

export default function ProducerMarker({ producer, onClick }: ProducerMarkerProps) {
  const handleMarkerClick = () => {
    onClick?.(producer);
  };

  return (
    <Marker
      position={[producer.coordinates.lat, producer.coordinates.lng]}
      icon={createCustomIcon(producer.category)}
      eventHandlers={{
        click: handleMarkerClick,
      }}
      aria-label={`Productor ${producer.name} en ${producer.address}`}
    >
      <Tooltip
        direction="top"
        offset={[0, -10]}
        opacity={0.95}
        className="producer-tooltip"
        permanent={false}
      >
        <div className="shadow-natural-lg max-w-sm rounded-lg border border-gray-200 bg-white p-4">
          {/* Header */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-semibold text-gray-900">{producer.name}</h3>
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-a4co-olive-100 text-a4co-olive-700 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                  {getCategoryEmoji(producer.category)} {getCategoryName(producer.category)}
                </span>
                {producer.distance && (
                  <span className="flex items-center text-xs text-gray-500">
                    <MapPin className="mr-1 h-3 w-3" />
                    {producer.distance.toFixed(1)} km
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-3 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(producer.rating)
                      ? 'fill-current text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium text-gray-700">
                {producer.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">{producer.description}</p>

          {/* Specialties */}
          {producer.specialties.length > 0 && (
            <div className="mb-3">
              <h4 className="mb-1 text-xs font-semibold text-gray-700">Especialidades:</h4>
              <div className="flex flex-wrap gap-1">
                {producer.specialties.slice(0, 3).map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-a4co-clay-100 text-a4co-clay-700 inline-block rounded px-2 py-1 text-xs"
                  >
                    {specialty}
                  </span>
                ))}
                {producer.specialties.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{producer.specialties.length - 3} más
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center">
              <MapPin className="mr-2 h-3 w-3 text-gray-400" />
              <span className="truncate">{producer.address}</span>
            </div>
            {producer.phone && (
              <div className="flex items-center">
                <Phone className="mr-2 h-3 w-3 text-gray-400" />
                <span>{producer.phone}</span>
              </div>
            )}
            {producer.established && (
              <div className="flex items-center">
                <Clock className="mr-2 h-3 w-3 text-gray-400" />
                <span>Desde {producer.established}</span>
              </div>
            )}
          </div>

          {/* Certifications */}
          {producer.certifications.length > 0 && (
            <div className="mt-3 border-t border-gray-200 pt-3">
              <div className="flex items-center gap-1">
                <Award className="text-a4co-olive-600 h-3 w-3" />
                <span className="text-a4co-olive-700 text-xs font-medium">
                  {producer.certifications.join(' • ')}
                </span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleMarkerClick}
            className="from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 shadow-natural hover:shadow-natural-md mt-3 w-full rounded-md bg-gradient-to-r px-3 py-2 text-xs font-medium text-white transition-all duration-200"
            aria-label={`Ver más detalles de ${producer.name}`}
          >
            Ver Detalles
          </button>
          {/* Routing Button */}
          <button
            onClick={e => {
              e.stopPropagation();
              // This will be handled by the parent MapView component
              if (onClick) {
                onClick(producer);
              }
            }}
            className="bg-a4co-olive-500 hover:bg-a4co-olive-600 shadow-natural hover:shadow-natural-md mt-2 flex w-full items-center justify-center rounded-md px-3 py-2 text-xs font-medium text-white transition-all duration-200"
            aria-label={`Calcular ruta hacia ${producer.name}`}
          >
            <Navigation className="mr-1 h-3 w-3" />
            Cómo Llegar
          </button>
        </div>
      </Tooltip>
    </Marker>
  );
}
