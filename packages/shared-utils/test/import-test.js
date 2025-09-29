'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const index_1 = require('../index');
// Test básico para verificar que las importaciones funcionan
console.log('Testing shared-utils imports...');
// Test BaseEntity
class TestEntity extends index_1.BaseEntity {
    name;
    constructor(name, id) {
        super(id);
        this.name = name;
    }
}
const entity = new TestEntity('Test Entity');
console.log('✅ BaseEntity works:', entity.id);
// Test ValueObject
class TestValue extends index_1.ValueObject {
    constructor(value) {
        super(value);
    }
}
const valueObj = new TestValue('test-value');
console.log('✅ ValueObject works:', valueObj.value);
// Test generateId
const uuid = (0, index_1.generateId)(16);
console.log('✅ generateId works:', uuid);
console.log('🎉 All imports are working correctly!');
//# sourceMappingURL=import-test.js.map
