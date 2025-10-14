import { BaseController } from '../../packages/shared-utils/src/base';
import { InventoryService } from './service';
interface UpdateStockRequest {
    productId: string;
    quantity: number;
}
interface GetStockRequest {
    productId: string;
}
export declare class InventoryController extends BaseController<InventoryService> {
    constructor();
    updateStock(req: UpdateStockRequest): string;
    getStock(req: GetStockRequest): string;
}
export {};
//# sourceMappingURL=controller.d.ts.map