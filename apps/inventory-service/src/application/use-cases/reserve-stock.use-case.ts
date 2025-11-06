import { Product } from '../../domain/entities/product.entity';
import { StockQuantity } from '../../domain/value-objects';

export interface ReserveStockRequest {
  productId: string;
  quantity: number;
  orderId: string;
  customerId: string;
  expiresAt: Date;
  sagaId?: string;
}

export interface ReserveStockResponse {
  success: boolean;
  reservationId: string;
  productId: string;
  quantity: number;
  availableStock: number;
  expiresAt: Date;
  message?: string;
}

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
}

export class ReserveStockUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(request: ReserveStockRequest): Promise<ReserveStockResponse> {
    const { productId, quantity, orderId, sagaId } = request;

    // Validate input
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    // Find product
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    // Check if product is active
    if (!product.isActive) {
      throw new Error(`Product ${product.name} is not active`);
    }

    // Create StockQuantity value object
    const stockQuantity = StockQuantity.create(quantity);

    try {
      // Reserve stock (this will emit events automatically)
      product.reserveStock(stockQuantity, orderId, sagaId);

      // Save changes (events will be published by event publisher)
      await this.productRepository.save(product);

      // Generate reservation ID
      const reservationId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        reservationId,
        productId,
        quantity,
        availableStock: product.availableStockValue,
        expiresAt: request.expiresAt,
        message: `Successfully reserved ${quantity} units of ${product.name}`,
      };
    } catch (error: any) {
      // If out of stock, return failure response
      if (error.message.includes('Cannot reserve')) {
        return {
          success: false,
          reservationId: '',
          productId,
          quantity,
          availableStock: product.availableStockValue,
          expiresAt: request.expiresAt,
          message: error.message,
        };
      }
      throw error;
    }
  }
}
