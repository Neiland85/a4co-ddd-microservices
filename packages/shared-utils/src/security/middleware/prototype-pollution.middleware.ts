import { Request, Response, NextFunction } from 'express';
import { PrototypePollutionValidator } from '../validators/prototype-pollution.validator';

export class PrototypePollutionMiddleware {
  static validateRequest(req: Request, res: Response, next: NextFunction): void {
    try {
      if (req.body) {
        const validation = PrototypePollutionValidator.validateObject(req.body);
        if (!validation.isValid) {
          return res.status(400).json({
            error: 'Bad Request',
            message: 'Request contains dangerous keys',
            violations: validation.violations
          });
        }
      }
      next();
    } catch (error) {
      res.status(500).json({ error: 'Validation failed' });
    }
  }

  static sanitizeRequest(req: Request, res: Response, next: NextFunction): void {
    if (req.body) {
      req.body = PrototypePollutionValidator.sanitizeObject(req.body);
    }
    next();
  }
}

export const validateRequest = PrototypePollutionMiddleware.validateRequest;
export const sanitizeRequest = PrototypePollutionMiddleware.sanitizeRequest;

export default PrototypePollutionMiddleware;