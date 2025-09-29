export class PrototypePollutionValidator {
  static validateObject(obj: any): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];

    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (dangerousKeys.includes(key)) {
          violations.push('Dangerous key found: ' + key);
        }
      });
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