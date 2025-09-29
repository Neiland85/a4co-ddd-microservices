#!/usr/bin/env node

/**
 * Script para integrar middleware de seguridad de braces en todos los microservicios
 */

const fs = require('fs');
const path = require('path');

const services = [
  'auth-service',
  'user-service',
  'product-service',
  'order-service',
  'payment-service',
  'notification-service',
  'analytics-service',
  'chat-service',
  'cms-service',
  'event-service',
  'geo-service',
  'inventory-service',
  'loyalty-service',
  'transportista-service',
];

const BRACES_MIDDLEWARE_IMPORT = `import { BracesSecurityMiddleware } from '@a4co/shared-utils';`;

const BRACES_MIDDLEWARE_SETUP = `  // Braces security middleware
  const bracesMiddleware = new BracesSecurityMiddleware({
    maxExpansionSize: 50,
    maxRangeSize: 10,
    monitoringEnabled: true,
  });
  app.use(bracesMiddleware.validateRequestBody());
  app.use(bracesMiddleware.validateQueryParams());`;

function integrateBracesMiddleware(serviceName) {
  const mainFile = path.join(__dirname, '..', 'apps', serviceName, 'src', 'main.ts');

  if (!fs.existsSync(mainFile)) {
    console.log(`⚠️  Skipping ${serviceName}: main.ts not found`);
    return;
  }

  let content = fs.readFileSync(mainFile, 'utf8');

  // Check if already integrated
  if (content.includes('BracesSecurityMiddleware')) {
    console.log(`✅ ${serviceName}: Already has braces middleware`);
    return;
  }

  // Add import after helmet import
  if (content.includes("import helmet from 'helmet';")) {
    content = content.replace(
      "import helmet from 'helmet';\nimport { AuthModule } from './auth.module';",
      "import helmet from 'helmet';\nimport { AuthModule } from './auth.module';\n" +
        BRACES_MIDDLEWARE_IMPORT
    );
  } else if (content.includes("import helmet from 'helmet';")) {
    content = content.replace(
      "import helmet from 'helmet';",
      "import helmet from 'helmet';\n" + BRACES_MIDDLEWARE_IMPORT
    );
  }

  // Add middleware setup after helmet setup
  if (content.includes('crossOriginEmbedderPolicy: false,')) {
    const helmetEndIndex = content.indexOf('crossOriginEmbedderPolicy: false,') + 100;
    const nextLines = content.substring(helmetEndIndex, helmetEndIndex + 200);
    const closingParenIndex = nextLines.indexOf('  );');

    if (closingParenIndex !== -1) {
      const insertPoint = helmetEndIndex + closingParenIndex + 4;
      content =
        content.slice(0, insertPoint) +
        '\n\n' +
        BRACES_MIDDLEWARE_SETUP +
        content.slice(insertPoint);
    }
  }

  fs.writeFileSync(mainFile, content);
  console.log(`✅ ${serviceName}: Braces middleware integrated`);
}

console.log('🔧 Integrating Braces Security Middleware in all services...\n');

services.forEach(integrateBracesMiddleware);

console.log('\n🎉 Braces security middleware integration completed!');
console.log('📋 Next steps:');
console.log('1. Test each service to ensure middleware works correctly');
console.log('2. Update service documentation');
console.log('3. Configure monitoring and alerting');
