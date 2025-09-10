"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
class AdminService {
    createUser(username, role) {
        return `Usuario ${username} creado con rol ${role}.`;
    }
    deleteUser(userId) {
        return `Usuario con ID ${userId} eliminado.`;
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=service.js.map