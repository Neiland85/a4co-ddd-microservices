"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const service_1 = require("./service");
class AuthController {
    authService = new service_1.AuthService();
    login(req) {
        return this.authService.login(req.username, req.password);
    }
    register(req) {
        return this.authService.register(req.username, req.password);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=controller.js.map