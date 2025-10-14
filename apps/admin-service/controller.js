"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const service_1 = require("./service");
class AdminController {
    adminService = new service_1.AdminService();
    createUser(username, role) {
        return this.adminService.createUser(username, role);
    }
    deleteUser(userId) {
        return this.adminService.deleteUser(userId);
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=controller.js.map