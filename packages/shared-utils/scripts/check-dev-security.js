#!/usr/bin/env node

/**
 * Dev Server Security Check Script
 * Validates dev server security configurations across the monorepo
 */

const fs = require('fs');
const path = require('path');
const { DevServerValidator } = require('../dist/security/validators/dev-server.validator');
const { DevServerSecurityUtils } = require('../dist/security/utils/dev-server-security-utils');

class DevServerSecurityChecker {
  constructor() {
    this.validator = new DevServerValidator();
    this.utils = new DevServerSecurityUtils();
    this.issues = [];
    this.warnings = [];
  }

  /**
   * Main check function
   */
  async check() {
    console.log('🔒 Checking Dev Server Security Configurations...\n');

    try {
      await this.checkPackageJsonConfigs();
      await this.checkViteConfigs();
      await this.checkNextConfigs();
      await this.checkEnvFiles();

      this.printResults();
    } catch (error) {
      console.error('❌ Error during security check:', error.message);
      process.exit(1);
    }
  }

  /**
   * Check package.json scripts for insecure dev commands
   */
  async checkPackageJsonConfigs() {
    console.log('📦 Checking package.json configurations...');

    const packageJsonPaths = [
      path.join(process.cwd(), 'package.json'),
      path.join(process.cwd(), 'packages', 'dashboard-web', 'package.json'),
      path.join(process.cwd(), 'apps', 'dashboard-web', 'package.json'),
    ];

    for (const packagePath of packageJsonPaths) {
      if (fs.existsSync(packagePath)) {
        try {
          const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
          this.checkPackageScripts(packageJson, packagePath);
        } catch (error) {
          this.issues.push(`Failed to parse ${packagePath}: ${error.message}`);
        }
      }
    }
  }

  /**
   * Check package.json scripts for security issues
   */
  checkPackageScripts(packageJson, filePath) {
    const scripts = packageJson.scripts || {};

    for (const [scriptName, scriptCommand] of Object.entries(scripts)) {
      if (scriptName.includes('dev') || scriptName.includes('start')) {
        // Check for insecure host bindings
        if (scriptCommand.includes('--host 0.0.0.0') || scriptCommand.includes('-H 0.0.0.0')) {
          this.issues.push(`${filePath}: Script '${scriptName}' binds to 0.0.0.0 (insecure)`);
        }

        // Check for dangerous ports
        const portMatch =
          scriptCommand.match(/--port\s+(\d+)/) || scriptCommand.match(/-p\s+(\d+)/);
        if (portMatch) {
          const port = parseInt(portMatch[1]);
          if (!this.validator.validatePortConfig(port)) {
            this.issues.push(`${filePath}: Script '${scriptName}' uses insecure port ${port}`);
          }
        }
      }
    }
  }

  /**
   * Check Vite configuration files
   */
  async checkViteConfigs() {
    console.log('⚡ Checking Vite configurations...');

    const viteConfigPaths = [
      'vite.config.ts',
      'vite.config.js',
      'packages/dashboard-web/vite.config.ts',
      'apps/dashboard-web/vite.config.ts',
    ];

    for (const configPath of viteConfigPaths) {
      const fullPath = path.join(process.cwd(), configPath);
      if (fs.existsSync(fullPath)) {
        try {
          // For this check, we'll look for common insecure patterns in the file content
          const content = fs.readFileSync(fullPath, 'utf8');
          this.checkViteConfigContent(content, fullPath);
        } catch (error) {
          this.warnings.push(`Could not check ${fullPath}: ${error.message}`);
        }
      }
    }
  }

  /**
   * Check Vite config content for security issues
   */
  checkViteConfigContent(content, filePath) {
    // Check for insecure host
    if (content.includes("host: '0.0.0.0'") || content.includes('host: "0.0.0.0"')) {
      this.issues.push(`${filePath}: Vite config binds to 0.0.0.0 (insecure)`);
    }

    // Check for wildcard CORS
    if (content.includes('cors: true') || content.includes("cors: '*'")) {
      this.issues.push(`${filePath}: Vite config allows wildcard CORS (insecure)`);
    }
  }

  /**
   * Check Next.js configuration files
   */
  async checkNextConfigs() {
    console.log('▲ Checking Next.js configurations...');

    const nextConfigPaths = [
      'next.config.js',
      'next.config.ts',
      'packages/dashboard-web/next.config.js',
      'apps/dashboard-web/next.config.js',
    ];

    for (const configPath of nextConfigPaths) {
      const fullPath = path.join(process.cwd(), configPath);
      if (fs.existsSync(fullPath)) {
        this.warnings.push(
          `${fullPath}: Next.js config found - manual security review recommended`
        );
      }
    }
  }

  /**
   * Check environment files for security issues
   */
  async checkEnvFiles() {
    console.log('🌍 Checking environment files...');

    const envFiles = [
      '.env',
      '.env.local',
      '.env.development',
      'packages/dashboard-web/.env.local',
      'apps/dashboard-web/.env.local',
    ];

    for (const envFile of envFiles) {
      const fullPath = path.join(process.cwd(), envFile);
      if (fs.existsSync(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          this.checkEnvContent(content, fullPath);
        } catch (error) {
          this.warnings.push(`Could not check ${fullPath}: ${error.message}`);
        }
      }
    }
  }

  /**
   * Check environment file content
   */
  checkEnvContent(content, filePath) {
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        // Check for insecure host settings
        if (trimmed.includes('HOST=0.0.0.0') || trimmed.includes('VITE_HOST=0.0.0.0')) {
          this.issues.push(`${filePath}: Environment sets insecure host 0.0.0.0`);
        }

        // Check for dangerous CORS settings
        if (trimmed.includes('CORS_ORIGIN=*') || trimmed.includes('VITE_CORS_ORIGIN=*')) {
          this.issues.push(`${filePath}: Environment allows wildcard CORS`);
        }
      }
    }
  }

  /**
   * Print check results
   */
  printResults() {
    console.log('\n📊 Security Check Results:');

    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log('✅ No security issues found!');
      console.log('🎉 Your dev server configurations appear secure.');
      return;
    }

    if (this.issues.length > 0) {
      console.log(`\n❌ Security Issues Found (${this.issues.length}):`);
      this.issues.forEach(issue => console.log(`  - ${issue}`));
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.warnings.length}):`);
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    if (this.issues.length > 0) {
      console.log('\n🔧 Recommended Actions:');
      console.log('  1. Change host from 0.0.0.0 to localhost or 127.0.0.1');
      console.log('  2. Use specific CORS origins instead of wildcards');
      console.log('  3. Avoid using privileged ports (80, 443)');
      console.log('  4. Consider using the DevServerSecurityUtils for secure configs');

      process.exit(1);
    }
  }
}

// Run the checker
const checker = new DevServerSecurityChecker();
checker.check().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
