#!/usr/bin/env node

/**
 * Micromatch ReDoS Security Mitigation Script
 * Creates comprehensive protection against ReDoS vulnerabilities in micromatch
 */

const fs = require('fs');
const path = require('path');

class MicromatchReDoSMitigation {
  constructor() {
    this.baseDir = path.join(__dirname, '..', 'packages', 'shared-utils');
    this.securityDir = path.join(this.baseDir, 'src', 'security');
  }

  /**
   * Main mitigation function
   */
  async mitigate() {
    console.log('🔍 Implementing Micromatch ReDoS Security Mitigations...\n');

    try {
      // Create security components
      await this.createDirectories();
      await this.copyValidator();
      await this.copyProtector();
      await this.copyWrapper();
      await this.copyESLintRules();
      await this.copyTests();
      await this.copyDocumentation();
      await this.updatePackageJson();

      console.log('✅ Micromatch ReDoS mitigation completed successfully!');
      console.log('\n📋 Components created:');
      console.log('  - Pattern validator for detecting suspicious regex patterns');
      console.log('  - ReDoS protector with timeouts and circuit breakers');
      console.log('  - Safe micromatch wrapper with security controls');
      console.log('  - ESLint rules for detecting insecure pattern usage');
      console.log('  - Comprehensive test suite');
      console.log('  - Security documentation and mitigation guide');
    } catch (error) {
      console.error('❌ Error during mitigation:', error.message);
      process.exit(1);
    }
  }

  async createDirectories() {
    const dirs = [
      path.join(this.securityDir, 'validators'),
      path.join(this.securityDir, 'middleware'),
      path.join(this.securityDir, 'utils'),
      path.join(this.securityDir, '__tests__'),
      path.join(__dirname, '..', 'eslint-rules'),
      path.join(__dirname, '..', 'docs'),
    ];

    for (const dir of dirs) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
  }

  async copyValidator() {
    const validatorPath = path.join(
      this.securityDir,
      'validators',
      'micromatch-pattern.validator.ts'
    );
    const validatorCode = fs.readFileSync(
      path.join(__dirname, 'templates', 'micromatch-pattern.validator.ts'),
      'utf8'
    );
    await fs.promises.writeFile(validatorPath, validatorCode, 'utf8');
    console.log('✅ Created MicromatchPatternValidator');
  }

  async copyProtector() {
    const protectorPath = path.join(
      this.securityDir,
      'middleware',
      'micromatch-redos-protector.ts'
    );
    const protectorCode = fs.readFileSync(
      path.join(__dirname, 'templates', 'micromatch-redos-protector.ts'),
      'utf8'
    );
    await fs.promises.writeFile(protectorPath, protectorCode, 'utf8');
    console.log('✅ Created MicromatchReDoSProtector');
  }

  async copyWrapper() {
    const wrapperPath = path.join(this.securityDir, 'utils', 'safe-micromatch.ts');
    const wrapperCode = fs.readFileSync(
      path.join(__dirname, 'templates', 'safe-micromatch.ts'),
      'utf8'
    );
    await fs.promises.writeFile(wrapperPath, wrapperCode, 'utf8');
    console.log('✅ Created SafeMicromatch wrapper');
  }

  async copyESLintRules() {
    const eslintPath = path.join(__dirname, '..', 'eslint-rules', 'micromatch-rules.js');
    const eslintCode = fs.readFileSync(
      path.join(__dirname, 'templates', 'micromatch-rules.js'),
      'utf8'
    );
    await fs.promises.writeFile(eslintPath, eslintCode, 'utf8');
    console.log('✅ Created ESLint rules for micromatch security');
  }

  async copyTests() {
    const testPath = path.join(this.securityDir, '__tests__', 'micromatch-redos.test.ts');
    const testCode = fs.readFileSync(
      path.join(__dirname, 'templates', 'micromatch-redos.test.ts'),
      'utf8'
    );
    await fs.promises.writeFile(testPath, testCode, 'utf8');
    console.log('✅ Created comprehensive test suite');
  }

  async copyDocumentation() {
    const docsPath = path.join(__dirname, '..', 'docs', 'micromatch-redos-mitigation.md');
    const documentation = fs.readFileSync(
      path.join(__dirname, 'templates', 'micromatch-redos-mitigation.md'),
      'utf8'
    );
    await fs.promises.writeFile(docsPath, documentation, 'utf8');
    console.log('✅ Created comprehensive documentation');
  }

  /**
   * Update package.json with security scripts
   */
  async updatePackageJson() {
    const packageJsonPath = path.join(this.baseDir, 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(await fs.promises.readFile(packageJsonPath, 'utf8'));

      // Add security scripts
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts['test:micromatch-security'] =
        'jest src/security/__tests__/micromatch-redos.test.ts';
      packageJson.scripts['check:micromatch-security'] =
        'node scripts/check-micromatch-security.js';

      await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log('✅ Updated package.json with security scripts');
    }
  }
}

// Run if called directly
if (require.main === module) {
  const mitigation = new MicromatchReDoSMitigation();
  mitigation.mitigate().catch(error => {
    console.error('💥 Mitigation failed:', error);
    process.exit(1);
  });
}

module.exports = MicromatchReDoSMitigation;
