export { DomainEvent, IDomainEvent } from '../domain/domain-event';
// Importar y exportar clases de eventos de dominio explícitamente
<<<<<<< HEAD
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
=======
export { Address, ContactInfo, OrderItemReference, ProductSummary } from './domain-events';
export {
  OrderCreatedEvent,
  OrderConfirmedEvent,
  OrderCancelledEvent,
  OrderDeliveredEvent,
  StockReservedEvent,
  StockReleasedEvent,
  LowStockWarningEvent,
  StockUpdatedEvent,
  PaymentInitiatedEvent,
  PaymentSucceededEvent,
  PaymentFailedEvent,
  RefundProcessedEvent,
  UserRegisteredEvent,
  UserProfileUpdatedEvent,
  UserPreferencesChangedEvent,
  ArtisanVerifiedEvent,
  NewProductListedEvent,
  ArtisanStatusChangedEvent,
  EmailSentEvent,
  SMSSentEvent,
  SalesRecordedEvent,
  UserActionTrackedEvent,
  PointsEarnedEvent,
  PointsRedeemedEvent,
  LocationUpdatedEvent,
  ServiceStartedEvent,
  ServiceErrorEvent,
  SagaCompletedEvent,
  SagaFailedEvent,
  ProductInformationRequestedEvent,
  StockValidationRequestedEvent,
  UserInformationRequestedEvent,
  DomainEventFactory,
  EventValidationResult,
  DomainEventValidator,
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
} from './domain-events';

// Importar y exportar clases de eventos de integración explícitamente
export {
  ProductInformationProvidedEvent,
  StockValidationResponseEvent,
  UserInformationProvidedEvent,
} from './integration-events';

// Exportar Event Bus y Subjects
<<<<<<< HEAD
export { EventDrivenService, EventHandler, IEventBus, NatsEventBus } from './event-bus';
=======
export { IEventBus, NatsEventBus, EventHandler, EventDrivenService } from './event-bus';
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
export { EventSubjects } from './subjects';
