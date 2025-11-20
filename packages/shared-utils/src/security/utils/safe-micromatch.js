"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeMicromatch = void 0;
exports.createSafeMicromatch = createSafeMicromatch;
exports.safeMatch = safeMatch;
exports.safeIsMatch = safeIsMatch;
exports.safeMakeRe = safeMakeRe;
const micromatch_1 = __importDefault(require("micromatch"));
const micromatch_redos_protector_1 = require("../middleware/micromatch-redos-protector");
const micromatch_pattern_validator_1 = require("../validators/micromatch-pattern.validator");
let logger;
try {
    const observability = require('@a4co/observability');
    logger = observability.getGlobalLogger();
}
catch {
    logger = {
        info: console.info,
        warn: console.warn,
        error: console.error,
    };
}
class SafeMicromatch {
    constructor(options = {}) {
        this.protector = new micromatch_redos_protector_1.MicromatchReDoSProtector();
    }
    async match(list, patterns, options) {
        const patternArray = Array.isArray(patterns) ? patterns : [patterns];
        const result = await this.protector.safeMatch(() => micromatch_1.default.match(list, patterns, options), patternArray, { context: 'SafeMicromatch.match' });
        if (!result.success) {
            logger.error('SafeMicromatch.match failed', {
                error: result.error,
                patterns: patternArray,
                executionTime: result.executionTime,
            });
            return [];
        }
        return result.result || [];
    }
    async isMatch(str, patterns, options) {
        const patternArray = Array.isArray(patterns) ? patterns : [patterns];
        const result = await this.protector.safeMatch(() => micromatch_1.default.isMatch(str, patterns, options), patternArray, { context: 'SafeMicromatch.isMatch' });
        if (!result.success) {
            logger.error('SafeMicromatch.isMatch failed', {
                error: result.error,
                str,
                patterns: patternArray,
                executionTime: result.executionTime,
            });
            return false;
        }
        return result.result || false;
    }
    async makeRe(pattern, options) {
        const result = await this.protector.safeMatch(() => micromatch_1.default.makeRe(pattern, options), [pattern], { context: 'SafeMicromatch.makeRe' });
        if (!result.success) {
            logger.error('SafeMicromatch.makeRe failed', {
                error: result.error,
                pattern,
                executionTime: result.executionTime,
            });
            return null;
        }
        return result.result || null;
    }
    async some(list, patterns, options) {
        const patternArray = Array.isArray(patterns) ? patterns : [patterns];
        const result = await this.protector.safeMatch(() => micromatch_1.default.some(list, patterns, options), patternArray, { context: 'SafeMicromatch.some' });
        if (!result.success) {
            logger.error('SafeMicromatch.some failed', {
                error: result.error,
                patterns: patternArray,
                executionTime: result.executionTime,
            });
            return false;
        }
        return result.result || false;
    }
    async every(list, patterns, options) {
        const patternArray = Array.isArray(patterns) ? patterns : [patterns];
        const result = await this.protector.safeMatch(() => micromatch_1.default.every(list, patterns, options), patternArray, { context: 'SafeMicromatch.every' });
        if (!result.success) {
            logger.error('SafeMicromatch.every failed', {
                error: result.error,
                patterns: patternArray,
                executionTime: result.executionTime,
            });
            return false;
        }
        return result.result || false;
    }
    async all(list, patterns, options) {
        const patternArray = Array.isArray(patterns) ? patterns : [patterns];
        const result = await this.protector.safeMatch(() => micromatch_1.default.all(list, patterns, options), patternArray, { context: 'SafeMicromatch.all' });
        if (!result.success) {
            logger.error('SafeMicromatch.all failed', {
                error: result.error,
                patterns: patternArray,
                executionTime: result.executionTime,
            });
            return [];
        }
        return result.result || [];
    }
    async not(list, patterns, options) {
        const patternArray = Array.isArray(patterns) ? patterns : [patterns];
        const result = await this.protector.safeMatch(() => micromatch_1.default.not(list, patterns, options), patternArray, { context: 'SafeMicromatch.not' });
        if (!result.success) {
            logger.error('SafeMicromatch.not failed', {
                error: result.error,
                patterns: patternArray,
                executionTime: result.executionTime,
            });
            return list;
        }
        return result.result || list;
    }
    getStats() {
        return this.protector.getStats();
    }
    validatePatterns(patterns) {
        return micromatch_pattern_validator_1.MicromatchPatternValidator.validatePatterns(patterns);
    }
    sanitizePattern(pattern) {
        return micromatch_pattern_validator_1.MicromatchPatternValidator.sanitizePattern(pattern);
    }
}
exports.SafeMicromatch = SafeMicromatch;
function createSafeMicromatch(options) {
    return new SafeMicromatch(options);
}
async function safeMatch(list, patterns, options) {
    const safe = new SafeMicromatch(options);
    return safe.match(list, patterns, options);
}
async function safeIsMatch(str, patterns, options) {
    const safe = new SafeMicromatch(options);
    return safe.isMatch(str, patterns, options);
}
async function safeMakeRe(pattern, options) {
    const safe = new SafeMicromatch(options);
    return safe.makeRe(pattern, options);
}
//# sourceMappingURL=safe-micromatch.js.map