import { Injectable } from '@nestjs/common';
import { CryptographyServicePort } from '../ports/cryptography-service.port';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

/**
 * Adapter que implementa servicios criptográficos usando bcrypt
 */
@Injectable()
export class BcryptCryptographyAdapter implements CryptographyServicePort {
  private readonly SALT_ROUNDS = 12;

  async hashPassword(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  generateSecureToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }
}
