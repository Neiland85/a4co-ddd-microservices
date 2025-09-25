/**
 * Event Subjects/Topics para NATS
 * Organizados por dominio para facilitar el mantenimiento
 */

export const EventSubjects = {
  // ========================================
  // ORDER DOMAIN EVENTS
  // ========================================
  ORDER_CREATED: 'order.created.v1',
  ORDER_CONFIRMED: 'order.confirmed.v1',
  ORDER_CANCELLED: 'order.cancelled.v1',
  ORDER_DELIVERED: 'order.delivered.v1',
  ORDER_UPDATED: 'order.updated.v1',
  ORDER_PAYMENT_REQUESTED: 'order.payment.requested.v1',

  // ========================================
  // INVENTORY DOMAIN EVENTS
  // ========================================
  STOCK_RESERVED: 'inventory.stock.reserved.v1',
  STOCK_RELEASED: 'inventory.stock.released.v1',
  STOCK_UPDATED: 'inventory.stock.updated.v1',
  LOW_STOCK_WARNING: 'inventory.stock.warning.v1',
  STOCK_DEPLETED: 'inventory.stock.depleted.v1',
  STOCK_REPLENISHED: 'inventory.stock.replenished.v1',

  // ========================================
  // PAYMENT DOMAIN EVENTS
  // ========================================
  PAYMENT_INITIATED: 'payment.initiated.v1',
  PAYMENT_SUCCEEDED: 'payment.succeeded.v1',
  PAYMENT_FAILED: 'payment.failed.v1',
  PAYMENT_CANCELLED: 'payment.cancelled.v1',
  REFUND_INITIATED: 'payment.refund.initiated.v1',
  REFUND_PROCESSED: 'payment.refund.processed.v1',
  REFUND_FAILED: 'payment.refund.failed.v1',

  // ========================================
  // USER DOMAIN EVENTS
  // ========================================
  USER_REGISTERED: 'user.registered.v1',
  USER_VERIFIED: 'user.verified.v1',
  USER_PROFILE_UPDATED: 'user.profile.updated.v1',
  USER_PREFERENCES_CHANGED: 'user.preferences.changed.v1',
  USER_DEACTIVATED: 'user.deactivated.v1',
  USER_PASSWORD_CHANGED: 'user.password.changed.v1',
  USER_LOGIN_ATTEMPTED: 'user.login.attempted.v1',
  USER_LOGIN_SUCCEEDED: 'user.login.succeeded.v1',
  USER_LOGIN_FAILED: 'user.login.failed.v1',

  // ========================================
  // ARTISAN DOMAIN EVENTS
  // ========================================
  ARTISAN_REGISTERED: 'artisan.registered.v1',
  ARTISAN_VERIFIED: 'artisan.verified.v1',
  ARTISAN_STATUS_CHANGED: 'artisan.status.changed.v1',
  ARTISAN_PROFILE_UPDATED: 'artisan.profile.updated.v1',
  PRODUCT_LISTED: 'artisan.product.listed.v1',
  ARTISAN_PRODUCT_UPDATED: 'artisan.product.updated.v1',
  PRODUCT_DELISTED: 'artisan.product.delisted.v1',

  // ========================================
  // PRODUCT DOMAIN EVENTS
  // ========================================
  PRODUCT_CREATED: 'product.created.v1',
  PRODUCT_UPDATED: 'product.updated.v1',
  PRODUCT_DELETED: 'product.deleted.v1',
  PRODUCT_PRICE_CHANGED: 'product.price.changed.v1',
  PRODUCT_AVAILABILITY_CHANGED: 'product.availability.changed.v1',
  PRODUCT_CATEGORY_CHANGED: 'product.category.changed.v1',

  // ========================================
  // NOTIFICATION DOMAIN EVENTS
  // ========================================
  NOTIFICATION_TRIGGERED: 'notification.triggered.v1',
  EMAIL_SENT: 'notification.email.sent.v1',
  EMAIL_DELIVERED: 'notification.email.delivered.v1',
  EMAIL_FAILED: 'notification.email.failed.v1',
  SMS_SENT: 'notification.sms.sent.v1',
  SMS_DELIVERED: 'notification.sms.delivered.v1',
  SMS_FAILED: 'notification.sms.failed.v1',
  PUSH_NOTIFICATION_SENT: 'notification.push.sent.v1',

  // ========================================
  // GEO/LOCATION DOMAIN EVENTS
  // ========================================
  LOCATION_UPDATED: 'geo.location.updated.v1',
  DELIVERY_ZONE_CHANGED: 'geo.delivery_zone.changed.v1',
  ARTISAN_LOCATION_VERIFIED: 'geo.artisan.verified.v1',
  NEARBY_SEARCH_PERFORMED: 'geo.search.nearby.v1',

  // ========================================
  // LOYALTY DOMAIN EVENTS
  // ========================================
  POINTS_EARNED: 'loyalty.points.earned.v1',
  POINTS_REDEEMED: 'loyalty.points.redeemed.v1',
  TIER_UPGRADED: 'loyalty.tier.upgraded.v1',
  REWARD_UNLOCKED: 'loyalty.reward.unlocked.v1',
  CAMPAIGN_TRIGGERED: 'loyalty.campaign.triggered.v1',

  // ========================================
  // INTEGRATION EVENTS - Para comunicación entre bounded contexts
  // ========================================
  PRODUCT_INFORMATION_REQUESTED: 'integration.product.info.requested.v1',
  PRODUCT_INFORMATION_PROVIDED: 'integration.product.info.provided.v1',
  STOCK_VALIDATION_REQUESTED: 'integration.stock.validation.requested.v1',
  STOCK_VALIDATION_RESPONSE: 'integration.stock.validation.response.v1',
  USER_INFORMATION_REQUESTED: 'integration.user.info.requested.v1',
  USER_INFORMATION_PROVIDED: 'integration.user.info.provided.v1',

  // ========================================
  // SAGA EVENTS
  // ========================================
  SAGA_STARTED: 'saga.started.v1',
  SAGA_STEP_COMPLETED: 'saga.step.completed.v1',
  SAGA_COMPLETED: 'saga.completed.v1',
  SAGA_FAILED: 'saga.failed.v1',
  SAGA_COMPENSATION_TRIGGERED: 'saga.compensation.triggered.v1',

  // ========================================
  // ANALYTICS DOMAIN EVENTS
  // ========================================
  PAGE_VIEW_TRACKED: 'analytics.pageview.v1',
  USER_ACTION_TRACKED: 'analytics.action.v1',
  CONVERSION_TRACKED: 'analytics.conversion.v1',
  SALES_RECORDED: 'analytics.sales.v1',
  PERFORMANCE_METRIC_RECORDED: 'analytics.performance.v1',

  // ========================================
  // CHAT DOMAIN EVENTS
  // ========================================
  CHAT_MESSAGE_SENT: 'chat.message.sent.v1',
  CHAT_MESSAGE_DELIVERED: 'chat.message.delivered.v1',
  CHAT_MESSAGE_READ: 'chat.message.read.v1',
  CHAT_CONVERSATION_STARTED: 'chat.conversation.started.v1',
  CHAT_CONVERSATION_ENDED: 'chat.conversation.ended.v1',

  // ========================================
  // CMS DOMAIN EVENTS
  // ========================================
  CONTENT_PUBLISHED: 'cms.content.published.v1',
  CONTENT_UPDATED: 'cms.content.updated.v1',
  CONTENT_DELETED: 'cms.content.deleted.v1',
  CONTENT_APPROVED: 'cms.content.approved.v1',
  CONTENT_REJECTED: 'cms.content.rejected.v1',

  // ========================================
  // ADMIN DOMAIN EVENTS
  // ========================================
  ADMIN_ACTION_PERFORMED: 'admin.action.performed.v1',
  SYSTEM_MAINTENANCE_SCHEDULED: 'admin.maintenance.scheduled.v1',
  SYSTEM_BACKUP_COMPLETED: 'admin.backup.completed.v1',
  SECURITY_ALERT_TRIGGERED: 'admin.security.alert.v1',

  // ========================================
  // EVENT SERVICE DOMAIN EVENTS
  // ========================================
  MARKETPLACE_EVENT_CREATED: 'event.marketplace.created.v1',
  MARKETPLACE_EVENT_UPDATED: 'event.marketplace.updated.v1',
  MARKETPLACE_EVENT_CANCELLED: 'event.marketplace.cancelled.v1',
  EVENT_ATTENDANCE_REGISTERED: 'event.attendance.registered.v1',

  // ========================================
  // SYSTEM EVENTS
  // ========================================
  HEALTH_CHECK_PERFORMED: 'system.health.check.v1',
  SERVICE_STARTED: 'system.service.started.v1',
  SERVICE_STOPPED: 'system.service.stopped.v1',
  SERVICE_ERROR: 'system.service.error.v1',
  INTEGRATION_ERROR: 'system.integration.error.v1',

  // ========================================
  // DEAD LETTER QUEUE PATTERNS
  // ========================================
  DLQ_SUFFIX: '.dlq',
  RETRY_SUFFIX: '.retry',
} as const;

// Type-safe subject keys
export type EventSubjectKeys = keyof typeof EventSubjects;
export type EventSubjectValues = (typeof EventSubjects)[EventSubjectKeys];

/**
 * Subject patterns for subscription wildcards
 */
export const SubjectPatterns = {
  // All order events
  ALL_ORDER_EVENTS: 'order.*.v1',

  // All payment events
  ALL_PAYMENT_EVENTS: 'payment.*.v1',

  // All inventory events
  ALL_INVENTORY_EVENTS: 'inventory.*.v1',

  // All user events
  ALL_USER_EVENTS: 'user.*.v1',

  // All notification events
  ALL_NOTIFICATION_EVENTS: 'notification.*.v1',

  // All system events
  ALL_SYSTEM_EVENTS: 'system.*.v1',

  // All events (use with caution)
  ALL_EVENTS: '*.v1',

  // Domain-specific patterns
  ALL_STOCK_EVENTS: 'inventory.stock.*.v1',
  ALL_PAYMENT_REFUND_EVENTS: 'payment.refund.*.v1',
  ALL_EMAIL_EVENTS: 'notification.email.*.v1',
  ALL_SMS_EVENTS: 'notification.sms.*.v1',

  // Dead letter queues
  ALL_DLQ_EVENTS: '*.dlq',
  ALL_RETRY_EVENTS: '*.retry',
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
  LOW_PRIORITY: 'low-priority-queue',
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
    const parts = subject.split('.');
    return parts[0] || 'unknown';
  }

  /**
   * Extract event type from subject
   */
  static extractEventType(subject: string): string {
    const parts = subject.split('.');
    return parts[parts.length - 1] || 'unknown';
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
  CRITICAL = 'critical',
}

/**
 * Event categories for filtering and routing
 */
export enum EventCategory {
  BUSINESS = 'business', // Core business events
  SYSTEM = 'system', // System/infrastructure events
  INTEGRATION = 'integration', // External system integration events
  ANALYTICS = 'analytics', // Analytics and tracking events
  SECURITY = 'security', // Security-related events
}
