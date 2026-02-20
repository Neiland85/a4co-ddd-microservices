import { Evidence, EvidenceStatus } from '../aggregates/evidence.aggregate.js';

export interface IEvidenceRepository {
  save(evidence: Evidence): Promise<void>;
  findById(id: string): Promise<Evidence | null>;
  findByCaseId(caseId: string): Promise<Evidence[]>;
  findByStatus(status: EvidenceStatus): Promise<Evidence[]>;
  update(evidence: Evidence): Promise<void>;
  delete(id: string): Promise<void>;
}
