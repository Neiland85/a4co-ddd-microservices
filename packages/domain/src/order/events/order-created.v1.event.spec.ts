import { OrderCreatedV1Event, ORDER_CREATED_V1 } from './order-created.v1.event';

describe('OrderCreatedV1Event', () => {
  it('should create event with correct properties', () => {
    const orderId = 'order-123';
    const customerId = 'customer-456';
    const items = [
      {
        productId: 'prod-1',
        productName: 'Product 1',
        quantity: 2,
        unitPrice: { amount: 50, currency: 'EUR' },
      },
    ];
    const totalAmount = { amount: 100, currency: 'EUR' };
    const sagaId = 'saga-789';

    const event = OrderCreatedV1Event.create(
      orderId,
      customerId,
      items,
      totalAmount,
      sagaId,
    );

    expect(event.eventType).toBe(ORDER_CREATED_V1);
    expect(event.aggregateId).toBe(orderId);
    expect(event.eventVersion).toBe(1);
    expect(event.sagaId).toBe(sagaId);
    expect(event.eventData.orderId).toBe(orderId);
    expect(event.eventData.customerId).toBe(customerId);
    expect(event.eventData.items).toEqual(items);
    expect(event.eventData.totalAmount).toEqual(totalAmount);
    expect(event.eventData.timestamp).toBeDefined();
  });

  it('should create event without sagaId', () => {
    const orderId = 'order-123';
    const customerId = 'customer-456';
    const items: any[] = [];
    const totalAmount = { amount: 0, currency: 'EUR' };

    const event = OrderCreatedV1Event.create(
      orderId,
      customerId,
      items,
      totalAmount,
    );

    expect(event.sagaId).toBeUndefined();
  });

  it('should have versioned event type', () => {
    expect(ORDER_CREATED_V1).toBe('order.created.v1');
  });

  it('should have timestamp in ISO format', () => {
    const event = OrderCreatedV1Event.create(
      'order-123',
      'customer-456',
      [],
      { amount: 0, currency: 'EUR' },
    );

    const timestamp = event.eventData.timestamp;
    expect(timestamp).toBeDefined();
    expect(typeof timestamp).toBe('string');
    expect(() => new Date(timestamp)).not.toThrow();
  });
});
