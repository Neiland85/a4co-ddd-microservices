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
exports.UserDomainService = void 0;
const common_1 = require("@nestjs/common");
let UserDomainService = class UserDomainService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async isEmailUnique(email) {
        const exists = await this.userRepository.existsByEmail(email);
        return !exists;
    }
    async validateUniqueEmail(email) {
        const isUnique = await this.isEmailUnique(email);
        if (!isUnique) {
            throw new Error('El email ya está registrado');
        }
    }
    async canUserPerformAction(userId, action) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            return false;
        }
        // Verificaciones básicas
        if (user.status !== 'active') {
            return false;
        }
        if (!user.emailVerified && action !== 'verify-email') {
            return false;
        }
        return true;
    }
};
exports.UserDomainService = UserDomainService;
exports.UserDomainService = UserDomainService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], UserDomainService);
//# sourceMappingURL=user-domain.service.js.map