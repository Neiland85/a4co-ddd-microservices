import { BaseController } from '../../packages/shared-utils/src/base';
import { OrderService } from './service';
interface CreateOrderRequest {
    orderId: string;
    items: string[];
}
interface GetOrderRequest {
    orderId: string;
}
export declare class OrderController extends BaseController<OrderService> {
    constructor();
    createOrder(req: CreateOrderRequest): string;
    getOrder(req: GetOrderRequest): string;
}
export {};
//# sourceMappingURL=controller.d.ts.map