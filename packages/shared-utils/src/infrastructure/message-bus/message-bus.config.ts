/**
 * Configuración centralizada para el Message Bus
 * Define exchanges, queues y bindings para toda la arquitectura
 */

export interface ExchangeConfig {
  name: string;
  type: 'direct' | 'topic' | 'fanout' | 'headers';
  durable: boolean;
  autoDelete?: boolean;
}

export interface QueueConfig {
  name: string;
  durable: boolean;
  exclusive?: boolean;
  autoDelete?: boolean;
  messageTtl?: number;
  deadLetterExchange?: string;
  deadLetterRoutingKey?: string;
  maxLength?: number;
  maxPriority?: number;
}

export interface BindingConfig {
  exchange: string;
  pattern: string;
}

export interface MessageBusConfig {
  connection: {
    url?: string;
    hostname?: string;
    port?: number;
    username?: string;
    password?: string;
    vhost?: string;
    heartbeat?: number;
    connectionTimeout?: number;
  };
  exchanges: Record<string, ExchangeConfig>;
  queues: Record<string, QueueConfig & { bindings: BindingConfig[] }>;
  deadLetterConfig: {
    exchange: string;
    queue: string;
    ttl: number;
  };
}

export const DEFAULT_MESSAGE_BUS_CONFIG: MessageBusConfig = {
  connection: {
    hostname: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT || '5672'),
    username: process.env.RABBITMQ_USER || 'guest',
    password: process.env.RABBITMQ_PASS || 'guest',
    vhost: process.env.RABBITMQ_VHOST || '/',
    heartbeat: 60,
    connectionTimeout: 10000,
  },

  exchanges: {
    // Domain Events Exchange (Topic)
    'domain.events': {
      name: 'a4co.domain.events',
      type: 'topic',
      durable: true,
    },

    // Order Service Events
    'orders.events': {
      name: 'a4co.orders.events',
      type: 'topic',
      durable: true,
    },

    // Payment Service Events
    'payments.events': {
      name: 'a4co.payments.events',
      type: 'topic',
      durable: true,
    },

    // Inventory Service Events
    'inventory.events': {
      name: 'a4co.inventory.events',
      type: 'topic',
      durable: true,
    },

    // Product Service Events
    'products.events': {
      name: 'a4co.products.events',
      type: 'topic',
      durable: true,
    },

    // User Service Events
    'users.events': {
      name: 'a4co.users.events',
      type: 'topic',
      durable: true,
    },

    // Notification Service Commands (Direct)
    'notifications.commands': {
      name: 'a4co.notifications.commands',
      type: 'direct',
      durable: true,
    },

    // Dead Letter Exchange
    'dead.letter': {
      name: 'a4co.dead.letter',
      type: 'direct',
      durable: true,
    },

    // Saga Orchestration Exchange
    'saga.orchestration': {
      name: 'a4co.saga.orchestration',
      type: 'topic',
      durable: true,
    },
  },

  queues: {
    // Order Service Queues
    'order.payment.events': {
      name: 'a4co.order.payment.events',
      durable: true,
      messageTtl: 3600000, // 1 hour
      deadLetterExchange: 'a4co.dead.letter',
      deadLetterRoutingKey: 'order.payment.dead',
      bindings: [
        { exchange: 'a4co.payments.events', pattern: 'payment.processed' },
        { exchange: 'a4co.payments.events', pattern: 'payment.failed' },
        { exchange: 'a4co.payments.events', pattern: 'refund.completed' },
      ],
    },

    'order.inventory.events': {
      name: 'a4co.order.inventory.events',
      durable: true,
      bindings: [
        { exchange: 'a4co.inventory.events', pattern: 'stock.reserved' },
        { exchange: 'a4co.inventory.events', pattern: 'stock.released' },
        { exchange: 'a4co.inventory.events', pattern: 'stock.reservation.failed' },
      ],
    },

    // Inventory Service Queues
    'inventory.order.events': {
      name: 'a4co.inventory.order.events',
      durable: true,
      bindings: [
        { exchange: 'a4co.orders.events', pattern: 'order.created' },
        { exchange: 'a4co.orders.events', pattern: 'order.cancelled' },
        { exchange: 'a4co.orders.events', pattern: 'order.confirmed' },
      ],
    },

    'inventory.product.commands': {
      name: 'a4co.inventory.product.commands',
      durable: true,
      bindings: [
        { exchange: 'a4co.products.events', pattern: 'product.created' },
        { exchange: 'a4co.products.events', pattern: 'product.discontinued' },
      ],
    },

    // Payment Service Queues
    'payment.order.events': {
      name: 'a4co.payment.order.events',
      durable: true,
      bindings: [
        { exchange: 'a4co.orders.events', pattern: 'order.created' },
        { exchange: 'a4co.orders.events', pattern: 'order.cancelled' },
      ],
    },

    // Notification Service Queues
    'notification.all.events': {
      name: 'a4co.notification.all.events',
      durable: true,
      bindings: [
        // Order events
        { exchange: 'a4co.orders.events', pattern: 'order.*' },
        // Payment events
        { exchange: 'a4co.payments.events', pattern: 'payment.*' },
        { exchange: 'a4co.payments.events', pattern: 'refund.*' },
        // Inventory alerts
        { exchange: 'a4co.inventory.events', pattern: 'stock.low' },
        { exchange: 'a4co.inventory.events', pattern: 'stock.out' },
        // User events
        { exchange: 'a4co.users.events', pattern: 'user.registered' },
        { exchange: 'a4co.users.events', pattern: 'artisan.verified' },
      ],
    },

    'notification.priority': {
      name: 'a4co.notification.priority',
      durable: true,
      maxPriority: 10,
      bindings: [
        { exchange: 'a4co.notifications.commands', pattern: 'send.priority' },
      ],
    },

    // Analytics Service Queues
    'analytics.events': {
      name: 'a4co.analytics.events',
      durable: true,
      bindings: [
        { exchange: 'a4co.domain.events', pattern: '#' }, // Todos los eventos
      ],
    },

    // Loyalty Service Queues
    'loyalty.order.events': {
      name: 'a4co.loyalty.order.events',
      durable: true,
      bindings: [
        { exchange: 'a4co.orders.events', pattern: 'order.completed' },
        { exchange: 'a4co.orders.events', pattern: 'order.refunded' },
      ],
    },

    // Dead Letter Queue
    'dead.letter.queue': {
      name: 'a4co.dead.letter.queue',
      durable: true,
      messageTtl: 2592000000, // 30 días
      bindings: [
        { exchange: 'a4co.dead.letter', pattern: '#' },
      ],
    },

    // Saga Orchestration Queues
    'saga.order.orchestration': {
      name: 'a4co.saga.order.orchestration',
      durable: true,
      bindings: [
        { exchange: 'a4co.saga.orchestration', pattern: 'order.saga.*' },
      ],
    },
  },

  deadLetterConfig: {
    exchange: 'a4co.dead.letter',
    queue: 'a4co.dead.letter.queue',
    ttl: 2592000000, // 30 días
  },
};

/**
 * Routing Key Patterns
 * 
 * Orders:
 * - order.created
 * - order.confirmed
 * - order.cancelled
 * - order.shipped
 * - order.delivered
 * - order.completed
 * - order.refund.requested
 * 
 * Payments:
 * - payment.initiated
 * - payment.processed
 * - payment.failed
 * - payment.refund.initiated
 * - payment.refund.completed
 * 
 * Inventory:
 * - stock.reserved
 * - stock.released
 * - stock.low
 * - stock.out
 * - stock.replenished
 * - stock.adjusted
 * - stock.transferred
 * 
 * Products:
 * - product.created
 * - product.updated
 * - product.price.changed
 * - product.discontinued
 * - product.featured
 * 
 * Users:
 * - user.registered
 * - user.verified
 * - user.deactivated
 * - artisan.verified
 * - artisan.suspended
 */

export const getRoutingKey = (service: string, entity: string, action: string): string => {
  return `${entity}.${action}`.toLowerCase();
};

export const getExchangeName = (service: string): string => {
  return `a4co.${service}.events`;
};