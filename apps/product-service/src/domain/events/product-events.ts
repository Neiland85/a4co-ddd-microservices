import { DomainEvent } from '../base-classes';

export class ProductCreatedEvent extends DomainEvent {
  constructor(
    public aggregateId: string,
    public data: {
      productId: string;
      name: string;
      description: string;
      price: number;
      currency: string;
      categoryId: string;
      artisanId: string;
      craftingTimeHours: number;
      materials: string[];
      isCustomizable: boolean;
      createdAt: Date;
    }
  ) {
    super();
  }

  eventType(): string {
    return 'ProductCreatedEvent';
  }
}

export class ProductUpdatedEvent extends DomainEvent {
  constructor(
    public aggregateId: string,
    public data: {
      productId: string;
      changedFields: string[];
      oldValues: Record<string, any>;
      newValues: Record<string, any>;
      updatedAt: Date;
    }
  ) {
    super();
  }

  eventType(): string {
    return 'ProductUpdatedEvent';
  }
}

export class ProductVariantAddedEvent extends DomainEvent {
  constructor(
    public aggregateId: string,
    public data: {
      productId: string;
      variantId: string;
      variantName: string;
      variantPrice: number;
      attributes: Record<string, string>;
      addedAt: Date;
    }
  ) {
    super();
  }

  eventType(): string {
    return 'ProductVariantAddedEvent';
  }
}

export class ProductDeactivatedEvent extends DomainEvent {
  constructor(
    public aggregateId: string,
    public data: {
      productId: string;
      reason: string;
      deactivatedAt: Date;
    }
  ) {
    super();
  }

  eventType(): string {
    return 'ProductDeactivatedEvent';
  }
}
