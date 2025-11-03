import { Router } from 'express';
import { PaymentController } from './controller';

// CONFIGURACIÓN DE RUTAS PARA PAYMENT SERVICE

export function setupPaymentRoutes(): Router {
  const router = Router();
  const paymentController = new PaymentController();

  // ENDPOINTS CRÍTICOS PARA OTROS SERVICIOS

  /**
   * POST /payments/validate
   * Validar método de pago antes de procesar la orden
   */
  router.post('/validate', async(req, res) => {
  router.post('/validate', async (req, res) => {
    try {
      const { paymentMethodType, paymentMethodId, customerId, amount, currency, orderId } =
        req.body;

      if (!paymentMethodType || !paymentMethodId || !customerId || !amount || !currency) {
        return res.status(400).json({
          error: 'Missing required fields',
          message:
            'paymentMethodType, paymentMethodId, customerId, amount y currency son obligatorios',
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          error: 'Invalid amount',
          message: 'El monto debe ser mayor a 0',
        });
      }

      const result = await paymentController.validatePaymentMethod({
        paymentMethodType,
        paymentMethodId,
        customerId,
        amount,
        currency,
        orderId,
      });
      res.json(result);
    } catch (error) {
      console.error('Error validating payment method:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * POST /payments/process
   * Procesar el pago de una orden
   */
  router.post('/process', async(req, res) => {
  router.post('/process', async (req, res) => {
    try {
      const {
        orderId,
        customerId,
        paymentMethodType,
        paymentMethodId,
        amount,
        currency,
        description,
        customerEmail,
        customerPhone,
        billingAddress,
      } = req.body;

      if (
        !orderId ||
        !customerId ||
        !paymentMethodType ||
        !paymentMethodId ||
        !amount ||
        !currency ||
        !description
      ) {
        return res.status(400).json({
          error: 'Missing required fields',
          message:
            'orderId, customerId, paymentMethodType, paymentMethodId, amount, currency y description son obligatorios',
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          error: 'Invalid amount',
          message: 'El monto debe ser mayor a 0',
        });
      }

      const result = await paymentController.processPayment({
        orderId,
        customerId,
        paymentMethodType,
        paymentMethodId,
        amount,
        currency,
        description,
        customerEmail,
        customerPhone,
        billingAddress,
      });
      res.json(result);
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * GET /payments/methods/:customerId
   * Obtener métodos de pago de un cliente
   */
  router.get('/methods/:customerId', async(req, res) => {
  router.get('/methods/:customerId', async (req, res) => {
    try {
      const { customerId } = req.params;
      const { activeOnly } = req.query;

      if (!customerId) {
        return res.status(400).json({
          error: 'customerId is required',
          message: 'El ID del cliente es obligatorio',
        });
      }

      const result = await paymentController.getCustomerPaymentMethods({
        customerId,
        activeOnly: activeOnly === 'true',
      });
      res.json(result);
    } catch (error) {
      console.error('Error getting customer payment methods:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * POST /payments/refund
   * Procesar reembolso de un pago
   */
  router.post('/refund', async(req, res) => {
  router.post('/refund', async (req, res) => {
    try {
      const { paymentId, orderId, refundAmount, reason, customerId } = req.body;

      if (!paymentId || !orderId || !refundAmount || !reason) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'paymentId, orderId, refundAmount y reason son obligatorios',
        });
      }

      if (refundAmount <= 0) {
        return res.status(400).json({
          error: 'Invalid refund amount',
          message: 'El monto del reembolso debe ser mayor a 0',
        });
      }

      const result = await paymentController.refundPayment({
        paymentId,
        orderId,
        refundAmount,
        reason,
        customerId,
      });
      res.json(result);
    } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  // ENDPOINTS INTERNOS DEL SERVICIO

  /**
   * GET /payments/:paymentId
   * Obtener detalles de un pago específico
   */
  router.get('/:paymentId', async(req, res) => {
  router.get('/:paymentId', async (req, res) => {
    try {
      const { paymentId } = req.params;

      if (!paymentId) {
        return res.status(400).json({
          error: 'paymentId is required',
          message: 'El ID del pago es obligatorio',
        });
      }

      const result = await paymentController.getPaymentDetails(paymentId);
      res.json(result);
    } catch (error) {
      console.error('Error getting payment details:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * GET /payments/order/:orderId
   * Obtener pagos asociados a una orden
   */
  router.get('/order/:orderId', async(req, res) => {
  router.get('/order/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        return res.status(400).json({
          error: 'orderId is required',
          message: 'El ID de la orden es obligatorio',
        });
      }

      const result = await paymentController.getPaymentsByOrder(orderId);
      res.json(result);
    } catch (error) {
      console.error('Error getting payments by order:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * GET /payments/customer/:customerId
   * Obtener historial de pagos de un cliente
   */
  router.get('/customer/:customerId', async(req, res) => {
  router.get('/customer/:customerId', async (req, res) => {
    try {
      const { customerId } = req.params;
      const { limit, offset } = req.query;

      if (!customerId) {
        return res.status(400).json({
          error: 'customerId is required',
          message: 'El ID del cliente es obligatorio',
        });
      }

      const result = await paymentController.getCustomerPaymentHistory(
        customerId,
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );
      res.json(result);
    } catch (error) {
      console.error('Error getting customer payment history:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * POST /payments/methods
   * Agregar nuevo método de pago para un cliente
   */
  router.post('/methods', async(req, res) => {
  router.post('/methods', async (req, res) => {
    try {
      const { customerId, ...paymentMethodData } = req.body;

      if (!customerId) {
        return res.status(400).json({
          error: 'customerId is required',
          message: 'El ID del cliente es obligatorio',
        });
      }

      const result = await paymentController.addPaymentMethod(customerId, paymentMethodData);
      res.json(result);
    } catch (error) {
      console.error('Error adding payment method:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * PUT /payments/methods/:methodId
   * Actualizar método de pago existente
   */
  router.put('/methods/:methodId', async(req, res) => {
  router.put('/methods/:methodId', async (req, res) => {
    try {
      const { methodId } = req.params;
      const updateData = req.body;

      if (!methodId) {
        return res.status(400).json({
          error: 'methodId is required',
          message: 'El ID del método de pago es obligatorio',
        });
      }

      const result = await paymentController.updatePaymentMethod(methodId, updateData);
      res.json(result);
    } catch (error) {
      console.error('Error updating payment method:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * DELETE /payments/methods/:methodId
   * Eliminar método de pago
   */
  router.delete('/methods/:methodId', async(req, res) => {
  router.delete('/methods/:methodId', async (req, res) => {
    try {
      const { methodId } = req.params;

      if (!methodId) {
        return res.status(400).json({
          error: 'methodId is required',
          message: 'El ID del método de pago es obligatorio',
        });
      }

      const result = await paymentController.deletePaymentMethod(methodId);
      res.json(result);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  // ENDPOINTS DE MONITOREO Y SALUD

  /**
   * GET /payments/health
   * Verificar salud del servicio de pagos
   */
  router.get('/health', async(req, res) => {
  router.get('/health', async (req, res) => {
    try {
      const result = await paymentController.getHealth();
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
   * GET /payments/metrics
   * Obtener métricas del servicio
   */
  router.get('/metrics', async(req, res) => {
  router.get('/metrics', async (req, res) => {
    try {
      const result = await paymentController.getMetrics();
      res.json(result);
    } catch (error) {
      console.error('Error getting metrics:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Error interno del servidor',
      });
    }
  });

  /**
   * GET /payments/status/:paymentId
   * Obtener estado actual de un pago
   */
  router.get('/status/:paymentId', async(req, res) => {
  router.get('/status/:paymentId', async (req, res) => {
    try {
      const { paymentId } = req.params;

      if (!paymentId) {
        return res.status(400).json({
          error: 'paymentId is required',
          message: 'El ID del pago es obligatorio',
        });
      }

      const result = await paymentController.getPaymentStatus(paymentId);
      res.json(result);
    } catch (error) {
      console.error('Error getting payment status:', error);
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
        'POST /payments/validate',
        'POST /payments/process',
        'GET /payments/methods/:customerId',
        'POST /payments/refund',
        'GET /payments/:paymentId',
        'GET /payments/order/:orderId',
        'GET /payments/customer/:customerId',
        'POST /payments/methods',
        'PUT /payments/methods/:methodId',
        'DELETE /payments/methods/:methodId',
        'GET /payments/health',
        'GET /payments/metrics',
        'GET /payments/status/:paymentId',
      ],
    });
  });

  return router;
}
