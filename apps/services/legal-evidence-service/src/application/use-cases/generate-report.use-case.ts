import { randomUUID } from 'crypto';
import { LegalCase } from '../../domain/aggregates/case.aggregate.js';
import { Evidence } from '../../domain/aggregates/evidence.aggregate.js';
import { GeneratedReport, ReportStatus, ReportType } from '../../domain/entities/generated-report.entity.js';
import { AccessLog, AccessAction } from '../../domain/entities/access-log.entity.js';
import { ICaseRepository } from '../../domain/repositories/case.repository.js';
import { IEvidenceRepository } from '../../domain/repositories/evidence.repository.js';
import { IReportRepository } from '../../domain/repositories/report.repository.js';
import { IAccessLogRepository } from '../../domain/repositories/access-log.repository.js';
import { ReportGeneratedEvent } from '../../domain/events/report-generated.event.js';
import { IPdfGenerator, ReportContent } from '../ports/pdf-generator.port.js';

export interface GenerateReportCommand {
  caseId: string;
  requestedBy: string;
}

export interface GenerateReportResult {
  report: GeneratedReport;
  domainEvents: ReportGeneratedEvent[];
}

export class GenerateReportUseCase {
  constructor(
    private readonly caseRepository: ICaseRepository,
    private readonly evidenceRepository: IEvidenceRepository,
    private readonly reportRepository: IReportRepository,
    private readonly accessLogRepository: IAccessLogRepository,
    private readonly pdfGenerator: IPdfGenerator,
  ) {}

  async execute(command: GenerateReportCommand): Promise<GenerateReportResult> {
    const { caseId, requestedBy } = command;

    const legalCase: LegalCase | null = await this.caseRepository.findById(caseId);
    if (!legalCase) {
      throw new Error(`Case ${caseId} not found`);
    }

    const evidences: Evidence[] = await this.evidenceRepository.findByCaseId(caseId);

    const reportContent: ReportContent = {
      legalCase,
      evidences,
      generatedAt: new Date(),
      requestedBy,
    };

    const pdfBuffer = await this.pdfGenerator.generate(reportContent);
    const storageUrl = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;

    const reportId = randomUUID();
    const report = new GeneratedReport(
      reportId,
      caseId,
      ReportType.CASE_SUMMARY,
      requestedBy,
      ReportStatus.PENDING,
      null,
    );

    report.markAsGenerated(storageUrl);
    legalCase.addReport(report);

    await this.reportRepository.save(report);
    await this.caseRepository.update(legalCase);

    const custodyLog = new AccessLog(
      randomUUID(),
      caseId,
      'CASE',
      requestedBy,
      AccessAction.REPORT_GENERATED,
      null,
    );
    await this.accessLogRepository.save(custodyLog);

    const reportGeneratedEvent = new ReportGeneratedEvent(
      reportId,
      caseId,
      ReportType.CASE_SUMMARY,
      requestedBy,
      storageUrl,
    );

    return {
      report,
      domainEvents: [reportGeneratedEvent],
    };
  }
}
