import { PrismaClient } from "@prisma/client";
import { OutboxPublisher } from "../index.js";

const prisma = new PrismaClient();

const natsUrl = process.env.NATS_URL || "nats://localhost:4222";
const subjectPrefix = process.env.OUTBOX_SUBJECT_PREFIX || "a4co";
const pollIntervalMs = Number(process.env.OUTBOX_POLL_MS || "1000");
const batchSize = Number(process.env.OUTBOX_BATCH || "50");

const abort = new AbortController();

process.on("SIGINT", () => abort.abort());
process.on("SIGTERM", () => abort.abort());

async function main() {
  const pub = new OutboxPublisher(prisma, {
    natsUrl,
    subjectPrefix,
    pollIntervalMs,
    batchSize,
  });

  await pub.start(abort.signal);

  await pub.stop();
  await prisma.$disconnect();
}

main().catch(async (e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
