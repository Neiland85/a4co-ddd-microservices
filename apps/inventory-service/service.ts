import { BaseService } from '../../packages/shared-utils/src/base';

export class InventoryService extends BaseService {
  constructor() {
    super('InventoryService');
  }

  updateStock(productId: string, quantity: number): string {
    try {
      const validatedProductId = this.validateId(productId, 'inventory');
      const validatedQuantity = this.validateRequired(quantity, 'quantity');

      this.log('Updating inventory', { productId, quantity });

      return this.createSuccessMessage(
        'Inventory',
        'updated',
        `${validatedProductId} to ${validatedQuantity}`,
      );
    } catch (error) {
      return this.handleServiceError(error, 'updateStock');
    }
  }

  getStock(productId: string): string {
    try {
      const validatedProductId = this.validateId(productId, 'productId');

      this.log('Getting inventory', { productId: validatedProductId });

      return this.createSuccessMessage('Inventory', 'retrieved', validatedProductId);
    } catch (error) {
      return this.handleServiceError(error, 'getStock');
    }
  }
}
