/**
 * Event Subjects/Topics para NATS
 * Organizados por dominio para facilitar el mantenimiento
 */

export const EventSubjects = {
  // ========================================
  // ORDER DOMAIN EVENTS
  // ========================================
  ORDER_CREATED: 'order.created',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_DELIVERED: 'order.delivered',
  ORDER_UPDATED: 'order.updated',
  ORDER_PAYMENT_REQUESTED: 'order.payment.requested',
  
  // ========================================
  // INVENTORY DOMAIN EVENTS
  // ========================================
  STOCK_RESERVED: 'inventory.stock.reserved',
  STOCK_RELEASED: 'inventory.stock.released',
  STOCK_UPDATED: 'inventory.stock.updated',
  LOW_STOCK_WARNING: 'inventory.stock.warning',
  STOCK_DEPLETED: 'inventory.stock.depleted',
  STOCK_REPLENISHED: 'inventory.stock.replenished',
  
  // ========================================
  // PAYMENT DOMAIN EVENTS
  // ========================================
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_CANCELLED: 'payment.cancelled',
  REFUND_INITIATED: 'payment.refund.initiated',
  REFUND_PROCESSED: 'payment.refund.processed',
  REFUND_FAILED: 'payment.refund.failed',
  
  // ========================================
  // USER DOMAIN EVENTS
  // ========================================
  USER_REGISTERED: 'user.registered',
  USER_VERIFIED: 'user.verified',
  USER_PROFILE_UPDATED: 'user.profile.updated',
  USER_PREFERENCES_CHANGED: 'user.preferences.changed',
  USER_DEACTIVATED: 'user.deactivated',
  USER_PASSWORD_CHANGED: 'user.password.changed',
  USER_LOGIN_ATTEMPTED: 'user.login.attempted',
  USER_LOGIN_SUCCEEDED: 'user.login.succeeded',
  USER_LOGIN_FAILED: 'user.login.failed',
  
  // ========================================
  // ARTISAN DOMAIN EVENTS
  // ========================================
  ARTISAN_REGISTERED: 'artisan.registered',
  ARTISAN_VERIFIED: 'artisan.verified',
  ARTISAN_STATUS_CHANGED: 'artisan.status.changed',
  ARTISAN_PROFILE_UPDATED: 'artisan.profile.updated',
  NEW_PRODUCT_LISTED: 'artisan.product.listed',
  PRODUCT_UPDATED: 'artisan.product.updated',
  PRODUCT_DELISTED: 'artisan.product.delisted',
  
  // ========================================
  // PRODUCT DOMAIN EVENTS
  // ========================================
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  PRODUCT_PRICE_CHANGED: 'product.price.changed',
  PRODUCT_AVAILABILITY_CHANGED: 'product.availability.changed',
  PRODUCT_CATEGORY_CHANGED: 'product.category.changed',
  
  // ========================================
  // NOTIFICATION DOMAIN EVENTS
  // ========================================
  NOTIFICATION_TRIGGERED: 'notification.triggered',
  EMAIL_SENT: 'notification.email.sent',
  EMAIL_DELIVERED: 'notification.email.delivered',
  EMAIL_FAILED: 'notification.email.failed',
  SMS_SENT: 'notification.sms.sent',
  SMS_DELIVERED: 'notification.sms.delivered',
  SMS_FAILED: 'notification.sms.failed',
  PUSH_NOTIFICATION_SENT: 'notification.push.sent',
  
  // ========================================
  // GEO/LOCATION DOMAIN EVENTS
  // ========================================
  LOCATION_UPDATED: 'geo.location.updated',
  DELIVERY_ZONE_CHANGED: 'geo.delivery_zone.changed',
  ARTISAN_LOCATION_VERIFIED: 'geo.artisan.verified',
  NEARBY_SEARCH_PERFORMED: 'geo.search.nearby',
  
  // ========================================
  // LOYALTY DOMAIN EVENTS
  // ========================================
  POINTS_EARNED: 'loyalty.points.earned',
  POINTS_REDEEMED: 'loyalty.points.redeemed',
  TIER_UPGRADED: 'loyalty.tier.upgraded',
  REWARD_UNLOCKED: 'loyalty.reward.unlocked',
  CAMPAIGN_TRIGGERED: 'loyalty.campaign.triggered',
  
  // ========================================
  // INTEGRATION EVENTS - Para comunicación entre bounded contexts
  // ========================================
  PRODUCT_INFORMATION_REQUESTED: 'integration.product.info.requested',
  PRODUCT_INFORMATION_PROVIDED: 'integration.product.info.provided',
  STOCK_VALIDATION_REQUESTED: 'integration.stock.validation.requested',
  STOCK_VALIDATION_RESPONSE: 'integration.stock.validation.response',
  USER_INFORMATION_REQUESTED: 'integration.user.info.requested',
  USER_INFORMATION_PROVIDED: 'integration.user.info.provided',
  
  // ========================================
  // SAGA EVENTS
  // ========================================
  SAGA_STARTED: 'saga.started',
  SAGA_STEP_COMPLETED: 'saga.step.completed',
  SAGA_COMPLETED: 'saga.completed',
  SAGA_FAILED: 'saga.failed',
  SAGA_COMPENSATION_TRIGGERED: 'saga.compensation.triggered',
  
  // ========================================
  // ANALYTICS DOMAIN EVENTS
  // ========================================
  PAGE_VIEW_TRACKED: 'analytics.pageview',
  USER_ACTION_TRACKED: 'analytics.action',
  CONVERSION_TRACKED: 'analytics.conversion',
  SALES_RECORDED: 'analytics.sales',
  PERFORMANCE_METRIC_RECORDED: 'analytics.performance',
  
  // ========================================
  // CHAT DOMAIN EVENTS
  // ========================================
  CHAT_MESSAGE_SENT: 'chat.message.sent',
  CHAT_MESSAGE_DELIVERED: 'chat.message.delivered',
  CHAT_MESSAGE_READ: 'chat.message.read',
  CHAT_CONVERSATION_STARTED: 'chat.conversation.started',
  CHAT_CONVERSATION_ENDED: 'chat.conversation.ended',
  
  // ========================================
  // CMS DOMAIN EVENTS
  // ========================================
  CONTENT_PUBLISHED: 'cms.content.published',
  CONTENT_UPDATED: 'cms.content.updated',
  CONTENT_DELETED: 'cms.content.deleted',
  CONTENT_APPROVED: 'cms.content.approved',
  CONTENT_REJECTED: 'cms.content.rejected',
  
  // ========================================
  // ADMIN DOMAIN EVENTS
  // ========================================
  ADMIN_ACTION_PERFORMED: 'admin.action.performed',
  SYSTEM_MAINTENANCE_SCHEDULED: 'admin.maintenance.scheduled',
  SYSTEM_BACKUP_COMPLETED: 'admin.backup.completed',
  SECURITY_ALERT_TRIGGERED: 'admin.security.alert',
  
  // ========================================
  // EVENT SERVICE DOMAIN EVENTS
  // ========================================
  MARKETPLACE_EVENT_CREATED: 'event.marketplace.created',
  MARKETPLACE_EVENT_UPDATED: 'event.marketplace.updated',
  MARKETPLACE_EVENT_CANCELLED: 'event.marketplace.cancelled',
  EVENT_ATTENDANCE_REGISTERED: 'event.attendance.registered',
  
  // ========================================
  // SYSTEM EVENTS
  // ========================================
  HEALTH_CHECK_PERFORMED: 'system.health.check',
  SERVICE_STARTED: 'system.service.started',
  SERVICE_STOPPED: 'system.service.stopped',
  SERVICE_ERROR: 'system.service.error',
  INTEGRATION_ERROR: 'system.integration.error',
  
  // ========================================
  // DEAD LETTER QUEUE PATTERNS
  // ========================================
  DLQ_SUFFIX: '.dlq',
  RETRY_SUFFIX: '.retry'
} as const;

// Type-safe subject keys
export type EventSubjectKeys = keyof typeof EventSubjects;
export type EventSubjectValues = typeof EventSubjects[EventSubjectKeys];

/**
 * Subject patterns for subscription wildcards
 */
export const SubjectPatterns = {
  // All order events
  ALL_ORDER_EVENTS: 'order.*',
  
  // All payment events
  ALL_PAYMENT_EVENTS: 'payment.*',
  
  // All inventory events
  ALL_INVENTORY_EVENTS: 'inventory.*',
  
  // All user events
  ALL_USER_EVENTS: 'user.*',
  
  // All notification events
  ALL_NOTIFICATION_EVENTS: 'notification.*',
  
  // All system events
  ALL_SYSTEM_EVENTS: 'system.*',
  
  // All events (use with caution)
  ALL_EVENTS: '*',
  
  // Domain-specific patterns
  ALL_STOCK_EVENTS: 'inventory.stock.*',
  ALL_PAYMENT_REFUND_EVENTS: 'payment.refund.*',
  ALL_EMAIL_EVENTS: 'notification.email.*',
  ALL_SMS_EVENTS: 'notification.sms.*',
  
  // Dead letter queues
  ALL_DLQ_EVENTS: '*.dlq',
  ALL_RETRY_EVENTS: '*.retry'
} as const;

/**
 * Queue names for load balancing
 */
export const QueueNames = {
  // Service-specific queues
  ORDER_PROCESSING: 'order-processing-queue',
  PAYMENT_PROCESSING: 'payment-processing-queue',
  INVENTORY_MANAGEMENT: 'inventory-management-queue',
  NOTIFICATION_DELIVERY: 'notification-delivery-queue',
  EMAIL_SENDING: 'email-sending-queue',
  SMS_SENDING: 'sms-sending-queue',
  
  // Analytics queues
  ANALYTICS_EVENTS: 'analytics-events-queue',
  METRICS_COLLECTION: 'metrics-collection-queue',
  
  // Background processing
  BACKGROUND_TASKS: 'background-tasks-queue',
  CLEANUP_TASKS: 'cleanup-tasks-queue',
  
  // Priority queues
  HIGH_PRIORITY: 'high-priority-queue',
  LOW_PRIORITY: 'low-priority-queue'
} as const;

/**
 * Utility functions for subject management
 */
export class SubjectUtils {
  /**
   * Create a dead letter queue subject for a given subject
   */
  static createDLQSubject(originalSubject: string): string {
    return `${originalSubject}${EventSubjects.DLQ_SUFFIX}`;
  }

  /**
   * Create a retry subject for a given subject
   */
  static createRetrySubject(originalSubject: string): string {
    return `${originalSubject}${EventSubjects.RETRY_SUFFIX}`;
  }

  /**
   * Extract domain from subject
   */
  static extractDomain(subject: string): string {
    return subject.split('.')[0];
  }

  /**
   * Extract event type from subject
   */
  static extractEventType(subject: string): string {
    const parts = subject.split('.');
    return parts[parts.length - 1];
  }

  /**
   * Check if subject is a DLQ subject
   */
  static isDLQSubject(subject: string): boolean {
    return subject.endsWith(EventSubjects.DLQ_SUFFIX);
  }

  /**
   * Check if subject is a retry subject
   */
  static isRetrySubject(subject: string): boolean {
    return subject.endsWith(EventSubjects.RETRY_SUFFIX);
  }

  /**
   * Validate subject format
   */
  static isValidSubject(subject: string): boolean {
    // Basic validation: should have at least domain.event format
    const parts = subject.split('.');
    return parts.length >= 2 && parts.every(part => part.length > 0);
  }
}

/**
 * Event priority levels for routing
 */
export enum EventPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Event categories for filtering and routing
 */
export enum EventCategory {
  BUSINESS = 'business',      // Core business events
  SYSTEM = 'system',          // System/infrastructure events
  INTEGRATION = 'integration', // External system integration events
  ANALYTICS = 'analytics',    // Analytics and tracking events
  SECURITY = 'security'       // Security-related events
}