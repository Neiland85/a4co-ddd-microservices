import { PrototypePollutionValidator } from '../validators/prototype-pollution.validator';

export class SafeObjectUtils {
  static safeMerge(target: any, source: any): any {
    const targetValidation = PrototypePollutionValidator.validateObject(target);
    const sourceValidation = PrototypePollutionValidator.validateObject(source);

    if (!targetValidation.isValid || !sourceValidation.isValid) {
      throw new Error('Objects contain dangerous keys');
    }

    return { ...target, ...source };
  }

  static createSecureObject(): any {
    return Object.create(null);
  }

  static secureClone(obj: any): any {
    const validation = PrototypePollutionValidator.validateObject(obj);
    if (!validation.isValid) {
      throw new Error('Object contains dangerous keys');
    }
    return JSON.parse(JSON.stringify(obj));
  }
}

export default SafeObjectUtils;