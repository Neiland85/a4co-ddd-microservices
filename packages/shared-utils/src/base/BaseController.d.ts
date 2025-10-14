/**
 * BaseController - Clase abstracta que encapsula la lógica común de todos los controllers
 * Implementa el patrón DRY para reducir duplicación de código detectada por SonarQube
 */
export declare abstract class BaseController<TService> {
    protected service: TService;
    constructor(ServiceClass: new () => TService);
    /**
     * Maneja errores de forma consistente en todos los controllers
     */
    protected handleError(error: unknown): {
        error: string;
        code: number;
    };
    /**
     * Valida parámetros de entrada de forma consistente
     */
    protected validateRequest<T>(request: unknown, requiredFields: (keyof T)[]): T;
    /**
     * Envuelve las respuestas en un formato consistente
     */
    protected formatResponse<T>(data: T, status?: string): {
        status: string;
        data: T;
        timestamp: string;
    };
}
//# sourceMappingURL=BaseController.d.ts.map