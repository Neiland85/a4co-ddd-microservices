"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInventoryUseCase = void 0;
class CheckInventoryUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(request) {
        const { productId } = request;
        // Find product
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with id ${productId} not found`);
        }
        return {
            productId: product.id,
            name: product.name,
            sku: product.sku,
            currentStock: product.currentStock,
            reservedStock: product.reservedStock,
            availableStock: product.availableStock,
            stockStatus: product.stockStatus,
            needsRestock: product.needsRestock,
            unitPrice: product.unitPrice,
            currency: product.currency,
            isActive: product.isActive,
        };
    }
    async executeBulk(request) {
        const { productIds } = request;
        if (productIds.length === 0) {
            return {
                products: [],
                summary: {
                    totalProducts: 0,
                    inStock: 0,
                    lowStock: 0,
                    outOfStock: 0,
                    discontinued: 0,
                },
            };
        }
        // Find products
        const products = await this.productRepository.findByIds(productIds);
        // Transform to response format
        const productResponses = products.map(product => ({
            productId: product.id,
            name: product.name,
            sku: product.sku,
            currentStock: product.currentStock,
            reservedStock: product.reservedStock,
            availableStock: product.availableStock,
            stockStatus: product.stockStatus,
            needsRestock: product.needsRestock,
            unitPrice: product.unitPrice,
            currency: product.currency,
            isActive: product.isActive,
        }));
        // Calculate summary
        const summary = {
            totalProducts: products.length,
            inStock: productResponses.filter(p => p.stockStatus === 'in_stock').length,
            lowStock: productResponses.filter(p => p.stockStatus === 'low_stock').length,
            outOfStock: productResponses.filter(p => p.stockStatus === 'out_of_stock').length,
            discontinued: productResponses.filter(p => p.stockStatus === 'discontinued').length,
        };
        return {
            products: productResponses,
            summary,
        };
    }
}
exports.CheckInventoryUseCase = CheckInventoryUseCase;
//# sourceMappingURL=check-inventory.use-case.js.map