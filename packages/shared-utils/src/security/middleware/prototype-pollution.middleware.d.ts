import { Request, Response, NextFunction } from 'express';
export declare class PrototypePollutionMiddleware {
    static validateRequest(req: Request, res: Response, next: NextFunction): void;
    static sanitizeRequest(req: Request, res: Response, next: NextFunction): void;
}
export declare const validateRequest: typeof PrototypePollutionMiddleware.validateRequest;
export declare const sanitizeRequest: typeof PrototypePollutionMiddleware.sanitizeRequest;
export default PrototypePollutionMiddleware;
//# sourceMappingURL=prototype-pollution.middleware.d.ts.map