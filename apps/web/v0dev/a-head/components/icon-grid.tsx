'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List } from 'lucide-react';
import type { IconGridProps } from '@/types/icon-grid-types';
import { IconItem } from './icon-item';

export function IconGrid({
  icons,
  columns = 4,
  gap = 4,
  showLabels = true,
  onIconClick,
}: IconGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = Array.from(new Set(icons.map(icon => icon.category)));

  const filteredIcons = icons.filter(icon => {
    const matchesSearch =
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const gridColumns =
    {
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    }[columns] || 'grid-cols-4';

  const gapClass =
    {
      2: 'gap-2',
      4: 'gap-4',
      6: 'gap-6',
      8: 'gap-8',
    }[gap] || 'gap-4';

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Buscar iconos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredIcons.length} icono{filteredIcons.length !== 1 ? 's' : ''} encontrado
          {filteredIcons.length !== 1 ? 's' : ''}
        </p>
        {selectedCategory !== 'all' && (
          <Badge variant="secondary" className="capitalize">
            {selectedCategory}
          </Badge>
        )}
      </div>

      {/* Icons Grid/List */}
      {viewMode === 'grid' ? (
        <div className={`grid ${gridColumns} ${gapClass}`}>
          {filteredIcons.map(icon => (
            <IconItem key={icon.id} config={icon} onClick={onIconClick} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredIcons.map(icon => (
            <div
              key={icon.id}
              className="flex items-center gap-4 rounded-lg border p-3 hover:bg-gray-50"
            >
              <IconItem config={icon} onClick={onIconClick} />
              <div className="flex-1">
                <h3 className="font-medium">{icon.name}</h3>
                <p className="text-sm text-gray-600">{icon.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredIcons.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-400">
            <Search className="mx-auto h-12 w-12" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">No se encontraron iconos</h3>
          <p className="text-gray-600">Intenta cambiar los filtros o el término de búsqueda</p>
        </div>
      )}
    </div>
  );
}
