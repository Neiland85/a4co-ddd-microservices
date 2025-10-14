"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const base_1 = require("../../packages/shared-utils/src/base");
const service_1 = require("./service");
class OrderController extends base_1.BaseController {
    constructor() {
        super(service_1.OrderService);
    }
    createOrder(req) {
        try {
            const validated = this.validateRequest(req, ['orderId', 'items']);
            const result = this.service.createOrder(validated.orderId, validated.items);
            return this.formatResponse(result).data;
        }
        catch (error) {
            const errorResponse = this.handleError(error);
            throw new Error(errorResponse.error);
        }
    }
    getOrder(req) {
        try {
            const validated = this.validateRequest(req, ['orderId']);
            const result = this.service.getOrder(validated.orderId);
            return this.formatResponse(result).data;
        }
        catch (error) {
            const errorResponse = this.handleError(error);
            throw new Error(errorResponse.error);
        }
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=controller.js.map