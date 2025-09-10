"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
class AuthService {
    login(username, password) {
        return `Usuario ${username} autenticado.`;
    }
    register(username, password) {
        return `Usuario ${username} registrado.`;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=service.js.map