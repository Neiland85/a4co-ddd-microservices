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
