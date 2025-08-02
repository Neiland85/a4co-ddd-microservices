"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, Filter, X, MapPin, Star, Clock, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProducerFilters, ProducerStats } from "../types/producer-types"

interface MapFiltersProps {
  filters: ProducerFilters
  stats: ProducerStats
  onFiltersChange: (filters: Partial<ProducerFilters>) => void
  onReset: () => void
}

const categories = [
  { value: "all", label: "Todas las categorías", count: 0 },
  { value: "panaderia", label: "Panaderías", count: 0 },
  { value: "queseria", label: "Queserías", count: 0 },
  { value: "aceite", label: "Aceite de Oliva", count: 0 },
  { value: "miel", label: "Miel", count: 0 },
  { value: "conservas", label: "Conservas", count: 0 },
  { value: "vino", label: "Vinos", count: 0 },
  { value: "embutidos", label: "Embutidos", count: 0 },
  { value: "dulces", label: "Dulces", count: 0 },
]

export default function MapFilters({ filters, stats, onFiltersChange, onReset }: MapFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const activeFiltersCount = [
    filters.search && 1,
    filters.category !== "all" && 1,
    filters.maxDistance < 10 && 1,
    filters.minRating > 0 && 1,
    filters.onlyOpen && 1,
  ].filter(Boolean).length

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Buscar productores</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Nombre, ubicación o especialidad..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="pl-10"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFiltersChange({ search: "" })}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <Label>Categoría</Label>
        <div className="grid grid-cols-1 gap-2">
          {categories.map((category) => (
            <div
              key={category.value}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-gray-50",
                filters.category === category.value ? "border-a4co-olive-300 bg-a4co-olive-50" : "border-gray-200",
              )}
              onClick={() => onFiltersChange({ category: category.value })}
            >
              <span className="text-sm font-medium">{category.label}</span>
              {filters.category === category.value && (
                <Badge variant="secondary" className="bg-a4co-olive-100 text-a4co-olive-800">
                  Seleccionado
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Distance Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Distancia máxima</Label>
          <span className="text-sm text-gray-600">{filters.maxDistance}km</span>
        </div>
        <Slider
          value={[filters.maxDistance]}
          onValueChange={([value]) => onFiltersChange({ maxDistance: value })}
          max={20}
          min={1}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1km</span>
          <span>20km</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Valoración mínima</Label>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-600">{filters.minRating.toFixed(1)}</span>
          </div>
        </div>
        <Slider
          value={[filters.minRating]}
          onValueChange={([value]) => onFiltersChange({ minRating: value })}
          max={5}
          min={0}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0.0</span>
          <span>5.0</span>
        </div>
      </div>

      {/* Open Now Filter */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <Checkbox
          id="onlyOpen"
          checked={filters.onlyOpen}
          onCheckedChange={(checked) => onFiltersChange({ onlyOpen: !!checked })}
        />
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <Label htmlFor="onlyOpen" className="text-sm font-medium cursor-pointer">
            Solo abiertos ahora
          </Label>
        </div>
      </div>

      {/* Reset Button */}
      <Button variant="outline" onClick={onReset} className="w-full bg-transparent" disabled={activeFiltersCount === 0}>
        <RotateCcw className="h-4 w-4 mr-2" />
        Limpiar filtros
      </Button>
    </div>
  )

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="transition-all duration-300 hover:shadow-natural-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Productores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <MapPin className="h-8 w-8 text-a4co-olive-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-natural-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Categorías</p>
                <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
              </div>
              <Filter className="h-8 w-8 text-a4co-clay-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-natural-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Valoración</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500 fill-current" />
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-natural-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Abiertos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.openNow}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filter Sheet */}
      <div className="lg:hidden mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full relative bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-a4co-olive-100 text-a4co-olive-800">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filtros de búsqueda</SheetTitle>
              <SheetDescription>Encuentra productores artesanales cerca de ti</SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filter Panel */}
      <Card className="hidden lg:block mb-6 shadow-natural-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtros de búsqueda
              </CardTitle>
              <CardDescription>Encuentra productores artesanales cerca de ti</CardDescription>
            </div>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-a4co-olive-100 text-a4co-olive-800">
                {activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""} activo{activeFiltersCount > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <FilterContent />
        </CardContent>
      </Card>
    </>
  )
}
