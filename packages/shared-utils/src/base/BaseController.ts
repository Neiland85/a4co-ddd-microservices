/**
 * BaseController - Clase abstracta que encapsula la lógica común de todos los controllers
 * Implementa el patrón DRY para reducir duplicación de código detectada por SonarQube
 */
export abstract class BaseController<TService> {
  protected service: TService;

  constructor(ServiceClass: new () => TService) {
    this.service = new ServiceClass();
  }

  /**
   * Maneja errores de forma consistente en todos los controllers
   */
  protected handleError(error: unknown): { error: string; code: number } {
    if (error instanceof Error) {
      return { error: error.message, code: 400 };
    }
    return { error: 'Internal server error', code: 500 };
  }

  /**
   * Valida parámetros de entrada de forma consistente
   */
  protected validateRequest<T>(request: unknown, requiredFields: (keyof T)[]): T {
    if (!request || typeof request !== 'object') {
      throw new Error('Invalid request format');
    }

    const req = request as Record<string, unknown>;

    for (const field of requiredFields) {
      if (!((field as string) in req)) {
        throw new Error(`Missing required field: ${String(field)}`);
      }
    }

    return request as T;
  }

  /**
   * Envuelve las respuestas en un formato consistente
   */
  protected formatResponse<T>(
    data: T,
    status = 'success'
  ): {
    status: string;
    data: T;
    timestamp: string;
  } {
    return {
      status,
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
