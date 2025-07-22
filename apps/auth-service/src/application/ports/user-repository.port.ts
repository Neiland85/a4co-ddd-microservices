import { User } from '../../domain/aggregates/user.aggregate';

/**
 * Port para repositorio de usuarios
 * Define el contrato que debe cumplir cualquier implementación de persistencia
 */
export interface UserRepositoryPort {
  /**
   * Busca un usuario por su email
   * @param email Email del usuario
   * @returns Usuario encontrado o null si no existe
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Busca un usuario por su ID
   * @param id ID del usuario
   * @returns Usuario encontrado o null si no existe
   */
  findById(id: string): Promise<User | null>;

  /**
   * Guarda un usuario (crear o actualizar)
   * @param user Usuario a guardar
   * @returns Usuario guardado
   */
  save(user: User): Promise<User>;

  /**
   * Elimina un usuario por su ID
   * @param id ID del usuario a eliminar
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica si existe un usuario con el email dado
   * @param email Email a verificar
   * @returns true si existe, false en caso contrario
   */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Obtiene todos los usuarios activos
   * @returns Lista de usuarios activos
   */
  findActiveUsers(): Promise<User[]>;

  /**
   * Obtiene usuarios paginados
   * @param page Número de página (comenzando en 1)
   * @param limit Cantidad de elementos por página
   * @returns Lista paginada de usuarios
   */
  findPaginated(
    page: number,
    limit: number
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}
