"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReleaseStockUseCase = void 0;
class ReleaseStockUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(request) {
        const { productId, quantity, reason } = request;
        // Validate input
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        if (!reason || reason.trim().length === 0) {
            throw new Error('Reason is required');
        }
        // Find product
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error(`Product with id ${productId} not found`);
        }
        // Check if product is active
        if (!product.isActive) {
            throw new Error(`Product ${product.name} is not active`);
        }
        // Check if stock can be released
        if (product.reservedStock < quantity) {
            return {
                success: false,
                productId,
                quantity,
                availableStock: product.availableStock,
                message: `Cannot release ${quantity} units. Reserved: ${product.reservedStock}`,
            };
        }
        // Release stock
        product.releaseStock(quantity);
        // Save changes
        await this.productRepository.save(product);
        return {
            success: true,
            productId,
            quantity,
            availableStock: product.availableStock,
            message: `Successfully released ${quantity} units of ${product.name}. Reason: ${reason}`,
        };
    }
}
exports.ReleaseStockUseCase = ReleaseStockUseCase;
//# sourceMappingURL=release-stock.use-case.js.map