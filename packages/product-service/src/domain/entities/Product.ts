/**
 * Entidad de dominio que representa un producto en el sistema.
 * 
 * Esta clase encapsula toda la lógica de negocio relacionada con los productos,
 * incluyendo validaciones, reglas de negocio y comportamientos específicos del dominio.
 * 
 * @example
 * ```typescript
 * const product = new Product(
 *   'prod_123',
 *   'Aceite de Oliva',
 *   'aceite',
 *   true,
 *   12.5,
 *   'botella 500ml'
 * );
 * product.validate();
 * ```
 */
export class Product {
  /**
   * Crea una nueva instancia de Product.
   * 
   * @param id - Identificador único del producto (formato: prod_xxx)
   * @param name - Nombre del producto (requerido)
   * @param category - Categoría del producto (requerido)
   * @param seasonal - Indica si el producto es estacional
   * @param price - Precio del producto (opcional, debe ser >= 0)
   * @param unit - Unidad de medida del producto
   * @param description - Descripción detallada del producto
   * @param producer - Productor o fabricante del producto
   * @param location - Información de ubicación (objeto JSON)
   * @param images - Array de URLs de imágenes del producto
   * @param certifications - Array de certificaciones del producto
   * @param available - Indica si el producto está disponible para venta
   * @param stock - Cantidad disponible en inventario (debe ser >= 0)
   * @param harvestDate - Fecha de cosecha (para productos agrícolas)
   * @param createdAt - Fecha de creación del registro
   * @param updatedAt - Fecha de última actualización
   */
  constructor(
    public readonly id: string,
    public name: string,
    public category: string,
    public seasonal: boolean,
    public price?: number,
    public unit?: string,
    public description?: string,
    public producer?: string,
    public location?: any,
    public images: string[] = [],
    public certifications: string[] = [],
    public available: boolean = true,
    public stock?: number,
    public harvestDate?: string,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  /**
   * Valida que el producto cumpla con todas las reglas de negocio.
   * 
   * @throws {Error} Si el nombre está vacío o es solo espacios en blanco
   * @throws {Error} Si la categoría está vacía o es solo espacios en blanco
   * @throws {Error} Si el precio es negativo
   * @throws {Error} Si el stock es negativo
   * 
   * @example
   * ```typescript
   * try {
   *   product.validate();
   *   console.log('Producto válido');
   * } catch (error) {
   *   console.error('Error de validación:', error.message);
   * }
   * ```
   */
  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Product name is required");
    }
    if (!this.category || this.category.trim().length === 0) {
      throw new Error("Product category is required");
    }
    if (this.price !== undefined && this.price < 0) {
      throw new Error("Product price cannot be negative");
    }
    if (this.stock !== undefined && this.stock < 0) {
      throw new Error("Product stock cannot be negative");
    }
  }

  /**
   * Actualiza el stock del producto.
   * 
   * @param newStock - Nueva cantidad de stock (debe ser >= 0)
   * @throws {Error} Si el nuevo stock es negativo
   * 
   * @example
   * ```typescript
   * product.updateStock(200);
   * console.log(product.stock); // 200
   * ```
   */
  updateStock(newStock: number): void {
    if (newStock < 0) {
      throw new Error("Stock cannot be negative");
    }
    this.stock = newStock;
    this.updatedAt = new Date();
  }

  /**
   * Cambia el estado de disponibilidad del producto.
   * 
   * @example
   * ```typescript
   * console.log(product.available); // true
   * product.toggleAvailability();
   * console.log(product.available); // false
   * ```
   */
  toggleAvailability(): void {
    this.available = !this.available;
    this.updatedAt = new Date();
  }

  /**
   * Agrega una nueva imagen al producto si no existe.
   * 
   * @param imageUrl - URL de la imagen a agregar
   * 
   * @example
   * ```typescript
   * product.addImage('/images/new-product.jpg');
   * console.log(product.images); // ['/images/existing.jpg', '/images/new-product.jpg']
   * ```
   */
  addImage(imageUrl: string): void {
    if (!this.images.includes(imageUrl)) {
      this.images.push(imageUrl);
      this.updatedAt = new Date();
    }
  }

  /**
   * Agrega una nueva certificación al producto si no existe.
   * 
   * @param certification - Nombre de la certificación a agregar
   * 
   * @example
   * ```typescript
   * product.addCertification('Orgánico');
   * console.log(product.certifications); // ['Denominación de Origen', 'Orgánico']
   * ```
   */
  addCertification(certification: string): void {
    if (!this.certifications.includes(certification)) {
      this.certifications.push(certification);
      this.updatedAt = new Date();
    }
  }
} 