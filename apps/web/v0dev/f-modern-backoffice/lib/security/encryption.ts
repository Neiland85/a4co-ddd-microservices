export class EncryptionService {
  private readonly algorithm = "AES-GCM"
  private readonly keyLength = 256
  private readonly ivLength = 12

  // Generar clave de cifrado
  async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength,
      },
      true,
      ["encrypt", "decrypt"],
    )
  }

  // Cifrar datos
  async encrypt(text: string, key: CryptoKey): Promise<{ encrypted: string; iv: string }> {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const iv = crypto.getRandomValues(new Uint8Array(this.ivLength))

    const encrypted = await crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv,
      },
      key,
      data,
    )

    return {
      encrypted: Array.from(new Uint8Array(encrypted))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
      iv: Array.from(iv)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    }
  }

  // Descifrar datos
  async decrypt(encryptedData: { encrypted: string; iv: string }, key: CryptoKey): Promise<string> {
    const encrypted = new Uint8Array(encryptedData.encrypted.match(/.{2}/g)!.map((byte) => Number.parseInt(byte, 16)))
    const iv = new Uint8Array(encryptedData.iv.match(/.{2}/g)!.map((byte) => Number.parseInt(byte, 16)))

    const decrypted = await crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: iv,
      },
      key,
      encrypted,
    )

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  }

  // Hash seguro para contraseñas
  async hashData(data: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const actualSalt = salt || this.generateSecureToken(16)
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data + actualSalt)

    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
    const hash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    return { hash, salt: actualSalt }
  }

  // Verificar hash
  async verifyHash(data: string, hash: string, salt: string): Promise<boolean> {
    const computedHash = await this.hashData(data, salt)
    return computedHash.hash === hash
  }

  // Generar token seguro
  generateSecureToken(length = 32): string {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  // Generar UUID
  generateUUID(): string {
    return crypto.randomUUID()
  }
}

export const encryptionService = new EncryptionService()
