import { Injectable } from '@nestjs/common';
import { User, UserStatus } from '../../domain/aggregates/user.aggregate';
import { UserRepositoryPort } from '../ports/user-repository.port';

/**
 * Adapter in-memory para repositorio de usuarios
 * Para desarrollo y testing. En producción se reemplazaría por implementación con Prisma/TypeORM
 */
@Injectable()
export class InMemoryUserRepositoryAdapter implements UserRepositoryPort {
  private readonly users: Map<string, User> = new Map();

  async findByEmail(email: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(
      u => u.email.toLowerCase() === email.toLowerCase(),
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async save(user: User): Promise<User> {
    const persistence = user.toPersistence();
    this.users.set(persistence.id, user);
    return user;
  }

  async update(user: User): Promise<User> {
    const persistence = user.toPersistence();
    this.users.set(persistence.id, user);
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  async findActiveUsers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.status === UserStatus.ACTIVE);
  }

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
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
  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  /**
   * Método de utilidad para testing - limpiar repositorio
   */
  clear(): void {
    this.users.clear();
  }

  /**
   * Método de utilidad para testing - obtener conteo de usuarios
   */
  count(): number {
    return this.users.size;
  }
}
