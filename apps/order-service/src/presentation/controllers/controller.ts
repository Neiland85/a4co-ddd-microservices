import { OrderService } from '../../application/services/service';
import { InMemoryOrderRepository } from '../../infrastructure/repositories/order.repository';
import { CreateOrderDTO, GetOrderDTO } from '../../application/services/service';
import { CreateOrderRequestV1, GetOrderRequestV1, OrderResponseV1 } from '../../contracts/api/v1/dto';

export class OrderController {
  private service: OrderService;

  constructor() {
    const repository = new InMemoryOrderRepository();
    this.service = new OrderService(repository);
  }

  async createOrder(req: CreateOrderRequestV1): Promise<OrderResponseV1> {
    const result = await this.service.createOrder(req);
    return {
      orderId: result.id,
      customerId: result.customerId,
      items: result.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: item.currency,
        totalPrice: item.totalPrice,
      })),
      status: result.status,
      totalAmount: result.totalAmount,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  async getOrder(orderId: string): Promise<OrderResponseV1> {
    const result = await this.service.getOrder({ orderId });
    return {
      orderId: result.id,
      customerId: result.customerId,
      items: result.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: item.currency,
        totalPrice: item.totalPrice,
      })),
      status: result.status,
      totalAmount: result.totalAmount,
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }
}
