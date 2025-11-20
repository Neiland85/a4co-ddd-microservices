"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prototype_pollution_validator_1 = require("../validators/prototype-pollution.validator");
const safe_object_utils_1 = require("../utils/safe-object.utils");
describe('Lodash Security Mitigations', () => {
    describe('PrototypePollutionValidator', () => {
        it('should detect dangerous __proto__ key', () => {
            const obj = { '__proto__': { polluted: true } };
            const result = prototype_pollution_validator_1.PrototypePollutionValidator.validateObject(obj);
            expect(result.isValid).toBe(false);
        });
        it('should allow safe objects', () => {
            const obj = { name: 'John', age: 30 };
            const result = prototype_pollution_validator_1.PrototypePollutionValidator.validateObject(obj);
            expect(result.isValid).toBe(true);
        });
    });
    describe('SafeObjectUtils', () => {
        it('should safely merge objects', () => {
            const target = { a: 1 };
            const source = { b: 2 };
            const result = safe_object_utils_1.SafeObjectUtils.safeMerge(target, source);
            expect(result).toEqual({ a: 1, b: 2 });
        });
        it('should reject dangerous merge attempts', () => {
            const target = { a: 1 };
            const source = { '__proto__': { polluted: true } };
            expect(() => safe_object_utils_1.SafeObjectUtils.safeMerge(target, source)).toThrow();
        });
    });
});
//# sourceMappingURL=lodash-security.test.js.map