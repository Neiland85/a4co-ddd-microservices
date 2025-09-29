/**
 * Dev Server Security Utilities
 * Provides secure configuration generators for various dev server frameworks
 */

export interface ViteConfig {
  server?: {
    host?: string;
    port?: number;
    cors?:
      | boolean
      | {
          origin?: string | string[];
          credentials?: boolean;
        };
    headers?: Record<string, string>;
  };
}

export interface NextConfig {
  headers?: () => Array<{
    source: string;
    headers: Array<{ key: string; value: string }>;
  }>;
}

export class DevServerSecurityUtils {
  /**
   * Generates secure Vite development server configuration
   */
  generateSecureViteConfig(): ViteConfig {
    return {
      server: {
        host: 'localhost',
        port: 3000,
        cors: {
          origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
          credentials: false,
        },
        headers: this.generateSecureHeaders(),
      },
    };
  }

  /**
   * Generates secure Next.js configuration
   */
  generateSecureNextConfig(): NextConfig {
    return {
      headers: () => [
        {
          source: '/(.*)',
          headers: Object.entries(this.generateSecureHeaders()).map(([key, value]) => ({
            key,
            value,
          })),
        },
      ],
    };
  }

  /**
   * Generates secure esbuild configuration
   */
  generateSecureEsbuildConfig(): any {
    return {
      host: 'localhost',
      port: 3000,
      servedir: './dist',
      onRequest: (args: any) => {
        // Log all requests for monitoring
        console.log(
          `[${new Date().toISOString()}] ${args.method} ${args.path} from ${args.remoteAddress}`
        );
      },
    };
  }

  /**
   * Generates secure headers for dev servers
   */
  generateSecureHeaders(): Record<string, string> {
    return {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };
  }

  /**
   * Generates secure environment variables for dev servers
   */
  generateSecureEnvVars(): Record<string, string> {
    return {
      NODE_ENV: 'development',
      HOST: 'localhost',
      PORT: '3000',
      CORS_ORIGIN: 'http://localhost:3000',
      SECURE_HEADERS: 'true',
    };
  }

  /**
   * Validates and sanitizes host configuration
   */
  sanitizeHost(host: string): string {
    const allowedHosts = ['localhost', '127.0.0.1', '::1'];

    if (allowedHosts.includes(host)) {
      return host;
    }

    // Default to localhost for security
    return 'localhost';
  }

  /**
   * Validates and sanitizes port configuration
   */
  sanitizePort(port: number): number {
    const allowedPorts = [3000, 3001, 4000, 5000, 8000, 8080, 9000];

    if (allowedPorts.includes(port)) {
      return port;
    }

    // Default to 3000 for security
    return 3000;
  }
}
