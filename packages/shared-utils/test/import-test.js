<<<<<<< HEAD
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const index_1 = require('../index');
=======
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
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
<<<<<<< HEAD
//# sourceMappingURL=import-test.js.map
=======
//# sourceMappingURL=import-test.js.map
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
