import { DomainEvent } from '@a4co/shared-utils';
import { ProductId } from '../value-objects/product-id.vo';

export class ProductCreatedEvent extends DomainEvent {
  constructor(public readonly productId: ProductId) {
    super();
  }
}
