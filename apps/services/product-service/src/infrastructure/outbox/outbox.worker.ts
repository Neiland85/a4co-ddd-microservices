import { PrismaOutboxStore } from './prisma-outbox.store';
import { LogIntegrationPublisher } from './log-event.publisher';

const store = new PrismaOutboxStore();
const publisher = new LogIntegrationPublisher();

const WORKER_ID = `product-service-outbox-${process.pid}`;

async function tick() {
  const batch = await store.lockBatch({ limit: 25, lockedBy: WORKER_ID });
  if (!batch.length) return;

  for (const msg of batch) {
    try {
      await publisher.publish({
        eventId: msg.eventId,
        eventType: msg.eventType,
        payload: msg.payload,
      });
      await store.markPublished(msg.id);
    } catch (e: any) {
      const err = e?.stack || e?.message || String(e);
      const nextRetryAt = new Date(Date.now() + 30_000);
      await store.markFailed({ id: msg.id, error: err, nextRetryAt });
    }
  }
}

export async function startOutboxWorker() {
  // loop simple
  setInterval(() => {
    tick().catch((e) => console.error('[OUTBOX:ERROR]', e));
  }, 2000);
}
