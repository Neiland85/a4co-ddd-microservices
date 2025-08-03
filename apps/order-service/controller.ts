import { BaseController } from '../../packages/shared-utils/src/base';
import { OrderService } from './service';

interface CreateOrderRequest {
  orderId: string;
  items: string[];
}

interface GetOrderRequest {
  orderId: string;
}

export class OrderController extends BaseController<OrderService> {
  constructor() {
    super(OrderService);
  }

  createOrder(req: CreateOrderRequest): string {
    try {
      const validated = this.validateRequest<CreateOrderRequest>(req, ['orderId', 'items']);
      const result = this.service.createOrder(validated.orderId, validated.items);
      return this.formatResponse(result).data;
    } catch (error) {
      const errorResponse = this.handleError(error);
      throw new Error(errorResponse.error);
    }
  }

  getOrder(req: GetOrderRequest): string {
    try {
      const validated = this.validateRequest<GetOrderRequest>(req, ['orderId']);
      const result = this.service.getOrder(validated.orderId);
      return this.formatResponse(result).data;
    } catch (error) {
      const errorResponse = this.handleError(error);
      throw new Error(errorResponse.error);
    }
  }
}
