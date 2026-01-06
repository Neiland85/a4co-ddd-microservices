import { Product } from '../../domain/entities/product.entity';

export interface ReleaseStockRequest {
  productId: string;
  quantity: number;
  reservationId?: string;
  reason: string;
}

export interface ReleaseStockResponse {
  success: boolean;
  productId: string;
  quantity: number;
  availableStock: number;
  message?: string;
}

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
}

export class ReleaseStockUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(request: ReleaseStockRequest): Promise<ReleaseStockResponse> {
    const { productId, quantity, reason } = request;

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

    // Check if stock can be released
    if (product.reservedStock < quantity) {
      return {
        success: false,
        productId,
        quantity,
        availableStock: product.availableStock,
        message: `Cannot release ${quantity} units. Reserved: ${product.reservedStock}`,
      };
    }

    // Release stock
    product.releaseStock(quantity);

    // Save changes
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
