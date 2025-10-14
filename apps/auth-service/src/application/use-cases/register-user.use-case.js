"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_domain_service_1 = require("../../domain/services/user-domain.service");
const user_aggregate_1 = require("../../domain/aggregates/user.aggregate");
const user_dto_1 = require("../dto/user.dto");
let RegisterUserUseCase = class RegisterUserUseCase {
    userRepository;
    cryptographyService;
    eventBus;
    userDomainService;
    constructor(userRepository, cryptographyService, eventBus, userDomainService) {
        this.userRepository = userRepository;
        this.cryptographyService = cryptographyService;
        this.eventBus = eventBus;
        this.userDomainService = userDomainService;
    }
    async execute(request) {
        try {
            // Validar que el email sea único usando el dominio service
            await this.userDomainService.validateUniqueEmail(request.email);
            // Hash de la contraseña usando el adapter
            const hashedPassword = await this.cryptographyService.hashPassword(request.password);
            // Crear el usuario con contraseña ya hasheada
            const user = await user_aggregate_1.User.createWithHashedPassword(request.email, request.name, hashedPassword);
            // Persistir el usuario usando el adapter
            const savedUser = await this.userRepository.save(user);
            // Publicar eventos de dominio
            const domainEvents = savedUser.getUncommittedEvents();
            await this.eventBus.publishAll(domainEvents);
            savedUser.clearEvents();
            // Mapear a DTO de respuesta
            return this.mapToDto(savedUser);
        }
        catch (error) {
            const err = error;
            console.error(`Error en RegisterUserUseCase: ${err.message}`);
            throw err;
        }
    }
    mapToDto(user) {
        const dto = new user_dto_1.UserResponseDto();
        dto.id = user.id;
        dto.email = user.email;
        dto.name = user.name;
        dto.status = user.status;
        dto.emailVerified = user.emailVerified;
        dto.lastLoginAt = user.lastLoginAt;
        dto.createdAt = user.createdAt;
        dto.updatedAt = user.updatedAt;
        return dto;
    }
};
exports.RegisterUserUseCase = RegisterUserUseCase;
exports.RegisterUserUseCase = RegisterUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepositoryPort')),
    __param(1, (0, common_1.Inject)('CryptographyServicePort')),
    __param(2, (0, common_1.Inject)('EventBusPort')),
    __metadata("design:paramtypes", [Object, Object, Object, user_domain_service_1.UserDomainService])
], RegisterUserUseCase);
//# sourceMappingURL=register-user.use-case.js.map