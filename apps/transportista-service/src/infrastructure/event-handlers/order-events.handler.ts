import { Controller, Logger, Inject } from '@nestjs/common';
import { EventPattern, Payload, Ctx, NatsContext } from '@nestjs/microservices';
import { EventTypes } from '@a4co/shared-events';
import { CreateShipmentUseCase } from '../../application/use-cases/create-shipment.use-case.js';
import { AssignShipmentUseCase } from '../../application/use-cases/assign-shipment.use-case.js';

/**
 * Order Events Handler
 * Listens to order-related events and triggers shipment creation
 */
@Controller()
export class OrderEventsHandler {
  private readonly logger = new Logger(OrderEventsHandler.name);

  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly assignShipmentUseCase: AssignShipmentUseCase,
  ) {}

  /**
   * Handle OrderConfirmed event
   * Creates a shipment and assigns a transportista when an order is confirmed
   */
  @EventPattern(EventTypes.ORDER_CONFIRMED_V1)
  async handleOrderConfirmed(@Payload() payload: any, @Ctx() context: NatsContext): Promise<void> {
    const eventData = payload.data || payload;
    
    this.logger.log(`📥 Received ${EventTypes.ORDER_CONFIRMED_V1}`, {
      orderId: eventData.orderId,
      correlationId: payload.correlationId,
    });

    try {
      // Extract addresses from metadata or use defaults
      const pickupAddress = eventData.pickupAddress || 'Default warehouse, Málaga, Spain';
      const deliveryAddress = eventData.deliveryAddress || 'Customer address pending';
      
      // Calculate shipping cost (simplified: 5% of order total)
      const shippingCost = eventData.totalAmount * 0.05;

      // Step 1: Create shipment
      const shipment = await this.createShipmentUseCase.execute({
        orderId: eventData.orderId,
        pickupAddress,
        deliveryAddress,
        shippingCost,
        metadata: {
          notes: `Order confirmed at ${eventData.confirmedAt}`,
        },
      });

      this.logger.log(`✅ Shipment ${shipment.id} created for order ${eventData.orderId}`);

      // Step 2: Auto-assign transportista
      try {
        const assignedShipment = await this.assignShipmentUseCase.execute({
          shipmentId: shipment.id,
        });

        this.logger.log(
          `✅ Shipment ${assignedShipment.id} assigned to transportista ${assignedShipment.transportistaId}`,
        );
      } catch (assignError) {
        this.logger.error(
          `⚠️ Failed to assign transportista for shipment ${shipment.id}. Shipment remains PENDING.`,
          assignError,
        );
        // Shipment stays in PENDING status - can be assigned later
      }
    } catch (error) {
      this.logger.error(
        `❌ Error handling order confirmed for order ${eventData.orderId}`,
        error,
      );
      
      // TODO: Emit shipment.failed.v1 event for saga compensation
      throw error;
    }
  }
}
