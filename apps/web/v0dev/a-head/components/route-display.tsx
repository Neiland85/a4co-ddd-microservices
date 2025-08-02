"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RouteIcon, Clock, MapPin, Star, Navigation } from "lucide-react"
import type { Route } from "@/types/routing-types"

interface RouteDisplayProps {
  route: Route
  onStartNavigation?: () => void
}

export function RouteDisplay({ route, onStartNavigation }: RouteDisplayProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Fácil"
      case "medium":
        return "Moderada"
      case "hard":
        return "Difícil"
      default:
        return "Desconocida"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RouteIcon className="w-5 h-5 text-green-600" />
            {route.name}
          </CardTitle>
          <Badge className={getDifficultyColor(route.difficulty)}>{getDifficultyLabel(route.difficulty)}</Badge>
        </div>
        <p className="text-sm text-gray-600">{route.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Route Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <RouteIcon className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Distancia</p>
              <p className="font-semibold">{route.totalDistance.toFixed(1)} km</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Duración</p>
              <p className="font-semibold">{Math.round(route.totalDuration)} min</p>
            </div>
          </div>
        </div>

        {/* Route Points */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Puntos de la ruta</h4>
          <div className="space-y-1">
            {route.points.map((point, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <MapPin
                  className={`w-3 h-3 ${
                    point.type === "start" ? "text-green-600" : point.type === "end" ? "text-red-600" : "text-blue-600"
                  }`}
                />
                <span className="text-gray-700">{point.name}</span>
                <Badge variant="outline" className="text-xs">
                  {point.type === "start" ? "Inicio" : point.type === "end" ? "Final" : "Parada"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        {route.highlights.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              Destacados de la ruta
            </h4>
            <ul className="space-y-1">
              {route.highlights.map((highlight, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-1">
                  <span className="text-yellow-500 mt-1">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        {onStartNavigation && (
          <Button onClick={onStartNavigation} className="w-full bg-green-600 hover:bg-green-700">
            <Navigation className="w-4 h-4 mr-2" />
            Iniciar Navegación
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
