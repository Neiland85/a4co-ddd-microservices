import type { RoutePoint, Route, TransportMode, RoutingOptions } from "../types/routing-types"

// OpenRouteService API configuration
const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY || "demo-key"
const ORS_BASE_URL = "https://api.openrouteservice.org/v2"

export class RoutingService {
  private static formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`
    }
    return `${(meters / 1000).toFixed(1)} km`
  }

  private static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes} min`
  }

  private static getProfileFromMode(mode: TransportMode): string {
    const profiles = {
      "driving-car": "driving-car",
      "cycling-regular": "cycling-regular",
      "foot-walking": "foot-walking",
    }
    return profiles[mode] || "driving-car"
  }

  static async calculateRoute(
    start: RoutePoint,
    end: RoutePoint,
    options: RoutingOptions = { mode: "driving-car" },
  ): Promise<Route> {
    try {
      const profile = this.getProfileFromMode(options.mode)

      const requestBody = {
        coordinates: [
          [start.lng, start.lat],
          [end.lng, end.lat],
        ],
        format: "json",
        instructions: true,
        geometry: true,
        elevation: false,
        extra_info: ["waytype", "steepness"],
        options: {
          avoid_features: [...(options.avoidTolls ? ["tollways"] : []), ...(options.avoidHighways ? ["highways"] : [])],
        },
      }

      const response = await fetch(`${ORS_BASE_URL}/directions/${profile}`, {
        method: "POST",
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Routing API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.routes || data.routes.length === 0) {
        throw new Error("No route found")
      }

      const route = data.routes[0]

      // Convert geometry from encoded polyline to coordinates array
      const geometry: [number, number][] = route.geometry.coordinates || []

      // Process route segments/steps
      const segments =
        route.segments?.flatMap(
          (segment: any) =>
            segment.steps?.map((step: any) => ({
              distance: step.distance,
              duration: step.duration,
              instruction: step.instruction,
              type: step.type,
            })) || [],
        ) || []

      return {
        id: `route-${Date.now()}`,
        distance: route.summary.distance,
        duration: route.summary.duration,
        geometry,
        segments,
        summary: {
          distance: this.formatDistance(route.summary.distance),
          duration: this.formatDuration(route.summary.duration),
        },
      }
    } catch (error) {
      console.error("Route calculation error:", error)
      throw new Error("No se pudo calcular la ruta. Inténtalo de nuevo.")
    }
  }

  // Fallback to simple straight-line calculation if API fails
  static calculateStraightLineRoute(start: RoutePoint, end: RoutePoint): Route {
    const distance = this.calculateDistance(start.lat, start.lng, end.lat, end.lng)
    const estimatedDuration = distance * 60 // Rough estimate: 1 km per minute walking

    return {
      id: `straight-${Date.now()}`,
      distance: distance * 1000, // convert to meters
      duration: estimatedDuration,
      geometry: [
        [start.lng, start.lat],
        [end.lng, end.lat],
      ],
      segments: [
        {
          distance: distance * 1000,
          duration: estimatedDuration,
          instruction: `Dirección directa hacia ${end.address || "destino"}`,
          type: "straight",
        },
      ],
      summary: {
        distance: this.formatDistance(distance * 1000),
        duration: this.formatDuration(estimatedDuration),
      },
    }
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }
}
