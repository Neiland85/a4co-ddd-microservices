#!/usr/bin/env node

/**
 * Script para generar package.json faltantes en microservicios
 * Basado en el patrón estándar del monorepo A4CO
 */

const fs = require('fs');
const path = require('path');

// Configuración de microservicios
const microservices = [
  'user-service',
  'inventory-service',
  'payment-service',
  'notification-service',
  'loyalty-service',
  'geo-service',
  'event-service',
  'cms-service',
  'chat-service',
  'analytics-service',
  'admin-service',
  'artisan-service'
];

// Template para microservicios NestJS
const nestjsTemplate = (name, description) => ({
  name: `@a4co/${name}`,
  version: "1.0.0",
  description: description,
  main: "dist/main.js",
  scripts: {
    "build": "nest build",
    "dev": "nest start --watch",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix",
    "lint:fix": "eslint \"{src,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "clean": "rm -rf dist"
  },
  dependencies: {
    "@a4co/shared-utils": "workspace:*",
    "@nestjs/common": "^10.3.3",
    "@nestjs/core": "^10.3.3",
    "@nestjs/platform-express": "^10.3.3",
    "@nestjs/swagger": "^7.3.0",
    "@nestjs/config": "^3.2.0",
    "@prisma/client": "^5.10.2",
    "class-validator": "^0.14.1",
    "class-transformer": "^0.5.1",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1",
    "swagger-ui-express": "^5.0.0"
  },
  devDependencies: {
    "@nestjs/cli": "^10.3.2",
    "@nestjs/schematics": "^10.1.1",
    "@nestjs/testing": "^10.3.3",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.12",
    "@types/node": "^20.11.24",
    "@types/supertest": "^6.0.2",
    "jest": "^29.7.0",
    "prisma": "^5.10.2",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.4",
    "ts-jest": "^29.1.2",
    "ts-loader": "^9.5.1",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.9.2"
  }
});

// Template para aplicaciones Next.js
const nextjsTemplate = (name, description) => ({
  name: `@a4co/${name}`,
  version: "1.0.0",
  description: description,
  private: true,
  scripts: {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next"
  },
  dependencies: {
    "@a4co/design-system": "workspace:*",
    "@a4co/shared-utils": "workspace:*",
    "@hookform/resolvers": "^5.2.1",
    "@radix-ui/react-accordion": "1.2.2",
    "@radix-ui/react-avatar": "1.1.2",
    "@radix-ui/react-dialog": "1.1.4",
    "@radix-ui/react-dropdown-menu": "2.1.4",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-separator": "1.1.1",
    "@radix-ui/react-slot": "^1.2.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.454.0",
    "next": "^15.4.5",
    "next-themes": "^0.4.4",
    "react": "^19.1.0",
    "react-dom": "^19",
    "react-hook-form": "^7.62.0",
    "tailwind-merge": "^2.5.5",
    "zod": "^3.24.1"
  },
  devDependencies: {
    "@types/node": "^22",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.20",
    "eslint": "^9",
    "eslint-config-next": "15.4.1",
    "postcss": "^8.5",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.9.2"
  }
});

// Mapeo de servicios a templates
const serviceTemplates = {
  'user-service': { template: 'nestjs', description: 'Servicio de usuarios para a4co-ddd-microservices' },
  'inventory-service': { template: 'nestjs', description: 'Servicio de inventario para a4co-ddd-microservices' },
  'payment-service': { template: 'nestjs', description: 'Servicio de pagos para a4co-ddd-microservices' },
  'notification-service': { template: 'nestjs', description: 'Servicio de notificaciones para a4co-ddd-microservices' },
  'loyalty-service': { template: 'nestjs', description: 'Servicio de fidelización para a4co-ddd-microservices' },
  'geo-service': { template: 'nestjs', description: 'Servicio geográfico para a4co-ddd-microservices' },
  'event-service': { template: 'nestjs', description: 'Servicio de eventos para a4co-ddd-microservices' },
  'cms-service': { template: 'nestjs', description: 'Servicio CMS para a4co-ddd-microservices' },
  'chat-service': { template: 'nestjs', description: 'Servicio de chat para a4co-ddd-microservices' },
  'analytics-service': { template: 'nestjs', description: 'Servicio de analíticas para a4co-ddd-microservices' },
  'admin-service': { template: 'nestjs', description: 'Servicio de administración para a4co-ddd-microservices' },
  'artisan-service': { template: 'nestjs', description: 'Servicio de artesanos para a4co-ddd-microservices' }
};

function generatePackageJson(serviceName) {
  const servicePath = path.join(__dirname, '..', 'apps', serviceName);
  const packagePath = path.join(servicePath, 'package.json');
  
  // Verificar si ya existe
  if (fs.existsSync(packagePath)) {
    console.log(`⚠️  ${serviceName}: package.json ya existe, saltando...`);
    return;
  }
  
  // Verificar si el directorio existe
  if (!fs.existsSync(servicePath)) {
    console.log(`⚠️  ${serviceName}: directorio no encontrado, saltando...`);
    return;
  }
  
  const config = serviceTemplates[serviceName];
  if (!config) {
    console.log(`⚠️  ${serviceName}: template no encontrado, saltando...`);
    return;
  }
  
  let packageContent;
  if (config.template === 'nestjs') {
    packageContent = nestjsTemplate(serviceName, config.description);
  } else if (config.template === 'nextjs') {
    packageContent = nextjsTemplate(serviceName, config.description);
  }
  
  // Crear directorio si no existe
  if (!fs.existsSync(servicePath)) {
    fs.mkdirSync(servicePath, { recursive: true });
  }
  
  // Escribir package.json
  fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));
  console.log(`✅ ${serviceName}: package.json generado`);
  
  // Crear tsconfig.json si no existe
  const tsconfigPath = path.join(servicePath, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    const tsconfigContent = {
      "extends": "../tsconfig.base.json",
      "compilerOptions": {
        "outDir": "./dist",
        "rootDir": "./src"
      },
      "include": [
        "src/**/*",
        "test/**/*"
      ],
      "exclude": [
        "node_modules",
        "dist",
        "coverage"
      ]
    };
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfigContent, null, 2));
    console.log(`✅ ${serviceName}: tsconfig.json generado`);
  }
  
  // Crear jest.config.js si no existe
  const jestConfigPath = path.join(servicePath, 'jest.config.js');
  if (!fs.existsSync(jestConfigPath)) {
    const jestConfigContent = `module.exports = {
  ...require('../jest.config.base.js'),
  displayName: '${serviceName}'
};`;
    fs.writeFileSync(jestConfigPath, jestConfigContent);
    console.log(`✅ ${serviceName}: jest.config.js generado`);
  }
}

function main() {
  console.log('🚀 Generando package.json para microservicios...\n');
  
  microservices.forEach(serviceName => {
    generatePackageJson(serviceName);
  });
  
  console.log('\n✨ Proceso completado!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Ejecutar: pnpm install');
  console.log('2. Ejecutar: pnpm run build');
  console.log('3. Ejecutar: pnpm run test');
}

if (require.main === module) {
  main();
}

module.exports = { generatePackageJson, microservices };
