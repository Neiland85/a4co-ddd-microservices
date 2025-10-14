"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryEventBusAdapter = void 0;
const common_1 = require("@nestjs/common");
/**
 * Adapter in-memory para eventos de dominio
 * Para desarrollo y testing. En producción se reemplazaría por RabbitMQ/Kafka
 */
let InMemoryEventBusAdapter = class InMemoryEventBusAdapter {
    handlers = new Map();
    publishedEvents = [];
    async publish(event) {
        const eventType = event.constructor.name;
        // Almacenar evento para testing/debugging
        this.publishedEvents.push({
            ...event,
            publishedAt: new Date(),
            type: eventType,
        });
        // Ejecutar handlers registrados
        const eventHandlers = this.handlers.get(eventType) || [];
        for (const handler of eventHandlers) {
            try {
                handler(event);
            }
            catch (error) {
                console.error(`Error handling event ${eventType}:`, error);
            }
        }
        console.log(`📢 Event published: ${eventType}`, event);
    }
    async publishAll(events) {
        for (const event of events) {
            await this.publish(event);
        }
    }
    /**
     * Registra un handler para un tipo de evento específico
     * @param eventType Tipo del evento
     * @param handler Función handler
     */
    subscribe(eventType, handler) {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, []);
        }
        this.handlers.get(eventType).push(handler);
    }
    /**
     * Obtiene todos los eventos publicados (útil para testing)
     */
    getPublishedEvents() {
        return [...this.publishedEvents];
    }
    /**
     * Limpia el historial de eventos publicados
     */
    clearPublishedEvents() {
        this.publishedEvents.splice(0, this.publishedEvents.length);
    }
};
exports.InMemoryEventBusAdapter = InMemoryEventBusAdapter;
exports.InMemoryEventBusAdapter = InMemoryEventBusAdapter = __decorate([
    (0, common_1.Injectable)()
], InMemoryEventBusAdapter);
//# sourceMappingURL=in-memory-event-bus.adapter.js.map