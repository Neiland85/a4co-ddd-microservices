import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderService } from '../../application/services/service.js';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case.js';
import { OrderMetricsService } from '../../infrastructure/metrics/order-metrics.service.js';
import {
  CreateOrderRequestV1,
  GetOrderRequestV1,
  OrderResponseV1,
} from '../../contracts/api/v1/dto.js';
import { OrderItem } from '@a4co/domain-order';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly metricsService: OrderMetricsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createOrder(@Body() req: CreateOrderRequestV1): Promise<OrderResponseV1> {
    // Use the new Use Case approach
    const orderId = await this.createOrderUseCase.execute({
      customerId: req.customerId,
      items: req.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });

    // Get the created order
    const order = await this.orderService.getOrder({ orderId });

    // Record metrics
    this.metricsService.recordOrderCreated(order.totalAmount);

    return {
      orderId: order.id,
      customerId: order.customerId,
      items: order.items.map((item: OrderItem) => ({
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

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth() {
    return {
      status: 'ok',
      service: 'order-service',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Prometheus metrics endpoint' })
  async getMetrics() {
    return this.metricsService.getMetrics();
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrder(@Param('orderId') orderId: string): Promise<OrderResponseV1> {
    const result = await this.orderService.getOrder({ orderId });
    return {
      orderId: result.id,
      customerId: result.customerId,
      items: result.items.map((item: OrderItem) => ({
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
