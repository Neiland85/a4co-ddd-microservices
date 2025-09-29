import { PrototypePollutionValidator } from '../validators/prototype-pollution.validator';
import { SafeObjectUtils } from '../utils/safe-object.utils';

describe('Lodash Security Mitigations', () => {
  describe('PrototypePollutionValidator', () => {
    it('should detect dangerous __proto__ key', () => {
      const obj = { '__proto__': { polluted: true } };
      const result = PrototypePollutionValidator.validateObject(obj);
      expect(result.isValid).toBe(false);
    });

    it('should allow safe objects', () => {
      const obj = { name: 'John', age: 30 };
      const result = PrototypePollutionValidator.validateObject(obj);
      expect(result.isValid).toBe(true);
    });
  });

  describe('SafeObjectUtils', () => {
    it('should safely merge objects', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      const result = SafeObjectUtils.safeMerge(target, source);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should reject dangerous merge attempts', () => {
      const target = { a: 1 };
      const source = { '__proto__': { polluted: true } };
      expect(() => SafeObjectUtils.safeMerge(target, source)).toThrow();
    });
  });
});