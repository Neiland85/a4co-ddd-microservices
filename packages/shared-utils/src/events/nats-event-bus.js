"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsEventBus = void 0;
const nats_1 = require("nats");
const events_1 = require("events");
class NatsEventBus extends events_1.EventEmitter {
    connection = null;
    subscriptions = new Map();
    codec = (0, nats_1.StringCodec)();
    config;
    isConnected = false;
    constructor(config) {
        super();
        this.config = {
            timeout: 10000,
            reconnect: true,
            maxReconnectAttempts: 10,
            reconnectTimeWait: 2000,
            ...config,
        };
    }
    async connect() {
        try {
            const connectionOptions = {
                servers: this.config.servers,
                name: this.config.name || `a4co-event-bus-${Date.now()}`,
                timeout: this.config.timeout,
                reconnect: this.config.reconnect,
                maxReconnectAttempts: this.config.maxReconnectAttempts,
                reconnectTimeWait: this.config.reconnectTimeWait,
            };
            this.connection = await (0, nats_1.connect)(connectionOptions);
            this.isConnected = true;
            this.setupConnectionListeners();
            this.emit('connected');
            console.log(`✅ Conectado a NATS en: ${Array.isArray(this.config.servers) ? this.config.servers.join(', ') : this.config.servers}`);
        }
        catch (error) {
            this.emit('error', error);
            throw new Error(`❌ Error conectando a NATS: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async disconnect() {
        if (this.connection) {
            try {
                await this.connection.drain();
                this.connection.close();
                this.connection = null;
                this.isConnected = false;
                this.emit('disconnected');
                console.log('🔌 Desconectado de NATS');
            }
            catch (error) {
                this.emit('error', error);
                console.error('❌ Error desconectando de NATS:', error);
            }
        }
    }
    setupConnectionListeners() {
        if (!this.connection)
            return;
        this.connection.closed().then(() => {
            this.isConnected = false;
            this.emit('disconnected');
            console.log('🔌 Conexión NATS cerrada');
        });
        (async () => {
            try {
                for await (const status of this.connection.status()) {
                    this.emit('status', status);
                    switch (status.type) {
                        case 'disconnect':
                            this.isConnected = false;
                            this.emit('disconnected');
                            console.log('🔌 Desconectado de NATS');
                            break;
                        case 'reconnect':
                            this.isConnected = true;
                            this.emit('reconnected');
                            console.log('🔄 Reconectado a NATS');
                            break;
                    }
                }
            }
            catch (error) {
                console.error('Error en status NATS:', error);
            }
        })();
    }
    async publish(subject, event) {
        if (!this.connection || !this.isConnected) {
            throw new Error('❌ No hay conexión activa con NATS');
        }
        try {
            const message = JSON.stringify({
                ...event,
                timestamp: event.timestamp.toISOString(),
            });
            const encodedMessage = this.codec.encode(message);
            await this.connection.publish(subject, encodedMessage);
            this.emit('published', { subject, event });
            console.log(`📤 Evento publicado en ${subject}:`, event.eventType);
        }
        catch (error) {
            this.emit('error', error);
            throw new Error(`❌ Error publicando evento en ${subject}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async subscribe(subject, handler, queueGroup) {
        if (!this.connection || !this.isConnected) {
            throw new Error('❌ No hay conexión activa con NATS');
        }
        try {
            const subscription = queueGroup
                ? this.connection.subscribe(subject, { queue: queueGroup })
                : this.connection.subscribe(subject);
            const subscriptionKey = `${subject}-${queueGroup || 'default'}`;
            this.setupMessageHandler(subscription, handler, subject);
            this.subscriptions.set(subscriptionKey, subscription);
            this.emit('subscribed', { subject, queueGroup });
            console.log(`📥 Suscrito a ${subject}${queueGroup ? ` (queue: ${queueGroup})` : ''}`);
        }
        catch (error) {
            this.emit('error', error);
            throw new Error(`❌ Error suscribiéndose a ${subject}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    setupMessageHandler(subscription, handler, subject) {
        (async () => {
            for await (const message of subscription) {
                try {
                    const decodedMessage = this.codec.decode(message.data);
                    const eventMessage = JSON.parse(decodedMessage);
                    if (typeof eventMessage.timestamp === 'string') {
                        eventMessage.timestamp = new Date(eventMessage.timestamp);
                    }
                    this.emit('message', { subject, message: eventMessage });
                    await handler(eventMessage);
                    if ('ack' in message) {
                        message.ack();
                    }
                }
                catch (error) {
                    this.emit('error', error);
                    console.error(`❌ Error procesando mensaje de ${subject}:`, error);
                }
            }
        })();
    }
    async unsubscribe(subject, queueGroup) {
        const subscriptionKey = `${subject}-${queueGroup || 'default'}`;
        const subscription = this.subscriptions.get(subscriptionKey);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(subscriptionKey);
            this.emit('unsubscribed', { subject, queueGroup });
            console.log(`📤 Desuscrito de ${subject}${queueGroup ? ` (queue: ${queueGroup})` : ''}`);
        }
    }
    async unsubscribeAll() {
        for (const [key, subscription] of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.subscriptions.clear();
        this.emit('unsubscribed-all');
        console.log('📤 Desuscrito de todos los eventos');
    }
    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    getConnectionStatus() {
        return this.isConnected;
    }
    getActiveSubscriptions() {
        return Array.from(this.subscriptions.keys());
    }
    async publishOrderCreated(orderId, orderData) {
        const event = {
            eventId: this.generateEventId(),
            eventType: 'OrderCreated',
            timestamp: new Date(),
            data: { orderId, ...orderData },
        };
        await this.publish('order.created', event);
    }
    async publishStockReserved(orderId, stockData) {
        const event = {
            eventId: this.generateEventId(),
            eventType: 'StockReserved',
            timestamp: new Date(),
            data: { orderId, ...stockData },
        };
        await this.publish('inventory.stock.reserved', event);
    }
    async subscribeToOrderCreated(handler) {
        await this.subscribe('order.created', handler, 'order-service');
    }
    async subscribeToStockReserved(handler) {
        await this.subscribe('inventory.stock.reserved', handler, 'inventory-service');
    }
}
exports.NatsEventBus = NatsEventBus;
//# sourceMappingURL=nats-event-bus.js.map