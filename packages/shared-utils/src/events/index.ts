export { DomainEvent, IDomainEvent } from '../domain/domain-event';
// Importar y exportar clases de eventos de dominio explícitamente
export {
  Address,
  ArtisanStatusChangedEvent,
  ArtisanVerifiedEvent,
  ContactInfo,
  DomainEventFactory,
  DomainEventValidator,
  EmailSentEvent,
  EventValidationResult,
  LocationUpdatedEvent,
  LowStockWarningEvent,
  NewProductListedEvent,
  OrderCancelledEvent,
  OrderConfirmedEvent,
  OrderCreatedEvent,
  OrderDeliveredEvent,
  OrderItemReference,
  PaymentFailedEvent,
  PaymentInitiatedEvent,
  PaymentSucceededEvent,
  PointsEarnedEvent,
  PointsRedeemedEvent,
  ProductInformationRequestedEvent,
  ProductSummary,
  RefundProcessedEvent,
  SMSSentEvent,
  SagaCompletedEvent,
  SagaFailedEvent,
  SalesRecordedEvent,
  ServiceErrorEvent,
  ServiceStartedEvent,
  StockReleasedEvent,
  StockReservedEvent,
  StockUpdatedEvent,
  StockValidationRequestedEvent,
  UserActionTrackedEvent,
  UserInformationRequestedEvent,
  UserPreferencesChangedEvent,
  UserProfileUpdatedEvent,
  UserRegisteredEvent,
} from './domain-events';

// Importar y exportar clases de eventos de integración explícitamente
export {
  ProductInformationProvidedEvent,
  StockValidationResponseEvent,
  UserInformationProvidedEvent,
} from './integration-events';

// Exportar Event Bus y Subjects
export { EventDrivenService, EventHandler, IEventBus, NatsEventBus } from './event-bus';
export { EventSubjects } from './subjects';
