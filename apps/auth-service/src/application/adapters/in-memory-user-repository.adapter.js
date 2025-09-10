"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryUserRepositoryAdapter = void 0;
const common_1 = require("@nestjs/common");
const user_aggregate_1 = require("../../domain/aggregates/user.aggregate");
/**
 * Adapter in-memory para repositorio de usuarios
 * Para desarrollo y testing. En producción se reemplazaría por implementación con Prisma/TypeORM
 */
let InMemoryUserRepositoryAdapter = class InMemoryUserRepositoryAdapter {
    users = new Map();
    async findByEmail(email) {
        const user = Array.from(this.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
        return user || null;
    }
    async findById(id) {
        return this.users.get(id) || null;
    }
    async save(user) {
        const persistence = user.toPersistence();
        this.users.set(persistence.id, user);
        return user;
    }
    async delete(id) {
        this.users.delete(id);
    }
    async existsByEmail(email) {
        const user = await this.findByEmail(email);
        return user !== null;
    }
    async findActiveUsers() {
        return Array.from(this.users.values()).filter(user => user.status === user_aggregate_1.UserStatus.ACTIVE);
    }
    async findPaginated(page, limit) {
        const allUsers = Array.from(this.users.values());
        const total = allUsers.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const users = allUsers.slice(start, start + limit);
        return {
            users,
            total,
            page,
            totalPages,
        };
    }
    /**
     * Método de utilidad para testing - obtener todos los usuarios
     */
    async findAll() {
        return Array.from(this.users.values());
    }
    /**
     * Método de utilidad para testing - limpiar repositorio
     */
    clear() {
        this.users.clear();
    }
    /**
     * Método de utilidad para testing - obtener conteo de usuarios
     */
    count() {
        return this.users.size;
    }
};
exports.InMemoryUserRepositoryAdapter = InMemoryUserRepositoryAdapter;
exports.InMemoryUserRepositoryAdapter = InMemoryUserRepositoryAdapter = __decorate([
    (0, common_1.Injectable)()
], InMemoryUserRepositoryAdapter);
//# sourceMappingURL=in-memory-user-repository.adapter.js.map