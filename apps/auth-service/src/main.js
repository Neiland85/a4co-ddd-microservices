"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const auth_module_1 = require("./auth.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(auth_module_1.AuthModule);
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
        .setTitle('A4CO Auth Service')
        .setDescription('Servicio de autenticación para la plataforma A4CO')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Authentication')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    // Global prefix
    app.setGlobalPrefix('api/v1');
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Auth Service running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map