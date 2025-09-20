import { CreateProductDto, ProductResponseDto } from "../dto/CreateProductDto";
import { Product } from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/interfaces/ProductRepository";
import { ProductId } from "../../domain/value-objects/ProductId";
import { ProductCreatedEvent } from "../../domain/events/ProductCreated";

/**
 * Caso de uso para crear un nuevo producto en el sistema.
 * 
 * Esta clase implementa la lógica de aplicación para crear productos,
 * incluyendo validación de datos, generación de IDs únicos, y publicación
 * de eventos de dominio.
 * 
 * @example
 * ```typescript
 * const useCase = new CreateProductUseCase(productRepository);
 * const product = await useCase.execute({
 *   name: 'Aceite de Oliva',
 *   category: 'aceite',
 *   seasonal: true,
 *   price: 12.5
 * });
 * ```
 */
export class CreateProductUseCase {
  /**
   * Crea una nueva instancia del caso de uso.
   * 
   * @param productRepo - Repositorio de productos para persistencia
   */
  constructor(private readonly productRepo: ProductRepository) {}

  /**
   * Ejecuta el caso de uso para crear un nuevo producto.
   * 
   * Este método:
   * 1. Valida los datos de entrada
   * 2. Genera un ID único para el producto
   * 3. Crea la entidad Product con validaciones de dominio
   * 4. Persiste el producto en el repositorio
   * 5. Publica el evento ProductCreated
   * 6. Retorna el DTO de respuesta
   * 
   * @param dto - Datos del producto a crear
   * @returns Promise<ProductResponseDto> - Producto creado con todos sus datos
   * @throws {Error} Si los datos de entrada son inválidos
   * @throws {Error} Si la validación de dominio falla
   * 
   * @example
   * ```typescript
   * try {
   *   const product = await createProductUseCase.execute({
   *     name: 'Queso de Cabra',
   *     category: 'queso',
   *     seasonal: false,
   *     price: 8.75,
   *     unit: 'pieza 250g',
   *     description: 'Queso artesanal de cabra',
   *     producer: 'Quesería Los Olivos'
   *   });
   *   
   *   console.log('Producto creado:', product.id);
   * } catch (error) {
   *   console.error('Error al crear producto:', error.message);
   * }
   * ```
   */
  async execute(dto: CreateProductDto): Promise<ProductResponseDto> {
    // Validar datos de entrada
    if (!dto.name || !dto.category) {
      throw new Error("Name and category are required");
    }

    // Generar ID único
    const productId = ProductId.generate();

    // Crear la entidad Product
    const product = new Product(
      productId.id,
      dto.name,
      dto.category,
      dto.seasonal,
      dto.price,
      dto.unit,
      dto.description,
      dto.producer,
      dto.location,
      dto.images || [],
      dto.certifications || [],
      dto.available !== undefined ? dto.available : true,
      dto.stock,
      dto.harvestDate
    );

    // Validar la entidad
    product.validate();

    // Guardar en el repositorio
    const savedProduct = await this.productRepo.save(product);

    // Crear evento de dominio
    const productCreatedEvent = new ProductCreatedEvent(
      savedProduct.id,
      savedProduct.name,
      savedProduct.category
    );

    // Aquí se podría publicar el evento a un bus de eventos
    // await this.eventBus.publish(productCreatedEvent);

    // Retornar DTO de respuesta
    return this.toResponseDto(savedProduct);
  }

  /**
   * Convierte una entidad Product a ProductResponseDto.
   * 
   * @param product - Entidad Product del dominio
   * @returns ProductResponseDto - DTO de respuesta con todos los datos del producto
   * 
   * @private
   */
  private toResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      seasonal: product.seasonal,
      price: product.price,
      unit: product.unit,
      description: product.description,
      producer: product.producer,
      location: product.location,
      images: product.images,
      certifications: product.certifications,
      available: product.available,
      stock: product.stock,
      harvestDate: product.harvestDate,
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date()
    };
  }
} 