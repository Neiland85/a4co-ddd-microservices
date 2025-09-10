'use client';

import { useState } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Star, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Producer } from '../types/producer-types';

interface ProducerMarkerProps {
  producer: Producer;
  isSelected?: boolean;
  onClick?: () => void;
}

const createCustomIcon = (category: string, color: string) => {
  const categoryInitial = category.charAt(0).toUpperCase();

  const svgContent = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${color}" stroke="#fff" strokeWidth="2"/>
      <text x="16" y="21" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold">
        ${categoryInitial}
      </text>
    </svg>
  `;

  const encodedSvg = encodeURIComponent(svgContent);

  return new Icon({
    iconUrl: `data:image/svg+xml,${encodedSvg}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const categoryColors = {
  panaderia: '#8B4513',
  queseria: '#FFD700',
  aceite: '#228B22',
  miel: '#FFA500',
  conservas: '#DC143C',
  vino: '#800080',
  embutidos: '#A0522D',
  dulces: '#FF69B4',
};

export default function ProducerMarker({ producer, isSelected, onClick }: ProducerMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);

  const icon = createCustomIcon(producer.category, categoryColors[producer.category] || '#6B7280');

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const formatDistance = (distance: number) => {
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`;
  };

  return (
    <Marker
      position={[producer.lat, producer.lng]}
      icon={icon}
      eventHandlers={{
        click: onClick,
        mouseover: () => setIsHovered(true),
        mouseout: () => setIsHovered(false),
      }}
    >
      <Tooltip
        permanent={isSelected || isHovered}
        direction="top"
        offset={[0, -10]}
        className="producer-tooltip"
      >
        <Card
          className={cn(
            'shadow-natural-lg min-w-[280px] border-0 transition-all duration-300',
            isSelected && 'ring-a4co-olive-500 shadow-natural-xl ring-2'
          )}
        >
          <CardContent className="space-y-3 p-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold leading-tight text-gray-900">
                  {producer.name}
                </h3>
                <div className="mt-1 flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600">{producer.location}</span>
                </div>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  'px-2 py-1 text-xs',
                  producer.isOpen
                    ? 'border-green-200 bg-green-100 text-green-800'
                    : 'border-red-200 bg-red-100 text-red-800'
                )}
              >
                {producer.isOpen ? 'Abierto' : 'Cerrado'}
              </Badge>
            </div>

            {/* Rating and Distance */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-current text-yellow-500" />
                <span className="text-xs font-medium text-gray-900">
                  {formatRating(producer.rating)}
                </span>
                <span className="text-xs text-gray-500">({producer.reviewCount} reseñas)</span>
              </div>
              <span className="text-xs text-gray-600">{formatDistance(producer.distance)}</span>
            </div>

            {/* Specialties */}
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-700">Especialidades:</span>
              <div className="flex flex-wrap gap-1">
                {producer.specialties.slice(0, 3).map((specialty, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-a4co-olive-50 text-a4co-olive-700 border-a4co-olive-200 px-2 py-0.5 text-xs"
                  >
                    {specialty}
                  </Badge>
                ))}
                {producer.specialties.length > 3 && (
                  <Badge variant="outline" className="px-2 py-0.5 text-xs">
                    +{producer.specialties.length - 3}
                  </Badge>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <div className="flex items-center space-x-3">
                {producer.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">{producer.phone}</span>
                  </div>
                )}
                {producer.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">{producer.email}</span>
                  </div>
                )}
              </div>
              {producer.hours && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600">{producer.hours}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Tooltip>
    </Marker>
  );
}
