"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Grid, List } from "lucide-react"
import type { IconGridProps } from "@/types/icon-grid-types"
import { IconItem } from "./icon-item"

export function IconGrid({ icons, columns = 4, gap = 4, showLabels = true, onIconClick }: IconGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const categories = Array.from(new Set(icons.map((icon) => icon.category)))

  const filteredIcons = icons.filter((icon) => {
    const matchesSearch =
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || icon.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const gridColumns =
    {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    }[columns] || "grid-cols-4"

  const gapClass =
    {
      2: "gap-2",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
    }[gap] || "gap-4"

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar iconos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredIcons.length} icono{filteredIcons.length !== 1 ? "s" : ""} encontrado
          {filteredIcons.length !== 1 ? "s" : ""}
        </p>
        {selectedCategory !== "all" && (
          <Badge variant="secondary" className="capitalize">
            {selectedCategory}
          </Badge>
        )}
      </div>

      {/* Icons Grid/List */}
      {viewMode === "grid" ? (
        <div className={`grid ${gridColumns} ${gapClass}`}>
          {filteredIcons.map((icon) => (
            <IconItem key={icon.id} config={icon} onClick={onIconClick} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredIcons.map((icon) => (
            <div key={icon.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
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
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron iconos</h3>
          <p className="text-gray-600">Intenta cambiar los filtros o el término de búsqueda</p>
        </div>
      )}
    </div>
  )
}
