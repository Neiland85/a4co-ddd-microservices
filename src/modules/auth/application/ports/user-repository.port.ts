import { User } from '../../domain/aggregates';

/**
 * Port para repositorio de usuarios
 * Define el contrato que debe cumplir cualquier implementación de persistencia
 */
export interface UserRepositoryPort {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
  findActiveUsers(): Promise<User[]>;
  findPaginated(
    page: number,
    limit: number,
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}
