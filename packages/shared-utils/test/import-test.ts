import { BaseEntity, ValueObject, generateId } from '../index';

// Test básico para verificar que las importaciones funcionan
console.log('Testing shared-utils imports...');

// Test BaseEntity
class TestEntity extends BaseEntity {
  constructor(
    public name: string,
    id?: string
  ) {
    super(id);
  }
}

const entity = new TestEntity('Test Entity');
console.log('✅ BaseEntity works:', entity.id);

// Test ValueObject
class TestValue extends ValueObject<string> {
  constructor(value: string) {
    super(value);
  }
}

const valueObj = new TestValue('test-value');
console.log('✅ ValueObject works:', valueObj.value);

// Test generateId
const uuid = generateId(16);
console.log('✅ generateId works:', uuid);

console.log('🎉 All imports are working correctly!');
