"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
console.log('Testing shared-utils imports...');
class TestEntity extends index_1.BaseEntity {
    name;
    constructor(name, id) {
        super(id);
        this.name = name;
    }
}
const entity = new TestEntity('Test Entity');
console.log('✅ BaseEntity works:', entity.id);
class TestValue extends index_1.ValueObject {
    constructor(value) {
        super(value);
    }
}
const valueObj = new TestValue('test-value');
console.log('✅ ValueObject works:', valueObj.value);
const uuid = index_1.UuidUtil.generate();
console.log('✅ UuidUtil works:', uuid);
console.log('✅ ErrorCodes works:', index_1.ErrorCodes.INVALID_CREDENTIALS);
console.log('🎉 All imports are working correctly!');
//# sourceMappingURL=import-test.js.map