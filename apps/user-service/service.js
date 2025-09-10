"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const base_1 = require("../../packages/shared-utils/src/base");
class UserService extends base_1.BaseService {
    constructor() {
        super('UserService');
    }
    createUser(username, email) {
        try {
            const validatedUsername = this.validateRequired(username, 'username');
            const validatedEmail = this.validateRequired(email, 'email');
            this.log('Creating user', { username, email });
            return this.createSuccessMessage('User', 'created', `with ${validatedUsername} and ${validatedEmail}`);
        }
        catch (error) {
            return this.handleServiceError(error, 'createUser');
        }
    }
    getUser(username) {
        try {
            const validatedUsername = this.validateId(username, 'username');
            this.log('Getting user', { username: validatedUsername });
            return this.createSuccessMessage('User', 'retrieved', validatedUsername);
        }
        catch (error) {
            return this.handleServiceError(error, 'getUser');
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=service.js.map