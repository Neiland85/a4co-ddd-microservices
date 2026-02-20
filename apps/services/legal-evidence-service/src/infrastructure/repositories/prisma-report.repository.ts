import { PrismaClient } from '@prisma/client';
import { GeneratedReport, ReportStatus, ReportType } from '../../domain/entities/generated-report.entity.js';
import { IReportRepository } from '../../domain/repositories/report.repository.js';

export class PrismaReportRepository implements IReportRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(report: GeneratedReport): Promise<void> {
    await this.prisma.generatedReport.create({
      data: {
        id: report.id,
        caseId: report.caseId,
        reportType: report.reportType,
        requestedBy: report.requestedBy,
        status: report.status,
        storageUrl: report.storageUrl,
        requestedAt: report.requestedAt,
      },
    });
  }

  async findById(id: string): Promise<GeneratedReport | null> {
    const record = await this.prisma.generatedReport.findUnique({ where: { id } });
    if (!record) return null;
    return new GeneratedReport(
      record.id,
      record.caseId,
      record.reportType as ReportType,
      record.requestedBy,
      record.status as ReportStatus,
      record.storageUrl,
      record.requestedAt,
    );
  }

  async findByCaseId(caseId: string): Promise<GeneratedReport[]> {
    const records = await this.prisma.generatedReport.findMany({ where: { caseId } });
    return records.map(
      (r) =>
        new GeneratedReport(
          r.id,
          r.caseId,
          r.reportType as ReportType,
          r.requestedBy,
          r.status as ReportStatus,
          r.storageUrl,
          r.requestedAt,
        ),
    );
  }
}
