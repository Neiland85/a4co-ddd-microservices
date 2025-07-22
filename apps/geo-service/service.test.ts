import { GeoService } from './service';

describe('GeoService', () => {
  const geoService = new GeoService();

  it('should get coordinates', () => {
    const result = geoService.getCoordinates('Dirección');
    expect(result).toEqual({ lat: 0, lng: 0 });
  });

  it('should calculate distance', () => {
    const result = geoService.calculateDistance(
      { lat: 0, lng: 0 },
      { lat: 3, lng: 4 }
    );
    expect(result).toBe(5);
  });
});
