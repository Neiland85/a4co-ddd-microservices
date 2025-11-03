export class PrototypePollutionValidator {
  static validateObject(obj: any): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (obj && typeof obj === 'object') {
      // Check if the object has a modified prototype (prototype pollution)
      const objProto = Object.getPrototypeOf(obj);
      if (objProto !== Object.prototype && objProto !== null) {
        violations.push('Object has modified prototype (potential prototype pollution)');
      }

      // Check for dangerous keys in own properties
      const dangerousKeys = ['constructor', 'prototype'];
      const allKeys = Object.getOwnPropertyNames(obj);
      allKeys.forEach(key => {
        if (dangerousKeys.includes(key)) {
          violations.push('Dangerous key found: ' + key);
        }
      });

      // Check if __proto__ was explicitly set as a property
      // This is tricky because { __proto__: value } modifies the prototype, not creates a property
      if (obj.__proto__ !== Object.prototype && obj.__proto__ !== null) {
        violations.push('Object has modified __proto__ (prototype pollution detected)');
      }
    }

    return { isValid: violations.length === 0, violations };
  }

  static sanitizeObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized: any = {};
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

    for (const [key, value] of Object.entries(obj)) {
      if (!dangerousKeys.includes(key)) {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}

export default PrototypePollutionValidator;
