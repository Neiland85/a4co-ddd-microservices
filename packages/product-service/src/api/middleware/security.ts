import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

/**
 * Middleware de validación de entrada
 */
export const validateProductInput = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre del producto debe tener entre 1 y 100 caracteres'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('La categoría debe tener entre 1 y 50 caracteres'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Los datos de entrada no son válidos',
        details: errors.array()
      });
    }
    next();
  }
];

/**
 * Middleware de sanitización de entrada
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitizar strings
  if (req.body.name) {
    req.body.name = req.body.name.trim().replace(/[<>]/g, '');
  }
  if (req.body.description) {
    req.body.description = req.body.description.trim().replace(/[<>]/g, '');
  }
  if (req.body.category) {
    req.body.category = req.body.category.trim().replace(/[<>]/g, '');
  }
  
  next();
};

/**
 * Middleware de logging de seguridad
 */
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      contentLength: res.get('content-length')
    };
    
    // Log de seguridad para peticiones sospechosas
    if (res.statusCode >= 400 || duration > 5000) {
      console.warn('Security warning:', logData);
    } else {
      console.info('Request processed:', logData);
    }
  });
  
  next();
};

/**
 * Middleware de headers de seguridad
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Headers de seguridad adicionales
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

/**
 * Middleware de detección de ataques básicos
 */
export const attackDetection = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i
  ];
  
  const userInput = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.params);
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userInput)) {
      console.error('Potential attack detected:', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        pattern: pattern.source,
        timestamp: new Date().toISOString()
      });
      
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked for security reasons'
      });
    }
  }
  
  next();
}; 