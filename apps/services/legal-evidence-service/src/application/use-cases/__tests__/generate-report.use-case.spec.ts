import { GenerateReportUseCase } from '../generate-report.use-case';
import { LegalCase, CaseStatus } from '../../../domain/aggregates/case.aggregate';
import { Evidence, EvidenceType, EvidenceStatus } from '../../../domain/aggregates/evidence.aggregate';
import { GeneratedReport, ReportStatus, ReportType } from '../../../domain/entities/generated-report.entity';
import { AccessAction } from '../../../domain/entities/access-log.entity';
import { ICaseRepository } from '../../../domain/repositories/case.repository';
import { IEvidenceRepository } from '../../../domain/repositories/evidence.repository';
import { IReportRepository } from '../../../domain/repositories/report.repository';
import { IAccessLogRepository } from '../../../domain/repositories/access-log.repository';
import { IPdfGenerator } from '../../ports/pdf-generator.port';

const mockCase = new LegalCase(
  'case-001',
  'Test Case',
  'A test legal case',
  'judge-01',
  CaseStatus.OPEN,
  [],
  [],
  new Date('2024-01-01'),
  new Date('2024-01-01'),
  'tenant-1',
);

const mockEvidence = new Evidence(
  'ev-001',
  'Document A',
  'Important contract',
  EvidenceType.DOCUMENT,
  'case-001',
  'lawyer-01',
  EvidenceStatus.SUBMITTED,
  [],
  [],
  new Date('2024-01-02'),
  new Date('2024-01-02'),
);

function buildUseCase(overrides: {
  caseRepo?: Partial<ICaseRepository>;
  evidenceRepo?: Partial<IEvidenceRepository>;
  reportRepo?: Partial<IReportRepository>;
  accessLogRepo?: Partial<IAccessLogRepository>;
  pdfGen?: Partial<IPdfGenerator>;
}) {
  const caseRepo: ICaseRepository = {
    findById: jest.fn().mockResolvedValue(mockCase),
    save: jest.fn().mockResolvedValue(undefined),
    findAll: jest.fn().mockResolvedValue([]),
    findByStatus: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    ...overrides.caseRepo,
  };

  const evidenceRepo: IEvidenceRepository = {
    findByCaseId: jest.fn().mockResolvedValue([mockEvidence]),
    save: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn().mockResolvedValue(null),
    findByStatus: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    ...overrides.evidenceRepo,
  };

  const reportRepo: IReportRepository = {
    save: jest.fn().mockResolvedValue(undefined),
    findById: jest.fn().mockResolvedValue(null),
    findByCaseId: jest.fn().mockResolvedValue([]),
    ...overrides.reportRepo,
  };

  const accessLogRepo: IAccessLogRepository = {
    save: jest.fn().mockResolvedValue(undefined),
    findByResourceId: jest.fn().mockResolvedValue([]),
    ...overrides.accessLogRepo,
  };

  const pdfGen: IPdfGenerator = {
    generate: jest.fn().mockResolvedValue(Buffer.from('PDF_CONTENT')),
    ...overrides.pdfGen,
  };

  return {
    useCase: new GenerateReportUseCase(caseRepo, evidenceRepo, reportRepo, accessLogRepo, pdfGen),
    caseRepo,
    evidenceRepo,
    reportRepo,
    accessLogRepo,
    pdfGen,
  };
}

describe('GenerateReportUseCase', () => {
  describe('execute', () => {
    it('should return a GENERATED report on success', async () => {
      const { useCase } = buildUseCase({});

      const result = await useCase.execute({ caseId: 'case-001', requestedBy: 'user-01', tenantId: 'tenant-1' });

      expect(result.report).toBeInstanceOf(GeneratedReport);
      expect(result.report.status).toBe(ReportStatus.GENERATED);
      expect(result.report.caseId).toBe('case-001');
      expect(result.report.reportType).toBe(ReportType.CASE_SUMMARY);
      expect(result.report.storageUrl).toMatch(/^data:application\/pdf;base64,/);
    });

    it('should persist the report via reportRepository', async () => {
      const { useCase, reportRepo } = buildUseCase({});

      await useCase.execute({ caseId: 'case-001', requestedBy: 'user-01', tenantId: 'tenant-1' });

      expect(reportRepo.save).toHaveBeenCalledTimes(1);
      const savedReport = (reportRepo.save as jest.Mock).mock.calls[0][0] as GeneratedReport;
      expect(savedReport.caseId).toBe('case-001');
    });

    it('should update the case with the new report', async () => {
      const { useCase, caseRepo } = buildUseCase({});

      await useCase.execute({ caseId: 'case-001', requestedBy: 'user-01', tenantId: 'tenant-1' });

      expect(caseRepo.update).toHaveBeenCalledTimes(1);
    });

    it('should register a REPORT_GENERATED access log (custody event)', async () => {
      const { useCase, accessLogRepo } = buildUseCase({});

      await useCase.execute({ caseId: 'case-001', requestedBy: 'user-01', tenantId: 'tenant-1' });

      expect(accessLogRepo.save).toHaveBeenCalledTimes(1);
      const savedLog = (accessLogRepo.save as jest.Mock).mock.calls[0][0];
      expect(savedLog.action).toBe(AccessAction.REPORT_GENERATED);
      expect(savedLog.resourceId).toBe('case-001');
      expect(savedLog.userId).toBe('user-01');
      expect(savedLog.tenantId).toBe('tenant-1');
    });

    it('should emit a ReportGeneratedEvent in the result', async () => {
      const { useCase } = buildUseCase({});

      const result = await useCase.execute({ caseId: 'case-001', requestedBy: 'user-01', tenantId: 'tenant-1' });

      expect(result.domainEvents).toHaveLength(1);
      expect(result.domainEvents[0].eventType).toBe('legal-evidence.report.generated.v1');
    });

    it('should throw an error if the case is not found', async () => {
      const { useCase } = buildUseCase({
        caseRepo: { findById: jest.fn().mockResolvedValue(null) },
      });

      await expect(useCase.execute({ caseId: 'missing-case', requestedBy: 'user-01', tenantId: 'tenant-1' })).rejects.toThrow(
        'Case missing-case not found',
      );
    });

    it('should call pdfGenerator.generate with the case and evidences', async () => {
      const { useCase, pdfGen } = buildUseCase({});

      await useCase.execute({ caseId: 'case-001', requestedBy: 'user-01', tenantId: 'tenant-1' });

      expect(pdfGen.generate).toHaveBeenCalledTimes(1);
      const content = (pdfGen.generate as jest.Mock).mock.calls[0][0];
      expect(content.legalCase.id).toBe('case-001');
      expect(content.evidences).toHaveLength(1);
    });

    it('should handle cases with no evidences', async () => {
      const { useCase } = buildUseCase({
        evidenceRepo: { findByCaseId: jest.fn().mockResolvedValue([]) },
      });

      const result = await useCase.execute({ caseId: 'case-001', requestedBy: 'user-01', tenantId: 'tenant-1' });

      expect(result.report.status).toBe(ReportStatus.GENERATED);
    });

    it('should reject access when case tenant differs from command tenant', async () => {
      const otherTenantCase = new LegalCase(
        'case-001',
        'Test Case',
        'A test legal case',
        'judge-01',
        CaseStatus.OPEN,
        [],
        [],
        new Date('2024-01-01'),
        new Date('2024-01-01'),
        'tenant-2',
      );
      const { useCase, evidenceRepo } = buildUseCase({
        caseRepo: { findById: jest.fn().mockResolvedValue(otherTenantCase) },
      });

      await expect(useCase.execute({ caseId: 'case-001', requestedBy: 'user-01', tenantId: 'tenant-1' })).rejects.toThrow(
        'Tenant access denied for case case-001',
      );
      expect(evidenceRepo.findByCaseId).not.toHaveBeenCalled();
    });
  });
});
