import { LegalCase, CaseStatus } from '../aggregates/case.aggregate.js';

export interface ICaseRepository {
  save(legalCase: LegalCase): Promise<void>;
  findById(id: string): Promise<LegalCase | null>;
  findAll(): Promise<LegalCase[]>;
  findByStatus(status: CaseStatus): Promise<LegalCase[]>;
  update(legalCase: LegalCase): Promise<void>;
  delete(id: string): Promise<void>;
}
