"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonBracesMiddlewares = exports.BracesMonitoringService = exports.BracesSanitizer = exports.BracesSecurityMiddleware = void 0;
exports.createBracesSecurityMiddleware = createBracesSecurityMiddleware;
exports.createBracesSanitizer = createBracesSanitizer;
exports.createBracesMonitoringService = createBracesMonitoringService;
const braces_monitor_1 = require("./braces-monitor");
const braces_security_1 = require("./braces-security");
class BracesSecurityMiddleware {
    constructor(config, serviceName = 'unknown-service') {
        this.validator = braces_security_1.BracesSecurityFactory.createValidator({
            maxExpansionSize: 50,
            maxRangeSize: 10,
            timeoutMs: 1000,
            monitoringEnabled: true,
            ...config,
        });
        this.monitor = braces_monitor_1.BracesSecurityMonitorFactory.getMonitor(serviceName);
    }
    validateRequestBody(fieldsToCheck = ['query', 'command', 'expression']) {
        return async (req, res, next) => {
            const startTime = Date.now();
            let blocked = false;
            try {
                for (const field of fieldsToCheck) {
                    const value = this.extractFieldValue(req.body, field);
                    if (value && typeof value === 'string') {
                        const validation = await this.validator.validateExpression(value);
                        if (!validation.isSafe) {
                            blocked = true;
                            this.monitor.recordAttack('EXPANSION_ATTACK', validation.issues.some(issue => issue.includes('CRITICAL') || issue.includes('CRITICAL'))
                                ? 'CRITICAL'
                                : 'HIGH', {
                                expression: value.substring(0, 200),
                                expansionSize: validation.stats?.expandedLength,
                                processingTime: Date.now() - startTime,
                                clientIP: req.ip || req.connection?.remoteAddress,
                                userAgent: req.get?.('User-Agent'),
                                endpoint: req.originalUrl || req.url,
                            }, {
                                field,
                                validationIssues: validation.issues,
                                requestId: req.id || 'unknown',
                            });
                            res.status(400).json({
                                error: 'Request blocked due to potentially dangerous expression',
                                details: validation.issues,
                                field: field,
                            });
                            return;
                        }
                        if (!req.body._security)
                            req.body._security = {};
                        req.body._security[field] = {
                            safe: validation.isSafe,
                            stats: validation.stats,
                        };
                    }
                }
                next();
            }
            catch (error) {
                this.monitor.recordAttack('PATTERN_VIOLATION', 'MEDIUM', {
                    processingTime: Date.now() - startTime,
                    clientIP: req.ip || req.connection?.remoteAddress,
                    endpoint: req.originalUrl || req.url,
                }, {
                    error: error instanceof Error ? error.message : String(error),
                    requestId: req.id || 'unknown',
                });
                throw error;
            }
            finally {
                const processingTime = Date.now() - startTime;
                const memoryUsage = process.memoryUsage().heapUsed;
                this.monitor.recordRequest(processingTime, memoryUsage, blocked);
            }
        };
    }
    validateQueryParams(paramsToCheck = ['q', 'query', 'cmd']) {
        return async (req, res, next) => {
            const startTime = Date.now();
            let blocked = false;
            try {
                for (const param of paramsToCheck) {
                    const value = req.query[param];
                    if (value && typeof value === 'string') {
                        const validation = await this.validator.validateExpression(value);
                        if (!validation.isSafe) {
                            blocked = true;
                            this.monitor.recordAttack('EXPANSION_ATTACK', 'HIGH', {
                                expression: value.substring(0, 200),
                                expansionSize: validation.stats?.expandedLength,
                                processingTime: Date.now() - startTime,
                                clientIP: req.ip || req.connection?.remoteAddress,
                                userAgent: req.get?.('User-Agent'),
                                endpoint: req.originalUrl || req.url,
                            }, {
                                param,
                                validationIssues: validation.issues,
                                requestId: req.id || 'unknown',
                            });
                            res.status(400).json({
                                error: 'Request blocked due to potentially dangerous query parameter',
                                details: validation.issues,
                                param: param,
                            });
                            return;
                        }
                    }
                }
                next();
            }
            catch (error) {
                this.monitor.recordAttack('PATTERN_VIOLATION', 'MEDIUM', {
                    processingTime: Date.now() - startTime,
                    clientIP: req.ip || req.connection?.remoteAddress,
                    endpoint: req.originalUrl || req.url,
                }, {
                    error: error instanceof Error ? error.message : String(error),
                    requestId: req.id || 'unknown',
                });
                throw error;
            }
            finally {
                const processingTime = Date.now() - startTime;
                const memoryUsage = process.memoryUsage().heapUsed;
                this.monitor.recordRequest(processingTime, memoryUsage, blocked);
            }
        };
    }
    extractFieldValue(obj, fieldPath) {
        return fieldPath.split('.').reduce((current, key) => current?.[key], obj);
    }
}
exports.BracesSecurityMiddleware = BracesSecurityMiddleware;
class BracesSanitizer {
    constructor() {
        this.validator = braces_security_1.BracesSecurityFactory.createValidator({
            maxExpansionSize: 100,
            maxRangeSize: 20,
        });
    }
    async sanitizeExpression(expression) {
        const validation = await this.validator.validateExpression(expression);
        if (validation.isSafe) {
            return {
                sanitized: expression,
                wasModified: false,
                issues: [],
            };
        }
        let sanitized = expression;
        sanitized = sanitized.replace(/\{(\d+)\.\.(\d+)\}/g, (match, start, end) => {
            const rangeSize = Math.abs(parseInt(end) - parseInt(start)) + 1;
            if (rangeSize > 10) {
                return `{${start}..${parseInt(start) + 9}}`;
            }
            return match;
        });
        sanitized = sanitized.replace(/\{([^}]+)\}/g, (match, content) => {
            const items = content.split(',');
            if (items.length > 10) {
                return `{${items.slice(0, 10).join(',')}}`;
            }
            return match;
        });
        return {
            sanitized,
            wasModified: sanitized !== expression,
            issues: validation.issues,
        };
    }
    async isSafeForLogging(expression) {
        const validation = await this.validator.validateExpression(expression);
        return validation.isSafe && validation.stats.expansionRatio < 5;
    }
}
exports.BracesSanitizer = BracesSanitizer;
class BracesMonitoringService {
    constructor() {
        this.alerts = [];
        this.stats = {
            totalValidations: 0,
            blockedExpressions: 0,
            alertsTriggered: 0,
        };
        this.validator = braces_security_1.BracesSecurityFactory.createValidator();
        this.validator.on('securityAlert', alert => {
            this.alerts.push({
                ...alert,
                timestamp: new Date().toISOString(),
            });
            this.stats.alertsTriggered++;
        });
    }
    async recordValidation(expression, source) {
        this.stats.totalValidations++;
        const validation = await this.validator.validateExpression(expression);
        if (!validation.isSafe) {
            this.stats.blockedExpressions++;
        }
        console.log(`🔍 Braces validation [${source}]: safe=${validation.isSafe}, ratio=${validation.stats.expansionRatio}`);
    }
    getSecurityStats() {
        return {
            ...this.stats,
            recentAlerts: this.alerts.slice(-10),
            alertRate: this.stats.alertsTriggered / Math.max(this.stats.totalValidations, 1),
        };
    }
    clearOldAlerts(maxAgeMs = 3600000) {
        const cutoff = Date.now() - maxAgeMs;
        this.alerts = this.alerts.filter(alert => new Date(alert.timestamp).getTime() > cutoff);
    }
}
exports.BracesMonitoringService = BracesMonitoringService;
function createBracesSecurityMiddleware(config) {
    return new BracesSecurityMiddleware(config);
}
function createBracesSanitizer() {
    return new BracesSanitizer();
}
function createBracesMonitoringService() {
    return new BracesMonitoringService();
}
exports.commonBracesMiddlewares = {
    searchApi: createBracesSecurityMiddleware().validateQueryParams(['q', 'query', 'search']),
    commandApi: createBracesSecurityMiddleware().validateRequestBody([
        'command',
        'script',
        'expression',
    ]),
    configApi: createBracesSecurityMiddleware({
        maxExpansionSize: 20,
        maxRangeSize: 5,
    }).validateRequestBody(['value', 'config', 'settings']),
};
//# sourceMappingURL=braces-web-middleware.js.map