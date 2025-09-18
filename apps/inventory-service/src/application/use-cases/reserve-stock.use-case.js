"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveStockUseCase = void 0;
class ReserveStockUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(request) {
        const { productId, quantity, orderId, customerId, expiresAt } = request;
        // Validate input
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        if (expiresAt <= new Date()) {
            throw new Error('Expiration date must be in the future');
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
        // Check if stock can be reserved
        if (!product.canReserveStock(quantity)) {
            return {
                success: false,
                reservationId: '',
                productId,
                quantity,
                availableStock: product.availableStock,
                expiresAt,
                message: `Cannot reserve ${quantity} units. Available: ${product.availableStock}`,
            };
        }
        // Reserve stock
        product.reserveStock(quantity);
        // Save changes
        await this.productRepository.save(product);
        // Generate reservation ID
        const reservationId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
            success: true,
            reservationId,
            productId,
            quantity,
            availableStock: product.availableStock,
            expiresAt,
            message: `Successfully reserved ${quantity} units of ${product.name}`,
        };
    }
}
exports.ReserveStockUseCase = ReserveStockUseCase;
//# sourceMappingURL=reserve-stock.use-case.js.map