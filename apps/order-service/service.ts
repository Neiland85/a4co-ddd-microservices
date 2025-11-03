import { BaseService } from '../../packages/shared-utils/src/base';

export class OrderService extends BaseService {
  constructor() {
    super('OrderService');
  }

  createOrder(orderId: string, items: string[]): string {
    try {
      const validatedId = this.validateId(orderId, 'order');
      const validatedItems = this.validateRequired(items, 'items');

      if (validatedItems.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      this.log('Creating order', { orderId: validatedId, itemCount: validatedItems.length });

      return this.createSuccessMessage(
        'Order',
        'created',
        `${validatedId} with items: ${validatedItems.join(', ')}`
      );
    } catch (error) {
      return this.handleServiceError(error, 'createOrder');
    }
  }

  getOrder(orderId: string): string {
    try {
      const validatedId = this.validateId(orderId, 'order');

      this.log('Getting order', { orderId: validatedId });

      return this.createSuccessMessage('Order', 'retrieved', validatedId);
    } catch (error) {
      return this.handleServiceError(error, 'getOrder');
    }
  }
}
