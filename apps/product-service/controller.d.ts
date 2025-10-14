import { BaseController } from '../../packages/shared-utils/src/base';
import { ProductService } from './service';
interface AddProductRequest {
    name: string;
    price: number;
}
interface GetProductRequest {
    name: string;
}
export declare class ProductController extends BaseController<ProductService> {
    constructor();
    addProduct(req: AddProductRequest): string;
    getProduct(req: GetProductRequest): string;
}
export {};
//# sourceMappingURL=controller.d.ts.map