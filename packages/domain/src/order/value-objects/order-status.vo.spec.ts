import { OrderStatus, OrderStatusValue } from './order-status.vo';
import { InvalidStateTransitionError } from '../../common/errors/domain.error';

describe('OrderStatus Value Object', () => {
  describe('create', () => {
    it('should create a valid OrderStatus', () => {
      const status = OrderStatus.create(OrderStatusValue.PENDING);
      expect(status.value).toBe(OrderStatusValue.PENDING);
    });

    it('should create pending status', () => {
      const status = OrderStatus.pending();
      expect(status.value).toBe(OrderStatusValue.PENDING);
    });
  });

  describe('canTransitionTo', () => {
    it('should allow PENDING to CONFIRMED transition', () => {
      const pending = OrderStatus.pending();
      const confirmed = OrderStatus.create(OrderStatusValue.CONFIRMED);
      expect(pending.canTransitionTo(confirmed)).toBe(true);
    });

    it('should allow PENDING to CANCELLED transition', () => {
      const pending = OrderStatus.pending();
      const cancelled = OrderStatus.create(OrderStatusValue.CANCELLED);
      expect(pending.canTransitionTo(cancelled)).toBe(true);
    });

    it('should allow CONFIRMED to SHIPPED transition', () => {
      const confirmed = OrderStatus.create(OrderStatusValue.CONFIRMED);
      const shipped = OrderStatus.create(OrderStatusValue.SHIPPED);
      expect(confirmed.canTransitionTo(shipped)).toBe(true);
    });

    it('should not allow DELIVERED to any transition', () => {
      const delivered = OrderStatus.create(OrderStatusValue.DELIVERED);
      const shipped = OrderStatus.create(OrderStatusValue.SHIPPED);
      expect(delivered.canTransitionTo(shipped)).toBe(false);
    });

    it('should not allow PENDING to SHIPPED transition', () => {
      const pending = OrderStatus.pending();
      const shipped = OrderStatus.create(OrderStatusValue.SHIPPED);
      expect(pending.canTransitionTo(shipped)).toBe(false);
    });
  });

  describe('transitionTo', () => {
    it('should transition when valid', () => {
      const pending = OrderStatus.pending();
      const confirmed = OrderStatus.create(OrderStatusValue.CONFIRMED);
      const result = pending.transitionTo(confirmed);
      expect(result.value).toBe(OrderStatusValue.CONFIRMED);
    });

    it('should throw error when invalid transition', () => {
      const pending = OrderStatus.pending();
      const shipped = OrderStatus.create(OrderStatusValue.SHIPPED);
      expect(() => pending.transitionTo(shipped)).toThrow(InvalidStateTransitionError);
    });
  });

  describe('isFinal', () => {
    it('should return true for DELIVERED', () => {
      const delivered = OrderStatus.create(OrderStatusValue.DELIVERED);
      expect(delivered.isFinal()).toBe(true);
    });

    it('should return true for CANCELLED', () => {
      const cancelled = OrderStatus.create(OrderStatusValue.CANCELLED);
      expect(cancelled.isFinal()).toBe(true);
    });

    it('should return true for FAILED', () => {
      const failed = OrderStatus.create(OrderStatusValue.FAILED);
      expect(failed.isFinal()).toBe(true);
    });

    it('should return false for PENDING', () => {
      const pending = OrderStatus.pending();
      expect(pending.isFinal()).toBe(false);
    });
  });

  describe('canBeCancelled', () => {
    it('should return true for PENDING', () => {
      const pending = OrderStatus.pending();
      expect(pending.canBeCancelled()).toBe(true);
    });

    it('should return true for CONFIRMED', () => {
      const confirmed = OrderStatus.create(OrderStatusValue.CONFIRMED);
      expect(confirmed.canBeCancelled()).toBe(true);
    });

    it('should return false for DELIVERED', () => {
      const delivered = OrderStatus.create(OrderStatusValue.DELIVERED);
      expect(delivered.canBeCancelled()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for same status', () => {
      const status1 = OrderStatus.pending();
      const status2 = OrderStatus.pending();
      expect(status1.equals(status2)).toBe(true);
    });

    it('should return false for different status', () => {
      const pending = OrderStatus.pending();
      const confirmed = OrderStatus.create(OrderStatusValue.CONFIRMED);
      expect(pending.equals(confirmed)).toBe(false);
    });
  });
});
