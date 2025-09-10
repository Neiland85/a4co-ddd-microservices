import type { Route, RoutePoint, RoutingOptions } from '@/types/routing-types';

class RoutingService {
  private apiKey = process.env.NEXT_PUBLIC_ROUTING_API_KEY || 'demo-key';

  async calculateRoute(
    start: RoutePoint,
    end: RoutePoint,
    waypoints: RoutePoint[] = [],
    options: RoutingOptions
  ): Promise<Route> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock route calculation
    const mockRoute: Route = {
      id: `route-${Date.now()}`,
      name: `Ruta de ${start.name} a ${end.name}`,
      description: 'Ruta optimizada para descubrir productores artesanales',
      totalDistance: Math.random() * 50 + 10, // 10-60 km
      totalDuration: Math.random() * 120 + 30, // 30-150 minutes
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any,
      points: [start, ...waypoints, end],
      segments: this.generateMockSegments(start, end, waypoints),
      highlights: [
        'Paisajes de olivares centenarios',
        'Vistas panorámicas de la Sierra Sur',
        'Pueblos con encanto tradicional',
        'Talleres artesanales históricos',
      ],
    };

    return mockRoute;
  }

  async getOptimizedRoute(points: RoutePoint[], options: RoutingOptions): Promise<Route> {
    // Simulate route optimization
    await new Promise(resolve => setTimeout(resolve, 1500));

    const optimizedPoints = [...points].sort(() => Math.random() - 0.5);

    return this.calculateRoute(
      optimizedPoints[0],
      optimizedPoints[optimizedPoints.length - 1],
      optimizedPoints.slice(1, -1),
      options
    );
  }

  private generateMockSegments(start: RoutePoint, end: RoutePoint, waypoints: RoutePoint[]) {
    const allPoints = [start, ...waypoints, end];
    const segments = [];

    for (let i = 0; i < allPoints.length - 1; i++) {
      segments.push({
        distance: Math.random() * 15 + 2,
        duration: Math.random() * 30 + 5,
        instructions: `Continúa hacia ${allPoints[i + 1].name}`,
        coordinates: this.generateMockCoordinates(allPoints[i], allPoints[i + 1]),
      });
    }

    return segments;
  }

  private generateMockCoordinates(start: RoutePoint, end: RoutePoint): [number, number][] {
    const coords: [number, number][] = [];
    const steps = 10;

    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const lat = start.lat + (end.lat - start.lat) * ratio;
      const lng = start.lng + (end.lng - start.lng) * ratio;
      coords.push([lng, lat]);
    }

    return coords;
  }
}

export const routingService = new RoutingService();
