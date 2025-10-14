import { BaseEntity, ValueObject, generateId } from './index';

// Test básico para verificar que las importaciones funcionan
describe('Shared Utils Import Test', () => {
  test('should import BaseEntity correctly', () => {
    class TestEntity extends BaseEntity {
      constructor(
        public name: string,
<<<<<<< HEAD
        id?: string,
=======
        id?: string
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
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
