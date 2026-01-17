export abstract class ProductDomainEvent {
  readonly occurredAt = new Date();
}

export class ProductCreatedEvent extends ProductDomainEvent {
  constructor(public readonly productId: string) {
    super();
  }
}

export class ProductPublishedEvent extends ProductDomainEvent {
  constructor(public readonly productId: string) {
    super();
  }
}
