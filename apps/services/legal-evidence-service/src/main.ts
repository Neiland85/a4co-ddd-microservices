import 'reflect-metadata';
import { randomUUID } from 'crypto';
import { NestFactory } from '@nestjs/core';
import { LegalEvidenceModule } from './legal-evidence.module.js';
import { StructuredLogger } from './shared/structured-logger.js';

async function bootstrap() {
  const app = await NestFactory.create(LegalEvidenceModule);
  app.use((req: { headers: Record<string, string | string[] | undefined>; method?: string; url?: string; ip?: string }, res: { setHeader: (name: string, value: string) => void }, next: () => void) => {
    const incomingCorrelationId = req.headers['x-correlation-id'];
    const correlationId =
      typeof incomingCorrelationId === 'string' && incomingCorrelationId.trim().length > 0
        ? incomingCorrelationId
        : randomUUID();

    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);

    StructuredLogger.info({
      event: 'legal-evidence.access.request',
      correlationId,
      method: req.method,
      path: req.url,
      ip: req.ip,
    });
    next();
  });
  const port = Number(process.env['PORT'] ?? 3007);
  await app.listen(port);
  console.log(`Legal Evidence Service running on port ${port}`);
}

bootstrap();
