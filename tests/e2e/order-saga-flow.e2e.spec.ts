import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { OrderModule } from '../../apps/order-service/src/order.module';

describe('Order Saga E2E Flow (REAL)', () => {
  let app: INestApplication;
  let orderId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrderModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /orders - Create Order', () => {
    it('should create a new order successfully', async () => {
      const createOrderDto = {
        customerId: 'customer-test-123',
        items: [
          {
            productId: 'product-1',
            quantity: 2,
            unitPrice: 50.0,
          },
          {
            productId: 'product-2',
            quantity: 1,
            unitPrice: 100.0,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(createOrderDto)
        .expect(201);

      expect(response.body).toHaveProperty('orderId');
      expect(response.body.status).toBe('PENDING');
      expect(response.body.message).toBe('Order created successfully');

      orderId = response.body.orderId;
      expect(orderId).toBeDefined();
      expect(typeof orderId).toBe('string');
    });

    it('should reject order with invalid data', async () => {
      const invalidOrderDto = {
        customerId: '',
        items: [],
      };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidOrderDto)
        .expect(500); // Will be 400 when validation is added
    });

    it('should reject order with negative quantity', async () => {
      const invalidOrderDto = {
        customerId: 'customer-123',
        items: [
          {
            productId: 'product-1',
            quantity: -1,
            unitPrice: 50.0,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/orders')
        .send(invalidOrderDto)
        .expect(500); // Will throw from domain validation
    });
  });

  describe('GET /orders/:id - Retrieve Order', () => {
    it('should retrieve the created order', async () => {
      if (!orderId) {
        // Create order first
        const createResponse = await request(app.getHttpServer())
          .post('/orders')
          .send({
            customerId: 'customer-456',
            items: [{ productId: 'product-3', quantity: 1, unitPrice: 75.0 }],
          });

        orderId = createResponse.body.orderId;
      }

      const response = await request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .expect(200);

      expect(response.body).toHaveProperty('orderId', orderId);
      expect(response.body).toHaveProperty('customerId');
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('totalAmount');
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('should return 404 for non-existent order', async () => {
      await request(app.getHttpServer())
        .get('/orders/non-existent-id')
        .expect(404);
    });
  });

  describe('GET /orders - Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'order-service');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /orders/metrics - Prometheus Metrics', () => {
    it('should return Prometheus metrics', async () => {
      const response = await request(app.getHttpServer())
        .get('/orders/metrics')
        .expect(200);

      expect(typeof response.text).toBe('string');
      // Verify metrics format
      expect(response.text).toContain('orders_created_total');
    });
  });

  describe('Business Logic Validations', () => {
    it('should calculate total amount correctly', async () => {
      const createOrderDto = {
        customerId: 'customer-789',
        items: [
          { productId: 'product-4', quantity: 3, unitPrice: 20.0 }, // 60
          { productId: 'product-5', quantity: 2, unitPrice: 15.5 }, // 31
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(createOrderDto)
        .expect(201);

      const order = await request(app.getHttpServer())
        .get(`/orders/${response.body.orderId}`)
        .expect(200);

      expect(order.body.totalAmount).toBe(91.0); // 60 + 31
    });

    it('should handle multiple items correctly', async () => {
      const createOrderDto = {
        customerId: 'customer-multi',
        items: [
          { productId: 'product-6', quantity: 1, unitPrice: 10.0 },
          { productId: 'product-7', quantity: 1, unitPrice: 20.0 },
          { productId: 'product-8', quantity: 1, unitPrice: 30.0 },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/orders')
        .send(createOrderDto)
        .expect(201);

      const order = await request(app.getHttpServer())
        .get(`/orders/${response.body.orderId}`)
        .expect(200);

      expect(order.body.items).toHaveLength(3);
      expect(order.body.totalAmount).toBe(60.0);
    });
  });

  describe('Concurrency Tests', () => {
    it('should handle multiple concurrent order creations', async () => {
      const promises = [];

      for (let i = 0; i < 10; i++) {
        const promise = request(app.getHttpServer())
          .post('/orders')
          .send({
            customerId: `customer-concurrent-${i}`,
            items: [{ productId: 'product-concurrent', quantity: 1, unitPrice: 10.0 }],
          });
        promises.push(promise);
      }

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('orderId');
      });

      // Verify all orders have unique IDs
      const orderIds = responses.map((r) => r.body.orderId);
      const uniqueIds = new Set(orderIds);
      expect(uniqueIds.size).toBe(10);
    });
  });
});

describe('Integration with Domain Events', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrderModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should emit OrderCreatedEvent when order is created', async () => {
    // This test will need to be expanded once we have proper event listening
    const createOrderDto = {
      customerId: 'customer-event-test',
      items: [{ productId: 'product-event', quantity: 1, unitPrice: 99.99 }],
    };

    const response = await request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto)
      .expect(201);

    expect(response.body.orderId).toBeDefined();

    // TODO: Add event listener to verify OrderCreatedEvent was published to NATS
    // For now, we just verify the order was created
  });
});
