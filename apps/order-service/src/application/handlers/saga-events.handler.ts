import { Injectable, Logger, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderSaga, EventMessage } from '../sagas/order.saga';

/**
 * Handler para eventos de NATS relacionados con la Saga
 * Este handler se suscribe a eventos y delega el procesamiento a OrderSaga
 */
@Injectable()
export class SagaEventsHandler {
  private readonly logger = new Logger(SagaEventsHandler.name);

  constructor(
    private readonly orderSaga: OrderSaga,
  ) {}

  @EventPattern('inventory.reserved')
  async handleInventoryReserved(@Payload() event: EventMessage): Promise<void> {
    this.logger.log(`📥 Evento recibido: inventory.reserved para orden ${event.data?.orderId}`);
    
    try {
      await this.orderSaga.handleInventoryReserved(event);
    } catch (error) {
      this.logger.error(`❌ Error procesando inventory.reserved:`, error);
    }
  }

  @EventPattern('inventory.out_of_stock')
  async handleInventoryOutOfStock(@Payload() event: EventMessage): Promise<void> {
    this.logger.log(`📥 Evento recibido: inventory.out_of_stock para orden ${event.data?.orderId}`);
    
    try {
      await this.orderSaga.handleInventoryOutOfStock(event);
    } catch (error) {
      this.logger.error(`❌ Error procesando inventory.out_of_stock:`, error);
    }
  }

  @EventPattern('payment.succeeded')
  async handlePaymentSucceeded(@Payload() event: EventMessage): Promise<void> {
    this.logger.log(`📥 Evento recibido: payment.succeeded para orden ${event.data?.orderId}`);
    
    try {
      await this.orderSaga.handlePaymentSucceeded(event);
    } catch (error) {
      this.logger.error(`❌ Error procesando payment.succeeded:`, error);
    }
  }

  @EventPattern('payment.failed')
  async handlePaymentFailed(@Payload() event: EventMessage): Promise<void> {
    this.logger.log(`📥 Evento recibido: payment.failed para orden ${event.data?.orderId}`);
    
    try {
      await this.orderSaga.handlePaymentFailed(event);
    } catch (error) {
      this.logger.error(`❌ Error procesando payment.failed:`, error);
    }
  }
}
