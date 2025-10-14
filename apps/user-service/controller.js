"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const base_1 = require("../../packages/shared-utils/src/base");
const service_1 = require("./service");
class UserController extends base_1.BaseController {
    constructor() {
        super(service_1.UserService);
    }
    createUser(req) {
        try {
            const validated = this.validateRequest(req, ['username', 'email']);
            const result = this.service.createUser(validated.username, validated.email);
            return this.formatResponse(result).data;
        }
        catch (error) {
            const errorResponse = this.handleError(error);
            throw new Error(errorResponse.error);
        }
    }
    getUser(req) {
        try {
            const validated = this.validateRequest(req, ['username']);
            const result = this.service.getUser(validated.username);
            return this.formatResponse(result).data;
        }
        catch (error) {
            const errorResponse = this.handleError(error);
            throw new Error(errorResponse.error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=controller.js.map