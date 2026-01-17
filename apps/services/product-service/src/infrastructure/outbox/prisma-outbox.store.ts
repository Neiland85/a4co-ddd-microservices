import { prisma } from '../persistence/prisma';
import { OutboxStorePort, OutboxRecord } from '../../application/ports/outbox-store.port';

const NOW = () => new Date();

function backoff(attempt: number): Date {
  // Exponencial suave: 10s, 30s, 60s, 120s, 300s...
  const seconds = Math.min(300, Math.floor(10 * Math.pow(1.7, Math.max(0, attempt - 1))));
  const d = new Date();
  d.setSeconds(d.getSeconds() + seconds);
  return d;
}

export class PrismaOutboxStore implements OutboxStorePort {
  async enqueue(event: {
    eventId: string;
    eventType: string;
    eventVersion: number;
    aggregateType: string;
    aggregateId: string;
    payload: unknown;
  }): Promise<void> {
    // Idempotencia: eventId UNIQUE
    await prisma.outboxEvent.create({
      data: {
        eventId: event.eventId,
        eventType: event.eventType,
        eventVersion: event.eventVersion,
        aggregateType: event.aggregateType,
        aggregateId: event.aggregateId,
        payload: event.payload as any,
        status: 'PENDING',
      },
    }).catch((e: any) => {
      // Si ya existe, es idempotente: ignorar
      if (String(e?.code) === 'P2002') return;
      throw e;
    });
  }

  async lockBatch(args: { limit: number; lockedBy: string }): Promise<OutboxRecord[]> {
    const now = NOW();

    // 1) Seleccionar candidatos (PENDING, o FAILED pero reintentable)
    const candidates = await prisma.outboxEvent.findMany({
      where: {
        status: { in: ['PENDING', 'FAILED'] },
        OR: [
          { nextRetryAt: null },
          { nextRetryAt: { lte: now } },
        ],
        lockedAt: null,
      },
      orderBy: { createdAt: 'asc' },
      take: args.limit,
    });

    if (!candidates.length) return [];

    // 2) Lock optimistic (updateMany por id y lockedAt null)
    const locked: OutboxRecord[] = [];
    for (const c of candidates) {
      const res = await prisma.outboxEvent.updateMany({
        where: { id: c.id, lockedAt: null },
        data: { lockedAt: now, lockedBy: args.lockedBy },
      });
      if (res.count === 1) {
        locked.push({
          id: c.id,
          eventId: c.eventId,
          eventType: c.eventType,
          eventVersion: c.eventVersion,
          aggregateType: c.aggregateType,
          aggregateId: c.aggregateId,
          payload: c.payload,
          status: c.status as any,
          attempts: c.attempts,
          nextRetryAt: c.nextRetryAt,
          lockedAt: now,
          lockedBy: args.lockedBy,
        });
      }
    }

    return locked;
  }

  async markPublished(id: string): Promise<void> {
    await prisma.outboxEvent.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: NOW(),
        lockedAt: null,
        lockedBy: null,
        lastError: null,
      },
    });
  }

  async markFailed(args: { id: string; error: string; nextRetryAt: Date }): Promise<void> {
    const current = await prisma.outboxEvent.findUnique({ where: { id: args.id } });
    const attempts = (current?.attempts ?? 0) + 1;

    await prisma.outboxEvent.update({
      where: { id: args.id },
      data: {
        status: 'FAILED',
        attempts,
        nextRetryAt: args.nextRetryAt ?? backoff(attempts),
        lastError: args.error.slice(0, 5000),
        lockedAt: null,
        lockedBy: null,
      },
    });
  }
}
