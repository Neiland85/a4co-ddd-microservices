"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
const uuid_1 = require("uuid");
class BaseEntity {
    constructor(id) {
        this.id = id || (0, uuid_1.v4)();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    equals(entity) {
        return this.id === entity.id;
    }
    touch() {
        this.updatedAt = new Date();
    }
}
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=base-entity.js.map