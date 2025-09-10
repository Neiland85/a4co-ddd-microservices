export class GeoService {
  getCoordinates(address: string): { lat: number; lng: number } {
    return { lat: 0, lng: 0 };
  }

  calculateDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    return Math.sqrt(Math.pow(coord2.lat - coord1.lat, 2) + Math.pow(coord2.lng - coord1.lng, 2));
  }
}
