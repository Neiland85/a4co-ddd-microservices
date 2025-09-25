import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class UuidUtil {
  static generate(): string {
    return uuidv4();
  }

  static isValid(uuid: string): boolean {
    return uuidValidate(uuid);
  }

  static validateOrThrow(uuid: string): void {
    if (!this.isValid(uuid)) {
      throw new Error(`Invalid UUID: ${uuid}`);
    }
  }
}

/**
 * Genera un nuevo UUID v4 o un ID aleatorio de la longitud especificada
 */
export function generateId(length?: number): string {
  if (length) {
    // Generar un ID aleatorio de la longitud especificada
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  return UuidUtil.generate();
}
