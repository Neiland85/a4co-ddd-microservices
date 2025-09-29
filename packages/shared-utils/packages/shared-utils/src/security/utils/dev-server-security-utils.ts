/**
 * Utilidades de seguridad para Dev Servers
 * Funciones helper para proteger servidores de desarrollo
 */

import { DevServerValidator } from '../validators/dev-server.validator';

export class DevServerSecurityUtils {
  /**
   * Genera configuración segura para Vite
   */
  static generateSecureViteConfig(): string {
    return `import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '127.0.0.1', // Solo localhost
    port: 3000,
    strictPort: true,
    cors: {
      origin: false, // Deshabilitar CORS en desarrollo
      credentials: false
    },
    https: false, // Usar HTTP en desarrollo local
    open: false, // No abrir automáticamente
    hmr: {
      port: 3001, // Puerto separado para HMR
    }
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true
  }
});`;
  }

  /**
   * Genera configuración segura para Next.js
   */
  static generateSecureNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    // Forzar host local
    env: {
      HOST: '127.0.0.1'
    }
  }),

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Configuración del dev server
  ...(process.env.NODE_ENV === 'development' && {
    devIndicators: {
      buildActivity: false, // Ocultar indicadores de build
    }
  })
};

export default nextConfig;`;
  }

  /**
   * Genera configuración segura para esbuild
   */
  static generateSecureEsbuildConfig(): string {
    return `import * as esbuild from 'esbuild';

const isDev = process.env.NODE_ENV === 'development';

const config = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  sourcemap: isDev,
  minify: !isDev,
  target: 'es2020',

  // Configuración segura del servidor
  ...(isDev && {
    serve: {
      host: '127.0.0.1', // Solo localhost
      port: 3000,
      servedir: 'dist',
      onRequest: (args) => {
        // Log de requests para detección de acceso no autorizado
        if (args.remoteAddress !== '127.0.0.1' && args.remoteAddress !== '::1') {
          console.warn(`⚠️  Request desde IP externa: ${args.remoteAddress} - ${args.method} ${args.path}`);
        }
      }
    }
  })
};

await esbuild.build(config);`;
  }

  /**
   * Genera middleware de protección para dev servers
   */
  static generateDevServerMiddleware(): string {
    return `import { createServer } from 'http';
import { parse } from 'url';

// Middleware de protección para dev servers
function createSecureDevMiddleware(port: number = 3000) {
  return (req, res, next) => {
    const { remoteAddress } = req.socket;

    // Bloquear requests desde IPs externas en desarrollo
    if (process.env.NODE_ENV === 'development') {
      if (remoteAddress !== '127.0.0.1' && remoteAddress !== '::1' && remoteAddress !== '::ffff:127.0.0.1') {
        console.warn(`🚫 Request bloqueado desde IP externa: ${remoteAddress}`);

        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Access denied',
          message: 'Development server only accessible from localhost'
        }));
        return;
      }
    }

    // Headers de seguridad
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    next();
  };
}

export { createSecureDevMiddleware };`;
  }

  /**
   * Genera script de verificación de seguridad
   */
  static generateSecurityCheckScript(): string {
    return `#!/usr/bin/env node

/**
 * Verificación de seguridad para Dev Servers
 * Ejecutar: node scripts/check-dev-security.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de seguridad de Dev Servers...');

const issues = [];

// Verificar procesos corriendo en puertos de desarrollo
try {
  const netstat = execSync('netstat -tulpn 2>/dev/null || ss -tulpn 2>/dev/null || echo "netstat/ss not available"', { encoding: 'utf-8' });

  const devPorts = [3000, 3001, 4000, 5000, 8000, 8080, 9000, 9090];
  const lines = netstat.split('\n');

  for (const line of lines) {
    for (const port of devPorts) {
      if (line.includes(`:${port} `)) {
        // Verificar si está bound a 0.0.0.0
        if (line.includes('0.0.0.0:${port}')) {
          issues.push(`🚨 Puerto ${port} accesible desde cualquier interfaz (0.0.0.0)`);
        }
      }
    }
  }
} catch (error) {
  console.log('⚠️  No se pudo verificar puertos de red');
}

// Verificar archivos de configuración
const configFiles = [
  'vite.config.js',
  'vite.config.ts',
  'next.config.js',
  'next.config.mjs',
  'webpack.config.js',
  'esbuild.config.js'
];

for (const configFile of configFiles) {
  const configPath = path.join(process.cwd(), configFile);
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, 'utf8');

      // Verificar host inseguro
      if (content.includes("host: '0.0.0.0'") || content.includes('host: "0.0.0.0"')) {
        issues.push(`🚨 ${configFile} tiene host 0.0.0.0 (accesible externamente)`);
      }

      // Verificar CORS inseguro
      if (content.includes("origin: '*'") || content.includes('origin: "*"')) {
        issues.push(`🚨 ${configFile} tiene CORS origin wildcard`);
      }
    } catch (error) {
      // Ignorar errores de lectura
    }
  }
}

// Verificar variables de entorno sensibles
const envFiles = ['.env', '.env.local', '.env.development'];
for (const envFile of envFiles) {
  const envPath = path.join(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const sensitivePatterns = [
        /API_KEY=/,
        /SECRET=/,
        /TOKEN=/,
        /PASSWORD=/,
        /DATABASE_URL=/
      ];

      for (const pattern of sensitivePatterns) {
        if (pattern.test(content)) {
          issues.push(`🚨 ${envFile} contiene posibles secrets sensibles`);
          break;
        }
      }
    } catch (error) {
      // Ignorar errores de lectura
    }
  }
}

if (issues.length === 0) {
  console.log('✅ No se encontraron problemas de seguridad evidentes');
} else {
  console.log('\n🚨 Problemas de seguridad encontrados:');
  issues.forEach(issue => console.log(`  ${issue}`));
  console.log('\n💡 Recomendaciones:');
  console.log('  - Configurar host: "127.0.0.1" en dev servers');
  console.log('  - Usar CORS restrictivo en desarrollo');
  console.log('  - No exponer secrets en archivos .env de desarrollo');
  console.log('  - Usar túnel SSH para acceso remoto seguro');
}

process.exit(issues.length > 0 ? 1 : 0);`;
  }

  /**
   * Genera headers de seguridad para dev servers
   */
  static generateSecureHeaders(): Record<string, string> {
    return {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }

  /**
   * Registra evento de seguridad
   */
  static logSecurityEvent(event: {
    type: string;
    ip: string;
    userAgent?: string;
    url?: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    details?: any;
  }): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type: 'dev_server_security',
      event: event.type,
      ip: event.ip,
      userAgent: event.userAgent,
      url: event.url,
      severity: event.severity,
      details: event.details
    };

    console.warn(`🛡️ DEV SERVER SECURITY: ${JSON.stringify(logEntry)}`);

    // En producción, enviar a sistema de logging centralizado
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrar con sistema de logging (Winston, Pino, etc.)
    }
  }
}