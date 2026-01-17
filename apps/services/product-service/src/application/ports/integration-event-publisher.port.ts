export interface IntegrationEventPublisherPort {
  publish(event: { eventId: string; eventType: string; payload: unknown }): Promise<void>;
}
