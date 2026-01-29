// Temporary IEventBus interface
export interface IEventBus {
  publish(subject: string, event: unknown): Promise<void>;
  subscribe(eventType: string, handler: (event: unknown) => void): void;
}

// Temporary EventSubjects
export const EventSubjects = {
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  PRODUCT_PUBLISHED: 'product.published',
  PRODUCT_PRICE_CHANGED: 'product.price.changed',
  PRODUCT_ARCHIVED: 'product.archived',
  PRODUCT_DISCONTINUED: 'product.discontinued',
} as const;

// Temporary NatsEventBus implementation
export class NatsEventBus implements IEventBus {
  async publish(subject: string, event: unknown): Promise<void> {
    // Temporary implementation
    console.log('Publishing event:', subject, event);
  }

  subscribe(eventType: string, handler: (event: unknown) => void): void {
    // Temporary implementation
    console.log('Subscribing to:', eventType);
  }
}

// Temporary EventHandler type
export type EventHandler = (event: unknown) => void;

// Temporary EventDrivenService interface
export interface EventDrivenService {
  handleEvent(event: unknown): Promise<void>;
}
