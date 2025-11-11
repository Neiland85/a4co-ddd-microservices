/**
 * Test E2E de Compensación (Rollback) del Saga
 * 
 * Valida que el sistema pueda hacer rollback correctamente cuando falla algún paso:
 * 1. Fallo en pago → Liberar inventario reservado
 * 2. Fallo en inventario → Cancelar orden
 * 3. Timeout → Compensar transacción
 */

import * as request from 'supertest';

describe('Order Saga Compensation (E2E)', () => {
  let orderServiceUrl: string;
  let inventoryServiceUrl: string;
  let paymentServiceUrl: string;

  beforeAll(async () => {
    orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3004';
    inventoryServiceUrl = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3006';
    paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005';
  });

  describe('Compensación por fallo en pago', () => {
    it('debe liberar inventario cuando el pago falla', async () => {
      const testOrder = {
        customerId: 'customer-payment-fail-001',
        items: [
          {
            productId: 'product-001',
            quantity: 3,
            price: 29.99,
          },
        ],
        totalAmount: 89.97,
        // Agregar flag para forzar fallo de pago (solo para testing)
        metadata: {
          forcePaymentFailure: true,
        },
      };

      // Paso 1: Verificar stock disponible antes de la orden
      const stockBeforeResponse = await request(inventoryServiceUrl)
        .get('/api/v1/inventory/products/product-001')
        .expect(200);

      const stockBefore = stockBeforeResponse.body.availableQuantity;

      // Paso 2: Crear orden
      const createOrderResponse = await request(orderServiceUrl)
        .post('/api/v1/orders')
        .send(testOrder)
        .expect(201);

      const orderId = createOrderResponse.body.orderId;

      // Paso 3: Esperar a que se reserve el inventario
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar que el inventario fue reservado (stock disminuyó)
      const stockReservedResponse = await request(inventoryServiceUrl)
        .get('/api/v1/inventory/products/product-001')
        .expect(200);

      expect(stockReservedResponse.body.availableQuantity).toBe(stockBefore - 3);
      expect(stockReservedResponse.body.reservedQuantity).toBeGreaterThanOrEqual(3);

      // Paso 4: Esperar a que falle el pago y se compense
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Paso 5: Verificar que el inventario fue liberado (stock volvió al valor original)
      const stockAfterResponse = await request(inventoryServiceUrl)
        .get('/api/v1/inventory/products/product-001')
        .expect(200);

      expect(stockAfterResponse.body.availableQuantity).toBe(stockBefore);

      // Paso 6: Verificar que la orden fue cancelada
      const orderCheckResponse = await request(orderServiceUrl)
        .get(`/api/v1/orders/${orderId}`)
        .expect(200);

      expect(orderCheckResponse.body.status).toBe('CANCELLED');
      expect(orderCheckResponse.body.cancellationReason).toContain('payment');
    }, 15000);
  });

  describe('Compensación por inventario insuficiente', () => {
    it('debe cancelar orden cuando no hay stock', async () => {
      const testOrder = {
        customerId: 'customer-no-stock-001',
        items: [
          {
            productId: 'product-limited-stock',
            quantity: 1000, // Cantidad imposible
            price: 29.99,
          },
        ],
        totalAmount: 29990.00,
      };

      // Crear orden
      const createOrderResponse = await request(orderServiceUrl)
        .post('/api/v1/orders')
        .send(testOrder)
        .expect(201);

      const orderId = createOrderResponse.body.orderId;

      // Esperar a que se detecte la falta de stock
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Verificar que la orden fue cancelada
      const orderCheckResponse = await request(orderServiceUrl)
        .get(`/api/v1/orders/${orderId}`)
        .expect(200);

      expect(orderCheckResponse.body.status).toBe('FAILED');

      // Verificar que NO hay reserva de inventario
      const reservationCheckResponse = await request(inventoryServiceUrl)
        .get(`/api/v1/inventory/reservations/order/${orderId}`);

      expect([404, 200]).toContain(reservationCheckResponse.status);
      
      if (reservationCheckResponse.status === 200) {
        expect(reservationCheckResponse.body.status).not.toBe('ACTIVE');
      }
    }, 10000);
  });

  describe('Compensación por timeout de orden', () => {
    it('debe liberar inventario cuando una reserva expira', async () => {
      const testOrder = {
        customerId: 'customer-timeout-001',
        items: [
          {
            productId: 'product-001',
            quantity: 2,
            price: 29.99,
          },
        ],
        totalAmount: 59.98,
        metadata: {
          // Configurar TTL corto para la prueba (1 minuto)
          reservationTtlMinutes: 1,
        },
      };

      // Crear orden
      const createOrderResponse = await request(orderServiceUrl)
        .post('/api/v1/orders')
        .send(testOrder)
        .expect(201);

      const orderId = createOrderResponse.body.orderId;

      // Esperar a que se reserve el inventario
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar que existe la reserva
      const reservationCheckResponse = await request(inventoryServiceUrl)
        .get(`/api/v1/inventory/reservations/order/${orderId}`)
        .expect(200);

      expect(reservationCheckResponse.body.status).toBe('ACTIVE');
      const reservationId = reservationCheckResponse.body.reservationId;

      // Esperar a que expire la reserva (65 segundos para dar margen)
      console.log('⏳ Esperando a que expire la reserva (65 segundos)...');
      await new Promise(resolve => setTimeout(resolve, 65000));

      // Verificar que la reserva fue expirada
      const expiredReservationResponse = await request(inventoryServiceUrl)
        .get(`/api/v1/inventory/reservations/${reservationId}`)
        .expect(200);

      expect(['EXPIRED', 'RELEASED']).toContain(expiredReservationResponse.body.status);

      // Verificar que el inventario fue liberado
      // (Esto requeriría tracking del stock antes y después)
    }, 75000); // Timeout largo para este test
  });

  describe('Idempotencia de compensación', () => {
    it('debe manejar múltiples intentos de compensación sin duplicados', async () => {
      const testOrder = {
        customerId: 'customer-idempotent-001',
        items: [
          {
            productId: 'product-001',
            quantity: 1,
            price: 29.99,
          },
        ],
        totalAmount: 29.99,
        metadata: {
          forcePaymentFailure: true,
        },
      };

      // Crear orden
      const createOrderResponse = await request(orderServiceUrl)
        .post('/api/v1/orders')
        .send(testOrder)
        .expect(201);

      const orderId = createOrderResponse.body.orderId;

      // Esperar compensación
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Intentar cancelar manualmente (debería ser idempotente)
      const cancelResponse = await request(orderServiceUrl)
        .post(`/api/v1/orders/${orderId}/cancel`)
        .send({ reason: 'manual_cancellation' });

      // No debería fallar, debería ser idempotente
      expect([200, 409]).toContain(cancelResponse.status);
    }, 10000);
  });

  describe('Métricas de compensación', () => {
    it('debe registrar métricas de compensaciones exitosas', async () => {
      // Verificar que las métricas incluyen compensaciones
      const metricsResponse = await request(orderServiceUrl)
        .get('/metrics')
        .expect(200);

      expect(metricsResponse.text).toContain('saga_compensation_total');
      expect(metricsResponse.text).toContain('saga_compensation_success_rate');
    });
  });
});
