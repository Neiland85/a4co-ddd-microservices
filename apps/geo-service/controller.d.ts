export declare class GeoController {
    private geoService;
    getCoordinates(address: string): {
        lat: number;
        lng: number;
    };
    calculateDistance(coord1: {
        lat: number;
        lng: number;
    }, coord2: {
        lat: number;
        lng: number;
    }): number;
}
//# sourceMappingURL=controller.d.ts.map