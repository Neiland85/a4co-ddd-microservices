"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoService = void 0;
class GeoService {
    getCoordinates(address) {
        return { lat: 0, lng: 0 };
    }
    calculateDistance(coord1, coord2) {
        return Math.sqrt(Math.pow(coord2.lat - coord1.lat, 2) + Math.pow(coord2.lng - coord1.lng, 2));
    }
}
exports.GeoService = GeoService;
//# sourceMappingURL=service.js.map