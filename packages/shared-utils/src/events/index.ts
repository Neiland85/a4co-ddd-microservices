<<<<<<< Updated upstream
export { DomainEvent, IDomainEvent } from '../domain/domain-event';
// Importar y exportar clases de eventos de dominio explícitamente
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
} from './domain-events';

// Importar y exportar clases de eventos de integración explícitamente
export {
  ProductInformationProvidedEvent,
  StockValidationResponseEvent,
  UserInformationProvidedEvent,
=======
export { DomainEvent, IDomainEvent } from './domain-event';
// Importar y exportar clases de eventos de dominio explícitamente
export { Address, ContactInfo, OrderItemReference, ProductSummary } from './domain-events';
export { 
  OrderCreatedEvent, OrderConfirmedEvent, OrderCancelledEvent, OrderDeliveredEvent, 
  StockReservedEvent, StockReleasedEvent, LowStockWarningEvent, StockUpdatedEvent, 
  PaymentInitiatedEvent, PaymentSucceededEvent, PaymentFailedEvent, RefundProcessedEvent, 
  UserRegisteredEvent, UserProfileUpdatedEvent, UserPreferencesChangedEvent, 
  ArtisanVerifiedEvent, NewProductListedEvent, ArtisanStatusChangedEvent, 
  EmailSentEvent, SMSSentEvent, SalesRecordedEvent, UserActionTrackedEvent, 
  PointsEarnedEvent, PointsRedeemedEvent, LocationUpdatedEvent, 
  ServiceStartedEvent, ServiceErrorEvent, 
  SagaCompletedEvent, SagaFailedEvent, ProductInformationRequestedEvent, StockValidationRequestedEvent, UserInformationRequestedEvent, 
  DomainEventFactory, EventValidationResult, DomainEventValidator
} from './domain-events';

// Importar y exportar clases de eventos de integración explícitamente
export { 
  ProductInformationProvidedEvent, StockValidationResponseEvent, 
  UserInformationProvidedEvent
>>>>>>> Stashed changes
} from './integration-events';

// Exportar Event Bus y Subjects
export { IEventBus, NatsEventBus, EventHandler, EventDrivenService } from './event-bus';
export { EventSubjects } from './subjects';
