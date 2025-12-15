import { DomainEventBase, EventTypes, IDomainEvent } from '../base/event.base';

class TestEvent extends DomainEventBase<{ message: string }> {
  constructor(message: string, correlationId?: string, metadata?: Record<string, any>) {
    super(EventTypes.ORDER_CREATED_V1, { message }, correlationId, metadata);
  }
}

describe('DomainEventBase', () => {
  describe('constructor', () => {
    it('should create an event with auto-generated eventId', () => {
      const event = new TestEvent('test message');
      
      expect(event.eventId).toBeDefined();
      expect(typeof event.eventId).toBe('string');
      expect(event.eventId.length).toBeGreaterThan(0);
    });

    it('should create an event with provided correlationId', () => {
      const correlationId = 'test-correlation-123';
      const event = new TestEvent('test', correlationId);
      
      expect(event.correlationId).toBe(correlationId);
    });

    it('should create an event with auto-generated correlationId if not provided', () => {
      const event = new TestEvent('test');
      
      expect(event.correlationId).toBeDefined();
      expect(typeof event.correlationId).toBe('string');
      expect(event.correlationId.length).toBeGreaterThan(0);
    });

    it('should set the event type correctly', () => {
      const event = new TestEvent('test');
      
      expect(event.eventType).toBe(EventTypes.ORDER_CREATED_V1);
    });

    it('should set timestamp to current date', () => {
      const beforeCreation = new Date();
      const event = new TestEvent('test');
      const afterCreation = new Date();
      
      expect(event.timestamp).toBeInstanceOf(Date);
      expect(event.timestamp.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(event.timestamp.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });

    it('should include metadata when provided', () => {
      const metadata = { userId: '123', source: 'api' };
      const event = new TestEvent('test', undefined, metadata);
      
      expect(event.metadata).toEqual(metadata);
    });
  });

  describe('toJSON', () => {
    it('should serialize event to JSON with ISO timestamp', () => {
      const message = 'test message';
      const correlationId = 'corr-123';
      const event = new TestEvent(message, correlationId);
      
      const json = event.toJSON();
      
      expect(json).toHaveProperty('eventId', event.eventId);
      expect(json).toHaveProperty('eventType', EventTypes.ORDER_CREATED_V1);
      expect(json).toHaveProperty('correlationId', correlationId);
      expect(json).toHaveProperty('timestamp');
      expect(json).toHaveProperty('data', { message });
      expect(typeof json.timestamp).toBe('string');
      expect(new Date(json.timestamp)).toBeInstanceOf(Date);
    });

    it('should include metadata in JSON when present', () => {
      const metadata = { key: 'value' };
      const event = new TestEvent('test', undefined, metadata);
      
      const json = event.toJSON();
      
      expect(json).toHaveProperty('metadata', metadata);
    });

    it('should not include metadata in JSON when not present', () => {
      const event = new TestEvent('test');
      
      const json = event.toJSON();
      
      expect(json).not.toHaveProperty('metadata');
    });
  });

  describe('fromJSON', () => {
    it('should deserialize event from JSON', () => {
      const json = {
        eventId: 'evt-123',
        eventType: EventTypes.ORDER_CREATED_V1,
        correlationId: 'corr-456',
        timestamp: '2025-01-01T00:00:00.000Z',
        data: { message: 'test' },
      };
      
      const event = DomainEventBase.fromJSON<{ message: string }>(json);
      
      expect(event.eventId).toBe(json.eventId);
      expect(event.eventType).toBe(json.eventType);
      expect(event.correlationId).toBe(json.correlationId);
      expect(event.timestamp).toEqual(new Date(json.timestamp));
      expect(event.data).toEqual(json.data);
    });

    it('should deserialize event with metadata', () => {
      const metadata = { userId: '789' };
      const json = {
        eventId: 'evt-123',
        eventType: EventTypes.ORDER_CREATED_V1,
        correlationId: 'corr-456',
        timestamp: '2025-01-01T00:00:00.000Z',
        data: { message: 'test' },
        metadata,
      };
      
      const event = DomainEventBase.fromJSON<{ message: string }>(json);
      
      expect(event.metadata).toEqual(metadata);
    });
  });

  describe('EventTypes', () => {
    it('should have versioned order event types', () => {
      expect(EventTypes.ORDER_CREATED_V1).toBe('order.created.v1');
      expect(EventTypes.ORDER_CONFIRMED_V1).toBe('order.confirmed.v1');
      expect(EventTypes.ORDER_CANCELLED_V1).toBe('order.cancelled.v1');
      expect(EventTypes.ORDER_FAILED_V1).toBe('order.failed.v1');
    });

    it('should have versioned payment event types', () => {
      expect(EventTypes.PAYMENT_REQUESTED_V1).toBe('payment.requested.v1');
      expect(EventTypes.PAYMENT_CONFIRMED_V1).toBe('payment.confirmed.v1');
      expect(EventTypes.PAYMENT_FAILED_V1).toBe('payment.failed.v1');
      expect(EventTypes.PAYMENT_PROCESSING_V1).toBe('payment.processing.v1');
    });

    it('should have versioned inventory event types', () => {
      expect(EventTypes.INVENTORY_RESERVED_V1).toBe('inventory.reserved.v1');
      expect(EventTypes.INVENTORY_RELEASED_V1).toBe('inventory.released.v1');
      expect(EventTypes.INVENTORY_OUT_OF_STOCK_V1).toBe('inventory.out_of_stock.v1');
    });
  });
});
