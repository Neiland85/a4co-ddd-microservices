import { BaseService } from './src/domain/base-classes';

export class ProductService extends BaseService {
  constructor() {
    super('ProductService');
  }

  addProduct(name: string, price: number): string {
    try {
      const validatedName = this.validateRequired(name, 'name');
      const validatedPrice = this.validateRequired(price, 'price');

<<<<<<< HEAD
      this.log(`Creating product: ${validatedName} with price ${validatedPrice}`);

      return `Product created successfully: ${validatedName}`;
=======
      this.log('Creating product', { name, price });

      return this.createSuccessMessage(
        'Product',
        'created',
        `with ${validatedName} and ${validatedPrice}`
      );
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `Error creating product: ${errorMessage}`;
    }
  }

  getProduct(name: string): string {
    try {
<<<<<<< HEAD
      const validatedName = this.validateRequired(name, 'name');

      this.log(`Getting product: ${validatedName}`);

      return `Product retrieved: ${validatedName}`;
=======
      const validatedName = this.validateId(name, 'name');

      this.log('Getting product', { name: validatedName });

      return this.createSuccessMessage('Product', 'retrieved', validatedName);
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `Error getting product: ${errorMessage}`;
    }
  }
}
