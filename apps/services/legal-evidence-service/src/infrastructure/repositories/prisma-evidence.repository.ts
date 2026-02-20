import { PrismaClient } from '@prisma/client';
import { Evidence, EvidenceType, EvidenceStatus } from '../../domain/aggregates/evidence.aggregate.js';
import { IEvidenceRepository } from '../../domain/repositories/evidence.repository.js';
import { CUSTODY_EVENT_IMMUTABLE_ERROR } from '../prisma/custody-event-immutability.middleware.js';

export class PrismaEvidenceRepository implements IEvidenceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(evidence: Evidence): Promise<void> {
    await this.prisma.evidence.create({
      data: {
        id: evidence.id,
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

  async findById(id: string): Promise<Evidence | null> {
    const record = await this.prisma.evidence.findUnique({ where: { id } });
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
    );
  }

  async findByCaseId(caseId: string): Promise<Evidence[]> {
    const records = await this.prisma.evidence.findMany({ where: { caseId } });
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
        ),
    );
  }

  async findByStatus(status: EvidenceStatus): Promise<Evidence[]> {
    const records = await this.prisma.evidence.findMany({ where: { status } });
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

  async updateCustodyEvent(): Promise<never> {
    throw new Error(CUSTODY_EVENT_IMMUTABLE_ERROR);
  }

  async deleteCustodyEvent(): Promise<never> {
    throw new Error(CUSTODY_EVENT_IMMUTABLE_ERROR);
  }
}
