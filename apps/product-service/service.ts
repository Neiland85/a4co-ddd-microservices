import { BaseService } from '../../packages/shared-utils/src/base';

export class ProductService extends BaseService {
  constructor() {
    super('ProductService');
  }

  addProduct(name: string, price: number): string {
    try {
      const validatedName = this.validateRequired(name, 'name');
      const validatedPrice = this.validateRequired(price, 'price');

      this.log('Creating product', { name, price });

      return this.createSuccessMessage(
        'Product',
        'created',
        `with ${validatedName} and ${validatedPrice}`
      );
    } catch (error) {
      return this.handleServiceError(error, 'addProduct');
    }
  }

  getProduct(name: string): string {
    try {
      const validatedName = this.validateId(name, 'name');

      this.log('Getting product', { name: validatedName });

      return this.createSuccessMessage('Product', 'retrieved', validatedName);
    } catch (error) {
      return this.handleServiceError(error, 'getProduct');
    }
  }
}
