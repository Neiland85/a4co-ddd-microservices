import { PrismaClient } from '@prisma/client';
import { LegalCase, CaseStatus } from '../../domain/aggregates/case.aggregate.js';
import { GeneratedReport, ReportStatus, ReportType } from '../../domain/entities/generated-report.entity.js';
import { ICaseRepository } from '../../domain/repositories/case.repository.js';

export class PrismaCaseRepository implements ICaseRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(legalCase: LegalCase): Promise<void> {
    await this.prisma.case.create({
      data: {
        id: legalCase.id,
        title: legalCase.title,
        description: legalCase.description,
        status: legalCase.status,
        openedBy: legalCase.openedBy,
        createdAt: legalCase.createdAt,
        updatedAt: legalCase.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<LegalCase | null> {
    const record = await this.prisma.case.findUnique({
      where: { id },
      include: { reports: true },
    });
    if (!record) return null;

    const reports = record.reports.map(
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

    return new LegalCase(
      record.id,
      record.title,
      record.description,
      record.openedBy,
      record.status as CaseStatus,
      [],
      reports,
      record.createdAt,
      record.updatedAt,
    );
  }

  async findAll(): Promise<LegalCase[]> {
    const records = await this.prisma.case.findMany();
    return records.map(
      (r) =>
        new LegalCase(r.id, r.title, r.description, r.openedBy, r.status as CaseStatus, [], [], r.createdAt, r.updatedAt),
    );
  }

  async findByStatus(status: CaseStatus): Promise<LegalCase[]> {
    const records = await this.prisma.case.findMany({ where: { status } });
    return records.map(
      (r) =>
        new LegalCase(r.id, r.title, r.description, r.openedBy, r.status as CaseStatus, [], [], r.createdAt, r.updatedAt),
    );
  }

  async update(legalCase: LegalCase): Promise<void> {
    await this.prisma.case.update({
      where: { id: legalCase.id },
      data: {
        title: legalCase.title,
        description: legalCase.description,
        status: legalCase.status,
        updatedAt: legalCase.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.case.delete({ where: { id } });
  }
}
