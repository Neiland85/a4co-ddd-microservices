export class CommandInjectionValidator {
  static validateString(input: string): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];
    const dangerousPatterns = [/eval\s*\(/, /Function\s*\(/, /setTimeout\s*\(/];

    if (typeof input === 'string') {
      dangerousPatterns.forEach((pattern, index) => {
        if (pattern.test(input)) {
          violations.push('Dangerous pattern ' + (index + 1) + ' found');
        }
      });
    }

    return { isValid: violations.length === 0, violations };
  }

  static sanitizeString(input: string): string {
    if (typeof input !== 'string') return input;

    return input.replace(/<script[^>]*>.*?<\/script>/gi, '');
  }
}

export default CommandInjectionValidator;