import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { LegalEvidenceModule } from './legal-evidence.module.js';

async function bootstrap() {
  const app = await NestFactory.create(LegalEvidenceModule);
  const port = Number(process.env['PORT'] ?? 3007);
  await app.listen(port);
  console.log(`Legal Evidence Service running on port ${port}`);
}

bootstrap();
