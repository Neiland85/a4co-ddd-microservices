"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDto = void 0;
class BaseDto {
    toJSON() {
        return JSON.parse(JSON.stringify(this));
    }
    static fromJSON(json) {
        const instance = new this();
        Object.assign(instance, json);
        return instance;
    }
}
exports.BaseDto = BaseDto;
//# sourceMappingURL=base-dto.js.map