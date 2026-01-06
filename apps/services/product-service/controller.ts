import { BaseController } from '../../packages/shared-utils/src/base';
import { ProductService } from './service';

interface AddProductRequest {
  name: string;
  price: number;
}

interface GetProductRequest {
  name: string;
}

export class ProductController extends BaseController<ProductService> {
  constructor() {
    super(ProductService);
  }

  addProduct(req: AddProductRequest): string {
    try {
      const validated = this.validateRequest<AddProductRequest>(req, ['name', 'price']);
      const result = this.service.addProduct(validated.name, validated.price);
      return this.formatResponse(result).data;
    } catch (error) {
      const errorResponse = this.handleError(error);
      throw new Error(errorResponse.error);
    }
  }

  getProduct(req: GetProductRequest): string {
    try {
      const validated = this.validateRequest<GetProductRequest>(req, ['name']);
      const result = this.service.getProduct(validated.name);
      return this.formatResponse(result).data;
    } catch (error) {
      const errorResponse = this.handleError(error);
      throw new Error(errorResponse.error);
    }
  }
}
