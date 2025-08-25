import { Product } from '../../domain/entities/product.entity';

export interface CheckInventoryRequest {
  productId: string;
}

export interface CheckInventoryResponse {
  productId: string;
  name: string;
  sku: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  needsRestock: boolean;
  unitPrice: number;
  currency: string;
  isActive: boolean;
}

export interface BulkCheckInventoryRequest {
  productIds: string[];
}

export interface BulkCheckInventoryResponse {
  products: CheckInventoryResponse[];
  summary: {
    totalProducts: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    discontinued: number;
  };
}

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findByIds(ids: string[]): Promise<Product[]>;
}

export class CheckInventoryUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(request: CheckInventoryRequest): Promise<CheckInventoryResponse> {
    const { productId } = request;

    // Find product
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    return {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      currentStock: product.currentStock,
      reservedStock: product.reservedStock,
      availableStock: product.availableStock,
      stockStatus: product.stockStatus,
      needsRestock: product.needsRestock,
      unitPrice: product.unitPrice,
      currency: product.currency,
      isActive: product.isActive
    };
  }

  async executeBulk(request: BulkCheckInventoryRequest): Promise<BulkCheckInventoryResponse> {
    const { productIds } = request;

    if (productIds.length === 0) {
      return {
        products: [],
        summary: {
          totalProducts: 0,
          inStock: 0,
          lowStock: 0,
          outOfStock: 0,
          discontinued: 0
        }
      };
    }

    // Find products
    const products = await this.productRepository.findByIds(productIds);

    // Transform to response format
    const productResponses = products.map(product => ({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      currentStock: product.currentStock,
      reservedStock: product.reservedStock,
      availableStock: product.availableStock,
      stockStatus: product.stockStatus,
      needsRestock: product.needsRestock,
      unitPrice: product.unitPrice,
      currency: product.currency,
      isActive: product.isActive
    }));

    // Calculate summary
    const summary = {
      totalProducts: products.length,
      inStock: productResponses.filter(p => p.stockStatus === 'in_stock').length,
      lowStock: productResponses.filter(p => p.stockStatus === 'low_stock').length,
      outOfStock: productResponses.filter(p => p.stockStatus === 'out_of_stock').length,
      discontinued: productResponses.filter(p => p.stockStatus === 'discontinued').length
    };

    return {
      products: productResponses,
      summary
    };
  }
}
