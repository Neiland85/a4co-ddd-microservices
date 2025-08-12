import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

/**
 * Configuración de rate limiting para protección de API
 * Limita las peticiones por IP para prevenir abuso
 */

// Rate limiter general
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 peticiones por ventana
  message: {
    error: 'Too many requests from this IP',
    message: 'Please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter para endpoints críticos
export const criticalEndpointsRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 peticiones por minuto
  message: {
    error: 'Too many requests to critical endpoint',
    message: 'Please slow down your requests',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter para endpoints públicos
export const publicEndpointsRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 60, // máximo 60 peticiones por minuto
  message: {
    error: 'Too many requests to public endpoint',
    message: 'Please try again later',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Speed limiter
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: 500,
  maxDelayMs: 20000
});

/**
 * Middleware para logging de rate limiting
 */
export const rateLimitLogger = (req: any, res: any, next: any) => {
  const originalSend = res.send;
  
  res.send = function(data: any) {
    if (res.statusCode === 429) {
      console.warn(`Rate limit exceeded for IP: ${req.ip}`, {
        path: req.path,
        method: req.method,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      });
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

/**
 * Configuración de rate limiting por tipo de endpoint
 */
export const getRateLimiterForEndpoint = (endpoint: string) => {
  // Endpoints críticos que requieren mayor protección
  const criticalEndpoints = [
    '/products', // POST - creación de productos
    '/products/:id', // PUT/DELETE - modificación/eliminación
    '/auth/login',
    '/auth/register'
  ];
  
  // Endpoints públicos de solo lectura
  const publicEndpoints = [
    '/products', // GET - listado de productos
    '/products/:id', // GET - obtener producto específico
    '/health',
    '/docs'
  ];
  
  if (criticalEndpoints.some(ep => endpoint.includes(ep.replace(':', '')))) {
    return criticalEndpointsRateLimiter;
  }
  
  if (publicEndpoints.some(ep => endpoint.includes(ep.replace(':', '')))) {
    return publicEndpointsRateLimiter;
  }
  
  return generalRateLimiter;
}; 