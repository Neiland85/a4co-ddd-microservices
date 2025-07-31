"use client"

import { useState, useCallback } from "react"
import type { Route, RoutePoint, RoutingOptions } from "@/types/routing-types"
import { routingService } from "@/services/routing-service"

export function useRouting() {
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateRoute = useCallback(
    async (start: RoutePoint, end: RoutePoint, waypoints: RoutePoint[] = [], options: RoutingOptions) => {
      setIsCalculating(true)
      setError(null)

      try {
        const route = await routingService.calculateRoute(start, end, waypoints, options)
        setCurrentRoute(route)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error calculating route")
      } finally {
        setIsCalculating(false)
      }
    },
    [],
  )

  const optimizeRoute = useCallback(async (points: RoutePoint[], options: RoutingOptions) => {
    setIsCalculating(true)
    setError(null)

    try {
      const route = await routingService.getOptimizedRoute(points, options)
      setCurrentRoute(route)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error optimizing route")
    } finally {
      setIsCalculating(false)
    }
  }, [])

  const clearRoute = useCallback(() => {
    setCurrentRoute(null)
    setError(null)
  }, [])

  return {
    currentRoute,
    isCalculating,
    error,
    calculateRoute,
    optimizeRoute,
    clearRoute,
  }
}
