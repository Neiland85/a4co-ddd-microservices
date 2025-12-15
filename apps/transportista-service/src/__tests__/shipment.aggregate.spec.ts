import { Shipment, ShipmentStatus } from '../domain/aggregates/shipment.aggregate';

describe('Shipment Aggregate', () => {
  describe('State Transitions', () => {
    it('should create a shipment in PENDING status', () => {
      const shipment = new Shipment(
        '1',
        'order-1',
        'Warehouse A',
        'Customer Address',
        15.5,
      );

      expect(shipment.status).toBe(ShipmentStatus.PENDING);
      expect(shipment.transportistaId).toBeNull();
    });

    it('should transition from PENDING to ASSIGNED', () => {
      const shipment = new Shipment(
        '1',
        'order-1',
        'Warehouse A',
        'Customer Address',
        15.5,
      );

      const eta = new Date();
      shipment.assignTransportista('trans-1', 'John Doe', eta);

      expect(shipment.status).toBe(ShipmentStatus.ASSIGNED);
      expect(shipment.transportistaId).toBe('trans-1');
      expect(shipment.estimatedDeliveryTime).toBe(eta);
    });

    it('should mark as FAILED from any status except DELIVERED', () => {
      const shipment = new Shipment(
        '1',
        'order-1',
        'Warehouse A',
        'Customer Address',
        15.5,
        ShipmentStatus.ASSIGNED,
        'trans-1',
      );

      shipment.markFailed('Customer not available');

      expect(shipment.status).toBe(ShipmentStatus.FAILED);
      expect(shipment.failureReason).toBe('Customer not available');
    });
  });

  describe('Domain Events', () => {
    it('should emit ShipmentCreatedEvent on creation', () => {
      const shipment = new Shipment(
        '1',
        'order-1',
        'Warehouse A',
        'Customer Address',
        15.5,
      );

      const events = shipment.domainEvents;
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('shipment.created.v1');
    });
  });
});
