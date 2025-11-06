import { Product } from '../../domain/entities/product.entity';
import { StockQuantity } from '../../domain/value-objects';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';

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

    // Convert quantity to value object
    const stockQuantity = StockQuantity.create(quantity);

    // Confirm reservation and deduct stock (this will emit domain events)
    product.confirmReservation(stockQuantity, orderId, sagaId);

    // Save changes (events will be published by event publisher)
    await this.productRepository.save(product);

    return {
      success: true,
      productId,
      quantity,
      currentStock: product.currentStock,
      availableStock: product.availableStock,
      message: `Successfully confirmed and deducted ${quantity} units of ${product.name}`,
    };
  }
}
