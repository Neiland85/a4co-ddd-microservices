export declare class EncryptionService {
    private readonly algorithm;
    private readonly keyLength;
    private readonly ivLength;
    generateKey(): Promise<CryptoKey>;
    encrypt(text: string, key: CryptoKey): Promise<{
        encrypted: string;
        iv: string;
    }>;
    decrypt(encryptedData: {
        encrypted: string;
        iv: string;
    }, key: CryptoKey): Promise<string>;
    hashData(data: string, salt?: string): Promise<{
        hash: string;
        salt: string;
    }>;
    verifyHash(data: string, hash: string, salt: string): Promise<boolean>;
    generateSecureToken(length?: number): string;
    generateUUID(): string;
}
export declare const encryptionService: EncryptionService;
//# sourceMappingURL=encryption.d.ts.map