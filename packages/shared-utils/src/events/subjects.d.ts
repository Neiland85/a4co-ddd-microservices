/**
 * Event Subjects/Topics para NATS
 * Organizados por dominio para facilitar el mantenimiento
 */
export declare const EventSubjects: {
    readonly ORDER_CREATED: "order.created";
    readonly ORDER_CONFIRMED: "order.confirmed";
    readonly ORDER_CANCELLED: "order.cancelled";
    readonly ORDER_DELIVERED: "order.delivered";
    readonly ORDER_UPDATED: "order.updated";
    readonly ORDER_PAYMENT_REQUESTED: "order.payment.requested";
    readonly STOCK_RESERVED: "inventory.stock.reserved";
    readonly STOCK_RELEASED: "inventory.stock.released";
    readonly STOCK_UPDATED: "inventory.stock.updated";
    readonly LOW_STOCK_WARNING: "inventory.stock.warning";
    readonly STOCK_DEPLETED: "inventory.stock.depleted";
    readonly STOCK_REPLENISHED: "inventory.stock.replenished";
    readonly PAYMENT_INITIATED: "payment.initiated";
    readonly PAYMENT_SUCCEEDED: "payment.succeeded";
    readonly PAYMENT_FAILED: "payment.failed";
    readonly PAYMENT_CANCELLED: "payment.cancelled";
    readonly REFUND_INITIATED: "payment.refund.initiated";
    readonly REFUND_PROCESSED: "payment.refund.processed";
    readonly REFUND_FAILED: "payment.refund.failed";
    readonly USER_REGISTERED: "user.registered";
    readonly USER_VERIFIED: "user.verified";
    readonly USER_PROFILE_UPDATED: "user.profile.updated";
    readonly USER_PREFERENCES_CHANGED: "user.preferences.changed";
    readonly USER_DEACTIVATED: "user.deactivated";
    readonly USER_PASSWORD_CHANGED: "user.password.changed";
    readonly USER_LOGIN_ATTEMPTED: "user.login.attempted";
    readonly USER_LOGIN_SUCCEEDED: "user.login.succeeded";
    readonly USER_LOGIN_FAILED: "user.login.failed";
    readonly ARTISAN_REGISTERED: "artisan.registered";
    readonly ARTISAN_VERIFIED: "artisan.verified";
    readonly ARTISAN_STATUS_CHANGED: "artisan.status.changed";
    readonly ARTISAN_PROFILE_UPDATED: "artisan.profile.updated";
    readonly PRODUCT_LISTED: "artisan.product.listed";
    readonly ARTISAN_PRODUCT_UPDATED: "artisan.product.updated";
    readonly PRODUCT_DELISTED: "artisan.product.delisted";
    readonly PRODUCT_CREATED: "product.created";
    readonly PRODUCT_UPDATED: "product.updated";
    readonly PRODUCT_DELETED: "product.deleted";
    readonly PRODUCT_PRICE_CHANGED: "product.price.changed";
    readonly PRODUCT_AVAILABILITY_CHANGED: "product.availability.changed";
    readonly PRODUCT_CATEGORY_CHANGED: "product.category.changed";
    readonly NOTIFICATION_TRIGGERED: "notification.triggered";
    readonly EMAIL_SENT: "notification.email.sent";
    readonly EMAIL_DELIVERED: "notification.email.delivered";
    readonly EMAIL_FAILED: "notification.email.failed";
    readonly SMS_SENT: "notification.sms.sent";
    readonly SMS_DELIVERED: "notification.sms.delivered";
    readonly SMS_FAILED: "notification.sms.failed";
    readonly PUSH_NOTIFICATION_SENT: "notification.push.sent";
    readonly LOCATION_UPDATED: "geo.location.updated";
    readonly DELIVERY_ZONE_CHANGED: "geo.delivery_zone.changed";
    readonly ARTISAN_LOCATION_VERIFIED: "geo.artisan.verified";
    readonly NEARBY_SEARCH_PERFORMED: "geo.search.nearby";
    readonly POINTS_EARNED: "loyalty.points.earned";
    readonly POINTS_REDEEMED: "loyalty.points.redeemed";
    readonly TIER_UPGRADED: "loyalty.tier.upgraded";
    readonly REWARD_UNLOCKED: "loyalty.reward.unlocked";
    readonly CAMPAIGN_TRIGGERED: "loyalty.campaign.triggered";
    readonly PRODUCT_INFORMATION_REQUESTED: "integration.product.info.requested";
    readonly PRODUCT_INFORMATION_PROVIDED: "integration.product.info.provided";
    readonly STOCK_VALIDATION_REQUESTED: "integration.stock.validation.requested";
    readonly STOCK_VALIDATION_RESPONSE: "integration.stock.validation.response";
    readonly USER_INFORMATION_REQUESTED: "integration.user.info.requested";
    readonly USER_INFORMATION_PROVIDED: "integration.user.info.provided";
    readonly SAGA_STARTED: "saga.started";
    readonly SAGA_STEP_COMPLETED: "saga.step.completed";
    readonly SAGA_COMPLETED: "saga.completed";
    readonly SAGA_FAILED: "saga.failed";
    readonly SAGA_COMPENSATION_TRIGGERED: "saga.compensation.triggered";
    readonly PAGE_VIEW_TRACKED: "analytics.pageview";
    readonly USER_ACTION_TRACKED: "analytics.action";
    readonly CONVERSION_TRACKED: "analytics.conversion";
    readonly SALES_RECORDED: "analytics.sales";
    readonly PERFORMANCE_METRIC_RECORDED: "analytics.performance";
    readonly CHAT_MESSAGE_SENT: "chat.message.sent";
    readonly CHAT_MESSAGE_DELIVERED: "chat.message.delivered";
    readonly CHAT_MESSAGE_READ: "chat.message.read";
    readonly CHAT_CONVERSATION_STARTED: "chat.conversation.started";
    readonly CHAT_CONVERSATION_ENDED: "chat.conversation.ended";
    readonly CONTENT_PUBLISHED: "cms.content.published";
    readonly CONTENT_UPDATED: "cms.content.updated";
    readonly CONTENT_DELETED: "cms.content.deleted";
    readonly CONTENT_APPROVED: "cms.content.approved";
    readonly CONTENT_REJECTED: "cms.content.rejected";
    readonly ADMIN_ACTION_PERFORMED: "admin.action.performed";
    readonly SYSTEM_MAINTENANCE_SCHEDULED: "admin.maintenance.scheduled";
    readonly SYSTEM_BACKUP_COMPLETED: "admin.backup.completed";
    readonly SECURITY_ALERT_TRIGGERED: "admin.security.alert";
    readonly MARKETPLACE_EVENT_CREATED: "event.marketplace.created";
    readonly MARKETPLACE_EVENT_UPDATED: "event.marketplace.updated";
    readonly MARKETPLACE_EVENT_CANCELLED: "event.marketplace.cancelled";
    readonly EVENT_ATTENDANCE_REGISTERED: "event.attendance.registered";
    readonly HEALTH_CHECK_PERFORMED: "system.health.check";
    readonly SERVICE_STARTED: "system.service.started";
    readonly SERVICE_STOPPED: "system.service.stopped";
    readonly SERVICE_ERROR: "system.service.error";
    readonly INTEGRATION_ERROR: "system.integration.error";
    readonly DLQ_SUFFIX: ".dlq";
    readonly RETRY_SUFFIX: ".retry";
};
export type EventSubjectKeys = keyof typeof EventSubjects;
export type EventSubjectValues = (typeof EventSubjects)[EventSubjectKeys];
/**
 * Subject patterns for subscription wildcards
 */
export declare const SubjectPatterns: {
    readonly ALL_ORDER_EVENTS: "order.*";
    readonly ALL_PAYMENT_EVENTS: "payment.*";
    readonly ALL_INVENTORY_EVENTS: "inventory.*";
    readonly ALL_USER_EVENTS: "user.*";
    readonly ALL_NOTIFICATION_EVENTS: "notification.*";
    readonly ALL_SYSTEM_EVENTS: "system.*";
    readonly ALL_EVENTS: "*";
    readonly ALL_STOCK_EVENTS: "inventory.stock.*";
    readonly ALL_PAYMENT_REFUND_EVENTS: "payment.refund.*";
    readonly ALL_EMAIL_EVENTS: "notification.email.*";
    readonly ALL_SMS_EVENTS: "notification.sms.*";
    readonly ALL_DLQ_EVENTS: "*.dlq";
    readonly ALL_RETRY_EVENTS: "*.retry";
};
/**
 * Queue names for load balancing
 */
export declare const QueueNames: {
    readonly ORDER_PROCESSING: "order-processing-queue";
    readonly PAYMENT_PROCESSING: "payment-processing-queue";
    readonly INVENTORY_MANAGEMENT: "inventory-management-queue";
    readonly NOTIFICATION_DELIVERY: "notification-delivery-queue";
    readonly EMAIL_SENDING: "email-sending-queue";
    readonly SMS_SENDING: "sms-sending-queue";
    readonly ANALYTICS_EVENTS: "analytics-events-queue";
    readonly METRICS_COLLECTION: "metrics-collection-queue";
    readonly BACKGROUND_TASKS: "background-tasks-queue";
    readonly CLEANUP_TASKS: "cleanup-tasks-queue";
    readonly HIGH_PRIORITY: "high-priority-queue";
    readonly LOW_PRIORITY: "low-priority-queue";
};
/**
 * Utility functions for subject management
 */
export declare class SubjectUtils {
    /**
     * Create a dead letter queue subject for a given subject
     */
    static createDLQSubject(originalSubject: string): string;
    /**
     * Create a retry subject for a given subject
     */
    static createRetrySubject(originalSubject: string): string;
    /**
     * Extract domain from subject
     */
    static extractDomain(subject: string): string;
    /**
     * Extract event type from subject
     */
    static extractEventType(subject: string): string;
    /**
     * Check if subject is a DLQ subject
     */
    static isDLQSubject(subject: string): boolean;
    /**
     * Check if subject is a retry subject
     */
    static isRetrySubject(subject: string): boolean;
    /**
     * Validate subject format
     */
    static isValidSubject(subject: string): boolean;
}
/**
 * Event priority levels for routing
 */
export declare enum EventPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    CRITICAL = "critical"
}
/**
 * Event categories for filtering and routing
 */
export declare enum EventCategory {
    BUSINESS = "business",// Core business events
    SYSTEM = "system",// System/infrastructure events
    INTEGRATION = "integration",// External system integration events
    ANALYTICS = "analytics",// Analytics and tracking events
    SECURITY = "security"
}
//# sourceMappingURL=subjects.d.ts.map