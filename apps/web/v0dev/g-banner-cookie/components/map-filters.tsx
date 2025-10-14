'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, MapPin, Star } from 'lucide-react';
import type { MapFilters, ProducerCategory } from '../types/producer-types';

interface MapFiltersProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const categoryOptions: { value: ProducerCategory; label: string; emoji: string }[] = [
  { value: 'panaderia', label: 'Panaderías', emoji: '🥖' },
  { value: 'queseria', label: 'Queserías', emoji: '🧀' },
  { value: 'aceite', label: 'Almazaras', emoji: '🫒' },
  { value: 'embutidos', label: 'Embutidos', emoji: '🥓' },
  { value: 'miel', label: 'Apicultores', emoji: '🍯' },
  { value: 'conservas', label: 'Conservas', emoji: '🥫' },
  { value: 'vinos', label: 'Bodegas', emoji: '🍷' },
  { value: 'dulces', label: 'Repostería', emoji: '🍰' },
  { value: 'artesania', label: 'Artesanía', emoji: '🏺' },
];

export default function ProducerFilters({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
  className = '',
}: MapFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.searchQuery);

  const handleCategoryToggle = (category: ProducerCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];

    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handleDistanceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      maxDistance: value[0],
    });
  };

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      minRating: value[0],
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({
      ...filters,
      searchQuery: searchInput,
    });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    onFiltersChange({
      categories: [],
      maxDistance: 50,
      searchQuery: '',
      minRating: 0,
    });
  };

  const activeFiltersCount =
    filters.categories.length +
    (filters.searchQuery ? 1 : 0) +
    (filters.maxDistance < 50 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0);

  return (
    <>
      {/* Filter Toggle Button */}
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className={`border-a4co-olive-200 hover:bg-a4co-olive-50 shadow-natural-lg fixed left-4 top-20 z-[1000] bg-white/95 backdrop-blur-sm ${className}`}
        aria-label={`${isOpen ? 'Cerrar' : 'Abrir'} filtros del mapa`}
        aria-expanded={isOpen}
      >
        <Filter className="mr-2 h-4 w-4" />
        Filtros
        {activeFiltersCount > 0 && (
          <Badge
            variant="secondary"
            className="bg-a4co-olive-500 ml-2 px-1.5 py-0.5 text-xs text-white"
          >
            {activeFiltersCount}
          </Badge>
        )}
      </Button>

      {/* Filters Panel */}
      {isOpen && (
        <Card className="shadow-natural-xl border-a4co-olive-200 fixed left-4 top-20 z-[1000] max-h-[calc(100vh-6rem)] w-80 overflow-y-auto bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
                <Filter className="text-a4co-olive-600 mr-2 h-5 w-5" />
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
                className="border-gray-300 bg-transparent text-xs hover:bg-gray-50"
              >
                Limpiar filtros
              </Button>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search */}
            <div>
              <Label
                htmlFor="search-input"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Buscar por nombre
              </Label>
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    id="search-input"
                    type="text"
                    placeholder="Ej: Panadería El Ochío..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="focus:border-a4co-olive-500 focus:ring-a4co-olive-500 border-gray-300 pl-10"
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
              <p id="search-help" className="mt-1 text-xs text-gray-500">
                Busca por nombre del productor o descripción
              </p>
            </div>

            {/* Categories */}
            <div>
              <Label className="mb-3 block text-sm font-medium text-gray-700">
                Categorías de Productores
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleCategoryToggle(option.value)}
                    className={`flex items-center rounded-lg border-2 p-3 text-left transition-all duration-200 ${
                      filters.categories.includes(option.value)
                        ? 'border-a4co-olive-500 bg-a4co-olive-50 text-a4co-olive-700'
                        : 'hover:border-a4co-olive-300 border-gray-200 hover:bg-gray-50'
                    }`}
                    aria-pressed={filters.categories.includes(option.value)}
                    aria-label={`Filtrar por ${option.label}`}
                  >
                    <span className="mr-2 text-lg" role="img" aria-hidden="true">
                      {option.emoji}
                    </span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div>
              <Label className="mb-3 block flex items-center text-sm font-medium text-gray-700">
                <MapPin className="mr-1 h-4 w-4" />
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
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>

            {/* Rating */}
            <div>
              <Label className="mb-3 block flex items-center text-sm font-medium text-gray-700">
                <Star className="mr-1 h-4 w-4" />
                Valoración mínima:{' '}
                {filters.minRating > 0 ? `${filters.minRating.toFixed(1)} estrellas` : 'Cualquiera'}
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
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>Cualquiera</span>
                <span>5 estrellas</span>
              </div>
            </div>

            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">Filtros activos:</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  {filters.categories.length > 0 && (
                    <div>
                      • {filters.categories.length} categoría
                      {filters.categories.length > 1 ? 's' : ''} seleccionada
                      {filters.categories.length > 1 ? 's' : ''}
                    </div>
                  )}
                  {filters.searchQuery && <div>• Búsqueda: "{filters.searchQuery}"</div>}
                  {filters.maxDistance < 50 && (
                    <div>• Máximo {filters.maxDistance} km de distancia</div>
                  )}
                  {filters.minRating > 0 && <div>• Mínimo {filters.minRating} estrellas</div>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
