"use client"

import { Marker, Tooltip } from "react-leaflet"
import { Icon } from "leaflet"
import { Star, MapPin, Phone, Award, Clock, Navigation } from "lucide-react"
import type { Producer } from "../types/producer-types"

interface ProducerMarkerProps {
  producer: Producer
  onClick?: (producer: Producer) => void
}

// Custom marker icons for different categories
const createCustomIcon = (category: string, isSelected = false) => {
  const iconColor = isSelected ? "#4a934a" : getCategoryColor(category)
  const iconSize = isSelected ? 35 : 30

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
  })
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    panaderia: "#b08968",
    queseria: "#f4d03f",
    aceite: "#8a9b73",
    embutidos: "#cd6155",
    miel: "#f7dc6f",
    conservas: "#85c1e9",
    vinos: "#8e44ad",
    dulces: "#f1948a",
    artesania: "#82e0aa",
  }
  return colors[category] || "#8a9b73"
}

const getCategoryEmoji = (category: string): string => {
  const emojis: Record<string, string> = {
    panaderia: "🥖",
    queseria: "🧀",
    aceite: "🫒",
    embutidos: "🥓",
    miel: "🍯",
    conservas: "🥫",
    vinos: "🍷",
    dulces: "🍰",
    artesania: "🏺",
  }
  return emojis[category] || "🏪"
}

const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    panaderia: "Panadería",
    queseria: "Quesería",
    aceite: "Almazara",
    embutidos: "Embutidos",
    miel: "Apicultor",
    conservas: "Conservas",
    vinos: "Bodega",
    dulces: "Repostería",
    artesania: "Artesanía",
  }
  return names[category] || "Productor"
}

export default function ProducerMarker({ producer, onClick }: ProducerMarkerProps) {
  const handleMarkerClick = () => {
    onClick?.(producer)
  }

  return (
    <Marker
      position={[producer.coordinates.lat, producer.coordinates.lng]}
      icon={createCustomIcon(producer.category)}
      eventHandlers={{
        click: handleMarkerClick,
      }}
      aria-label={`Productor ${producer.name} en ${producer.address}`}
    >
      <Tooltip direction="top" offset={[0, -10]} opacity={0.95} className="producer-tooltip" permanent={false}>
        <div className="p-4 max-w-sm bg-white rounded-lg shadow-natural-lg border border-gray-200">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{producer.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-a4co-olive-100 text-a4co-olive-700">
                  {getCategoryEmoji(producer.category)} {getCategoryName(producer.category)}
                </span>
                {producer.distance && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {producer.distance.toFixed(1)} km
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(producer.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium text-gray-700">{producer.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{producer.description}</p>

          {/* Specialties */}
          {producer.specialties.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-1">Especialidades:</h4>
              <div className="flex flex-wrap gap-1">
                {producer.specialties.slice(0, 3).map((specialty, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-a4co-clay-100 text-a4co-clay-700 rounded"
                  >
                    {specialty}
                  </span>
                ))}
                {producer.specialties.length > 3 && (
                  <span className="text-xs text-gray-500">+{producer.specialties.length - 3} más</span>
                )}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-2 text-gray-400" />
              <span className="truncate">{producer.address}</span>
            </div>
            {producer.phone && (
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-2 text-gray-400" />
                <span>{producer.phone}</span>
              </div>
            )}
            {producer.established && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-2 text-gray-400" />
                <span>Desde {producer.established}</span>
              </div>
            )}
          </div>

          {/* Certifications */}
          {producer.certifications.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-1">
                <Award className="h-3 w-3 text-a4co-olive-600" />
                <span className="text-xs text-a4co-olive-700 font-medium">{producer.certifications.join(" • ")}</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleMarkerClick}
            className="mt-3 w-full bg-gradient-to-r from-a4co-olive-500 to-a4co-clay-500 hover:from-a4co-olive-600 hover:to-a4co-clay-600 text-white text-xs font-medium py-2 px-3 rounded-md transition-all duration-200 shadow-natural hover:shadow-natural-md"
            aria-label={`Ver más detalles de ${producer.name}`}
          >
            Ver Detalles
          </button>
          {/* Routing Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              // This will be handled by the parent MapView component
              if (onClick) {
                onClick(producer)
              }
            }}
            className="mt-2 w-full bg-a4co-olive-500 hover:bg-a4co-olive-600 text-white text-xs font-medium py-2 px-3 rounded-md transition-all duration-200 shadow-natural hover:shadow-natural-md flex items-center justify-center"
            aria-label={`Calcular ruta hacia ${producer.name}`}
          >
            <Navigation className="h-3 w-3 mr-1" />
            Cómo Llegar
          </button>
        </div>
      </Tooltip>
    </Marker>
  )
}
