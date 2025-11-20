export declare abstract class BaseController<TService> {
    protected service: TService;
    constructor(ServiceClass: new () => TService);
    protected handleError(error: unknown): {
        error: string;
        code: number;
    };
    protected validateRequest<T>(request: unknown, requiredFields: (keyof T)[]): T;
    protected formatResponse<T>(data: T, status?: string): {
        status: string;
        data: T;
        timestamp: string;
    };
}
//# sourceMappingURL=BaseController.d.ts.map