import { ValueObject } from '../../src/domain/value-object';

// Create concrete implementations for testing
class TestStringValue extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}

class TestNumberValue extends ValueObject<number> {
  constructor(value: number) {
    super(value);
  }
}

class TestObjectValue extends ValueObject<{ name: string; age: number }> {
  constructor(value: { name: string; age: number }) {
    super(value);
  }
}

describe('ValueObject', () => {
  describe('Constructor and Value Access', () => {
    it('should create value object with string value', () => {
      const stringValue = new TestStringValue('test string');
      expect(stringValue.value).toBe('test string');
    });

    it('should create value object with number value', () => {
      const numberValue = new TestNumberValue(42);
      expect(numberValue.value).toBe(42);
    });

    it('should create value object with object value', () => {
      const objectValue = new TestObjectValue({ name: 'John', age: 30 });
      expect(objectValue.value).toEqual({ name: 'John', age: 30 });
    });

    it('should create value object with null value', () => {
      const nullValue = new TestStringValue(null as any);
      expect(nullValue.value).toBeNull();
    });

    it('should create value object with undefined value', () => {
      const undefinedValue = new TestStringValue(undefined as any);
      expect(undefinedValue.value).toBeUndefined();
    });
  });

  describe('Immutability', () => {
    it('should freeze the value for primitive types', () => {
      const stringValue = new TestStringValue('immutable');
      
      // Attempting to modify should not work (though TypeScript prevents this)
      expect(() => {
        (stringValue as any)._value = 'modified';
      }).not.toThrow();
      
      // Original value should remain unchanged
      expect(stringValue.value).toBe('immutable');
    });

    it('should freeze the value for object types', () => {
      const objectValue = new TestObjectValue({ name: 'John', age: 30 });
      
      // Attempting to modify nested properties should not work
      expect(() => {
        (objectValue.value as any).name = 'Jane';
      }).toThrow();
      
      // Original value should remain unchanged
      expect(objectValue.value).toEqual({ name: 'John', age: 30 });
    });

    it('should handle complex nested objects', () => {
      class NestedObjectValue extends ValueObject<{
        user: { name: string; details: { age: number; active: boolean } };
        tags: string[];
      }> {}

      const complexValue = new NestedObjectValue({
        user: { name: 'John', details: { age: 30, active: true } },
        tags: ['admin', 'user']
      });

      // Should freeze nested objects too
      expect(() => {
        (complexValue.value.user as any).name = 'Jane';
      }).toThrow();

      expect(() => {
        (complexValue.value.tags as any).push('new');
      }).toThrow();
    });
  });

  describe('equals method', () => {
    it('should return true for equal string values', () => {
      const value1 = new TestStringValue('test');
      const value2 = new TestStringValue('test');
      
      expect(value1.equals(value2)).toBe(true);
    });

    it('should return false for different string values', () => {
      const value1 = new TestStringValue('test1');
      const value2 = new TestStringValue('test2');
      
      expect(value1.equals(value2)).toBe(false);
    });

    it('should return true for equal number values', () => {
      const value1 = new TestNumberValue(42);
      const value2 = new TestNumberValue(42);
      
      expect(value1.equals(value2)).toBe(true);
    });

    it('should return false for different number values', () => {
      const value1 = new TestNumberValue(42);
      const value2 = new TestNumberValue(43);
      
      expect(value1.equals(value2)).toBe(false);
    });

    it('should return true for equal object values', () => {
      const value1 = new TestObjectValue({ name: 'John', age: 30 });
      const value2 = new TestObjectValue({ name: 'John', age: 30 });
      
      expect(value1.equals(value2)).toBe(true);
    });

    it('should return false for different object values', () => {
      const value1 = new TestObjectValue({ name: 'John', age: 30 });
      const value2 = new TestObjectValue({ name: 'Jane', age: 30 });
      
      expect(value1.equals(value2)).toBe(false);
    });

    it('should handle null values correctly', () => {
      const value1 = new TestStringValue(null as any);
      const value2 = new TestStringValue(null as any);
      const value3 = new TestStringValue('not null');
      
      expect(value1.equals(value2)).toBe(true);
      expect(value1.equals(value3)).toBe(false);
    });

    it('should handle undefined values correctly', () => {
      const value1 = new TestStringValue(undefined as any);
      const value2 = new TestStringValue(undefined as any);
      const value3 = new TestStringValue('not undefined');
      
      expect(value1.equals(value2)).toBe(true);
      expect(value1.equals(value3)).toBe(false);
    });

    it('should compare objects with different property order as equal', () => {
      class TestComplexValue extends ValueObject<{ a: number; b: string }> {}
      
      const value1 = new TestComplexValue({ a: 1, b: 'test' });
      const value2 = new TestComplexValue({ b: 'test', a: 1 });
      
      expect(value1.equals(value2)).toBe(true);
    });

    it('should handle deeply nested objects', () => {
      class DeepObjectValue extends ValueObject<{
        level1: { level2: { level3: { value: number } } };
      }> {}

      const value1 = new DeepObjectValue({
        level1: { level2: { level3: { value: 42 } } }
      });
      const value2 = new DeepObjectValue({
        level1: { level2: { level3: { value: 42 } } }
      });
      const value3 = new DeepObjectValue({
        level1: { level2: { level3: { value: 43 } } }
      });
      
      expect(value1.equals(value2)).toBe(true);
      expect(value1.equals(value3)).toBe(false);
    });
  });

  describe('toString method', () => {
    it('should return string representation for string values', () => {
      const stringValue = new TestStringValue('test string');
      expect(stringValue.toString()).toBe('test string');
    });

    it('should return string representation for number values', () => {
      const numberValue = new TestNumberValue(42);
      expect(numberValue.toString()).toBe('42');
    });

    it('should return string representation for boolean values', () => {
      class TestBooleanValue extends ValueObject<boolean> {}
      
      const trueValue = new TestBooleanValue(true);
      const falseValue = new TestBooleanValue(false);
      
      expect(trueValue.toString()).toBe('true');
      expect(falseValue.toString()).toBe('false');
    });

    it('should return string representation for object values', () => {
      const objectValue = new TestObjectValue({ name: 'John', age: 30 });
      expect(objectValue.toString()).toBe('[object Object]');
    });

    it('should handle null values', () => {
      const nullValue = new TestStringValue(null as any);
      expect(nullValue.toString()).toBe('null');
    });

    it('should handle undefined values', () => {
      const undefinedValue = new TestStringValue(undefined as any);
      expect(undefinedValue.toString()).toBe('undefined');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const emptyString = new TestStringValue('');
      expect(emptyString.value).toBe('');
      expect(emptyString.toString()).toBe('');
    });

    it('should handle zero number', () => {
      const zeroNumber = new TestNumberValue(0);
      expect(zeroNumber.value).toBe(0);
      expect(zeroNumber.toString()).toBe('0');
    });

    it('should handle empty object', () => {
      class EmptyObjectValue extends ValueObject<{}> {}
      const emptyObject = new EmptyObjectValue({});
      
      expect(emptyObject.value).toEqual({});
      expect(emptyObject.toString()).toBe('[object Object]');
    });

    it('should handle arrays as values', () => {
      class ArrayValue extends ValueObject<string[]> {}
      
      const arrayValue1 = new ArrayValue(['a', 'b', 'c']);
      const arrayValue2 = new ArrayValue(['a', 'b', 'c']);
      const arrayValue3 = new ArrayValue(['a', 'b', 'd']);
      
      expect(arrayValue1.value).toEqual(['a', 'b', 'c']);
      expect(arrayValue1.equals(arrayValue2)).toBe(true);
      expect(arrayValue1.equals(arrayValue3)).toBe(false);
    });

    it('should handle special number values', () => {
      const nanValue = new TestNumberValue(NaN);
      const infinityValue = new TestNumberValue(Infinity);
      const negativeInfinityValue = new TestNumberValue(-Infinity);
      
      expect(isNaN(nanValue.value)).toBe(true);
      expect(infinityValue.value).toBe(Infinity);
      expect(negativeInfinityValue.value).toBe(-Infinity);
      
      expect(nanValue.toString()).toBe('NaN');
      expect(infinityValue.toString()).toBe('Infinity');
      expect(negativeInfinityValue.toString()).toBe('-Infinity');
    });
  });

  describe('Type Safety', () => {
    it('should maintain type safety for value access', () => {
      const stringValue = new TestStringValue('test');
      const numberValue = new TestNumberValue(42);
      const objectValue = new TestObjectValue({ name: 'John', age: 30 });
      
      // TypeScript should ensure these are the correct types
      const str: string = stringValue.value;
      const num: number = numberValue.value;
      const obj: { name: string; age: number } = objectValue.value;
      
      expect(typeof str).toBe('string');
      expect(typeof num).toBe('number');
      expect(typeof obj).toBe('object');
      expect(obj.name).toBe('John');
      expect(obj.age).toBe(30);
    });
  });
});