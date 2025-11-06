import { Money } from '../../domain/value-objects';

describe('Money Value Object', () => {
  describe('creation', () => {
    it('should create money with valid amount and currency', () => {
      const money = new Money(100, 'USD');
      expect(money.amount).toBe(100);
      expect(money.currency).toBe('USD');
    });

    it('should throw error for negative amount', () => {
      expect(() => {
        new Money(-10, 'USD');
      }).toThrow('Amount cannot be negative');
    });

    it('should throw error for zero amount', () => {
      expect(() => {
        new Money(0, 'USD');
      }).toThrow('Amount cannot be zero');
    });

    it('should throw error for invalid currency', () => {
      expect(() => {
        new Money(100, 'INVALID' as any);
      }).toThrow('Invalid currency');
    });
  });

  describe('operations', () => {
    it('should add two money objects with same currency', () => {
      const money1 = new Money(50, 'USD');
      const money2 = new Money(30, 'USD');
      const result = money1.add(money2);

      expect(result.amount).toBe(80);
      expect(result.currency).toBe('USD');
    });

    it('should throw error when adding different currencies', () => {
      const money1 = new Money(50, 'USD');
      const money2 = new Money(30, 'EUR');

      expect(() => {
        money1.add(money2);
      }).toThrow('Cannot add different currencies');
    });

    it('should subtract two money objects', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(30, 'USD');
      const result = money1.subtract(money2);

      expect(result.amount).toBe(70);
    });

    it('should multiply money by factor', () => {
      const money = new Money(50, 'USD');
      const result = money.multiply(2);

      expect(result.amount).toBe(100);
    });
  });
});
