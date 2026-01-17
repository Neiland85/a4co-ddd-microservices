import { connect, JSONCodec, NatsConnection, JetStreamClient } from "nats";
import { PrismaClient } from "@prisma/client";

export type OutboxPublisherConfig = {
  natsUrl: string;
  stream?: string; // opcional, si quieres validar stream existente
  subjectPrefix?: string; // default: "a4co"
  batchSize?: number; // default: 50
  pollIntervalMs?: number; // default: 1000
};

const DEFAULTS = {
  subjectPrefix: "a4co",
  batchSize: 50,
  pollIntervalMs: 1000,
};

export class OutboxPublisher {
  private prisma: PrismaClient;
  private nc!: NatsConnection;
  private js!: JetStreamClient;
  private readonly cfg: Required<Omit<OutboxPublisherConfig, "stream">> & Pick<OutboxPublisherConfig, "stream">;

  constructor(prisma: PrismaClient, cfg: OutboxPublisherConfig) {
    this.prisma = prisma;
    this.cfg = {
      subjectPrefix: cfg.subjectPrefix ?? DEFAULTS.subjectPrefix,
      batchSize: cfg.batchSize ?? DEFAULTS.batchSize,
      pollIntervalMs: cfg.pollIntervalMs ?? DEFAULTS.pollIntervalMs,
      natsUrl: cfg.natsUrl,
      stream: cfg.stream,
    };
  }

  async start(signal?: AbortSignal) {
    this.nc = await connect({ servers: this.cfg.natsUrl });
    this.js = this.nc.jetstream();
    const jc = JSONCodec();

    while (!signal?.aborted) {
      const events = await this.prisma.outboxEvent.findMany({
        where: { processed: false },
        orderBy: { createdAt: "asc" },
        take: this.cfg.batchSize,
      });

      if (events.length === 0) {
        await this.sleep(this.cfg.pollIntervalMs);
        continue;
      }

      for (const evt of events) {
        const subject = `${this.cfg.subjectPrefix}.${evt.aggregateType}.${evt.eventType}.v${evt.eventVersion}`;

        try {
          // JetStream publish con msgID = eventId (idempotencia)
          await this.js.publish(subject, jc.encode(evt.payload), {
            msgID: evt.eventId,
          });

          // marcar como procesado (solo si publish OK)
          await this.prisma.outboxEvent.update({
            where: { eventId: evt.eventId },
            data: { processed: true },
          });
        } catch (err) {
          // no marcamos processed; reintento en ciclo siguiente
          // si necesitas backoff por evento, se añade en C2.3/C2.4
          // eslint-disable-next-line no-console
          console.warn(`[outbox] publish failed: ${evt.eventId} -> ${subject}`, err);
        }
      }
    }
  }

  async stop() {
    try { await this.nc?.drain(); } catch {}
    try { await this.nc?.close(); } catch {}
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
