export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  proxy: {
    timeout: parseInt(process.env.PROXY_TIMEOUT || '30000', 10),
  },

  services: {
    auth:
      process.env.AUTH_SERVICE_URL ||
      process.env.AUTH_URL ||
      'http://localhost:3001',

    products:
      process.env.PRODUCTS_SERVICE_URL ||
      process.env.PRODUCT_SERVICE_URL ||
      process.env.PRODUCTS_URL ||
      'http://localhost:3002',

    orders:
      process.env.ORDERS_SERVICE_URL ||
      process.env.ORDER_SERVICE_URL ||
      process.env.ORDERS_URL ||
      'http://localhost:3004',

    inventory:
      process.env.INVENTORY_SERVICE_URL ||
      process.env.INVENTORY_URL ||
      'http://localhost:3006',

    payments:
      process.env.PAYMENTS_SERVICE_URL ||
      process.env.PAYMENT_SERVICE_URL ||
      process.env.PAYMENTS_URL ||
      'http://localhost:3005',

    sagas:
      process.env.SAGAS_SERVICE_URL ||
      process.env.SAGA_SERVICE_URL ||
      process.env.SAGAS_URL ||
      'http://localhost:3006',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'preview-local-jwt-secret',
  },
});
