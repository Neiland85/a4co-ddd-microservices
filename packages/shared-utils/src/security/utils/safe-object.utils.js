"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeObjectUtils = void 0;
const prototype_pollution_validator_1 = require("../validators/prototype-pollution.validator");
class SafeObjectUtils {
    static safeMerge(target, source) {
        const targetValidation = prototype_pollution_validator_1.PrototypePollutionValidator.validateObject(target);
        const sourceValidation = prototype_pollution_validator_1.PrototypePollutionValidator.validateObject(source);
        if (!targetValidation.isValid || !sourceValidation.isValid) {
            throw new Error('Objects contain dangerous keys');
        }
        return { ...target, ...source };
    }
    static createSecureObject() {
        return Object.create(null);
    }
    static secureClone(obj) {
        const validation = prototype_pollution_validator_1.PrototypePollutionValidator.validateObject(obj);
        if (!validation.isValid) {
            throw new Error('Object contains dangerous keys');
        }
        return JSON.parse(JSON.stringify(obj));
    }
}
exports.SafeObjectUtils = SafeObjectUtils;
exports.default = SafeObjectUtils;
//# sourceMappingURL=safe-object.utils.js.map