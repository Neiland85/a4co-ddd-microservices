import { BaseEntity, ValueObject, UuidUtil, ErrorCodes } from '../index';

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

// Test UuidUtil
const uuid = UuidUtil.generate();
console.log('✅ UuidUtil works:', uuid);

// Test ErrorCodes
console.log('✅ ErrorCodes works:', ErrorCodes.INVALID_CREDENTIALS);

console.log('🎉 All imports are working correctly!');
