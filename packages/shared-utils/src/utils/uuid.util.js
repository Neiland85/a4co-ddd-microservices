"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UuidUtil = void 0;
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
//# sourceMappingURL=uuid.util.js.map