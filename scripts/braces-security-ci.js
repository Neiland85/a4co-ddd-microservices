#!/usr/bin/env node

/**
 * Script de CI/CD para validación automática de seguridad de braces
 *
 * Este script se ejecuta en el pipeline de CI/CD para validar que
 * no se introduzcan vulnerabilidades de expansión de braces.
 */

const { execSync } = require('child_process');
const path = require('path');

class BracesSecurityCI {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.sharedUtilsPath = path.join(this.projectRoot, 'packages', 'shared-utils');
    this.validateScript = path.join(
      this.sharedUtilsPath,
      'dist',
      'src',
      'security',
      'validate-braces-security.js'
    );
  }

  /**
   * Ejecutar validación completa de seguridad
   */
  async runValidation() {
    console.log('🔒 Braces Security CI/CD Validation');
    console.log('=====================================\n');

    try {
      // 1. Verificar que el script de validación existe
      console.log('📋 Step 1: Checking validation script...');
      if (!require('fs').existsSync(this.validateScript)) {
        throw new Error(`Validation script not found: ${this.validateScript}`);
      }
      console.log('✅ Validation script found\n');

      // 2. Ejecutar validación en todo el proyecto
      console.log('🔍 Step 2: Running braces security scan...');
      const scanCommand = `node "${this.validateScript}" --path "${this.projectRoot}"`;
      const scanOutput = execSync(scanCommand, {
        encoding: 'utf8',
        cwd: this.projectRoot,
        stdio: 'pipe',
      });

      console.log('Scan Output:');
      console.log(scanOutput);

      // Verificar si hay vulnerabilidades críticas
      if (scanOutput.includes('CRITICAL') || scanOutput.includes('HIGH')) {
        console.log(
          '\n❌ SECURITY VIOLATION: Critical or High severity braces vulnerabilities found!'
        );
        console.log('🚫 Blocking deployment due to security risks.');
        process.exit(1);
      }

      console.log('✅ No critical security vulnerabilities found\n');

      // 3. Verificar que los tests de seguridad pasan
      console.log('🧪 Step 3: Running security tests...');
      const testCommand = 'pnpm test --filter=@a4co/shared-utils -- --testPathPattern=braces';
      try {
        execSync(testCommand, {
          encoding: 'utf8',
          cwd: this.projectRoot,
          stdio: 'pipe',
        });
        console.log('✅ Security tests passed\n');
      } catch (error) {
        console.log('❌ Security tests failed!');
        console.log(error.stdout || error.message);
        process.exit(1);
      }

      // 4. Verificar configuración de middleware en servicios
      console.log('🔧 Step 4: Checking middleware integration...');
      await this.checkMiddlewareIntegration();
      console.log('✅ Middleware integration verified\n');

      console.log('🎉 All security checks passed!');
      console.log('🚀 Deployment can proceed safely.');
    } catch (error) {
      console.error('❌ CI/CD Validation Failed:');
      console.error(error.message);
      process.exit(1);
    }
  }

  /**
   * Verificar que el middleware esté integrado en los servicios
   */
  async checkMiddlewareIntegration() {
    const services = [
      'auth-service',
      'user-service',
      'product-service',
      'order-service',
      'payment-service',
    ];

    const fs = require('fs');

    for (const service of services) {
      const mainFile = path.join(this.projectRoot, 'apps', service, 'src', 'main.ts');

      if (!fs.existsSync(mainFile)) {
        console.log(`⚠️  Skipping ${service}: main.ts not found`);
        continue;
      }

      const content = fs.readFileSync(mainFile, 'utf8');

      if (!content.includes('BracesSecurityMiddleware')) {
        throw new Error(`❌ ${service}: BracesSecurityMiddleware not integrated`);
      }

      if (!content.includes('bracesMiddleware.validateRequestBody()')) {
        throw new Error(`❌ ${service}: Request body validation not configured`);
      }

      console.log(`✅ ${service}: Middleware properly integrated`);
    }
  }

  /**
   * Generar reporte de seguridad para el pipeline
   */
  generateSecurityReport() {
    const report = {
      timestamp: new Date().toISOString(),
      status: 'passed',
      checks: ['braces-expansion-scan', 'security-tests', 'middleware-integration'],
      recommendations: [
        'Monitor braces security metrics in production',
        'Set up alerts for security violations',
        'Regular security audits recommended',
      ],
    };

    // Guardar reporte como artifact del CI/CD
    const fs = require('fs');
    const reportPath = path.join(this.projectRoot, 'security-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`📄 Security report saved: ${reportPath}`);
  }
}

// Ejecutar validación si se llama directamente
if (require.main === module) {
  const ci = new BracesSecurityCI();
  ci.runValidation()
    .then(() => {
      ci.generateSecurityReport();
    })
    .catch(error => {
      console.error('CI/CD Validation failed:', error);
      process.exit(1);
    });
}

module.exports = BracesSecurityCI;
