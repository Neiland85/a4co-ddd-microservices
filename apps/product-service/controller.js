"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const base_1 = require("../../packages/shared-utils/src/base");
const service_1 = require("./service");
class ProductController extends base_1.BaseController {
    constructor() {
        super(service_1.ProductService);
    }
    addProduct(req) {
        try {
            const validated = this.validateRequest(req, ['name', 'price']);
            const result = this.service.addProduct(validated.name, validated.price);
            return this.formatResponse(result).data;
        }
        catch (error) {
            const errorResponse = this.handleError(error);
            throw new Error(errorResponse.error);
        }
    }
    getProduct(req) {
        try {
            const validated = this.validateRequest(req, ['name']);
            const result = this.service.getProduct(validated.name);
            return this.formatResponse(result).data;
        }
        catch (error) {
            const errorResponse = this.handleError(error);
            throw new Error(errorResponse.error);
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=controller.js.map