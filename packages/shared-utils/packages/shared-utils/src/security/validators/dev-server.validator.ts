/**
 * Validador de configuraciones de Dev Servers
 * Detecta configuraciones inseguras que permiten acceso externo
 */

export class DevServerValidator {
  /**
   * Valida configuración de host de dev server
   */
  static validateHostConfig(host: string | undefined): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (!host) {
      // Host no especificado - podría ser inseguro dependiendo del framework
      violations.push('Host no especificado - verificar configuración por defecto');
    } else if (host === '0.0.0.0') {
      violations.push('Host 0.0.0.0 permite conexiones desde cualquier interfaz de red');
    } else if (host !== '127.0.0.1' && host !== 'localhost') {
      violations.push(`Host '${host}' podría ser accesible externamente`);
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Valida configuración de puerto de dev server
   */
  static validatePortConfig(port: number | string | undefined): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (!port) {
      violations.push('Puerto no especificado - usar puerto por defecto podría ser inseguro');
      return { isValid: false, violations };
    }

    const portNum = typeof port === 'string' ? parseInt(port, 10) : port;

    // Puertos comunes de dev servers que podrían ser peligrosos si son accesibles
    const dangerousPorts = [3000, 3001, 4000, 5000, 8000, 8080, 9000, 9090];

    if (dangerousPorts.includes(portNum)) {
      violations.push(`Puerto ${portNum} es un puerto común de desarrollo - alto riesgo si es accesible externamente`);
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Valida configuración CORS para dev servers
   */
  static validateCorsConfig(cors: any): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    if (!cors) {
      violations.push('CORS no configurado - podría permitir requests desde orígenes maliciosos');
      return { isValid: false, violations };
    }

    // Verificar configuración permisiva
    if (cors.origin === '*' || cors.origin === true) {
      violations.push('CORS origin configurado como wildcard (*) - permite requests desde cualquier origen');
    }

    if (cors.credentials === true) {
      violations.push('CORS credentials habilitado - permite envío de cookies/autenticación');
    }

    return {
      isValid: violations.length === 0,
      violations
    };
  }

  /**
   * Valida configuración completa de dev server
   */
  static validateDevServerConfig(config: {
    host?: string;
    port?: number | string;
    cors?: any;
    https?: boolean;
    open?: boolean | string;
  }): { isValid: boolean; violations: string[] } {
    const allViolations: string[] = [];

    // Validar host
    const hostValidation = this.validateHostConfig(config.host);
    allViolations.push(...hostValidation.violations);

    // Validar puerto
    const portValidation = this.validatePortConfig(config.port);
    allViolations.push(...portValidation.violations);

    // Validar CORS
    if (config.cors) {
      const corsValidation = this.validateCorsConfig(config.cors);
      allViolations.push(...corsValidation.violations);
    }

    // Validar HTTPS
    if (!config.https) {
      allViolations.push('HTTPS no habilitado - tráfico no encriptado en desarrollo');
    }

    // Validar auto-open
    if (config.open) {
      allViolations.push('Auto-open habilitado - podría abrir URLs maliciosas automáticamente');
    }

    return {
      isValid: allViolations.length === 0,
      violations: allViolations
    };
  }
}