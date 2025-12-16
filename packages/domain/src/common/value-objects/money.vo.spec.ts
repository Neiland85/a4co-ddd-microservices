import { Money } from './money.vo';

describe('Money Value Object', () => {
  describe('create', () => {
    it('should create a valid Money instance', () => {
      const money = Money.create(100, 'EUR');
      expect(money.amount).toBe(100);
      expect(money.currency).toBe('EUR');
    });

    it('should default to EUR currency', () => {
      const money = Money.create(50);
      expect(money.currency).toBe('EUR');
    });

    it('should throw error for negative amount', () => {
      expect(() => Money.create(-10, 'EUR')).toThrow('Amount cannot be negative');
    });

    it('should throw error for invalid currency', () => {
      expect(() => Money.create(100, 'INVALID')).toThrow('Invalid currency: INVALID');
    });

    it('should accept zero amount', () => {
      const money = Money.create(0, 'USD');
      expect(money.amount).toBe(0);
      expect(money.isZero()).toBe(true);
    });
  });

  describe('add', () => {
    it('should add money with same currency', () => {
      const money1 = Money.create(100, 'EUR');
      const money2 = Money.create(50, 'EUR');
      const result = money1.add(money2);
      expect(result.amount).toBe(150);
      expect(result.currency).toBe('EUR');
    });

    it('should throw error when adding different currencies', () => {
      const money1 = Money.create(100, 'EUR');
      const money2 = Money.create(50, 'USD');
      expect(() => money1.add(money2)).toThrow('Cannot add different currencies');
    });
  });

  describe('subtract', () => {
    it('should subtract money with same currency', () => {
      const money1 = Money.create(100, 'EUR');
      const money2 = Money.create(30, 'EUR');
      const result = money1.subtract(money2);
      expect(result.amount).toBe(70);
    });

    it('should throw error when subtracting to negative', () => {
      const money1 = Money.create(50, 'EUR');
      const money2 = Money.create(100, 'EUR');
      expect(() => money1.subtract(money2)).toThrow('Cannot subtract to negative amount');
    });

    it('should throw error when subtracting different currencies', () => {
      const money1 = Money.create(100, 'EUR');
      const money2 = Money.create(30, 'USD');
      expect(() => money1.subtract(money2)).toThrow('Cannot subtract different currencies');
    });
  });

  describe('multiply', () => {
    it('should multiply money by a factor', () => {
      const money = Money.create(50, 'EUR');
      const result = money.multiply(3);
      expect(result.amount).toBe(150);
    });

    it('should throw error for negative factor', () => {
      const money = Money.create(50, 'EUR');
      expect(() => money.multiply(-2)).toThrow('Factor cannot be negative');
    });
  });

  describe('equals', () => {
    it('should return true for equal money', () => {
      const money1 = Money.create(100, 'EUR');
      const money2 = Money.create(100, 'EUR');
      expect(money1.equals(money2)).toBe(true);
    });

    it('should return false for different amounts', () => {
      const money1 = Money.create(100, 'EUR');
      const money2 = Money.create(50, 'EUR');
      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false for different currencies', () => {
      const money1 = Money.create(100, 'EUR');
      const money2 = Money.create(100, 'USD');
      expect(money1.equals(money2)).toBe(false);
    });
  });

  describe('isGreaterThan', () => {
    it('should return true when amount is greater', () => {
      const money1 = Money.create(100, 'EUR');
      const money2 = Money.create(50, 'EUR');
      expect(money1.isGreaterThan(money2)).toBe(true);
    });

    it('should return false when amount is not greater', () => {
      const money1 = Money.create(50, 'EUR');
      const money2 = Money.create(100, 'EUR');
      expect(money1.isGreaterThan(money2)).toBe(false);
    });

    it('should throw error when comparing different currencies', () => {
      const money1 = Money.create(100, 'EUR');
      const money2 = Money.create(50, 'USD');
      expect(() => money1.isGreaterThan(money2)).toThrow('Cannot compare different currencies');
    });
  });

  describe('toPrimitives', () => {
    it('should convert to primitives', () => {
      const money = Money.create(100, 'EUR');
      const primitives = money.toPrimitives();
      expect(primitives).toEqual({ amount: 100, currency: 'EUR' });
    });
  });

  describe('fromPrimitives', () => {
    it('should create from primitives', () => {
      const primitives = { amount: 100, currency: 'EUR' };
      const money = Money.fromPrimitives(primitives);
      expect(money.amount).toBe(100);
      expect(money.currency).toBe('EUR');
    });
  });
});
