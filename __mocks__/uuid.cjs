/**
 * UUID Mock for Jest Testing
 * This mock provides a CommonJS-compatible version of uuid functions
 */

function v4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function v1() {
  return v4(); // Simplified implementation
}

function v5(name, namespace) {
  return v4(); // Simplified implementation
}

function validate(uuid) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

function version(uuid) {
  return parseInt(uuid.charAt(14), 16);
}

const NIL = '00000000-0000-0000-0000-000000000000';
const MAX = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

module.exports = {
  v4,
  v1,
  v5,
  validate,
  version,
  NIL,
  MAX,
  default: { v4, v1, v5, validate, version, NIL, MAX },
};
