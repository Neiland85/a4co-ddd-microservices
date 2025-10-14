"use strict";
// Clase base para Value Objects en DDD
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseValueObject = void 0;
class BaseValueObject {
    _value;
    constructor(value) {
        this._value = value;
        this.ensureValidState();
    }
    get value() {
        return this._value;
    }
    equals(other) {
        if (other === null || other === undefined) {
            return false;
        }
        if (this === other) {
            return true;
        }
        return this._value === other._value;
    }
    toString() {
        return String(this._value);
    }
    valueOf() {
        return this._value;
    }
}
exports.BaseValueObject = BaseValueObject;
//# sourceMappingURL=base-value-object.js.map