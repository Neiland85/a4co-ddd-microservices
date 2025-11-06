import { Product } from '../../domain/entities/product.entity';
import { StockQuantity } from '../../domain/value-objects';

export interface ConfirmStockRequest {
  productId: string;
  quantity: number;
  orderId: string;
  sagaId?: string;
}

export interface ConfirmStockResponse {
  success: boolean;
  productId: string;
  quantity: number;
  currentStock: number;
  availableStock: number;
  message?: string;
}

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
}

export class ConfirmStockUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(request: ConfirmStockRequest): Promise<ConfirmStockResponse> {
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
      // Confirm reservation and deduct stock (this will emit events automatically)
      product.confirmReservation(stockQuantity, orderId, sagaId);

      // Save changes (events will be published by event publisher)
      await this.productRepository.save(product);

      return {
        success: true,
        productId,
        quantity,
        currentStock: product.currentStock,
        availableStock: product.availableStockValue,
        message: `Successfully confirmed and deducted ${quantity} units of ${product.name}`,
      };
    } catch (error: any) {
      // If cannot confirm, return failure response
      if (error.message.includes('Cannot confirm') || error.message.includes('Cannot deduct')) {
        return {
          success: false,
          productId,
          quantity,
          currentStock: product.currentStock,
          availableStock: product.availableStockValue,
          message: error.message,
        };
      }
      throw error;
    }
  }
}
