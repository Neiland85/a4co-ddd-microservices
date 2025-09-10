"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const product_module_1 = require("./product.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(product_module_1.ProductModule);
    // Security middleware
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
    // Global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    // CORS configuration
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    // Swagger documentation
    const config = new swagger_1.DocumentBuilder()
        .setTitle('A4CO Product Service')
        .setDescription('Servicio de gestión de productos para la plataforma A4CO')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Products')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT || 3003;
    console.log(`🚀 Product Service iniciado en puerto ${port}`);
    console.log(`📚 Documentación Swagger: http://localhost:${port}/api`);
    await app.listen(port);
}
bootstrap().catch(err => {
    console.error('Error al iniciar el servicio:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map