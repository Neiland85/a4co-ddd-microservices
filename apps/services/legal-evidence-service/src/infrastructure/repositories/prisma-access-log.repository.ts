import { PrismaClient } from '@prisma/client';
import { AccessLog, AccessAction } from '../../domain/entities/access-log.entity.js';
import { IAccessLogRepository } from '../../domain/repositories/access-log.repository.js';

export class PrismaAccessLogRepository implements IAccessLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(log: AccessLog): Promise<void> {
    await this.prisma.accessLog.create({
      data: {
        id: log.id,
        tenantId: log.tenantId!,
        resourceId: log.resourceId,
        resourceType: log.resourceType,
        userId: log.userId,
        action: log.action,
        ipAddress: log.ipAddress,
        occurredAt: log.occurredAt,
      },
    });
  }

  async findByResourceId(resourceId: string, tenantId?: string): Promise<AccessLog[]> {
    const records = await this.prisma.accessLog.findMany({
      where: { resourceId, ...(tenantId ? { tenantId } : {}) },
    });
    return records.map(
      (r) =>
        new AccessLog(
          r.id,
          r.resourceId,
          r.resourceType,
          r.userId,
          r.action as AccessAction,
          r.ipAddress,
          r.occurredAt,
          r.tenantId,
        ),
    );
  }
}
