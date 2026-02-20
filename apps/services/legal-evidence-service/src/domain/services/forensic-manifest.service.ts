import { createHash } from 'crypto';
import { Evidence } from '../aggregates/evidence.aggregate.js';

export interface CaseMetadata {
  id: string;
  title?: string;
  description?: string;
}

export interface FileManifestEntry {
  id: string;
  evidenceId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageUrl: string;
  hashAlgorithm: string | null;
  hashValue: string | null;
  status: string;
  uploadedAt: string;
}

export interface CustodyEventEntry {
  id: string;
  fromCustodian: string | null;
  toCustodian: string;
  reason: string;
  recordedBy: string;
  occurredAt: string;
}

export interface ForensicManifest {
  version: string;
  generatedAt: string;
  caseMetadata: CaseMetadata;
  evidence: {
    id: string;
    title: string;
    description: string;
    evidenceType: string;
    status: string;
    submittedBy: string;
    createdAt: string;
    updatedAt: string;
    files: FileManifestEntry[];
    custodyTimeline: CustodyEventEntry[];
  };
  packageHash: string;
}

export class ForensicManifestService {
  buildManifest(evidence: Evidence, caseMetadata: CaseMetadata): ForensicManifest {
    const manifestBody = {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      caseMetadata,
      evidence: {
        id: evidence.id,
        title: evidence.title,
        description: evidence.description,
        evidenceType: evidence.evidenceType,
        status: evidence.status,
        submittedBy: evidence.submittedBy,
        createdAt: evidence.createdAt.toISOString(),
        updatedAt: evidence.updatedAt.toISOString(),
        files: evidence.files.map((f) => ({
          id: f.id,
          evidenceId: f.evidenceId,
          fileName: f.fileName,
          mimeType: f.mimeType,
          sizeBytes: f.sizeBytes,
          storageUrl: f.storageUrl,
          hashAlgorithm: f.hashRecord?.algorithm ?? null,
          hashValue: f.hashRecord?.hashValue ?? null,
          status: f.status,
          uploadedAt: f.uploadedAt.toISOString(),
        })),
        custodyTimeline: evidence.custodyChain.map((e) => ({
          id: e.id,
          fromCustodian: e.fromCustodian,
          toCustodian: e.toCustodian,
          reason: e.reason,
          recordedBy: e.recordedBy,
          occurredAt: e.occurredAt.toISOString(),
        })),
      },
    };

    const packageHash = this.computePackageHash(JSON.stringify(manifestBody));

    return { ...manifestBody, packageHash };
  }

  computePackageHash(content: string): string {
    return createHash('sha256').update(content, 'utf8').digest('hex');
  }
}
