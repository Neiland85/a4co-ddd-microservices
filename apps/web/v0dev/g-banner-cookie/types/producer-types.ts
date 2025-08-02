export interface Producer {
  id: string
  name: string
  category: ProducerCategory
  description: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  products: string[]
  rating: number
  image?: string
  phone?: string
  email?: string
  website?: string
  established?: number
  specialties: string[]
  certifications: string[]
  distance?: number // in kilometers from user location
}

export type ProducerCategory =
  | "panaderia"
  | "queseria"
  | "aceite"
  | "embutidos"
  | "miel"
  | "conservas"
  | "vinos"
  | "dulces"
  | "artesania"

export interface MapFilters {
  categories: ProducerCategory[]
  maxDistance: number
  searchQuery: string
  minRating: number
}

export interface MapViewProps {
  producers: Producer[]
  filters: MapFilters
  onFiltersChange: (filters: MapFilters) => void
  userLocation?: { lat: number; lng: number }
  className?: string
}
