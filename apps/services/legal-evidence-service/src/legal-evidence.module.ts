import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GenerateReportUseCase } from './application/use-cases/generate-report.use-case.js';
import { MinimalPdfGeneratorService } from './infrastructure/pdf/minimal-pdf-generator.service.js';
import { PrismaReportRepository } from './infrastructure/repositories/prisma-report.repository.js';
import { PrismaAccessLogRepository } from './infrastructure/repositories/prisma-access-log.repository.js';
import { PrismaCaseRepository } from './infrastructure/repositories/prisma-case.repository.js';
import { PrismaEvidenceRepository } from './infrastructure/repositories/prisma-evidence.repository.js';
import { CasesController } from './presentation/controllers/cases.controller.js';
import { EvidenceController } from './presentation/controllers/evidence.controller.js';
import { VerifyEvidenceManifestUseCase } from './application/use-cases/verify-evidence-manifest.use-case.js';
import { ForensicManifestService } from './domain/services/forensic-manifest.service.js';

const prisma = new PrismaClient();

@Module({
  controllers: [CasesController, EvidenceController],
  providers: [
    { provide: 'PRISMA', useValue: prisma },
    { provide: 'ICaseRepository', useFactory: () => new PrismaCaseRepository(prisma) },
    { provide: 'IEvidenceRepository', useFactory: () => new PrismaEvidenceRepository(prisma) },
    { provide: 'IReportRepository', useFactory: () => new PrismaReportRepository(prisma) },
    { provide: 'IAccessLogRepository', useFactory: () => new PrismaAccessLogRepository(prisma) },
    { provide: 'IPdfGenerator', useClass: MinimalPdfGeneratorService },
    {
      provide: GenerateReportUseCase,
      useFactory: (
        caseRepo: InstanceType<typeof PrismaCaseRepository>,
        evidenceRepo: InstanceType<typeof PrismaEvidenceRepository>,
        reportRepo: InstanceType<typeof PrismaReportRepository>,
        accessLogRepo: InstanceType<typeof PrismaAccessLogRepository>,
        pdfGen: MinimalPdfGeneratorService,
      ) => new GenerateReportUseCase(caseRepo, evidenceRepo, reportRepo, accessLogRepo, pdfGen),
      inject: [
        'ICaseRepository',
        'IEvidenceRepository',
        'IReportRepository',
        'IAccessLogRepository',
        'IPdfGenerator',
      ],
    },
    { provide: ForensicManifestService, useFactory: () => new ForensicManifestService() },
    VerifyEvidenceManifestUseCase,
  ],
})
export class LegalEvidenceModule {}
