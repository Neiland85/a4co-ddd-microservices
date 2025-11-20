"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCategory = exports.EventPriority = exports.SubjectUtils = exports.QueueNames = exports.SubjectPatterns = exports.EventSubjects = void 0;
exports.EventSubjects = {
    ORDER_CREATED: 'order.created.v1',
    ORDER_CONFIRMED: 'order.confirmed.v1',
    ORDER_CANCELLED: 'order.cancelled.v1',
    ORDER_DELIVERED: 'order.delivered.v1',
    ORDER_UPDATED: 'order.updated.v1',
    ORDER_PAYMENT_REQUESTED: 'order.payment.requested.v1',
    STOCK_RESERVED: 'inventory.stock.reserved.v1',
    STOCK_RELEASED: 'inventory.stock.released.v1',
    STOCK_UPDATED: 'inventory.stock.updated.v1',
    LOW_STOCK_WARNING: 'inventory.stock.warning.v1',
    STOCK_DEPLETED: 'inventory.stock.depleted.v1',
    STOCK_REPLENISHED: 'inventory.stock.replenished.v1',
    PAYMENT_INITIATED: 'payment.initiated.v1',
    PAYMENT_SUCCEEDED: 'payment.succeeded.v1',
    PAYMENT_FAILED: 'payment.failed.v1',
    PAYMENT_CANCELLED: 'payment.cancelled.v1',
    REFUND_INITIATED: 'payment.refund.initiated.v1',
    REFUND_PROCESSED: 'payment.refund.processed.v1',
    REFUND_FAILED: 'payment.refund.failed.v1',
    USER_REGISTERED: 'user.registered.v1',
    USER_VERIFIED: 'user.verified.v1',
    USER_PROFILE_UPDATED: 'user.profile.updated.v1',
    USER_PREFERENCES_CHANGED: 'user.preferences.changed.v1',
    USER_DEACTIVATED: 'user.deactivated.v1',
    USER_PASSWORD_CHANGED: 'user.password.changed.v1',
    USER_LOGIN_ATTEMPTED: 'user.login.attempted.v1',
    USER_LOGIN_SUCCEEDED: 'user.login.succeeded.v1',
    USER_LOGIN_FAILED: 'user.login.failed.v1',
    ARTISAN_REGISTERED: 'artisan.registered.v1',
    ARTISAN_VERIFIED: 'artisan.verified.v1',
    ARTISAN_STATUS_CHANGED: 'artisan.status.changed.v1',
    ARTISAN_PROFILE_UPDATED: 'artisan.profile.updated.v1',
    PRODUCT_LISTED: 'artisan.product.listed.v1',
    ARTISAN_PRODUCT_UPDATED: 'artisan.product.updated.v1',
    PRODUCT_DELISTED: 'artisan.product.delisted.v1',
    PRODUCT_CREATED: 'product.created.v1',
    PRODUCT_UPDATED: 'product.updated.v1',
    PRODUCT_DELETED: 'product.deleted.v1',
    PRODUCT_PRICE_CHANGED: 'product.price.changed.v1',
    PRODUCT_AVAILABILITY_CHANGED: 'product.availability.changed.v1',
    PRODUCT_CATEGORY_CHANGED: 'product.category.changed.v1',
    NOTIFICATION_TRIGGERED: 'notification.triggered.v1',
    EMAIL_SENT: 'notification.email.sent.v1',
    EMAIL_DELIVERED: 'notification.email.delivered.v1',
    EMAIL_FAILED: 'notification.email.failed.v1',
    SMS_SENT: 'notification.sms.sent.v1',
    SMS_DELIVERED: 'notification.sms.delivered.v1',
    SMS_FAILED: 'notification.sms.failed.v1',
    PUSH_NOTIFICATION_SENT: 'notification.push.sent.v1',
    LOCATION_UPDATED: 'geo.location.updated.v1',
    DELIVERY_ZONE_CHANGED: 'geo.delivery_zone.changed.v1',
    ARTISAN_LOCATION_VERIFIED: 'geo.artisan.verified.v1',
    NEARBY_SEARCH_PERFORMED: 'geo.search.nearby.v1',
    POINTS_EARNED: 'loyalty.points.earned.v1',
    POINTS_REDEEMED: 'loyalty.points.redeemed.v1',
    TIER_UPGRADED: 'loyalty.tier.upgraded.v1',
    REWARD_UNLOCKED: 'loyalty.reward.unlocked.v1',
    CAMPAIGN_TRIGGERED: 'loyalty.campaign.triggered.v1',
    PRODUCT_INFORMATION_REQUESTED: 'integration.product.info.requested.v1',
    PRODUCT_INFORMATION_PROVIDED: 'integration.product.info.provided.v1',
    STOCK_VALIDATION_REQUESTED: 'integration.stock.validation.requested.v1',
    STOCK_VALIDATION_RESPONSE: 'integration.stock.validation.response.v1',
    USER_INFORMATION_REQUESTED: 'integration.user.info.requested.v1',
    USER_INFORMATION_PROVIDED: 'integration.user.info.provided.v1',
    SAGA_STARTED: 'saga.started.v1',
    SAGA_STEP_COMPLETED: 'saga.step.completed.v1',
    SAGA_COMPLETED: 'saga.completed.v1',
    SAGA_FAILED: 'saga.failed.v1',
    SAGA_COMPENSATION_TRIGGERED: 'saga.compensation.triggered.v1',
    PAGE_VIEW_TRACKED: 'analytics.pageview.v1',
    USER_ACTION_TRACKED: 'analytics.action.v1',
    CONVERSION_TRACKED: 'analytics.conversion.v1',
    SALES_RECORDED: 'analytics.sales.v1',
    PERFORMANCE_METRIC_RECORDED: 'analytics.performance.v1',
    CHAT_MESSAGE_SENT: 'chat.message.sent.v1',
    CHAT_MESSAGE_DELIVERED: 'chat.message.delivered.v1',
    CHAT_MESSAGE_READ: 'chat.message.read.v1',
    CHAT_CONVERSATION_STARTED: 'chat.conversation.started.v1',
    CHAT_CONVERSATION_ENDED: 'chat.conversation.ended.v1',
    CONTENT_PUBLISHED: 'cms.content.published.v1',
    CONTENT_UPDATED: 'cms.content.updated.v1',
    CONTENT_DELETED: 'cms.content.deleted.v1',
    CONTENT_APPROVED: 'cms.content.approved.v1',
    CONTENT_REJECTED: 'cms.content.rejected.v1',
    ADMIN_ACTION_PERFORMED: 'admin.action.performed.v1',
    SYSTEM_MAINTENANCE_SCHEDULED: 'admin.maintenance.scheduled.v1',
    SYSTEM_BACKUP_COMPLETED: 'admin.backup.completed.v1',
    SECURITY_ALERT_TRIGGERED: 'admin.security.alert.v1',
    MARKETPLACE_EVENT_CREATED: 'event.marketplace.created.v1',
    MARKETPLACE_EVENT_UPDATED: 'event.marketplace.updated.v1',
    MARKETPLACE_EVENT_CANCELLED: 'event.marketplace.cancelled.v1',
    EVENT_ATTENDANCE_REGISTERED: 'event.attendance.registered.v1',
    HEALTH_CHECK_PERFORMED: 'system.health.check.v1',
    SERVICE_STARTED: 'system.service.started.v1',
    SERVICE_STOPPED: 'system.service.stopped.v1',
    SERVICE_ERROR: 'system.service.error.v1',
    INTEGRATION_ERROR: 'system.integration.error.v1',
    DLQ_SUFFIX: '.dlq',
    RETRY_SUFFIX: '.retry',
};
exports.SubjectPatterns = {
    ALL_ORDER_EVENTS: 'order.*.v1',
    ALL_PAYMENT_EVENTS: 'payment.*.v1',
    ALL_INVENTORY_EVENTS: 'inventory.*.v1',
    ALL_USER_EVENTS: 'user.*.v1',
    ALL_NOTIFICATION_EVENTS: 'notification.*.v1',
    ALL_SYSTEM_EVENTS: 'system.*.v1',
    ALL_EVENTS: '*.v1',
    ALL_DLQ_EVENTS: '*.dlq',
    ALL_RETRY_EVENTS: '*.retry',
};
exports.QueueNames = {
    ORDER_PROCESSING: 'order-processing-queue',
    PAYMENT_PROCESSING: 'payment-processing-queue',
    INVENTORY_MANAGEMENT: 'inventory-management-queue',
    NOTIFICATION_DELIVERY: 'notification-delivery-queue',
    EMAIL_SENDING: 'email-sending-queue',
    SMS_SENDING: 'sms-sending-queue',
    BACKGROUND_TASKS: 'background-tasks-queue',
    CLEANUP_TASKS: 'cleanup-tasks-queue',
};
class SubjectUtils {
    static createDLQSubject(subject) {
        return `${subject}${exports.EventSubjects.DLQ_SUFFIX}`;
    }
    static createRetrySubject(subject) {
        return `${subject}${exports.EventSubjects.RETRY_SUFFIX}`;
    }
    static extractDomain(subject) {
        return subject.split('.')[0] || 'unknown';
    }
    static extractEventType(subject) {
        const parts = subject.split('.');
        return parts[parts.length - 1] || 'unknown';
    }
    static isDLQSubject(subject) {
        return subject.endsWith(exports.EventSubjects.DLQ_SUFFIX);
    }
    static isRetrySubject(subject) {
        return subject.endsWith(exports.EventSubjects.RETRY_SUFFIX);
    }
    static isValidSubject(subject) {
        const parts = subject.split('.');
        return parts.length >= 2 && parts.every(p => p.length > 0);
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