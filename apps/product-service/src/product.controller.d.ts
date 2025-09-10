import { CreateProductDTO, ProductService, UpdateProductDTO } from './application/services/product.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getProductById(id: string): Promise<import("./domain/entities/product.entity").Product | null>;
    getProductBySku(sku: string): Promise<import("./domain/entities/product.entity").Product | null>;
    getProductBySlug(slug: string): Promise<import("./domain/entities/product.entity").Product | null>;
    createProduct(productData: CreateProductDTO): Promise<import("./domain/entities/product.entity").Product>;
    updateProduct(id: string, productData: UpdateProductDTO): Promise<import("./domain/entities/product.entity").Product>;
    deleteProduct(id: string): Promise<void>;
    publishProduct(id: string): Promise<void>;
    archiveProduct(id: string): Promise<void>;
}
//# sourceMappingURL=product.controller.d.ts.map