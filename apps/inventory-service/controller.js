"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const base_1 = require("../../packages/shared-utils/src/base");
const service_1 = require("./service");
class InventoryController extends base_1.BaseController {
    constructor() {
        super(service_1.InventoryService);
    }
    updateStock(req) {
        try {
            const validated = this.validateRequest(req, ['productId', 'quantity']);
            const result = this.service.updateStock(validated.productId, validated.quantity);
            return this.formatResponse(result).data;
        }
        catch (error) {
            const errorResponse = this.handleError(error);
            throw new Error(errorResponse.error);
        }
    }
    getStock(req) {
        try {
            const validated = this.validateRequest(req, ['productId']);
            const result = this.service.getStock(validated.productId);
            return this.formatResponse(result).data;
        }
        catch (error) {
            const errorResponse = this.handleError(error);
            throw new Error(errorResponse.error);
        }
    }
}
exports.InventoryController = InventoryController;
//# sourceMappingURL=controller.js.map