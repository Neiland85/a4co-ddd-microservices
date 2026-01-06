import { Injectable } from '@nestjs/common';
import { EventBusPort } from '../ports/event-bus.port';

/**
 * Adapter in-memory para eventos de dominio
 * Para desarrollo y testing. En producción se reemplazaría por RabbitMQ/Kafka
 */
@Injectable()
export class InMemoryEventBusAdapter implements EventBusPort {
  private readonly handlers: Map<string, Array<(event: any) => void>> = new Map();
  private readonly publishedEvents: any[] = [];

  async publish(event: any): Promise<void> {
    const eventType = event.type || event.constructor.name;

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
      } catch (error) {
        console.error(`Error handling event ${eventType}:`, error);
      }
    }

    console.log(`📢 Event published: ${eventType}`, event);
  }

  async publishAll(events: any[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  /**
   * Registra un handler para un tipo de evento específico
   * @param eventType Tipo del evento
   * @param handler Función handler
   */
  subscribe(eventType: string, handler: (event: any) => void): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  /**
   * Obtiene todos los eventos publicados (útil para testing)
   */
  getPublishedEvents(): any[] {
    return [...this.publishedEvents];
  }

  /**
   * Limpia el historial de eventos publicados
   */
  clearPublishedEvents(): void {
    this.publishedEvents.splice(0, this.publishedEvents.length);
  }
}
