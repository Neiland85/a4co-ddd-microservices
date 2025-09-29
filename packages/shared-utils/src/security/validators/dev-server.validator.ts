/**
 * Dev Server Security Validator
 * Validates development server configurations for security vulnerabilities
 */

export interface DevServerConfig {
  host?: string;
  port?: number;
  cors?: string[] | boolean;
  headers?: Record<string, string>;
}

export class DevServerValidator {
  private readonly ALLOWED_HOSTS = ['localhost', '127.0.0.1', '::1'];
  private readonly ALLOWED_PORTS = [3000, 3001, 4000, 5000, 8000, 8080, 9000];

  /**
   * Validates host configuration for security
   */
  validateHostConfig(host: string): boolean {
    if (!host) return false;

    // Allow localhost variations
    if (this.ALLOWED_HOSTS.includes(host)) {
      return true;
    }

    // Reject dangerous hosts
    if (host === '0.0.0.0' || host === '::' || host === '*') {
      return false;
    }

    // Allow local IP ranges
    const localIpRegex =
      /^192\.168\.\d+\.\d+$|^10\.\d+\.\d+\.\d+$|^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/;
    return localIpRegex.test(host);
  }

  /**
   * Validates port configuration for security
   */
  validatePortConfig(port: number): boolean {
    if (!port || port < 1024 || port > 65535) return false;

    // Allow common dev ports
    if (this.ALLOWED_PORTS.includes(port)) {
      return true;
    }

    // Reject well-known ports
    const dangerousPorts = [80, 443, 21, 22, 23, 25, 53, 110, 143, 993, 995];
    return !dangerousPorts.includes(port);
  }

  /**
   * Validates CORS configuration for security
   */
  validateCorsConfig(cors: string[] | boolean): boolean {
    if (cors === true) {
      return false; // Wildcard CORS is dangerous
    }

    if (typeof cors === 'string') {
      return cors !== '*'; // String '*' is dangerous
    }

    if (Array.isArray(cors)) {
      // Check each origin
      return cors.every(origin => {
        try {
          const url = new URL(origin);
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
          return false;
        }
      });
    }

    return false;
  }

  /**
   * Validates complete dev server configuration
   */
  validateConfig(config: DevServerConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (config.host && !this.validateHostConfig(config.host)) {
      errors.push(`Insecure host configuration: ${config.host}`);
    }

    if (config.port && !this.validatePortConfig(config.port)) {
      errors.push(`Insecure port configuration: ${config.port}`);
    }

    if (config.cors !== undefined && !this.validateCorsConfig(config.cors)) {
      errors.push(`Insecure CORS configuration: ${JSON.stringify(config.cors)}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
