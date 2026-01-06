/**
 * Gateway Configuration
 */

export const configuration = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || '',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },

    // Service URLs (defaults for local development, use env vars in Docker)
    services: {
        auth: process.env.AUTH_SERVICE_URL || 'http://localhost:4000',
        products: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3002',
        orders: process.env.ORDERS_SERVICE_URL || 'http://localhost:3000',
        inventory: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3002',
        payments: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3001',
        sagas: process.env.SAGAS_SERVICE_URL || 'http://localhost:3006',
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

    // CORS (Allow both dashboard-client and local dev)
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:4200',
    },

    // Logging
    logging: {
        level: process.env.LOG_LEVEL || 'debug',
    },
});

export type GatewayConfig = ReturnType<typeof configuration>;
