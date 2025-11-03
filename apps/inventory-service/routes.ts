import { Router } from 'express';
import { InventoryController } from './controller';

// CONFIGURACIÓN DE RUTAS PARA INVENTORY SERVICE

export function setupInventoryRoutes(): Router {
  const router = Router();
  const inventoryController = new InventoryController();

  // ENDPOINTS CRÍTICOS PARA OTROS SERVICIOS

  /**
   * GET /inventory/check/:productId
   * Verificar disponibilidad de stock para un producto específico
   * Query params: quantity (número)
   */
  router.get('/check/:productId', async(req, res) => {
  router.get('/check/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const quantity = parseInt(req.query.quantity as string) || 1;

      if (!productId) {
        return res.status(400).json({
          error: 'productId is required',
          message: 'El ID del producto es obligatorio',
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          error: 'Invalid quantity',
          message: 'La cantidad debe ser mayor a 0',
        });
      }

      const result = await inventoryController.checkInventory(productId, quantity);
      res.json(result);
    } catch (error) {
      console.error('Error checking inventory:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * POST /inventory/check/bulk
   * Verificar disponibilidad de stock para múltiples productos
   */
  router.post('/check/bulk', async(req, res) => {
  router.post('/check/bulk', async (req, res) => {
    try {
      const { items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          error: 'Invalid items',
          message: 'Se requiere un array de items válido',
        });
      }

      const result = await inventoryController.bulkCheckInventory({ items });
      res.json(result);
    } catch (error) {
      console.error('Error bulk checking inventory:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * POST /inventory/reserve
   * Reservar stock para una orden
   */
  router.post('/reserve', async(req, res) => {
  router.post('/reserve', async (req, res) => {
    try {
      const { orderId, productId, quantity, customerId } = req.body;

      if (!orderId || !productId || !quantity) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'orderId, productId y quantity son obligatorios',
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          error: 'Invalid quantity',
          message: 'La cantidad debe ser mayor a 0',
        });
      }

      const result = await inventoryController.reserveStock({
        orderId,
        productId,
        quantity,
        customerId,
      });
      res.json(result);
    } catch (error) {
      console.error('Error reserving stock:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * POST /inventory/release
   * Liberar stock reservado
   */
  router.post('/release', async(req, res) => {
  router.post('/release', async (req, res) => {
    try {
      const { orderId, productId, quantity } = req.body;

      if (!orderId || !productId || !quantity) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'orderId, productId y quantity son obligatorios',
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          error: 'Invalid quantity',
          message: 'La cantidad debe ser mayor a 0',
        });
      }

      const result = await inventoryController.releaseStock({
        orderId,
        productId,
        quantity,
      });
      res.json(result);
    } catch (error) {
      console.error('Error releasing stock:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  // ENDPOINTS INTERNOS DEL SERVICIO

  /**
   * GET /inventory/product/:productId
   * Obtener información completa de inventario de un producto
   */
  router.get('/product/:productId', async(req, res) => {
  router.get('/product/:productId', async (req, res) => {
    try {
      const { productId } = req.params;

      if (!productId) {
        return res.status(400).json({
          error: 'productId is required',
          message: 'El ID del producto es obligatorio',
        });
      }

      const result = await inventoryController.getProductInventory(productId);
      res.json(result);
    } catch (error) {
      console.error('Error getting product inventory:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * GET /inventory/status
   * Obtener estado general del inventario
   */
  router.get('/status', async(req, res) => {
  router.get('/status', async (req, res) => {
    try {
      const result = await inventoryController.getInventoryStatus();
      res.json(result);
    } catch (error) {
      console.error('Error getting inventory status:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * POST /inventory/update
   * Actualizar stock de un producto
   */
  router.post('/update', async(req, res) => {
  router.post('/update', async (req, res) => {
    try {
      const { productId, quantity, reason } = req.body;

      if (!productId || quantity === undefined || !reason) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'productId, quantity y reason son obligatorios',
        });
      }

      const result = await inventoryController.updateProductStock(productId, quantity, reason);
      res.json(result);
    } catch (error) {
      console.error('Error updating product stock:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  // ENDPOINTS DE MONITOREO Y SALUD

  /**
   * GET /inventory/health
   * Verificar salud del servicio de inventario
   */
  router.get('/health', async(req, res) => {
  router.get('/health', async (req, res) => {
    try {
      const result = await inventoryController.getHealth();
      res.json(result);
    } catch (error) {
      console.error('Error getting health status:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * GET /inventory/metrics
   * Obtener métricas del servicio
   */
  router.get('/metrics', async(req, res) => {
  router.get('/metrics', async (req, res) => {
    try {
      const result = await inventoryController.getMetrics();
      res.json(result);
    } catch (error) {
      console.error('Error getting metrics:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  // MIDDLEWARE DE VALIDACIÓN GLOBAL

  // Middleware para validar que el servicio esté disponible
  router.use((req, res, next) => {
    // Aquí se pueden agregar validaciones globales
    // como autenticación, rate limiting, etc.
    next();
  });

  // MANEJO DE RUTAS NO ENCONTRADAS

  router.use('*', (req, res) => {
    res.status(404).json({
      error: 'Route not found',
      message: `La ruta ${req.originalUrl} no existe`,
      availableEndpoints: [
        'GET /inventory/check/:productId',
        'POST /inventory/check/bulk',
        'POST /inventory/reserve',
        'POST /inventory/release',
        'GET /inventory/product/:productId',
        'GET /inventory/status',
        'POST /inventory/update',
        'GET /inventory/health',
        'GET /inventory/metrics',
      ],
    });
  });

  return router;
}
