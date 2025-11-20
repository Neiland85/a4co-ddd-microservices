export declare const EventSubjects: {
    readonly ORDER_CREATED: "order.created.v1";
    readonly ORDER_CONFIRMED: "order.confirmed.v1";
    readonly ORDER_CANCELLED: "order.cancelled.v1";
    readonly ORDER_DELIVERED: "order.delivered.v1";
    readonly ORDER_UPDATED: "order.updated.v1";
    readonly ORDER_PAYMENT_REQUESTED: "order.payment.requested.v1";
    readonly STOCK_RESERVED: "inventory.stock.reserved.v1";
    readonly STOCK_RELEASED: "inventory.stock.released.v1";
    readonly STOCK_UPDATED: "inventory.stock.updated.v1";
    readonly LOW_STOCK_WARNING: "inventory.stock.warning.v1";
    readonly STOCK_DEPLETED: "inventory.stock.depleted.v1";
    readonly STOCK_REPLENISHED: "inventory.stock.replenished.v1";
    readonly PAYMENT_INITIATED: "payment.initiated.v1";
    readonly PAYMENT_SUCCEEDED: "payment.succeeded.v1";
    readonly PAYMENT_FAILED: "payment.failed.v1";
    readonly PAYMENT_CANCELLED: "payment.cancelled.v1";
    readonly REFUND_INITIATED: "payment.refund.initiated.v1";
    readonly REFUND_PROCESSED: "payment.refund.processed.v1";
    readonly REFUND_FAILED: "payment.refund.failed.v1";
    readonly USER_REGISTERED: "user.registered.v1";
    readonly USER_VERIFIED: "user.verified.v1";
    readonly USER_PROFILE_UPDATED: "user.profile.updated.v1";
    readonly USER_PREFERENCES_CHANGED: "user.preferences.changed.v1";
    readonly USER_DEACTIVATED: "user.deactivated.v1";
    readonly USER_PASSWORD_CHANGED: "user.password.changed.v1";
    readonly USER_LOGIN_ATTEMPTED: "user.login.attempted.v1";
    readonly USER_LOGIN_SUCCEEDED: "user.login.succeeded.v1";
    readonly USER_LOGIN_FAILED: "user.login.failed.v1";
    readonly ARTISAN_REGISTERED: "artisan.registered.v1";
    readonly ARTISAN_VERIFIED: "artisan.verified.v1";
    readonly ARTISAN_STATUS_CHANGED: "artisan.status.changed.v1";
    readonly ARTISAN_PROFILE_UPDATED: "artisan.profile.updated.v1";
    readonly PRODUCT_LISTED: "artisan.product.listed.v1";
    readonly ARTISAN_PRODUCT_UPDATED: "artisan.product.updated.v1";
    readonly PRODUCT_DELISTED: "artisan.product.delisted.v1";
    readonly PRODUCT_CREATED: "product.created.v1";
    readonly PRODUCT_UPDATED: "product.updated.v1";
    readonly PRODUCT_DELETED: "product.deleted.v1";
    readonly PRODUCT_PRICE_CHANGED: "product.price.changed.v1";
    readonly PRODUCT_AVAILABILITY_CHANGED: "product.availability.changed.v1";
    readonly PRODUCT_CATEGORY_CHANGED: "product.category.changed.v1";
    readonly NOTIFICATION_TRIGGERED: "notification.triggered.v1";
    readonly EMAIL_SENT: "notification.email.sent.v1";
    readonly EMAIL_DELIVERED: "notification.email.delivered.v1";
    readonly EMAIL_FAILED: "notification.email.failed.v1";
    readonly SMS_SENT: "notification.sms.sent.v1";
    readonly SMS_DELIVERED: "notification.sms.delivered.v1";
    readonly SMS_FAILED: "notification.sms.failed.v1";
    readonly PUSH_NOTIFICATION_SENT: "notification.push.sent.v1";
    readonly LOCATION_UPDATED: "geo.location.updated.v1";
    readonly DELIVERY_ZONE_CHANGED: "geo.delivery_zone.changed.v1";
    readonly ARTISAN_LOCATION_VERIFIED: "geo.artisan.verified.v1";
    readonly NEARBY_SEARCH_PERFORMED: "geo.search.nearby.v1";
    readonly POINTS_EARNED: "loyalty.points.earned.v1";
    readonly POINTS_REDEEMED: "loyalty.points.redeemed.v1";
    readonly TIER_UPGRADED: "loyalty.tier.upgraded.v1";
    readonly REWARD_UNLOCKED: "loyalty.reward.unlocked.v1";
    readonly CAMPAIGN_TRIGGERED: "loyalty.campaign.triggered.v1";
    readonly PRODUCT_INFORMATION_REQUESTED: "integration.product.info.requested.v1";
    readonly PRODUCT_INFORMATION_PROVIDED: "integration.product.info.provided.v1";
    readonly STOCK_VALIDATION_REQUESTED: "integration.stock.validation.requested.v1";
    readonly STOCK_VALIDATION_RESPONSE: "integration.stock.validation.response.v1";
    readonly USER_INFORMATION_REQUESTED: "integration.user.info.requested.v1";
    readonly USER_INFORMATION_PROVIDED: "integration.user.info.provided.v1";
    readonly SAGA_STARTED: "saga.started.v1";
    readonly SAGA_STEP_COMPLETED: "saga.step.completed.v1";
    readonly SAGA_COMPLETED: "saga.completed.v1";
    readonly SAGA_FAILED: "saga.failed.v1";
    readonly SAGA_COMPENSATION_TRIGGERED: "saga.compensation.triggered.v1";
    readonly PAGE_VIEW_TRACKED: "analytics.pageview.v1";
    readonly USER_ACTION_TRACKED: "analytics.action.v1";
    readonly CONVERSION_TRACKED: "analytics.conversion.v1";
    readonly SALES_RECORDED: "analytics.sales.v1";
    readonly PERFORMANCE_METRIC_RECORDED: "analytics.performance.v1";
    readonly CHAT_MESSAGE_SENT: "chat.message.sent.v1";
    readonly CHAT_MESSAGE_DELIVERED: "chat.message.delivered.v1";
    readonly CHAT_MESSAGE_READ: "chat.message.read.v1";
    readonly CHAT_CONVERSATION_STARTED: "chat.conversation.started.v1";
    readonly CHAT_CONVERSATION_ENDED: "chat.conversation.ended.v1";
    readonly CONTENT_PUBLISHED: "cms.content.published.v1";
    readonly CONTENT_UPDATED: "cms.content.updated.v1";
    readonly CONTENT_DELETED: "cms.content.deleted.v1";
    readonly CONTENT_APPROVED: "cms.content.approved.v1";
    readonly CONTENT_REJECTED: "cms.content.rejected.v1";
    readonly ADMIN_ACTION_PERFORMED: "admin.action.performed.v1";
    readonly SYSTEM_MAINTENANCE_SCHEDULED: "admin.maintenance.scheduled.v1";
    readonly SYSTEM_BACKUP_COMPLETED: "admin.backup.completed.v1";
    readonly SECURITY_ALERT_TRIGGERED: "admin.security.alert.v1";
    readonly MARKETPLACE_EVENT_CREATED: "event.marketplace.created.v1";
    readonly MARKETPLACE_EVENT_UPDATED: "event.marketplace.updated.v1";
    readonly MARKETPLACE_EVENT_CANCELLED: "event.marketplace.cancelled.v1";
    readonly EVENT_ATTENDANCE_REGISTERED: "event.attendance.registered.v1";
    readonly HEALTH_CHECK_PERFORMED: "system.health.check.v1";
    readonly SERVICE_STARTED: "system.service.started.v1";
    readonly SERVICE_STOPPED: "system.service.stopped.v1";
    readonly SERVICE_ERROR: "system.service.error.v1";
    readonly INTEGRATION_ERROR: "system.integration.error.v1";
    readonly DLQ_SUFFIX: ".dlq";
    readonly RETRY_SUFFIX: ".retry";
};
export type EventSubjectKeys = keyof typeof EventSubjects;
export type EventSubjectValues = (typeof EventSubjects)[EventSubjectKeys];
export declare const SubjectPatterns: {
    readonly ALL_ORDER_EVENTS: "order.*.v1";
    readonly ALL_PAYMENT_EVENTS: "payment.*.v1";
    readonly ALL_INVENTORY_EVENTS: "inventory.*.v1";
    readonly ALL_USER_EVENTS: "user.*.v1";
    readonly ALL_NOTIFICATION_EVENTS: "notification.*.v1";
    readonly ALL_SYSTEM_EVENTS: "system.*.v1";
    readonly ALL_EVENTS: "*.v1";
    readonly ALL_DLQ_EVENTS: "*.dlq";
    readonly ALL_RETRY_EVENTS: "*.retry";
};
export declare const QueueNames: {
    readonly ORDER_PROCESSING: "order-processing-queue";
    readonly PAYMENT_PROCESSING: "payment-processing-queue";
    readonly INVENTORY_MANAGEMENT: "inventory-management-queue";
    readonly NOTIFICATION_DELIVERY: "notification-delivery-queue";
    readonly EMAIL_SENDING: "email-sending-queue";
    readonly SMS_SENDING: "sms-sending-queue";
    readonly BACKGROUND_TASKS: "background-tasks-queue";
    readonly CLEANUP_TASKS: "cleanup-tasks-queue";
};
export declare class SubjectUtils {
    static createDLQSubject(subject: string): string;
    static createRetrySubject(subject: string): string;
    static extractDomain(subject: string): string;
    static extractEventType(subject: string): string;
    static isDLQSubject(subject: string): boolean;
    static isRetrySubject(subject: string): boolean;
    static isValidSubject(subject: string): boolean;
}
export declare enum EventPriority {
    LOW = "low",
    NORMAL = "normal",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare enum EventCategory {
    BUSINESS = "business",
    SYSTEM = "system",
    INTEGRATION = "integration",
    ANALYTICS = "analytics",
    SECURITY = "security"
}
//# sourceMappingURL=subjects.d.ts.map