"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObject = void 0;
class ValueObject {
    constructor(value) {
        this._value = Object.freeze(value);
    }
    get value() {
        return this._value;
    }
    equals(vo) {
        return JSON.stringify(this._value) === JSON.stringify(vo._value);
    }
    toString() {
        return String(this._value);
    }
}
exports.ValueObject = ValueObject;
//# sourceMappingURL=value-object.js.map