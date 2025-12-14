/**
 * Gateway Configuration
 */

export const configuration = () => ({
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    // Service URLs
    services: {
        auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
        products: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3002',
        orders: process.env.ORDERS_SERVICE_URL || 'http://localhost:3003',
        inventory: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3004',
    },

    // Proxy settings
    proxy: {
        timeout: parseInt(process.env.PROXY_TIMEOUT || '30000', 10),
        changeOrigin: process.env.PROXY_CHANGE_ORIGIN === 'true',
    },

    // Rate limiting
    rateLimit: {
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
        max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    },

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },

    // Logging
    logging: {
        level: process.env.LOG_LEVEL || 'debug',
    },
});

export type GatewayConfig = ReturnType<typeof configuration>;
