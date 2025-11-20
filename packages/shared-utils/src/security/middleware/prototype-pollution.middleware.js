"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeRequest = exports.validateRequest = exports.PrototypePollutionMiddleware = void 0;
const prototype_pollution_validator_1 = require("../validators/prototype-pollution.validator");
class PrototypePollutionMiddleware {
    static validateRequest(req, res, next) {
        try {
            if (req.body) {
                const validation = prototype_pollution_validator_1.PrototypePollutionValidator.validateObject(req.body);
                if (!validation.isValid) {
                    return res.status(400).json({
                        error: 'Bad Request',
                        message: 'Request contains dangerous keys',
                        violations: validation.violations
                    });
                }
            }
            next();
        }
        catch (error) {
            res.status(500).json({ error: 'Validation failed' });
        }
    }
    static sanitizeRequest(req, res, next) {
        if (req.body) {
            req.body = prototype_pollution_validator_1.PrototypePollutionValidator.sanitizeObject(req.body);
        }
        next();
    }
}
exports.PrototypePollutionMiddleware = PrototypePollutionMiddleware;
exports.validateRequest = PrototypePollutionMiddleware.validateRequest;
exports.sanitizeRequest = PrototypePollutionMiddleware.sanitizeRequest;
exports.default = PrototypePollutionMiddleware;
//# sourceMappingURL=prototype-pollution.middleware.js.map