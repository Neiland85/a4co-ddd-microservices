import { PrismaClient } from '@prisma/client';
import { Evidence, EvidenceType, EvidenceStatus } from '../../domain/aggregates/evidence.aggregate.js';
import { IEvidenceRepository } from '../../domain/repositories/evidence.repository.js';

export class PrismaEvidenceRepository implements IEvidenceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(evidence: Evidence): Promise<void> {
    await this.prisma.evidence.create({
      data: {
        id: evidence.id,
        tenantId: evidence.tenantId,
        caseId: evidence.caseId,
        title: evidence.title,
        description: evidence.description,
        evidenceType: evidence.evidenceType,
        status: evidence.status,
        submittedBy: evidence.submittedBy,
        createdAt: evidence.createdAt,
        updatedAt: evidence.updatedAt,
      },
    });
  }

  async findById(id: string, tenantId?: string): Promise<Evidence | null> {
    const record = await this.prisma.evidence.findFirst({
      where: { id, ...(tenantId ? { tenantId } : {}) },
    });
    if (!record) return null;
    return new Evidence(
      record.id,
      record.title,
      record.description,
      record.evidenceType as EvidenceType,
      record.caseId,
      record.submittedBy,
      record.status as EvidenceStatus,
      [],
      [],
      record.createdAt,
      record.updatedAt,
      record.tenantId,
    );
  }

  async findByCaseId(caseId: string, tenantId?: string): Promise<Evidence[]> {
    const records = await this.prisma.evidence.findMany({
      where: { caseId, ...(tenantId ? { tenantId } : {}) },
    });
    return records.map(
      (r) =>
        new Evidence(
          r.id,
          r.title,
          r.description,
          r.evidenceType as EvidenceType,
          r.caseId,
          r.submittedBy,
          r.status as EvidenceStatus,
          [],
          [],
          r.createdAt,
          r.updatedAt,
          r.tenantId,
        ),
    );
  }

  async findByStatus(status: EvidenceStatus, tenantId?: string): Promise<Evidence[]> {
    const records = await this.prisma.evidence.findMany({
      where: { status, ...(tenantId ? { tenantId } : {}) },
    });
    return records.map(
      (r) =>
        new Evidence(
          r.id,
          r.title,
          r.description,
          r.evidenceType as EvidenceType,
          r.caseId,
          r.submittedBy,
          r.status as EvidenceStatus,
          [],
          [],
          r.createdAt,
          r.updatedAt,
          r.tenantId,
        ),
    );
  }

  async update(evidence: Evidence): Promise<void> {
    await this.prisma.evidence.update({
      where: { id: evidence.id },
      data: {
        title: evidence.title,
        description: evidence.description,
        status: evidence.status,
        updatedAt: evidence.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.evidence.delete({ where: { id } });
  }
}
