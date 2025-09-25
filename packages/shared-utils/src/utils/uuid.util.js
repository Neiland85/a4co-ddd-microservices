"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UuidUtil = void 0;
exports.generateId = generateId;
const uuid_1 = require("uuid");
class UuidUtil {
    static generate() {
        return (0, uuid_1.v4)();
    }
    static isValid(uuid) {
        return (0, uuid_1.validate)(uuid);
    }
    static validateOrThrow(uuid) {
        if (!this.isValid(uuid)) {
            throw new Error(`Invalid UUID: ${uuid}`);
        }
    }
}
exports.UuidUtil = UuidUtil;
function generateId(length) {
    if (length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    return UuidUtil.generate();
}
//# sourceMappingURL=uuid.util.js.map