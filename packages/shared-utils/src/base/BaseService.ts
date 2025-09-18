/**
 * BaseService - Clase abstracta que encapsula la lógica común de todos los servicios
 * Implementa el patrón DRY para reducir duplicación de código detectada por SonarQube
 */
export abstract class BaseService {
  protected readonly serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Loguea operaciones de forma consistente
   */
  protected log(operation: string, data?: unknown): void {
    console.log(`[${this.serviceName}] ${operation}`, data ? JSON.stringify(data) : '');
  }

  /**
   * Valida datos de entrada comunes
   */
  protected validateId(id: string | undefined, entityName: string): string {
    if (!id || id.trim() === '') {
      throw new Error(`Invalid ${entityName} ID`);
    }
    return id.trim();
  }

  /**
   * Valida que un valor no sea null o undefined
   */
  protected validateRequired<T>(value: T | null | undefined, fieldName: string): T {
    if (value === null || value === undefined) {
      throw new Error(`${fieldName} is required`);
    }
    return value;
  }

  /**
   * Simula una operación asíncrona con retraso (para desarrollo)
   */
  protected async simulateDelay(ms = 100): Promise<void> {
    if (process.env['NODE_ENV'] === 'development') {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  /**
   * Maneja errores del servicio de forma consistente
   */
  protected handleServiceError(error: unknown, operation: string): never {
    const message = error instanceof Error ? error.message : 'Unknown error';
    this.log(`Error in ${operation}: ${message}`);
    throw new Error(`${this.serviceName} - ${operation} failed: ${message}`);
  }

  /**
   * Crea una respuesta exitosa estándar
   */
  protected createSuccessMessage(entity: string, action: string, details?: string): string {
    const baseMessage = `${entity} ${action} successfully`;
    return details ? `${baseMessage}: ${details}` : `${baseMessage}.`;
  }
}
