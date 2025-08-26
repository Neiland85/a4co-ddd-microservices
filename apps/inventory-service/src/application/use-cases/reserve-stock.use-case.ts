import { Product } from '../../domain/entities/product.entity';

export interface ReserveStockRequest {
  productId: string;
  quantity: number;
  orderId: string;
  customerId: string;
  expiresAt: Date;
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
    const { productId, quantity, orderId, customerId, expiresAt } = request;

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

    // Check if stock can be reserved
    if (!product.canReserveStock(quantity)) {
      return {
        success: false,
        reservationId: '',
        productId,
        quantity,
        availableStock: product.availableStock,
        expiresAt,
        message: `Cannot reserve ${quantity} units. Available: ${product.availableStock}`
      };
    }

    // Reserve stock
    product.reserveStock(quantity);

    // Save changes
    await this.productRepository.save(product);

    // Generate reservation ID
    const reservationId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      reservationId,
      productId,
      quantity,
      availableStock: product.availableStock,
      expiresAt,
      message: `Successfully reserved ${quantity} units of ${product.name}`
    };
  }
}
