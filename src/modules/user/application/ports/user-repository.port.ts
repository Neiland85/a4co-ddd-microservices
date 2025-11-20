import { User } from '../../domain/aggregates/user.aggregate';

/**
 * User Repository Port (Interface)
 *
 * Define el contrato que debe cumplir cualquier implementación de repositorio de usuarios
 * Siguiendo el patrón de Puertos y Adaptadores (Hexagonal Architecture)
 */
export interface UserRepositoryPort {
  /**
   * Guarda un usuario (create o update)
   * @param user - Usuario a guardar
   * @returns Promise<User> - Usuario guardado
   */
  save(user: User): Promise<User>;

  /**
   * Busca un usuario por ID
   * @param userId - ID del usuario
   * @returns Promise<User | null> - Usuario encontrado o null
   */
  findById(userId: string): Promise<User | null>;

  /**
   * Busca un usuario por username
   * @param username - Username del usuario
   * @returns Promise<User | null> - Usuario encontrado o null
   */
  findByUsername(username: string): Promise<User | null>;

  /**
   * Busca un usuario por email
   * @param email - Email del usuario
   * @returns Promise<User | null> - Usuario encontrado o null
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Lista todos los usuarios
   * @returns Promise<User[]> - Lista de usuarios
   */
  findAll(): Promise<User[]>;

  /**
   * Elimina un usuario por ID
   * @param userId - ID del usuario a eliminar
   * @returns Promise<void>
   */
  delete(userId: string): Promise<void>;
}
