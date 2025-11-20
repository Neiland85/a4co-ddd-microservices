"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsEventBus = void 0;
const nats_1 = require("nats");
const events_1 = require("events");
class NatsEventBus extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.connection = null;
        this.subscriptions = new Map();
        this.codec = (0, nats_1.StringCodec)();
        this.connected = false;
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
            const options = {
                servers: this.config.servers,
                name: this.config.name || `a4co-event-bus-${Date.now()}`,
                timeout: this.config.timeout,
                reconnect: this.config.reconnect,
                maxReconnectAttempts: this.config.maxReconnectAttempts,
                reconnectTimeWait: this.config.reconnectTimeWait,
            };
            this.connection = await (0, nats_1.connect)(options);
            this.connected = true;
            this.setupConnectionListeners();
            console.log(`✅ Conectado a NATS en ${Array.isArray(this.config.servers) ? this.config.servers.join(', ') : this.config.servers}`);
        }
        catch (error) {
            this.emit('error', error);
            throw new Error(`❌ Error conectando a NATS: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async disconnect() {
        if (this.connection) {
            try {
                await this.connection.drain();
                await this.connection.close();
                this.connection = null;
                this.connected = false;
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
        (async () => {
            for await (const status of this.connection.status()) {
                switch (status.type) {
                    case 'disconnect':
                        this.connected = false;
                        console.log('🔌 Desconectado de NATS');
                        break;
                    case 'reconnect':
                        this.connected = true;
                        console.log('🔄 Reconectado a NATS');
                        break;
                }
            }
        })();
    }
    async publish(subject, event) {
        if (!this.connection || !this.connected) {
            throw new Error('❌ No hay conexión activa con NATS');
        }
        try {
            const message = JSON.stringify({
                ...event,
                timestamp: event.timestamp.toISOString(),
            });
            const encoded = this.codec.encode(message);
            this.connection.publish(subject, encoded);
            console.log(`📤 Evento publicado en ${subject}: ${event.eventType}`);
        }
        catch (error) {
            console.error(`❌ Error publicando evento en ${subject}:`, error);
            throw error;
        }
    }
    async subscribe(subject, handler, queueGroup) {
        if (!this.connection || !this.connected) {
            throw new Error('❌ No hay conexión activa con NATS');
        }
        const sub = queueGroup
            ? this.connection.subscribe(subject, { queue: queueGroup })
            : this.connection.subscribe(subject);
        this.subscriptions.set(`${subject}-${queueGroup || 'default'}`, sub);
        console.log(`📥 Suscrito a ${subject}${queueGroup ? ` (queue: ${queueGroup})` : ''}`);
        (async () => {
            for await (const msg of sub) {
                try {
                    const decoded = this.codec.decode(msg.data);
                    const event = JSON.parse(decoded);
                    if (typeof event.timestamp === 'string')
                        event.timestamp = new Date(event.timestamp);
                    await handler(event);
                }
                catch (error) {
                    console.error(`❌ Error procesando mensaje de ${subject}:`, error);
                }
            }
        })();
    }
    async unsubscribe(subject, queueGroup) {
        const key = `${subject}-${queueGroup || 'default'}`;
        const sub = this.subscriptions.get(key);
        if (sub) {
            sub.unsubscribe();
            this.subscriptions.delete(key);
            console.log(`📤 Desuscrito de ${subject}${queueGroup ? ` (queue: ${queueGroup})` : ''}`);
        }
    }
    async unsubscribeAll() {
        for (const [key, sub] of this.subscriptions) {
            sub.unsubscribe();
        }
        this.subscriptions.clear();
        console.log('📤 Desuscrito de todos los eventos');
    }
    getConnectionStatus() {
        return this.connected;
    }
    getActiveSubscriptions() {
        return Array.from(this.subscriptions.keys());
    }
    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
}
exports.NatsEventBus = NatsEventBus;
//# sourceMappingURL=nats-event-bus.js.map