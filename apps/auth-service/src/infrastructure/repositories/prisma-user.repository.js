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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const user_aggregate_1 = require("../../domain/aggregates/user.aggregate");
let PrismaUserRepository = class PrismaUserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const userData = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!userData) {
            return null;
        }
        return this.mapToDomain(userData);
    }
    async findByEmail(email) {
        const userData = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!userData) {
            return null;
        }
        return this.mapToDomain(userData);
    }
    async save(user) {
        const userData = user.toPersistence();
        const savedUser = await this.prisma.user.create({
            data: {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                hashedPassword: userData.hashedPassword,
                status: userData.status,
                emailVerified: userData.emailVerified,
                lastLoginAt: userData.lastLoginAt,
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt,
            },
        });
        return this.mapToDomain(savedUser);
    }
    async update(user) {
        const userData = user.toPersistence();
        const updatedUser = await this.prisma.user.update({
            where: { id: userData.id },
            data: {
                email: userData.email,
                name: userData.name,
                hashedPassword: userData.hashedPassword,
                status: userData.status,
                emailVerified: userData.emailVerified,
                lastLoginAt: userData.lastLoginAt,
                updatedAt: userData.updatedAt,
            },
        });
        return this.mapToDomain(updatedUser);
    }
    async delete(id) {
        await this.prisma.user.delete({
            where: { id },
        });
    }
    async exists(email) {
        const count = await this.prisma.user.count({
            where: { email },
        });
        return count > 0;
    }
    async findAll(limit = 10, offset = 0) {
        const users = await this.prisma.user.findMany({
            skip: offset,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return users.map((user) => this.mapToDomain(user));
    }
    async count() {
        return await this.prisma.user.count();
    }
    mapToDomain(userData) {
        return user_aggregate_1.User.reconstruct(userData.id, userData.email, userData.name, userData.hashedPassword, userData.status, userData.emailVerified, userData.lastLoginAt, userData.createdAt, userData.updatedAt);
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], PrismaUserRepository);
//# sourceMappingURL=prisma-user.repository.js.map