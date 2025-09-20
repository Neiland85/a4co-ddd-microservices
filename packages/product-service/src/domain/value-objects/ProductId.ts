/**
 * Value Object que representa el identificador único de un producto.
 * 
 * Esta clase encapsula la lógica de validación y generación de IDs de productos,
 * asegurando que cumplan con el formato requerido: `prod_` seguido de caracteres alfanuméricos.
 * 
 * @example
 * ```typescript
 * // Crear un ID válido
 * const productId = new ProductId('prod_123');
 * 
 * // Generar un ID único
 * const newId = ProductId.generate();
 * ```
 */
export class ProductId {
  /**
   * Crea una nueva instancia de ProductId.
   * 
   * @param value - El valor del ID del producto
   * @throws {Error} Si el ID está vacío o no cumple con el formato requerido
   * 
   * @example
   * ```typescript
   * const validId = new ProductId('prod_abc123'); // ✅ Válido
   * const invalidId = new ProductId('product_123'); // ❌ Error: debe empezar con 'prod_'
   * ```
   */
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Product ID cannot be empty");
    }
    if (!value.match(/^prod_[a-zA-Z0-9_-]+$/)) {
      throw new Error("Invalid Product ID format. Must start with 'prod_' followed by alphanumeric characters, hyphens, or underscores");
    }
  }

  /**
   * Obtiene el valor del ID del producto.
   * 
   * @returns El ID del producto como string
   * 
   * @example
   * ```typescript
   * const productId = new ProductId('prod_123');
   * console.log(productId.id); // 'prod_123'
   * ```
   */
  get id(): string {
    return this.value;
  }

  /**
   * Compara este ProductId con otro para determinar si son iguales.
   * 
   * @param other - El ProductId con el que comparar
   * @returns `true` si los IDs son iguales, `false` en caso contrario
   * 
   * @example
   * ```typescript
   * const id1 = new ProductId('prod_123');
   * const id2 = new ProductId('prod_123');
   * const id3 = new ProductId('prod_456');
   * 
   * console.log(id1.equals(id2)); // true
   * console.log(id1.equals(id3)); // false
   * ```
   */
  equals(other: ProductId): boolean {
    return this.value === other.value;
  }

  /**
   * Convierte el ProductId a string.
   * 
   * @returns El ID del producto como string
   * 
   * @example
   * ```typescript
   * const productId = new ProductId('prod_123');
   * console.log(productId.toString()); // 'prod_123'
   * ```
   */
  toString(): string {
    return this.value;
  }

  /**
   * Genera un nuevo ProductId único basado en timestamp y string aleatorio.
   * 
   * @returns Una nueva instancia de ProductId con un ID único
   * 
   * @example
   * ```typescript
   * const newId = ProductId.generate();
   * console.log(newId.id); // 'prod_1703123456789_abc123'
   * ```
   */
  static generate(): ProductId {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return new ProductId(`prod_${timestamp}_${random}`);
  }
} 