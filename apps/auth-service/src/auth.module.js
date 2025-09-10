"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
// Controllers
const auth_controller_1 = require("./presentation/controllers/auth.controller");
// Use Cases
const register_user_use_case_1 = require("./application/use-cases/register-user.use-case");
const login_user_use_case_1 = require("./application/use-cases/login-user.use-case");
// Domain Services
const user_domain_service_1 = require("./domain/services/user-domain.service");
// Infrastructure
const prisma_user_repository_1 = require("./infrastructure/repositories/prisma-user.repository");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET', 'super-secret-key'),
                    signOptions: {
                        issuer: configService.get('JWT_ISSUER', 'a4co-auth-service'),
                        audience: configService.get('JWT_AUDIENCE', 'a4co-platform'),
                    },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            // Database - Proveedor personalizado de PrismaClient
            {
                provide: 'PrismaClient',
                useFactory: () => {
                    // Simulamos PrismaClient por ahora para que compile
                    return {
                        user: {
                            findUnique: async () => null,
                            create: async () => ({}),
                            update: async () => ({}),
                            delete: async () => { },
                            count: async () => 0,
                            findMany: async () => [],
                        },
                    };
                },
            },
            // Repositories
            {
                provide: 'UserRepository',
                useFactory: (prismaClient) => {
                    return new prisma_user_repository_1.PrismaUserRepository(prismaClient);
                },
                inject: ['PrismaClient'],
            },
            // Domain Services
            {
                provide: user_domain_service_1.UserDomainService,
                useFactory: (userRepository) => {
                    return new user_domain_service_1.UserDomainService(userRepository);
                },
                inject: ['UserRepository'],
            },
            // Use Cases
            {
                provide: register_user_use_case_1.RegisterUserUseCase,
                useFactory: (userRepository, userDomainService) => {
                    return new register_user_use_case_1.RegisterUserUseCase(userRepository, userDomainService);
                },
                inject: ['UserRepository', user_domain_service_1.UserDomainService],
            },
            {
                provide: login_user_use_case_1.LoginUserUseCase,
                useFactory: (userRepository, jwtService) => {
                    return new login_user_use_case_1.LoginUserUseCase(userRepository, jwtService);
                },
                inject: ['UserRepository', jwt_1.JwtModule],
            },
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map