'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Grid3X3, Filter } from 'lucide-react';
import IconItem from './icon-item';
import type { IconGridProps, IconConfig } from '../types/icon-grid-types';

/**
 * IconGrid Component
 *
 * A responsive grid component that displays a collection of icon buttons.
 * Supports filtering, searching, and customizable grid layouts.
 *
 * Installation: pnpm install lucide-react
 *
 * @param icons - Array of icon configurations to display
 * @param columns - Responsive column configuration
 * @param size - Default icon size (default: 24)
 * @param color - Default icon color (default: "currentColor")
 * @param strokeWidth - Default icon stroke width (default: 2)
 * @param variant - Button variant style
 * @param showLabels - Whether to show icon labels (default: true)
 * @param className - Additional CSS classes
 * @param onIconClick - Callback when an icon is clicked
 */
export default function IconGrid({
  icons,
  columns = {
    mobile: 2,
    tablet: 3,
    desktop: 4,
  },
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  variant = 'default',
  showLabels = true,
  className = '',
  onIconClick,
}: Readonly<IconGridProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories from icons
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(icons.map(icon => icon.category).filter(Boolean)));
    return uniqueCategories.sort();
  }, [icons]);

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    return icons.filter(icon => {
      const matchesSearch =
        searchQuery === '' ||
        icon.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [icons, searchQuery, selectedCategory]);

  const handleIconClick = (config: IconConfig) => {
    onIconClick?.(config);
  };

  const getGridClasses = () => {
    const { mobile = 2, tablet = 3, desktop = 4 } = columns;

    return `
      grid gap-4
      grid-cols-${mobile}
      md:grid-cols-${tablet}
      lg:grid-cols-${desktop}
    `;
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Grid3X3 className="text-a4co-olive-600 h-6 w-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Biblioteca de Iconos
          </h2>
          <Badge variant="secondary" className="bg-a4co-olive-100 text-a4co-olive-700">
            {filteredIcons.length} iconos
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search */}
        <div className="flex-1">
          <Label htmlFor="search-icons" className="sr-only">
            Buscar iconos
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              id="search-icons"
              type="text"
              placeholder="Buscar iconos por nombre o descripción..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="focus:border-a4co-olive-500 focus:ring-a4co-olive-500 border-gray-300 pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="sm:w-48">
            <Label htmlFor="category-filter" className="sr-only">
              Filtrar por categoría
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="focus:border-a4co-olive-500 focus:ring-a4co-olive-500 border-gray-300">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Todas las categorías" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category || ''}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Grid */}
      {filteredIcons.length > 0 ? (
        <div className={getGridClasses()}>
          {filteredIcons.map(iconConfig => (
            <IconItem
              key={iconConfig.id}
              config={{
                ...iconConfig,
                onClick: () => handleIconClick(iconConfig),
              }}
              size={size}
              color={color}
              strokeWidth={strokeWidth}
              variant={variant}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron iconos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Intenta ajustar los filtros de búsqueda o categoría
          </p>
        </div>
      )}

      {/* Grid Info */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Mostrando {filteredIcons.length} de {icons.length} iconos disponibles
      </div>
    </div>
  );
}
