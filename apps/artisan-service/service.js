"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtisanService = void 0;
class ArtisanService {
    createArtisanProfile(name, specialty) {
        return `Perfil de artesano ${name} creado con especialidad ${specialty}.`;
    }
    getArtisanProfile(name) {
        return `Información del perfil de artesano ${name}.`;
    }
}
exports.ArtisanService = ArtisanService;
//# sourceMappingURL=service.js.map