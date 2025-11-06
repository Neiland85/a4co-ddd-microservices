import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateOrderUseCase, GetOrderUseCase, GetAllOrdersUseCase } from '../../application/use-cases/create-order.use-case';
import { CreateOrderRequestV1, GetOrderRequestV1, OrderResponseV1 } from '../../contracts/api/v1/dto';

@Controller('orders')
export class OrderController {
    constructor(
        private readonly createOrderUseCase: CreateOrderUseCase,
        private readonly getOrderUseCase: GetOrderUseCase,
        private readonly getAllOrdersUseCase: GetAllOrdersUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createOrder(@Body() req: CreateOrderRequestV1): Promise<OrderResponseV1> {
        const result = await this.createOrderUseCase.execute({
            orderId: req.orderId,
            customerId: req.customerId,
            items: req.items,
        });

        return {
            orderId: result.id,
            customerId: result.customerId,
            items: result.items.map((item) => ({
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

    @Get(':orderId')
    async getOrder(@Param('orderId') orderId: string): Promise<OrderResponseV1> {
        const result = await this.getOrderUseCase.execute({ orderId });

        return {
            orderId: result.id,
            customerId: result.customerId,
            items: result.items.map((item) => ({
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

    @Get()
    async getAllOrders(): Promise<OrderResponseV1[]> {
        const results = await this.getAllOrdersUseCase.execute();

        return results.map((result) => ({
            orderId: result.id,
            customerId: result.customerId,
            items: result.items.map((item) => ({
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
        }));
    }
}
