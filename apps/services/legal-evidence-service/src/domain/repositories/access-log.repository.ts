import { AccessLog } from '../entities/access-log.entity.js';

export interface IAccessLogRepository {
  save(log: AccessLog): Promise<void>;
  findByCaseId(caseId: string): Promise<AccessLog[]>;
}
