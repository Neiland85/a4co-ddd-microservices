import { AccessLog } from '../entities/access-log.entity.js';

export interface IAccessLogRepository {
  save(log: AccessLog): Promise<void>;
  findByResourceId(resourceId: string, tenantId?: string): Promise<AccessLog[]>;
  findByCaseId(caseId: string): Promise<AccessLog[]>;
}
