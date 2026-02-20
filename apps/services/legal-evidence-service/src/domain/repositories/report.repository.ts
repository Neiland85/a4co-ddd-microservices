import { GeneratedReport } from '../entities/generated-report.entity.js';

export interface IReportRepository {
  save(report: GeneratedReport): Promise<void>;
  findById(id: string): Promise<GeneratedReport | null>;
  findByCaseId(caseId: string): Promise<GeneratedReport[]>;
}
