import { Product } from '../../domain/entities/product.entity';
import { StockQuantity } from '../../domain/value-objects/stock-quantity.vo';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';

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

export class ReserveStockUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(request: ReserveStockRequest): Promise<ReserveStockResponse> {
    const { productId, quantity, orderId, customerId, expiresAt, sagaId } = request;

    // Validate input
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    if (expiresAt <= new Date()) {
      throw new Error('Expiration date must be in the future');
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

    // Convert quantity to value object
    const stockQuantity = StockQuantity.create(quantity);

    // Try to reserve stock (this will emit events automatically)
    try {
      product.reserveStock(stockQuantity, orderId, sagaId);
    } catch (error: any) {
      // If OutOfStock event was emitted, return failure response
      if (error.message.includes('Cannot reserve')) {
        return {
          success: false,
          reservationId: '',
          productId,
          quantity,
          availableStock: product.availableStock.value,
          expiresAt,
          message: error.message,
        };
      }
      throw error;
    }

    // Save changes (events will be published by EventPublisher)
    await this.productRepository.save(product);

    // Generate reservation ID
    const reservationId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      reservationId,
      productId,
      quantity,
      availableStock: product.availableStock.value,
      expiresAt,
      message: `Successfully reserved ${quantity} units of ${product.name}`,
    };
  }
}
