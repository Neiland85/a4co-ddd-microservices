import { InventoryRepository } from "../../domain/repositories/inventory.repository";
import { NatsEventBus } from "@a4co/shared-utils";
import { InventoryReservedEvent, InventoryOutOfStockEvent } from "../../domain/events";

export class ReserveStockHandler {
  constructor(private readonly repo: InventoryRepository, private readonly eventBus: NatsEventBus) {}

  async handle(orderId: string, items: any[]) {
    const ok = await this.repo.reserveItems(orderId, items);
    if (ok) {
      await this.eventBus.publish(new InventoryReservedEvent(orderId, items));
    } else {
      await this.eventBus.publish(new InventoryOutOfStockEvent(orderId));
    }
  }
}
