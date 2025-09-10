"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const base_1 = require("../../packages/shared-utils/src/base");
class ProductService extends base_1.BaseService {
    constructor() {
        super('ProductService');
    }
    addProduct(name, price) {
        try {
            const validatedName = this.validateRequired(name, 'name');
            const validatedPrice = this.validateRequired(price, 'price');
            this.log('Creating product', { name, price });
            return this.createSuccessMessage('Product', 'created', `with ${validatedName} and ${validatedPrice}`);
        }
        catch (error) {
            return this.handleServiceError(error, 'addProduct');
        }
    }
    getProduct(name) {
        try {
            const validatedName = this.validateId(name, 'name');
            this.log('Getting product', { name: validatedName });
            return this.createSuccessMessage('Product', 'retrieved', validatedName);
        }
        catch (error) {
            return this.handleServiceError(error, 'getProduct');
        }
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=service.js.map