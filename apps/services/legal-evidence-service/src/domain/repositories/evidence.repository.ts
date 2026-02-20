import { Evidence, EvidenceStatus } from '../aggregates/evidence.aggregate.js';
import { ChainOfCustodyEvent } from '../entities/chain-of-custody-event.entity.js';

export interface IEvidenceRepository {
  save(evidence: Evidence): Promise<void>;
  findById(id: string): Promise<Evidence | null>;
  findByCaseId(caseId: string): Promise<Evidence[]>;
  findByStatus(status: EvidenceStatus): Promise<Evidence[]>;
  update(evidence: Evidence): Promise<void>;
  delete(id: string): Promise<void>;
  getCustodyTimeline(evidenceId: string): Promise<ChainOfCustodyEvent[]>;
}
