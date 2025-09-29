import { BaseEntity, ValueObject, generateId } from './index';

// Test básico para verificar que las importaciones funcionan
describe('Shared Utils Import Test', () => {
  test('should import BaseEntity correctly', () => {
    class TestEntity extends BaseEntity {
      constructor(
        public name: string,
        id?: string,
      ) {
        super(id);
      }
    }

    const entity = new TestEntity('Test Entity');
    expect(entity.id).toBeDefined();
  });

  test('should import ValueObject correctly', () => {
    class TestValue extends ValueObject<string> {
      constructor(value: string) {
        super(value);
      }
    }

    const valueObj = new TestValue('test-value');
    expect(valueObj.value).toBe('test-value');
  });

  test('should import generateId correctly', () => {
    const id = generateId(16);
    expect(id).toHaveLength(16);
  });
});
