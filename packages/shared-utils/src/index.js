"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsEventBus = exports.BaseService = void 0;
const nats_1 = require("nats");
const common_1 = require("@nestjs/common");
__exportStar(require("./domain/index"), exports);
__exportStar(require("./security/index"), exports);
class BaseService {
    constructor(serviceName) {
        this.logger = new common_1.Logger(serviceName);
    }
    validateRequired(value, fieldName) {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            throw new Error(`${fieldName} is required`);
        }
        return value;
    }
    log(message, context) {
        this.logger.log(message, context);
    }
    createSuccessMessage(entity, action, identifier) {
        return `${entity} ${action} successfully: ${identifier}`;
    }
    handleServiceError(error, operation) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Error in ${operation}: ${message}`, error);
        return `Error in ${operation}: ${message}`;
    }
}
exports.BaseService = BaseService;
class NatsEventBus {
    constructor() {
        this.logger = new common_1.Logger('NatsEventBus');
        this.codec = (0, nats_1.JSONCodec)();
    }
    async connect(url = 'nats://localhost:4222') {
        this.nc = await (0, nats_1.connect)({ servers: url });
        this.logger.log(`✅ Conectado a NATS en ${url}`);
    }
    async publish(subject, data) {
        if (!this.nc)
            await this.connect();
        this.nc.publish(subject, this.codec.encode(data));
        this.logger.log(`📤 Evento publicado → ${subject}`);
    }
    async subscribe(subject, handler) {
        if (!this.nc)
            await this.connect();
        const sub = this.nc.subscribe(subject);
        for await (const msg of sub) {
            const decoded = this.codec.decode(msg.data);
            this.logger.log(`📥 Evento recibido → ${subject}`);
            await handler(decoded);
        }
    }
}
exports.NatsEventBus = NatsEventBus;
//# sourceMappingURL=index.js.map