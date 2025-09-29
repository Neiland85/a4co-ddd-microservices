export class PrototypePollutionValidator {
  static validateObject(obj: any): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];
    const dangerousKeys = ['constructor', 'prototype'];

    if (obj && typeof obj === 'object') {
      // Check all property names (including non-enumerable)
      const allProps = Object.getOwnPropertyNames(obj);
      allProps.forEach(prop => {
        if (dangerousKeys.includes(prop)) {
          violations.push('Dangerous key found: ' + prop);
        }
      });

      // Special check for __proto__ pollution
      // If the object's prototype is not Object.prototype, it might be polluted
      try {
        if (obj.__proto__ && obj.__proto__ !== Object.prototype) {
          violations.push('Dangerous prototype detected');
        }
      } catch (e) {
        // Ignore errors when accessing __proto__
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
