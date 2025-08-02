"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import MapFilters from "@/components/map-filters"
import { useProducers } from "@/hooks/use-producers"
import type { ProducerFilters } from "@/types/producer-types"

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Cargando mapa...</div>
    </div>
  ),
})

export default function MapaPage() {
  const [filters, setFilters] = useState<ProducerFilters>({
    search: "",
    category: "all",
    maxDistance: 10,
    minRating: 0,
    onlyOpen: false,
  })

  const [selectedProducer, setSelectedProducer] = useState(null)
  const { producers, stats, isLoading } = useProducers(filters)

  const handleFiltersChange = (newFilters: Partial<ProducerFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleReset = () => {
    setFilters({
      search: "",
      category: "all",
      maxDistance: 10,
      minRating: 0,
      onlyOpen: false,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Mapa de Productores Artesanales
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl">
              Descubre productores locales cerca de ti. Utiliza los filtros para encontrar exactamente lo que buscas.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Filters Sidebar - Desktop */}
            <div className="xl:col-span-1">
              <div className="sticky top-24">
                <MapFilters
                  filters={filters}
                  stats={stats}
                  onFiltersChange={handleFiltersChange}
                  onReset={handleReset}
                />
              </div>
            </div>

            {/* Map Area */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-lg shadow-natural-lg overflow-hidden">
                <div className="h-96 sm:h-[500px] lg:h-[600px] xl:h-[700px]">
                  {isLoading ? (
                    <div className="h-full bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-a4co-olive-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando productores...</p>
                      </div>
                    </div>
                  ) : (
                    <MapView
                      producers={producers}
                      selectedProducer={selectedProducer}
                      onProducerSelect={setSelectedProducer}
                      className="h-full"
                    />
                  )}
                </div>
              </div>

              {/* Results Summary */}
              <div className="mt-4 sm:mt-6 p-4 bg-white rounded-lg shadow-natural border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {producers.length} productor{producers.length !== 1 ? "es" : ""} encontrado
                      {producers.length !== 1 ? "s" : ""}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {filters.category !== "all" && `Categoría: ${filters.category} • `}
                      {filters.search && `Búsqueda: "${filters.search}" • `}
                      Radio: {filters.maxDistance}km
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Valoración promedio: <span className="font-semibold">{stats.averageRating.toFixed(1)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Abiertos ahora: <span className="font-semibold">{stats.openNow}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
