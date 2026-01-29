import { UnitOfWork } from '../ports/unit-of-work.port';
import { ProductRepositoryPort } from '../ports/product-repository.port';
import { OutboxStorePort } from '../ports/outbox-store.port';
import { Product } from '../../domain/entities/product.entity';
import { EventIdFactory } from './event-id.factory';

export class CreateProductTxService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly productRepo: ProductRepositoryPort,
    private readonly outbox: OutboxStorePort,
  ) {}

  async execute(product: Product): Promise<void> {
    await this.uow.execute(async () => {
      // 1️⃣ Persist Aggregate
      await this.productRepo.save(product);

      // 2️⃣ Emit domain events → outbox
      for (const event of product.pullDomainEvents()) {
        const eventId = EventIdFactory.deterministic(
          `${product.id.value}:${event.type}:${event.version}`,
        );

        await this.outbox.enqueue({
          eventId,
          eventType: event.type,
          eventVersion: event.version,
          aggregateType: 'Product',
          aggregateId: product.id.value,
          payload: event.payload,
        });
      }
    });
  }
}
