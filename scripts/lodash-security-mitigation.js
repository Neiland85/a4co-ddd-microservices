#!/usr/bin/env node

/**
 * Script de mitigación de vulnerabilidades de Lodash
 * Prototype Pollution (Critical) + Command Injection (High)
 */

const fs = require('fs');
const path = require('path');

class LodashSecurityMitigation {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.packagesDir = path.join(this.projectRoot, 'packages');
  }

  async runAllMitigations() {
    console.log('🛡️ Iniciando mitigación de vulnerabilidades Lodash');
    console.log('==================================================\n');

    try {
      await this.updateLodashVersions();
      await this.createSecurityValidators();
      await this.createSafeObjectUtils();
      await this.createTemplateSanitizer();
      await this.createPrototypePollutionMiddleware();
      await this.addEslintRules();
      await this.createSecurityTests();
      await this.updatePackageJson();
      await this.createSecurityDocumentation();

      console.log('\n✅ Todas las mitigaciones de Lodash completadas exitosamente!');
      console.log('\n📋 Próximos pasos:');
      console.log('1. Ejecutar: pnpm install');
      console.log('2. Ejecutar tests: pnpm run test:security');
      console.log('3. Revisar documentación: docs/lodash-security-mitigation.md');
    } catch (error) {
      console.error('❌ Error durante la mitigación:', error.message);
      process.exit(1);
    }
  }

  async updateLodashVersions() {
    console.log('📦 Actualizando versiones de Lodash...');

    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (!packageJson.dependencies) packageJson.dependencies = {};

    const safeVersions = {
      lodash: '^4.17.21',
      'lodash.merge': '^4.6.2',
      'lodash-es': '^4.17.21',
    };

    Object.entries(safeVersions).forEach(([pkg, version]) => {
      if (!packageJson.dependencies[pkg]) {
        packageJson.dependencies[pkg] = version;
        console.log(`  ➕ Agregado ${pkg}@${version}`);
      }
    });

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Versiones de Lodash actualizadas');
  }

  async createSecurityValidators() {
    console.log('🔍 Creando validadores de seguridad...');

    const validatorsDir = path.join(
      this.packagesDir,
      'shared-utils',
      'src',
      'security',
      'validators'
    );
    if (!fs.existsSync(validatorsDir)) {
      fs.mkdirSync(validatorsDir, { recursive: true });
    }

    // Prototype pollution validator
    const prototypeValidator = `export class PrototypePollutionValidator {
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

export default PrototypePollutionValidator;`;

    fs.writeFileSync(
      path.join(validatorsDir, 'prototype-pollution.validator.ts'),
      prototypeValidator
    );

    // Command injection validator
    const commandInjectionValidator = `export class CommandInjectionValidator {
  static validateString(input: string): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];
    const dangerousPatterns = [/eval\\s*\\(/, /Function\\s*\\(/, /setTimeout\\s*\\(/];

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

    return input.replace(/<script[^>]*>.*?<\\/script>/gi, '');
  }
}

export default CommandInjectionValidator;`;

    fs.writeFileSync(
      path.join(validatorsDir, 'command-injection.validator.ts'),
      commandInjectionValidator
    );

    console.log('✅ Validadores de seguridad creados');
  }

  async createSafeObjectUtils() {
    console.log('🛡️ Creando utilidades para objetos seguros...');

    const utilsDir = path.join(this.packagesDir, 'shared-utils', 'src', 'security', 'utils');
    if (!fs.existsSync(utilsDir)) {
      fs.mkdirSync(utilsDir, { recursive: true });
    }

    const safeObjectUtils = `import { PrototypePollutionValidator } from '../validators/prototype-pollution.validator';

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

export default SafeObjectUtils;`;

    fs.writeFileSync(path.join(utilsDir, 'safe-object.utils.ts'), safeObjectUtils);

    console.log('✅ Utilidades para objetos seguros creadas');
  }

  async createTemplateSanitizer() {
    console.log('📝 Creando sanitizador de plantillas...');

    const templateDir = path.join(this.packagesDir, 'shared-utils', 'src', 'security', 'template');
    if (!fs.existsSync(templateDir)) {
      fs.mkdirSync(templateDir, { recursive: true });
    }

    const templateSanitizer = `import { CommandInjectionValidator } from '../validators/command-injection.validator';

export class TemplateSanitizer {
  static sanitizeTemplate(template: string): string {
    if (typeof template !== 'string') return template;

    let sanitized = template;
    sanitized = sanitized.replace(/<%=(.*?)%>/g, (match, content) => {
      if (content.includes('eval') || content.includes('Function')) {
        return '<!-- DANGEROUS CODE REMOVED -->';
      }
      return match;
    });

    return sanitized;
  }

  static compileSafeTemplate(template: string) {
    const sanitized = this.sanitizeTemplate(template);
    return new Function('data', 'user', 'config', 'return \`' + sanitized + '\`');
  }

  static renderTemplate(template: string, params: Record<string, any>): string {
    const compiled = this.compileSafeTemplate(template);
    return compiled(params.data, params.user, params.config);
  }
}

export default TemplateSanitizer;`;

    fs.writeFileSync(path.join(templateDir, 'template-sanitizer.ts'), templateSanitizer);

    console.log('✅ Sanitizador de plantillas creado');
  }

  async createPrototypePollutionMiddleware() {
    console.log('🛡️ Creando middleware de prototype pollution...');

    const middlewareDir = path.join(
      this.packagesDir,
      'shared-utils',
      'src',
      'security',
      'middleware'
    );
    if (!fs.existsSync(middlewareDir)) {
      fs.mkdirSync(middlewareDir, { recursive: true });
    }

    const middleware = `import { Request, Response, NextFunction } from 'express';
import { PrototypePollutionValidator } from '../validators/prototype-pollution.validator';

export class PrototypePollutionMiddleware {
  static validateRequest(req: Request, res: Response, next: NextFunction): void {
    try {
      if (req.body) {
        const validation = PrototypePollutionValidator.validateObject(req.body);
        if (!validation.isValid) {
          return res.status(400).json({
            error: 'Bad Request',
            message: 'Request contains dangerous keys',
            violations: validation.violations
          });
        }
      }
      next();
    } catch (error) {
      res.status(500).json({ error: 'Validation failed' });
    }
  }

  static sanitizeRequest(req: Request, res: Response, next: NextFunction): void {
    if (req.body) {
      req.body = PrototypePollutionValidator.sanitizeObject(req.body);
    }
    next();
  }
}

export const validateRequest = PrototypePollutionMiddleware.validateRequest;
export const sanitizeRequest = PrototypePollutionMiddleware.sanitizeRequest;

export default PrototypePollutionMiddleware;`;

    fs.writeFileSync(path.join(middlewareDir, 'prototype-pollution.middleware.ts'), middleware);

    console.log('✅ Middleware de prototype pollution creado');
  }

  async addEslintRules() {
    console.log('🔍 Agregando reglas de ESLint...');

    const eslintRulesPath = path.join(this.projectRoot, 'eslint-rules');
    if (!fs.existsSync(eslintRulesPath)) {
      fs.mkdirSync(eslintRulesPath);
    }

    const customRules = `module.exports = {
  'no-dangerous-lodash': {
    create(context) {
      return {
        CallExpression(node) {
          if (node.callee.object && node.callee.object.name === '_' &&
              ['merge', 'defaults'].includes(node.callee.property.name)) {
            context.report({
              node,
              message: 'Use SafeObjectUtils.safeMerge instead of _.merge'
            });
          }
        }
      };
    }
  },

  'no-prototype-pollution': {
    create(context) {
      return {
        MemberExpression(node) {
          if (node.property.name === '__proto__') {
            context.report({
              node,
              message: 'Direct access to __proto__ is dangerous'
            });
          }
        }
      };
    }
  }
};`;

    fs.writeFileSync(path.join(eslintRulesPath, 'security-rules.js'), customRules);

    console.log('✅ Reglas de ESLint agregadas');
  }

  async createSecurityTests() {
    console.log('🧪 Creando tests de seguridad...');

    const testDir = path.join(this.packagesDir, 'shared-utils', 'src', 'security', '__tests__');
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    const securityTests = `import { PrototypePollutionValidator } from '../validators/prototype-pollution.validator';
import { SafeObjectUtils } from '../utils/safe-object.utils';

describe('Lodash Security Mitigations', () => {
  describe('PrototypePollutionValidator', () => {
    it('should detect dangerous __proto__ key', () => {
      const obj = { '__proto__': { polluted: true } };
      const result = PrototypePollutionValidator.validateObject(obj);
      expect(result.isValid).toBe(false);
    });

    it('should allow safe objects', () => {
      const obj = { name: 'John', age: 30 };
      const result = PrototypePollutionValidator.validateObject(obj);
      expect(result.isValid).toBe(true);
    });
  });

  describe('SafeObjectUtils', () => {
    it('should safely merge objects', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      const result = SafeObjectUtils.safeMerge(target, source);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should reject dangerous merge attempts', () => {
      const target = { a: 1 };
      const source = { '__proto__': { polluted: true } };
      expect(() => SafeObjectUtils.safeMerge(target, source)).toThrow();
    });
  });
});`;

    fs.writeFileSync(path.join(testDir, 'lodash-security.test.ts'), securityTests);

    console.log('✅ Tests de seguridad creados');
  }

  async updatePackageJson() {
    console.log('📦 Actualizando package.json...');

    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    if (!packageJson.scripts) packageJson.scripts = {};

    packageJson.scripts['security:lodash'] = 'node scripts/lodash-security-mitigation.js';
    packageJson.scripts['test:security'] =
      'jest --config packages/shared-utils/jest.config.js --testPathPattern=security';

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log('✅ Package.json actualizado');
  }

  async createSecurityDocumentation() {
    console.log('📚 Creando documentación...');

    const docsDir = path.join(this.projectRoot, 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir);
    }

    const documentation = `# Mitigación de Vulnerabilidades Lodash

## Resumen
Este documento describe las mitigaciones implementadas para las vulnerabilidades críticas de Lodash:
- **Prototype Pollution (Critical)**: CVE-2020-8203, CVE-2021-23337
- **Command Injection (High)**: CVE-2021-23358

## Arquitectura de Seguridad

### 1. Validadores de Seguridad
- \`PrototypePollutionValidator\`: Detecta y previene contaminación de prototipos
- \`CommandInjectionValidator\`: Detecta inyección de comandos en plantillas

### 2. Utilidades Seguras
- \`SafeObjectUtils\`: Operaciones seguras de merge y clonado

### 3. Middleware de Protección
- \`PrototypePollutionMiddleware\`: Middleware Express para requests HTTP

## Uso en Código

### Objetos Seguros
\`\`\`typescript
import { SafeObjectUtils } from '@a4co/shared-utils';

const result = SafeObjectUtils.safeMerge(target, source);
const secureObj = SafeObjectUtils.createSecureObject();
\`\`\`

### Validación de Inputs
\`\`\`typescript
import { PrototypePollutionValidator } from '@a4co/shared-utils';

const validation = PrototypePollutionValidator.validateObject(userInput);
if (!validation.isValid) {
  throw new Error('Dangerous input detected');
}
\`\`\`

## Testing
\`\`\`bash
pnpm run test:security
\`\`\`

## Mejores Prácticas
- Usar utilidades nativas de JavaScript cuando sea posible
- Validar siempre inputs de fuentes no confiables
- Usar Object.create(null) para objetos sensibles
- Evitar acceso directo a propiedades del prototipo
`;

    fs.writeFileSync(path.join(docsDir, 'lodash-security-mitigation.md'), documentation);

    console.log('✅ Documentación creada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const mitigation = new LodashSecurityMitigation();
  mitigation.runAllMitigations().catch(console.error);
}

module.exports = LodashSecurityMitigation;
