"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const base_1 = require("../../packages/shared-utils/src/base");
class InventoryService extends base_1.BaseService {
    constructor() {
        super('InventoryService');
    }
    updateStock(productId, quantity) {
        try {
            const validatedProductId = this.validateId(productId, 'inventory');
            const validatedQuantity = this.validateRequired(quantity, 'quantity');
            this.log('Updating inventory', { productId, quantity });
            return this.createSuccessMessage('Inventory', 'updated', `${validatedProductId} to ${validatedQuantity}`);
        }
        catch (error) {
            return this.handleServiceError(error, 'updateStock');
        }
    }
    getStock(productId) {
        try {
            const validatedProductId = this.validateId(productId, 'productId');
            this.log('Getting inventory', { productId: validatedProductId });
            return this.createSuccessMessage('Inventory', 'retrieved', validatedProductId);
        }
        catch (error) {
            return this.handleServiceError(error, 'getStock');
        }
    }
}
exports.InventoryService = InventoryService;
//# sourceMappingURL=service.js.map