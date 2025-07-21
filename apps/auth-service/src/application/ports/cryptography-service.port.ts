/**
 * Port para servicio de encriptación
 * Abstrae la lógica de hashing y validación de passwords
 */
export interface CryptographyServicePort {
  /**
   * Genera hash de una contraseña
   * @param plainPassword Contraseña en texto plano
   * @returns Hash de la contraseña
   */
  hashPassword(plainPassword: string): Promise<string>;

  /**
   * Valida una contraseña contra su hash
   * @param plainPassword Contraseña en texto plano
   * @param hashedPassword Hash almacenado
   * @returns true si la contraseña es válida, false en caso contrario
   */
  validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;

  /**
   * Genera un token seguro
   * @param length Longitud del token (opcional, por defecto 32)
   * @returns Token seguro generado
   */
  generateSecureToken(length?: number): string;
}
