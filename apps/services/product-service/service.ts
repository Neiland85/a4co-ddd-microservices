import { BaseService } from '@a4co/shared-utils';

export class ProductService extends BaseService {
  constructor() {
    super('ProductService');
  }

  protected log(message: string, meta?: any): void {
    if (typeof super['log'] === 'function') {
      super['log'](message, meta);
    }
    // Si BaseService no tiene log, no hacer nada
  }

  addProduct(name: string, price: number): string {
    try {
      const validatedName = this.validateRequired(name, 'name');
      const validatedPrice = this.validateRequired(price, 'price');

      this.log('Creating product', { name: validatedName, price: validatedPrice });

      return this.createSuccessMessage(
        'Product',
        'created',
        `${validatedName} with price ${validatedPrice}`,
      );
    } catch (error) {
      return this.handleServiceError(error, 'addProduct');
    }
  }

  getProduct(productId: string): string {
    try {
      const validatedId = this.validateId(productId, 'productId');

      this.log('Getting product', { productId: validatedId });

      return this.createSuccessMessage('Product', 'retrieved', validatedId);
    } catch (error) {
      return this.handleServiceError(error, 'getProduct');
    }
  }
}
