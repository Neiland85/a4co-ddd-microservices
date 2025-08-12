import express from 'express';
import { ProductController } from './controllers/ProductController';
import { GamificationController } from './controllers/GamificationController';
import { 
  generalRateLimiter, 
  criticalEndpointsRateLimiter, 
  publicEndpointsRateLimiter,
  speedLimiter 
} from './middleware/rate-limiter';
import { 
  validateProductInput, 
  sanitizeInput, 
  securityLogger, 
  securityHeaders, 
  attackDetection 
} from './middleware/security';

const router = express.Router();
const productController = new ProductController();
const gamificationController = new GamificationController();

/**
 * Middleware de seguridad global
 */
router.use(securityHeaders);
router.use(securityLogger);
router.use(attackDetection);
router.use(speedLimiter);

/**
 * Health check endpoint
 * GET /health
 */
router.get('/health', publicEndpointsRateLimiter, (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'product-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    features: {
      gamification: true,
      rateLimiting: true,
      security: true
    }
  });
});

/**
 * API Documentation endpoint
 * GET /docs
 */
router.get('/docs', publicEndpointsRateLimiter, (req, res) => {
  res.status(200).json({
    name: 'Product Service API',
    version: '1.0.0',
    description: 'API para gestión de productos artesanales con gamificación',
    endpoints: {
      'GET /health': 'Health check del servicio',
      'GET /products': 'Obtener todos los productos',
      'GET /products/:id': 'Obtener producto por ID',
      'POST /products': 'Crear nuevo producto',
      'PUT /products/:id': 'Actualizar producto',
      'DELETE /products/:id': 'Eliminar producto',
      'GET /products/search': 'Buscar productos',
      'GET /gamification/profile/:userId': 'Perfil gamificado del usuario',
      'POST /gamification/action': 'Registrar acción del usuario',
      'GET /gamification/leaderboard': 'Ranking de artesanos',
      'GET /gamification/quests': 'Misiones disponibles'
    },
    rateLimits: {
      'Public endpoints': '60 requests/minute',
      'Critical endpoints': '10 requests/minute',
      'General': '100 requests/15 minutes'
    },
    security: {
      'Input validation': 'Enabled',
      'Rate limiting': 'Enabled',
      'Attack detection': 'Enabled',
      'Security headers': 'Enabled'
    },
    gamification: {
      'Points system': 'Enabled',
      'Badges': 'Enabled',
      'Achievements': 'Enabled',
      'Leaderboards': 'Enabled',
      'Quests': 'Enabled'
    }
  });
});

/**
 * Product routes con rate limiting específico
 */

// GET /products - Obtener todos los productos (endpoint público)
router.get('/products', publicEndpointsRateLimiter, (req, res) => {
  productController.getAllProducts(req, res);
});

// GET /products/:id - Obtener producto por ID (endpoint público)
router.get('/products/:id', publicEndpointsRateLimiter, (req, res) => {
  productController.getProductById(req, res);
});

// POST /products - Crear nuevo producto (endpoint crítico)
router.post('/products', 
  criticalEndpointsRateLimiter,
  sanitizeInput,
  validateProductInput,
  (req, res) => {
    productController.createProduct(req, res);
  }
);

// PUT /products/:id - Actualizar producto (endpoint crítico)
router.put('/products/:id', 
  criticalEndpointsRateLimiter,
  sanitizeInput,
  validateProductInput,
  (req, res) => {
    productController.updateProduct(req, res);
  }
);

// DELETE /products/:id - Eliminar producto (endpoint crítico)
router.delete('/products/:id', 
  criticalEndpointsRateLimiter,
  (req, res) => {
    productController.deleteProduct(req, res);
  }
);

// GET /products/search - Buscar productos (endpoint público)
router.get('/products/search', publicEndpointsRateLimiter, (req, res) => {
  productController.searchProducts(req, res);
});

/**
 * Gamification routes - Sistema de gamificación "Artesano Quest"
 */

// GET /gamification/profile/:userId - Perfil gamificado del usuario
router.get('/gamification/profile/:userId', publicEndpointsRateLimiter, (req, res) => {
  gamificationController.getUserProfile(req, res);
});

// POST /gamification/action - Registrar acción del usuario
router.post('/gamification/action', 
  criticalEndpointsRateLimiter,
  (req, res) => {
    gamificationController.recordAction(req, res);
  }
);

// GET /gamification/leaderboard - Ranking de artesanos
router.get('/gamification/leaderboard', publicEndpointsRateLimiter, (req, res) => {
  gamificationController.getLeaderboard(req, res);
});

// GET /gamification/quests - Misiones disponibles
router.get('/gamification/quests', publicEndpointsRateLimiter, (req, res) => {
  gamificationController.getQuests(req, res);
});

/**
 * Error handling middleware
 */
router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'Ha ocurrido un error inesperado',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown'
  });
});

/**
 * 404 handler
 */
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      '/health',
      '/docs',
      '/products',
      '/gamification/profile/:userId',
      '/gamification/leaderboard',
      '/gamification/quests'
    ]
  });
});

export default router; 