import { Controller, Post, Get, Body, Param, Inject } from '@nestjs/common';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { IOrderRepository } from '../../domain';
import { OrderId } from '../../domain/aggregates/order.aggregate';
import { CreateOrderRequestV1, OrderResponseV1 } from '../../contracts/api/v1/dto';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    @Inject('IOrderRepository') private readonly orderRepository: IOrderRepository,
  ) {}

  @Post()
  async createOrder(@Body() req: CreateOrderRequestV1): Promise<OrderResponseV1> {
    const orderId = await this.createOrderUseCase.execute({
      customerId: req.customerId,
      items: req.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: item.currency,
      })),
    });

    // Obtener la orden creada para retornarla
    const order = await this.orderRepository.findById(new OrderId(orderId));
    if (!order) {
      throw new Error('Order not found after creation');
    }

    return {
      orderId: order.id,
      customerId: order.customerId,
      items: order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: item.currency,
        totalPrice: item.totalPrice,
      })),
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string): Promise<OrderResponseV1> {
    const order = await this.orderRepository.findById(new OrderId(orderId));
    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    return {
      orderId: order.id,
      customerId: order.customerId,
      items: order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: item.currency,
        totalPrice: item.totalPrice,
      })),
      status: order.status,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}

