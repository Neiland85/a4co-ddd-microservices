import { CryptographyServicePort } from '../ports/cryptography-service.port';
/**
 * Adapter que implementa servicios criptográficos usando bcrypt
 */
export declare class BcryptCryptographyAdapter implements CryptographyServicePort {
    private readonly SALT_ROUNDS;
    hashPassword(plainPassword: string): Promise<string>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    generateSecureToken(length?: number): string;
}
//# sourceMappingURL=bcrypt-cryptography.adapter.d.ts.map