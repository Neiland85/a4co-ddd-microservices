"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import { LatLngBounds } from "leaflet"
import ProducerMarker from "./producer-marker"
import type { Producer } from "../types/producer-types"
import "leaflet/dist/leaflet.css"

interface MapViewProps {
  producers: Producer[]
  selectedProducer?: Producer | null
  onProducerSelect?: (producer: Producer) => void
  className?: string
}

// Component to fit map bounds to markers
function MapBounds({ producers }: { producers: Producer[] }) {
  const map = useMap()

  useEffect(() => {
    if (producers.length > 0) {
      const bounds = new LatLngBounds(producers.map((producer) => [producer.lat, producer.lng]))
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [producers, map])

  return null
}

export default function MapView({ producers, selectedProducer, onProducerSelect, className = "" }: MapViewProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-500">Cargando mapa...</div>
      </div>
    )
  }

  // Default center (Úbeda, Jaén)
  const defaultCenter: [number, number] = [38.0138, -3.3706]

  return (
    <div className={`relative ${className}`}>
      <MapContainer center={defaultCenter} zoom={12} className="h-full w-full rounded-lg" zoomControl={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds producers={producers} />

        {producers.map((producer) => (
          <ProducerMarker
            key={producer.id}
            producer={producer}
            isSelected={selectedProducer?.id === producer.id}
            onClick={() => onProducerSelect?.(producer)}
          />
        ))}
      </MapContainer>
    </div>
  )
}
