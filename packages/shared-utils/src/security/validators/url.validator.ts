/**
 * Validador de URLs para prevenir SSRF
 * Bloquea redirecciones a servicios internos y metadatos cloud
 */

export class URLValidator {
  // Rangos IP internos y metadatos cloud que deben bloquearse
  private static readonly BLOCKED_IP_RANGES = [
    // RFC1918 - Redes privadas
    /^10\./, // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
    /^192\.168\./, // 192.168.0.0/16
    /^127\./, // 127.0.0.0/8 (localhost)
    /^0\./, // 0.0.0.0/8
    /^169\.254\./, // 169.254.0.0/16 (link-local)

    // Metadatos cloud
    /^169\.254\.169\.254$/, // AWS IMDS
    /^100\.100\.100\.200$/, // Alibaba Cloud
    /^192\.0\.0\.192$/, // Oracle Cloud
    /^168\.63\.129\.16$/, // Azure IMDS
    /^metadata\.google\.internal$/, // GCP
  ];

  private static readonly BLOCKED_HOSTNAMES = [
    'localhost',
    'metadata.google.internal',
    '169.254.169.254',
    '100.100.100.200',
    '192.0.0.192',
    '168.63.129.16',
    'internal',
    'local',
    '127.0.0.1',
    '0.0.0.0',
  ];

  private static readonly ALLOWED_SCHEMES = ['http', 'https'];

  /**
   * Valida si una URL es segura para redirección
   */
  static validateURL(url: string): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (!url || typeof url !== 'string') {
      violations.push('URL is empty or not a string');
      return { isValid: false, violations };
    }

    try {
      const urlObj = new URL(url);

      // Validar esquema
      if (!this.ALLOWED_SCHEMES.includes(urlObj.protocol.replace(':', ''))) {
        violations.push(`Invalid scheme: ${urlObj.protocol}`);
      }

      // Validar hostname
      if (this.BLOCKED_HOSTNAMES.includes(urlObj.hostname.toLowerCase())) {
        violations.push(`Blocked hostname: ${urlObj.hostname}`);
      }

      // Validar IP ranges
      const hostname = urlObj.hostname;
      if (this.isIPAddress(hostname)) {
        for (const range of this.BLOCKED_IP_RANGES) {
          if (range.test(hostname)) {
            violations.push(`Blocked IP range: ${hostname}`);
            break;
          }
        }
      }

      // Validar puerto (bloquear puertos internos comunes)
      if (urlObj.port) {
        const port = parseInt(urlObj.port);
        if (this.isInternalPort(port)) {
          violations.push(`Blocked internal port: ${port}`);
        }
      }
    } catch (error) {
      violations.push(
        `Invalid URL format: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    return {
      isValid: violations.length === 0,
      violations,
    };
  }

  /**
   * Verifica si una cadena es una dirección IP
   */
  private static isIPAddress(hostname: string): boolean {
    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    return ipRegex.test(hostname);
  }

  /**
   * Verifica si un puerto es interno/privilegiado
   */
  private static isInternalPort(port: number): boolean {
    // Puertos comunes de servicios internos
    const internalPorts = [
      22, // SSH
      25, // SMTP
      53, // DNS
      80, // HTTP (si es interno)
      443, // HTTPS (si es interno)
      3306, // MySQL
      5432, // PostgreSQL
      6379, // Redis
      8080, // HTTP alternativo
      8443, // HTTPS alternativo
      9200, // Elasticsearch
      27017, // MongoDB
    ];

    return internalPorts.includes(port) || port < 1024;
  }

  /**
   * Sanitiza una URL removiendo componentes peligrosos
   */
  static sanitizeURL(url: string): string {
    if (!url || typeof url !== 'string') return url;

    try {
      const urlObj = new URL(url);

      // Remover credenciales
      urlObj.username = '';
      urlObj.password = '';

      // Remover fragmentos que podrían contener datos sensibles
      urlObj.hash = '';

      return urlObj.toString();
    } catch (error) {
      return url;
    }
  }

  /**
   * Verifica si una URL está en una allowlist
   */
  static isInAllowlist(url: string, allowlist: string[]): boolean {
    if (!url || !allowlist || allowlist.length === 0) return false;

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      return allowlist.some(allowed => {
        // Soporte para wildcards
        const pattern = allowed.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`, 'i');
        return regex.test(hostname);
      });
    } catch (error) {
      return false;
    }
  }
}

export default URLValidator;
