#!/usr/bin/env node

/**
 * Vite Static File Serving Security Mitigation Script
 * Creates comprehensive protection against static file serving vulnerabilities
 */

const fs = require('fs');
const path = require('path');

class ViteStaticFileServingMitigation {
  constructor() {
    this.baseDir = path.join(__dirname, '..', 'packages', 'shared-utils');
    this.securityDir = path.join(this.baseDir, 'src', 'security');
  }

  /**
   * Main mitigation function
   */
  async mitigate() {
    console.log('🔍 Implementing Vite Static File Serving Security Mitigations...\n');

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

      console.log('✅ Vite Static File Serving mitigation completed successfully!');
      console.log('\n📋 Components created:');
      console.log('  - Path validator for detecting suspicious static file requests');
      console.log('  - Vite protector middleware with access control');
      console.log('  - Safe static file server with whitelist validation');
      console.log('  - ESLint rules for detecting insecure static file serving');
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
      'vite-static-path.validator.ts'
    );
    const validatorCode = fs.readFileSync(
      path.join(__dirname, 'templates', 'vite-static-path.validator.ts'),
      'utf8'
    );
    await fs.promises.writeFile(validatorPath, validatorCode, 'utf8');
    console.log('✅ Created ViteStaticPathValidator');
  }

  async copyProtector() {
    const protectorPath = path.join(
      this.securityDir,
      'middleware',
      'vite-static-file-protector.ts'
    );
    const protectorCode = fs.readFileSync(
      path.join(__dirname, 'templates', 'vite-static-file-protector.ts'),
      'utf8'
    );
    await fs.promises.writeFile(protectorPath, protectorCode, 'utf8');
    console.log('✅ Created ViteStaticFileProtector');
  }

  async copyWrapper() {
    const wrapperPath = path.join(this.securityDir, 'utils', 'safe-vite-static-server.ts');
    const wrapperCode = fs.readFileSync(
      path.join(__dirname, 'templates', 'safe-vite-static-server.ts'),
      'utf8'
    );
    await fs.promises.writeFile(wrapperPath, wrapperCode, 'utf8');
    console.log('✅ Created SafeViteStaticServer wrapper');
  }

  async copyESLintRules() {
    const eslintPath = path.join(__dirname, '..', 'eslint-rules', 'vite-static-rules.js');
    const eslintCode = fs.readFileSync(
      path.join(__dirname, 'templates', 'vite-static-rules.js'),
      'utf8'
    );
    await fs.promises.writeFile(eslintPath, eslintCode, 'utf8');
    console.log('✅ Created ESLint rules for Vite static file security');
  }

  async copyTests() {
    const testPath = path.join(this.securityDir, '__tests__', 'vite-static-file-security.test.ts');
    const testCode = fs.readFileSync(
      path.join(__dirname, 'templates', 'vite-static-file-security.test.ts'),
      'utf8'
    );
    await fs.promises.writeFile(testPath, testCode, 'utf8');
    console.log('✅ Created comprehensive test suite');
  }

  async copyDocumentation() {
    const docsPath = path.join(__dirname, '..', 'docs', 'vite-static-file-serving-mitigation.md');
    const documentation = fs.readFileSync(
      path.join(__dirname, 'templates', 'vite-static-file-serving-mitigation.md'),
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
      packageJson.scripts['test:vite-static-security'] =
        'jest src/security/__tests__/vite-static-file-security.test.ts';
      packageJson.scripts['check:vite-static-security'] =
        'node scripts/check-vite-static-security.js';

      await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log('✅ Updated package.json with security scripts');
    }
  }
}

// Run if called directly
if (require.main === module) {
  const mitigation = new ViteStaticFileServingMitigation();
  mitigation.mitigate().catch(error => {
    console.error('💥 Mitigation failed:', error);
    process.exit(1);
  });
}

module.exports = ViteStaticFileServingMitigation;
