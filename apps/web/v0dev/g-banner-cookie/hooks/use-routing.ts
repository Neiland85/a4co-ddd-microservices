"use client"

import { useState, useCallback } from "react"
import { RoutingService } from "../services/routing-service"
import type { RoutePoint, RoutingOptions, RoutingState } from "../types/routing-types"

export function useRouting() {
  const [routingState, setRoutingState] = useState<RoutingState>({
    isCalculating: false,
    route: null,
    error: null,
    startPoint: null,
    endPoint: null,
  })

  const calculateRoute = useCallback(
    async (start: RoutePoint, end: RoutePoint, options: RoutingOptions = { mode: "driving-car" }) => {
      setRoutingState((prev) => ({
        ...prev,
        isCalculating: true,
        error: null,
        startPoint: start,
        endPoint: end,
      }))

      try {
        const route = await RoutingService.calculateRoute(start, end, options)

        setRoutingState((prev) => ({
          ...prev,
          isCalculating: false,
          route,
          error: null,
        }))

        return route
      } catch (error) {
        // Fallback to straight line if API fails
        try {
          const fallbackRoute = RoutingService.calculateStraightLineRoute(start, end)

          setRoutingState((prev) => ({
            ...prev,
            isCalculating: false,
            route: fallbackRoute,
            error: "Usando ruta directa (API no disponible)",
          }))

          return fallbackRoute
        } catch (fallbackError) {
          setRoutingState((prev) => ({
            ...prev,
            isCalculating: false,
            error: error instanceof Error ? error.message : "Error calculando la ruta",
          }))

          throw error
        }
      }
    },
    [],
  )

  const clearRoute = useCallback(() => {
    setRoutingState({
      isCalculating: false,
      route: null,
      error: null,
      startPoint: null,
      endPoint: null,
    })
  }, [])

  return {
    ...routingState,
    calculateRoute,
    clearRoute,
  }
}
