import { LegalCase, CaseStatus } from '../aggregates/case.aggregate.js';

export interface ICaseRepository {
  save(legalCase: LegalCase): Promise<void>;
  findById(id: string, tenantId?: string): Promise<LegalCase | null>;
  findAll(tenantId?: string): Promise<LegalCase[]>;
  findByStatus(status: CaseStatus, tenantId?: string): Promise<LegalCase[]>;
  update(legalCase: LegalCase): Promise<void>;
  delete(id: string): Promise<void>;
}
