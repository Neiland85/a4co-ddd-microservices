import { GeoService } from './service';

export class GeoController {
  private geoService = new GeoService();

  getCoordinates(address: string): { lat: number; lng: number } {
    return this.geoService.getCoordinates(address);
  }

  calculateDistance(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    return this.geoService.calculateDistance(coord1, coord2);
  }
}
