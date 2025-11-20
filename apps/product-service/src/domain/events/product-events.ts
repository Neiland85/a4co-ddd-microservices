import { DomainEvent } from '@a4co/shared-utils';

export class ProductCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    data: {
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
    },
  ) {
    super(aggregateId, data);
  }
}

export class ProductUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    data: {
      productId: string;
      changedFields: string[];
      oldValues: Record<string, any>;
      newValues: Record<string, any>;
      updatedAt: Date;
    },
  ) {
    super(aggregateId, data);
  }
}

export class ProductVariantAddedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    data: {
      productId: string;
      variantId: string;
      variantName: string;
      variantPrice: number;
      attributes: Record<string, string>;
      addedAt: Date;
    },
  ) {
    super(aggregateId, data);
  }
}

export class ProductDeactivatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    data: {
      productId: string;
      reason: string;
      deactivatedAt: Date;
    },
  ) {
    super(aggregateId, data);
  }
}
