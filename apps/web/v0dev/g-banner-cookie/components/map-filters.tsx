"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, MapPin, Star } from "lucide-react"
import type { MapFilters, ProducerCategory } from "../types/producer-types"

interface MapFiltersProps {
  filters: MapFilters
  onFiltersChange: (filters: MapFilters) => void
  isOpen: boolean
  onToggle: () => void
  className?: string
}

const categoryOptions: { value: ProducerCategory; label: string; emoji: string }[] = [
  { value: "panaderia", label: "Panaderías", emoji: "🥖" },
  { value: "queseria", label: "Queserías", emoji: "🧀" },
  { value: "aceite", label: "Almazaras", emoji: "🫒" },
  { value: "embutidos", label: "Embutidos", emoji: "🥓" },
  { value: "miel", label: "Apicultores", emoji: "🍯" },
  { value: "conservas", label: "Conservas", emoji: "🥫" },
  { value: "vinos", label: "Bodegas", emoji: "🍷" },
  { value: "dulces", label: "Repostería", emoji: "🍰" },
  { value: "artesania", label: "Artesanía", emoji: "🏺" },
]

export default function ProducerFilters({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
  className = "",
}: MapFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.searchQuery)

  const handleCategoryToggle = (category: ProducerCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]

    onFiltersChange({
      ...filters,
      categories: newCategories,
    })
  }

  const handleDistanceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      maxDistance: value[0],
    })
  }

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      minRating: value[0],
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFiltersChange({
      ...filters,
      searchQuery: searchInput,
    })
  }

  const clearAllFilters = () => {
    setSearchInput("")
    onFiltersChange({
      categories: [],
      maxDistance: 50,
      searchQuery: "",
      minRating: 0,
    })
  }

  const activeFiltersCount =
    filters.categories.length +
    (filters.searchQuery ? 1 : 0) +
    (filters.maxDistance < 50 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0)

  return (
    <>
      {/* Filter Toggle Button */}
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className={`fixed top-20 left-4 z-[1000] bg-white/95 backdrop-blur-sm border-a4co-olive-200 hover:bg-a4co-olive-50 shadow-natural-lg ${className}`}
        aria-label={`${isOpen ? "Cerrar" : "Abrir"} filtros del mapa`}
        aria-expanded={isOpen}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtros
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-2 bg-a4co-olive-500 text-white text-xs px-1.5 py-0.5">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {/* Filters Panel */}
      {isOpen && (
        <Card className="fixed top-20 left-4 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto z-[1000] bg-white/95 backdrop-blur-sm shadow-natural-xl border-a4co-olive-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-a4co-olive-600" />
                Filtrar Productores
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
                aria-label="Cerrar panel de filtros"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                Limpiar filtros
              </Button>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search */}
            <div>
              <Label htmlFor="search-input" className="text-sm font-medium text-gray-700 mb-2 block">
                Buscar por nombre
              </Label>
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search-input"
                    type="text"
                    placeholder="Ej: Panadería El Ochío..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-a4co-olive-500 focus:ring-a4co-olive-500"
                    aria-describedby="search-help"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-a4co-olive-500 hover:bg-a4co-olive-600 text-white"
                  aria-label="Buscar productores"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <p id="search-help" className="text-xs text-gray-500 mt-1">
                Busca por nombre del productor o descripción
              </p>
            </div>

            {/* Categories */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Categorías de Productores</Label>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleCategoryToggle(option.value)}
                    className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      filters.categories.includes(option.value)
                        ? "border-a4co-olive-500 bg-a4co-olive-50 text-a4co-olive-700"
                        : "border-gray-200 hover:border-a4co-olive-300 hover:bg-gray-50"
                    }`}
                    aria-pressed={filters.categories.includes(option.value)}
                    aria-label={`Filtrar por ${option.label}`}
                  >
                    <span className="text-lg mr-2" role="img" aria-hidden="true">
                      {option.emoji}
                    </span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Distancia máxima: {filters.maxDistance} km
              </Label>
              <Slider
                value={[filters.maxDistance]}
                onValueChange={handleDistanceChange}
                max={50}
                min={1}
                step={1}
                className="w-full"
                aria-label={`Distancia máxima: ${filters.maxDistance} kilómetros`}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>

            {/* Rating */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block flex items-center">
                <Star className="h-4 w-4 mr-1" />
                Valoración mínima: {filters.minRating > 0 ? `${filters.minRating.toFixed(1)} estrellas` : "Cualquiera"}
              </Label>
              <Slider
                value={[filters.minRating]}
                onValueChange={handleRatingChange}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
                aria-label={`Valoración mínima: ${filters.minRating} estrellas`}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Cualquiera</span>
                <span>5 estrellas</span>
              </div>
            </div>

            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Filtros activos:</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  {filters.categories.length > 0 && (
                    <div>
                      • {filters.categories.length} categoría{filters.categories.length > 1 ? "s" : ""} seleccionada
                      {filters.categories.length > 1 ? "s" : ""}
                    </div>
                  )}
                  {filters.searchQuery && <div>• Búsqueda: "{filters.searchQuery}"</div>}
                  {filters.maxDistance < 50 && <div>• Máximo {filters.maxDistance} km de distancia</div>}
                  {filters.minRating > 0 && <div>• Mínimo {filters.minRating} estrellas</div>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
