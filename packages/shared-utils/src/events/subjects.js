"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCategory = exports.EventPriority = exports.SubjectUtils = exports.QueueNames = exports.SubjectPatterns = exports.EventSubjects = void 0;
exports.EventSubjects = {
    ORDER_CREATED: 'order.created',
    ORDER_CONFIRMED: 'order.confirmed',
    ORDER_CANCELLED: 'order.cancelled',
    ORDER_DELIVERED: 'order.delivered',
    ORDER_UPDATED: 'order.updated',
    ORDER_PAYMENT_REQUESTED: 'order.payment.requested',
    STOCK_RESERVED: 'inventory.stock.reserved',
    STOCK_RELEASED: 'inventory.stock.released',
    STOCK_UPDATED: 'inventory.stock.updated',
    LOW_STOCK_WARNING: 'inventory.stock.warning',
    STOCK_DEPLETED: 'inventory.stock.depleted',
    STOCK_REPLENISHED: 'inventory.stock.replenished',
    PAYMENT_INITIATED: 'payment.initiated',
    PAYMENT_SUCCEEDED: 'payment.succeeded',
    PAYMENT_FAILED: 'payment.failed',
    PAYMENT_CANCELLED: 'payment.cancelled',
    REFUND_INITIATED: 'payment.refund.initiated',
    REFUND_PROCESSED: 'payment.refund.processed',
    REFUND_FAILED: 'payment.refund.failed',
    USER_REGISTERED: 'user.registered',
    USER_VERIFIED: 'user.verified',
    USER_PROFILE_UPDATED: 'user.profile.updated',
    USER_PREFERENCES_CHANGED: 'user.preferences.changed',
    USER_DEACTIVATED: 'user.deactivated',
    USER_PASSWORD_CHANGED: 'user.password.changed',
    USER_LOGIN_ATTEMPTED: 'user.login.attempted',
    USER_LOGIN_SUCCEEDED: 'user.login.succeeded',
    USER_LOGIN_FAILED: 'user.login.failed',
    ARTISAN_REGISTERED: 'artisan.registered',
    ARTISAN_VERIFIED: 'artisan.verified',
    ARTISAN_STATUS_CHANGED: 'artisan.status.changed',
    ARTISAN_PROFILE_UPDATED: 'artisan.profile.updated',
    PRODUCT_LISTED: 'artisan.product.listed',
    ARTISAN_PRODUCT_UPDATED: 'artisan.product.updated',
    PRODUCT_DELISTED: 'artisan.product.delisted',
    PRODUCT_CREATED: 'product.created',
    PRODUCT_UPDATED: 'product.updated',
    PRODUCT_DELETED: 'product.deleted',
    PRODUCT_PRICE_CHANGED: 'product.price.changed',
    PRODUCT_AVAILABILITY_CHANGED: 'product.availability.changed',
    PRODUCT_CATEGORY_CHANGED: 'product.category.changed',
    NOTIFICATION_TRIGGERED: 'notification.triggered',
    EMAIL_SENT: 'notification.email.sent',
    EMAIL_DELIVERED: 'notification.email.delivered',
    EMAIL_FAILED: 'notification.email.failed',
    SMS_SENT: 'notification.sms.sent',
    SMS_DELIVERED: 'notification.sms.delivered',
    SMS_FAILED: 'notification.sms.failed',
    PUSH_NOTIFICATION_SENT: 'notification.push.sent',
    LOCATION_UPDATED: 'geo.location.updated',
    DELIVERY_ZONE_CHANGED: 'geo.delivery_zone.changed',
    ARTISAN_LOCATION_VERIFIED: 'geo.artisan.verified',
    NEARBY_SEARCH_PERFORMED: 'geo.search.nearby',
    POINTS_EARNED: 'loyalty.points.earned',
    POINTS_REDEEMED: 'loyalty.points.redeemed',
    TIER_UPGRADED: 'loyalty.tier.upgraded',
    REWARD_UNLOCKED: 'loyalty.reward.unlocked',
    CAMPAIGN_TRIGGERED: 'loyalty.campaign.triggered',
    PRODUCT_INFORMATION_REQUESTED: 'integration.product.info.requested',
    PRODUCT_INFORMATION_PROVIDED: 'integration.product.info.provided',
    STOCK_VALIDATION_REQUESTED: 'integration.stock.validation.requested',
    STOCK_VALIDATION_RESPONSE: 'integration.stock.validation.response',
    USER_INFORMATION_REQUESTED: 'integration.user.info.requested',
    USER_INFORMATION_PROVIDED: 'integration.user.info.provided',
    SAGA_STARTED: 'saga.started',
    SAGA_STEP_COMPLETED: 'saga.step.completed',
    SAGA_COMPLETED: 'saga.completed',
    SAGA_FAILED: 'saga.failed',
    SAGA_COMPENSATION_TRIGGERED: 'saga.compensation.triggered',
    PAGE_VIEW_TRACKED: 'analytics.pageview',
    USER_ACTION_TRACKED: 'analytics.action',
    CONVERSION_TRACKED: 'analytics.conversion',
    SALES_RECORDED: 'analytics.sales',
    PERFORMANCE_METRIC_RECORDED: 'analytics.performance',
    CHAT_MESSAGE_SENT: 'chat.message.sent',
    CHAT_MESSAGE_DELIVERED: 'chat.message.delivered',
    CHAT_MESSAGE_READ: 'chat.message.read',
    CHAT_CONVERSATION_STARTED: 'chat.conversation.started',
    CHAT_CONVERSATION_ENDED: 'chat.conversation.ended',
    CONTENT_PUBLISHED: 'cms.content.published',
    CONTENT_UPDATED: 'cms.content.updated',
    CONTENT_DELETED: 'cms.content.deleted',
    CONTENT_APPROVED: 'cms.content.approved',
    CONTENT_REJECTED: 'cms.content.rejected',
    ADMIN_ACTION_PERFORMED: 'admin.action.performed',
    SYSTEM_MAINTENANCE_SCHEDULED: 'admin.maintenance.scheduled',
    SYSTEM_BACKUP_COMPLETED: 'admin.backup.completed',
    SECURITY_ALERT_TRIGGERED: 'admin.security.alert',
    MARKETPLACE_EVENT_CREATED: 'event.marketplace.created',
    MARKETPLACE_EVENT_UPDATED: 'event.marketplace.updated',
    MARKETPLACE_EVENT_CANCELLED: 'event.marketplace.cancelled',
    EVENT_ATTENDANCE_REGISTERED: 'event.attendance.registered',
    HEALTH_CHECK_PERFORMED: 'system.health.check',
    SERVICE_STARTED: 'system.service.started',
    SERVICE_STOPPED: 'system.service.stopped',
    SERVICE_ERROR: 'system.service.error',
    INTEGRATION_ERROR: 'system.integration.error',
    DLQ_SUFFIX: '.dlq',
    RETRY_SUFFIX: '.retry'
};
exports.SubjectPatterns = {
    ALL_ORDER_EVENTS: 'order.*',
    ALL_PAYMENT_EVENTS: 'payment.*',
    ALL_INVENTORY_EVENTS: 'inventory.*',
    ALL_USER_EVENTS: 'user.*',
    ALL_NOTIFICATION_EVENTS: 'notification.*',
    ALL_SYSTEM_EVENTS: 'system.*',
    ALL_EVENTS: '*',
    ALL_STOCK_EVENTS: 'inventory.stock.*',
    ALL_PAYMENT_REFUND_EVENTS: 'payment.refund.*',
    ALL_EMAIL_EVENTS: 'notification.email.*',
    ALL_SMS_EVENTS: 'notification.sms.*',
    ALL_DLQ_EVENTS: '*.dlq',
    ALL_RETRY_EVENTS: '*.retry'
};
exports.QueueNames = {
    ORDER_PROCESSING: 'order-processing-queue',
    PAYMENT_PROCESSING: 'payment-processing-queue',
    INVENTORY_MANAGEMENT: 'inventory-management-queue',
    NOTIFICATION_DELIVERY: 'notification-delivery-queue',
    EMAIL_SENDING: 'email-sending-queue',
    SMS_SENDING: 'sms-sending-queue',
    ANALYTICS_EVENTS: 'analytics-events-queue',
    METRICS_COLLECTION: 'metrics-collection-queue',
    BACKGROUND_TASKS: 'background-tasks-queue',
    CLEANUP_TASKS: 'cleanup-tasks-queue',
    HIGH_PRIORITY: 'high-priority-queue',
    LOW_PRIORITY: 'low-priority-queue'
};
class SubjectUtils {
    static createDLQSubject(originalSubject) {
        return `${originalSubject}${exports.EventSubjects.DLQ_SUFFIX}`;
    }
    static createRetrySubject(originalSubject) {
        return `${originalSubject}${exports.EventSubjects.RETRY_SUFFIX}`;
    }
    static extractDomain(subject) {
        return subject.split('.')[0];
    }
    static extractEventType(subject) {
        const parts = subject.split('.');
        return parts[parts.length - 1];
    }
    static isDLQSubject(subject) {
        return subject.endsWith(exports.EventSubjects.DLQ_SUFFIX);
    }
    static isRetrySubject(subject) {
        return subject.endsWith(exports.EventSubjects.RETRY_SUFFIX);
    }
    static isValidSubject(subject) {
        const parts = subject.split('.');
        return parts.length >= 2 && parts.every(part => part.length > 0);
    }
}
exports.SubjectUtils = SubjectUtils;
var EventPriority;
(function (EventPriority) {
    EventPriority["LOW"] = "low";
    EventPriority["NORMAL"] = "normal";
    EventPriority["HIGH"] = "high";
    EventPriority["CRITICAL"] = "critical";
})(EventPriority || (exports.EventPriority = EventPriority = {}));
var EventCategory;
(function (EventCategory) {
    EventCategory["BUSINESS"] = "business";
    EventCategory["SYSTEM"] = "system";
    EventCategory["INTEGRATION"] = "integration";
    EventCategory["ANALYTICS"] = "analytics";
    EventCategory["SECURITY"] = "security";
})(EventCategory || (exports.EventCategory = EventCategory = {}));
//# sourceMappingURL=subjects.js.map