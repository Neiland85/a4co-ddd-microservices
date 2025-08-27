"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDrivenService = exports.NatsEventBus = void 0;
exports.EventHandler = EventHandler;
const nats_1 = require("nats");
class NatsEventBus {
    nc;
    codec = (0, nats_1.StringCodec)();
    subscriptions = new Map();
    serviceName;
    constructor(serviceName) {
        this.serviceName = serviceName;
    }
    async connect(servers = ['nats://localhost:4222']) {
        try {
            this.nc = await (0, nats_1.connect)({
                servers,
                name: this.serviceName,
                reconnect: true,
                maxReconnectAttempts: 10,
                reconnectTimeWait: 1000,
                timeout: 5000
            });
            console.log(`✅ ${this.serviceName} connected to NATS at ${servers.join(', ')}`);
            (async () => {
                for await (const status of this.nc.status()) {
                    console.log(`🔄 NATS ${status.type}: ${status.data}`);
                }
            })();
        }
        catch (error) {
            console.error(`❌ Failed to connect to NATS:`, error);
            throw error;
        }
    }
    async disconnect() {
        if (this.nc) {
            this.subscriptions.forEach(sub => sub.unsubscribe());
            this.subscriptions.clear();
            await this.nc.close();
            this.nc = undefined;
            console.log(`🔌 ${this.serviceName} disconnected from NATS`);
        }
    }
    isConnected() {
        return this.nc !== undefined && !this.nc.isClosed();
    }
    async publish(subject, event) {
        if (!this.nc) {
            throw new Error('NATS connection not established. Call connect() first.');
        }
        const enhancedEvent = {
            ...event,
            metadata: {
                eventId: event.eventId,
                correlationId: this.generateCorrelationId(),
                publishedAt: new Date().toISOString(),
                version: '1.0',
                source: this.serviceName
            }
        };
        const eventData = JSON.stringify(enhancedEvent, null, 0);
        try {
            this.nc.publish(subject, this.codec.encode(eventData));
            console.log(`📤 Published event ${event.eventType} to ${subject}`);
        }
        catch (error) {
            console.error(`❌ Failed to publish event ${event.eventType} to ${subject}:`, error);
            throw error;
        }
    }
    async subscribe(subject, handler) {
        if (!this.nc) {
            throw new Error('NATS connection not established. Call connect() first.');
        }
        const sub = this.nc.subscribe(subject);
        this.subscriptions.set(`${subject}`, sub);
        console.log(`📥 Subscribed to ${subject}`);
        this.processMessages(sub, handler, subject);
        return sub;
    }
    async subscribeQueue(subject, queue, handler) {
        if (!this.nc) {
            throw new Error('NATS connection not established. Call connect() first.');
        }
        const sub = this.nc.subscribe(subject, { queue });
        this.subscriptions.set(`${subject}:${queue}`, sub);
        console.log(`📥 Subscribed to ${subject} with queue ${queue}`);
        this.processMessages(sub, handler, subject, queue);
        return sub;
    }
    async processMessages(sub, handler, subject, queue) {
        for await (const msg of sub) {
            try {
                const eventData = JSON.parse(this.codec.decode(msg.data));
                console.log(`📨 Received event ${eventData.eventType} on ${subject}${queue ? ` (queue: ${queue})` : ''}`);
                const startTime = Date.now();
                await handler(eventData);
                const duration = Date.now() - startTime;
                console.log(`✅ Processed event ${eventData.eventType} in ${duration}ms`);
            }
            catch (error) {
                console.error(`❌ Error processing event on ${subject}:`, error);
                await this.handleEventError(msg, error, subject);
            }
        }
    }
    async handleEventError(msg, error, subject) {
        try {
            const eventData = JSON.parse(this.codec.decode(msg.data));
            const retryCount = (eventData.metadata.retryCount || 0) + 1;
            if (retryCount <= 3) {
                console.log(`🔄 Retrying event ${eventData.eventType} (attempt ${retryCount})`);
                eventData.metadata.retryCount = retryCount;
                setTimeout(() => {
                    if (this.nc) {
                        this.nc.publish(subject, this.codec.encode(JSON.stringify(eventData)));
                    }
                }, Math.pow(2, retryCount) * 1000);
            }
            else {
                console.error(`💀 Sending event ${eventData.eventType} to dead letter queue after ${retryCount} retries`);
                if (this.nc) {
                    this.nc.publish(`${subject}.dlq`, this.codec.encode(JSON.stringify({
                        originalSubject: subject,
                        event: eventData,
                        error: {
                            message: error.message,
                            stack: error.stack
                        },
                        failedAt: new Date().toISOString()
                    })));
                }
            }
        }
        catch (parseError) {
            console.error(`❌ Failed to parse event data for error handling:`, parseError);
        }
    }
    generateCorrelationId() {
        return `${this.serviceName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.NatsEventBus = NatsEventBus;
function EventHandler(subject) {
    return function (target, propertyName, descriptor) {
        target._eventHandlers = target._eventHandlers || [];
        target._eventHandlers.push({
            subject,
            method: propertyName,
            handler: descriptor.value
        });
    };
}
class EventDrivenService {
    eventBus;
    handlerRegistrations = [];
    constructor(serviceName) {
        this.eventBus = new NatsEventBus(serviceName);
    }
    async startEventHandling() {
        await this.eventBus.connect();
        await this.registerEventHandlers();
    }
    async stopEventHandling() {
        this.handlerRegistrations.forEach(sub => sub.unsubscribe());
        this.handlerRegistrations = [];
        await this.eventBus.disconnect();
    }
    async registerEventHandlers() {
        const eventHandlers = this.constructor.prototype._eventHandlers || [];
        for (const { subject, handler } of eventHandlers) {
            const subscription = await this.eventBus.subscribe(subject, handler.bind(this));
            this.handlerRegistrations.push(subscription);
        }
    }
    async publishEvent(subject, event) {
        await this.eventBus.publish(subject, event);
    }
}
exports.EventDrivenService = EventDrivenService;
//# sourceMappingURL=event-bus.js.map