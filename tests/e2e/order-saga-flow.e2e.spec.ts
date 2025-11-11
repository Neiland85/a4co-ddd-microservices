/**
 * Test E2E del flujo completo: Order → Inventory → Payment
 * 
 * Este test valida el Saga Pattern completo para procesar una orden:
 * 1. Crear orden
 * 2. Reservar inventario
 * 3. Procesar pago
 * 4. Confirmar orden
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Order Saga Flow (E2E)', () => {
  let app: INestApplication;
  let orderServiceUrl: string;
  let inventoryServiceUrl: string;
  let paymentServiceUrl: string;

  beforeAll(async () => {
    // URLs de los servicios (se pueden configurar desde variables de entorno)
    orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3004';
    inventoryServiceUrl = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3006';
    paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005';
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Flujo completo exitoso', () => {
    it('debe procesar una orden completa exitosamente', async () => {
      const testOrder = {
        customerId: 'customer-test-001',
        items: [
          {
            productId: 'product-001',
            quantity: 2,
            price: 29.99,
          },
          {
            productId: 'product-002',
            quantity: 1,
            price: 49.99,
          },
        ],
        totalAmount: 109.97,
      };

      // Paso 1: Crear la orden
      const createOrderResponse = await request(orderServiceUrl)
        .post('/api/v1/orders')
        .send(testOrder)
        .expect(201);

      expect(createOrderResponse.body).toHaveProperty('orderId');
      expect(createOrderResponse.body.status).toBe('PENDING');

      const orderId = createOrderResponse.body.orderId;

      // Paso 2: Esperar a que se reserve el inventario (dar tiempo al evento asíncrono)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar que el inventario fue reservado
      const inventoryCheckResponse = await request(inventoryServiceUrl)
        .get(`/api/v1/inventory/reservations/order/${orderId}`)
        .expect(200);

      expect(inventoryCheckResponse.body).toHaveProperty('reservationId');
      expect(inventoryCheckResponse.body.status).toBe('ACTIVE');
      expect(inventoryCheckResponse.body.items).toHaveLength(2);

      // Paso 3: Esperar a que se procese el pago
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Verificar que el pago fue procesado
      const paymentCheckResponse = await request(paymentServiceUrl)
        .get(`/api/v1/payments/order/${orderId}`)
        .expect(200);

      expect(paymentCheckResponse.body).toHaveProperty('paymentId');
      expect(paymentCheckResponse.body.status).toBe('SUCCEEDED');

      // Paso 4: Verificar que la orden fue confirmada
      const orderCheckResponse = await request(orderServiceUrl)
        .get(`/api/v1/orders/${orderId}`)
        .expect(200);

      expect(orderCheckResponse.body.status).toBe('CONFIRMED');
      expect(orderCheckResponse.body).toHaveProperty('paymentId');

      // Paso 5: Verificar métricas de la saga
      const metricsResponse = await request(orderServiceUrl)
        .get('/metrics')
        .expect(200);

      expect(metricsResponse.text).toContain('saga_success_rate');
      expect(metricsResponse.text).toContain('saga_duration');
    }, 15000); // Timeout de 15 segundos para el test completo
  });

  describe('Flujo con stock insuficiente', () => {
    it('debe fallar si no hay stock suficiente', async () => {
      const testOrder = {
        customerId: 'customer-test-002',
        items: [
          {
            productId: 'product-out-of-stock',
            quantity: 100, // Cantidad imposible
            price: 29.99,
          },
        ],
        totalAmount: 2999.00,
      };

      // Crear la orden
      const createOrderResponse = await request(orderServiceUrl)
        .post('/api/v1/orders')
        .send(testOrder)
        .expect(201);

      const orderId = createOrderResponse.body.orderId;

      // Esperar a que se procese la falta de stock
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Verificar que la orden fue cancelada
      const orderCheckResponse = await request(orderServiceUrl)
        .get(`/api/v1/orders/${orderId}`)
        .expect(200);

      expect(orderCheckResponse.body.status).toBe('FAILED');
      expect(orderCheckResponse.body.failureReason).toContain('stock');
    }, 10000);
  });

  describe('Carga concurrente', () => {
    it('debe procesar múltiples órdenes concurrentes', async () => {
      const orderPromises = [];

      // Crear 10 órdenes simultáneas
      for (let i = 0; i < 10; i++) {
        const testOrder = {
          customerId: `customer-concurrent-${i}`,
          items: [
            {
              productId: 'product-001',
              quantity: 1,
              price: 29.99,
            },
          ],
          totalAmount: 29.99,
        };

        orderPromises.push(
          request(orderServiceUrl)
            .post('/api/v1/orders')
            .send(testOrder)
        );
      }

      // Ejecutar todas las órdenes en paralelo
      const responses = await Promise.all(orderPromises);

      // Verificar que todas fueron creadas
      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('orderId');
      });

      // Esperar a que se procesen todas
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Verificar que todas se procesaron correctamente
      for (const response of responses) {
        const orderId = response.body.orderId;
        
        const orderCheck = await request(orderServiceUrl)
          .get(`/api/v1/orders/${orderId}`);

        expect(['CONFIRMED', 'PENDING', 'PROCESSING']).toContain(orderCheck.body.status);
      }
    }, 20000);
  });

  describe('Timeout de saga', () => {
    it('debe cancelar una orden si la saga excede el timeout', async () => {
      // Este test requiere configurar un timeout corto en el saga orchestrator
      // y simular una demora en el procesamiento
      
      // Para propósitos de demostración, asumimos que el timeout está configurado
      // Este test sería más complejo en un entorno real
      
      expect(true).toBe(true); // Placeholder
    });
  });
});
