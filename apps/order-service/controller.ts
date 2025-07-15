import { OrderService } from './service';

export class OrderController {
  private orderService = new OrderService();

  createOrder(req: { orderId: string; items: string[] }): string {
    return this.orderService.createOrder(req.orderId, req.items);
  }

  getOrder(req: { orderId: string }): string {
    return this.orderService.getOrder(req.orderId);
  }
}
