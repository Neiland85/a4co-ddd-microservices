import { BaseService } from './src/domain/base-classes';

export class ProductService extends BaseService {
  constructor() {
    super('ProductService');
  }

  addProduct(name: string, price: number): string {
    try {
      const validatedName = this.validateRequired(name, 'name');
      const validatedPrice = this.validateRequired(price, 'price');

      this.log(`Creating product: ${validatedName} with price ${validatedPrice}`);

      return `Product created successfully: ${validatedName}`;
    } catch (error) {
      return `Error creating product: ${error.message}`;
    }
  }

  getProduct(name: string): string {
    try {
      const validatedName = this.validateRequired(name, 'name');

      this.log(`Getting product: ${validatedName}`);

      return `Product retrieved: ${validatedName}`;
    } catch (error) {
      return `Error getting product: ${error.message}`;
    }
  }
}
