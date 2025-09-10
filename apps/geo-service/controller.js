"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoController = void 0;
const service_1 = require("./service");
class GeoController {
    geoService = new service_1.GeoService();
    getCoordinates(address) {
        return this.geoService.getCoordinates(address);
    }
    calculateDistance(coord1, coord2) {
        return this.geoService.calculateDistance(coord1, coord2);
    }
}
exports.GeoController = GeoController;
//# sourceMappingURL=controller.js.map