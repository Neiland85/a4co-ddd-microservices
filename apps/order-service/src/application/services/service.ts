import { Order, OrderItem, OrderId, IOrderRepository } from '../../domain';

// ========================================
// DTOs (Data Transfer Objects)
// ========================================

export interface CreateOrderDTO {
  orderId: string;
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    currency?: string;
  }[];
}

export interface GetOrderDTO {
  orderId: string;
}

// ========================================
// PORTS/INTERFACES
// ========================================

// IOrderRepository is now imported from domain

// ========================================
// APPLICATION SERVICE
// ========================================

export class OrderService {
  constructor(
    private readonly orderRepository: IOrderRepository
  ) { }

  async createOrder(dto: CreateOrderDTO): Promise<Order> {
    const orderId = new OrderId(dto.orderId);

    // Check if order already exists
    const existingOrder = await this.orderRepository.findById(orderId);
    if (existingOrder) {
      throw new Error(`Order with id ${dto.orderId} already exists`);
    }

    // Create order items
    const items = dto.items.map(item =>
      new OrderItem(
        item.productId,
        item.quantity,
        item.unitPrice,
        item.currency || 'EUR'
      )
    );

    // Create order aggregate
    const order = new Order(dto.orderId, dto.customerId, items);

    // Save order
    await this.orderRepository.save(order);

    return order;
  }

  async getOrder(dto: GetOrderDTO): Promise<Order> {
    const orderId = new OrderId(dto.orderId);
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order with id ${dto.orderId} not found`);
    }

    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }
}
