import { UserRepositoryPort } from '../ports/user-repository.port';
import { User } from '../../domain/aggregates/user.aggregate';
/**
 * Adapter in-memory para repositorio de usuarios
 * Para desarrollo y testing. En producción se reemplazaría por implementación con Prisma/TypeORM
 */
export declare class InMemoryUserRepositoryAdapter implements UserRepositoryPort {
    private readonly users;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<User>;
    delete(id: string): Promise<void>;
    existsByEmail(email: string): Promise<boolean>;
    findActiveUsers(): Promise<User[]>;
    findPaginated(page: number, limit: number): Promise<{
        users: User[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    /**
     * Método de utilidad para testing - obtener todos los usuarios
     */
    findAll(): Promise<User[]>;
    /**
     * Método de utilidad para testing - limpiar repositorio
     */
    clear(): void;
    /**
     * Método de utilidad para testing - obtener conteo de usuarios
     */
    count(): number;
}
//# sourceMappingURL=in-memory-user-repository.adapter.d.ts.map