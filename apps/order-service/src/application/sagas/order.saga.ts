import { NatsEventBus } from "@a4co/shared-utils";
import { CreateOrderCommand } from "../commands/create-order.command";
import { OrderCreatedEvent, OrderCancelledEvent } from "../../domain/events";
import { PaymentSucceededEvent, PaymentFailedEvent } from "@a4co/shared-utils";

export class OrderSaga {
  constructor(private readonly repo: any, private readonly eventBus: NatsEventBus) {}

  async execute(command: CreateOrderCommand) {
    const order = await this.repo.create(command);
    await this.eventBus.publish(new OrderCreatedEvent(order.id, order.items));

    // Manejo de eventos asincrónicos
    this.eventBus.subscribe("PaymentSucceeded", async (e: PaymentSucceededEvent) => {
      await this.repo.updateStatus(e.orderId, "CONFIRMED");
    });

    this.eventBus.subscribe("PaymentFailed", async (e: PaymentFailedEvent) => {
      await this.repo.updateStatus(e.orderId, "CANCELLED");
      await this.eventBus.publish(new OrderCancelledEvent(e.orderId));
    });
  }
}
