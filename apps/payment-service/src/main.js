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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const observability_1 = require("@a4co/observability");
const shared_utils_1 = require("@a4co/shared-utils");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const process = __importStar(require("process"));
const payment_module_1 = require("./payment.module");
async function bootstrap() {
    (0, observability_1.initializeTracing)({
        serviceName: 'payment-service',
        serviceVersion: '1.0.0',
        environment: process.env['NODE_ENV'] || 'development',
    });
    const logger = (0, observability_1.getLogger)();
    const app = await core_1.NestFactory.create(payment_module_1.PaymentModule, {
        logger: false,
    });
    app.connectMicroservice({
        transport: microservices_1.Transport.NATS,
        options: {
            servers: [process.env['NATS_URL'] || 'nats://localhost:4222'],
            queue: 'payment_queue',
        },
    });
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
        crossOriginEmbedderPolicy: false,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const bracesMiddleware = new shared_utils_1.BracesSecurityMiddleware({
        maxExpansionSize: 50,
        maxRangeSize: 10,
        monitoringEnabled: true,
    });
    app.use(bracesMiddleware.validateRequestBody());
    app.use(bracesMiddleware.validateQueryParams());
    app.enableCors({
        origin: process.env['ALLOWED_ORIGINS']?.split(',') || ['http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('A4CO Payment Service')
        .setDescription('Servicio de procesamiento de pagos para la plataforma A4CO')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Payments')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env['PORT'] ? Number(process.env['PORT']) : 3006;
    await app.startAllMicroservices();
    logger.info('🔌 NATS microservice conectado');
    await app.listen(port);
    logger.info(`🚀 Payment Service iniciado en puerto ${port}`);
    logger.info(`📚 Documentación Swagger: http://localhost:${port}/api`);
}
bootstrap().catch(err => {
    const logger = (0, observability_1.getLogger)();
    logger.error('Error al iniciar el servicio:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map