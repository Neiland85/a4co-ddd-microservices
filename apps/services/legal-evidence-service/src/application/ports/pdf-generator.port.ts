import { LegalCase } from '../../domain/aggregates/case.aggregate.js';
import { Evidence } from '../../domain/aggregates/evidence.aggregate.js';

export interface ReportContent {
  legalCase: LegalCase;
  evidences: Evidence[];
  generatedAt: Date;
  requestedBy: string;
}

export interface IPdfGenerator {
  generate(content: ReportContent): Promise<Buffer>;
}

export const PDF_GENERATOR_PORT = 'IPdfGenerator';
