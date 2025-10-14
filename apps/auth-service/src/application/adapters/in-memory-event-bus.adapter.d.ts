import { EventBusPort } from '../ports/event-bus.port';
/**
 * Adapter in-memory para eventos de dominio
 * Para desarrollo y testing. En producción se reemplazaría por RabbitMQ/Kafka
 */
export declare class InMemoryEventBusAdapter implements EventBusPort {
    private readonly handlers;
    private readonly publishedEvents;
    publish(event: any): Promise<void>;
    publishAll(events: any[]): Promise<void>;
    /**
     * Registra un handler para un tipo de evento específico
     * @param eventType Tipo del evento
     * @param handler Función handler
     */
    subscribe(eventType: string, handler: (event: any) => void): void;
    /**
     * Obtiene todos los eventos publicados (útil para testing)
     */
    getPublishedEvents(): any[];
    /**
     * Limpia el historial de eventos publicados
     */
    clearPublishedEvents(): void;
}
//# sourceMappingURL=in-memory-event-bus.adapter.d.ts.map