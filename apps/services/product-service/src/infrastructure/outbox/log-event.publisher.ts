import { IntegrationEventPublisherPort } from '../../application/ports/integration-event-publisher.port';

export class LogIntegrationPublisher implements IntegrationEventPublisherPort {
  async publish(event: { eventId: string; eventType: string; payload: unknown }): Promise<void> {
    // Sustituible por NATS/Kafka/EventBridge
    console.log('[OUTBOX:PUBLISH]', event.eventType, event.eventId, event.payload);
  }
}
