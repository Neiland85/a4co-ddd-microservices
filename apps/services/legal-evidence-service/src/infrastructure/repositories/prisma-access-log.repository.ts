import { PrismaClient } from '@prisma/client';
import { AccessLog, AccessAction } from '../../domain/entities/access-log.entity.js';
import { CustodyEventType } from '../../domain/entities/chain-of-custody-event.entity.js';
import { IAccessLogRepository } from '../../domain/repositories/access-log.repository.js';

export class PrismaAccessLogRepository implements IAccessLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(log: AccessLog): Promise<void> {
    await this.prisma.accessLog.create({
      data: {
        id: log.id,
        userId: log.userId,
        caseId: log.caseId,
        evidenceId: log.evidenceId,
        action: log.action,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        timestampUtc: log.timestampUtc,
      },
    });

    if (
      log.evidenceId &&
      (log.action === AccessAction.VIEW ||
        log.action === AccessAction.DOWNLOAD ||
        log.action === AccessAction.EXPORT)
    ) {
      await this.prisma.chainOfCustodyEvent.create({
        data: {
          evidenceId: log.evidenceId,
          eventType: CustodyEventType.EVIDENCE_ACCESSED,
          fromCustodian: null,
          toCustodian: log.userId,
          reason: CustodyEventType.EVIDENCE_ACCESSED,
          recordedBy: log.userId,
          occurredAt: log.timestampUtc,
        },
      });
    }
  }

  async findByCaseId(caseId: string): Promise<AccessLog[]> {
    const records = await this.prisma.accessLog.findMany({
      where: { caseId },
      orderBy: { timestampUtc: 'desc' },
    });
    return records.map(
      (r) =>
        new AccessLog(
          r.id,
          r.userId,
          r.caseId,
          r.evidenceId,
          r.action as AccessAction,
          r.ipAddress,
          r.userAgent,
          r.timestampUtc,
        ),
    );
  }
}
