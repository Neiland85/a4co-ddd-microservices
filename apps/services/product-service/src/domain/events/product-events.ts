import { DomainEvent } from '@a4co/shared-utils';

export class ProductCreatedEvent extends DomainEvent {
  constructor(productId: string) {
    super(productId, {});
  }
}

export class ProductPublishedEvent extends DomainEvent {
  constructor(productId: string) {
    super(productId, {});
  }
}

export class ProductPriceChangedEvent extends DomainEvent {
  constructor(productId: string) {
    super(productId, {});
  }
}

export class ProductArchivedEvent extends DomainEvent {
  constructor(productId: string) {
    super(productId, {});
  }
}
