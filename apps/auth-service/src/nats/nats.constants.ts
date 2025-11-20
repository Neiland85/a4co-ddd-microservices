export const NATS_CONFIG = {
  servers: (process.env as any).NATS_URL || 'nats://localhost:4222',
  token: (process.env as any).NATS_AUTH_TOKEN || '',
  name: 'auth-service',
};
