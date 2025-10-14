/**
 * BaseService - Clase abstracta que encapsula la lógica común de todos los servicios
 * Implementa el patrón DRY para reducir duplicación de código detectada por SonarQube
 */
export declare abstract class BaseService {
    protected readonly serviceName: string;
    constructor(serviceName: string);
    /**
     * Loguea operaciones de forma consistente
     */
    protected log(operation: string, data?: unknown): void;
    /**
     * Valida datos de entrada comunes
     */
    protected validateId(id: string | undefined, entityName: string): string;
    /**
     * Valida que un valor no sea null o undefined
     */
    protected validateRequired<T>(value: T | null | undefined, fieldName: string): T;
    /**
     * Simula una operación asíncrona con retraso (para desarrollo)
     */
    protected simulateDelay(ms?: number): Promise<void>;
    /**
     * Maneja errores del servicio de forma consistente
     */
    protected handleServiceError(error: unknown, operation: string): never;
    /**
     * Crea una respuesta exitosa estándar
     */
    protected createSuccessMessage(entity: string, action: string, details?: string): string;
}
//# sourceMappingURL=BaseService.d.ts.map