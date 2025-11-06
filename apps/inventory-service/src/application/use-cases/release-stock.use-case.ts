import { Product } from '../../domain/entities/product.entity';
import { StockQuantity } from '../../domain/value-objects';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';

export interface ReleaseStockRequest {
  productId: string;
  quantity: number;
  orderId: string;
  reservationId?: string;
  orderId: string;
  reason: string;
  sagaId?: string;
}

export interface ReleaseStockResponse {
  success: boolean;
  productId: string;
  quantity: number;
  availableStock: number;
  message?: string;
}

export class ReleaseStockUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(request: ReleaseStockRequest): Promise<ReleaseStockResponse> {
    const { productId, quantity, orderId, reason, sagaId } = request;

    // Validate input
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    if (!reason || reason.trim().length === 0) {
      throw new Error('Reason is required');
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

    // Check if stock can be released
    if (product.reservedStockQuantity.isLessThan(stockQuantity)) {
      return {
        success: true,
        productId,
        quantity,
        availableStock: product.availableStockValue,
        message: `Successfully released ${quantity} units of ${product.name}. Reason: ${reason}`,
      };
    } catch (error: any) {
      // If cannot release, return failure response
      if (error.message.includes('Cannot release')) {
        return {
          success: false,
          productId,
          quantity,
          availableStock: product.availableStockValue,
          message: error.message,
        };
      }
      throw error;
    }

    // Release stock (this will emit domain events)
    product.releaseStock(stockQuantity, orderId, reason, sagaId);

    // Save changes (events will be published by event publisher)
    await this.productRepository.save(product);

    return {
      success: true,
      productId,
      quantity,
      availableStock: product.availableStock,
      message: `Successfully released ${quantity} units of ${product.name}. Reason: ${reason}`,
    };
  }
}
