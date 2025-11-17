export const NATS_CONFIG = {
  servers: process.env.NATS_URL || 'nats://localhost:4222',
  token: process.env.NATS_AUTH_TOKEN || '',
  name: 'auth-service',
};

