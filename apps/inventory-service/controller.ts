import { BaseController } from '../../packages/shared-utils/src/base';
import { InventoryService } from './service';

interface UpdateStockRequest {
  productId: string;
  quantity: number;
}

interface GetStockRequest {
  productId: string;
}

export class InventoryController extends BaseController<InventoryService> {
  constructor() {
    super(InventoryService);
  }

  updateStock(req: UpdateStockRequest): string {
    try {
      const validated = this.validateRequest<UpdateStockRequest>(req, ['productId', 'quantity']);
      const result = this.service.updateStock(validated.productId, validated.quantity);
      return this.formatResponse(result).data;
    } catch (error) {
      const errorResponse = this.handleError(error);
      throw new Error(errorResponse.error);
    }
  }

  getStock(req: GetStockRequest): string {
    try {
      const validated = this.validateRequest<GetStockRequest>(req, ['productId']);
      const result = this.service.getStock(validated.productId);
      return this.formatResponse(result).data;
    } catch (error) {
      const errorResponse = this.handleError(error);
      throw new Error(errorResponse.error);
    }
  }
}
