"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtisanController = void 0;
const service_1 = require("./service");
class ArtisanController {
    artisanService = new service_1.ArtisanService();
    createArtisanProfile(req) {
        return this.artisanService.createArtisanProfile(req.name, req.specialty);
    }
    getArtisanProfile(req) {
        return this.artisanService.getArtisanProfile(req.name);
    }
}
exports.ArtisanController = ArtisanController;
//# sourceMappingURL=controller.js.map