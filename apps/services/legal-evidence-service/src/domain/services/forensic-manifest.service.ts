import {
  createHash,
  createPrivateKey,
  createPublicKey,
  createSign,
  createVerify,
  generateKeyPairSync,
} from 'crypto';
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
  manifestSignature: string;
  publicKeyId: string;
}

export class ForensicManifestService {
  private readonly privateKeyPem: string;
  private readonly publicKeyPem: string;
  private readonly publicKeyId: string;

  constructor(
    privateKeyPem = process.env['FORENSIC_MANIFEST_PRIVATE_KEY_PEM'],
    publicKeyPem = process.env['FORENSIC_MANIFEST_PUBLIC_KEY_PEM'],
    publicKeyId = process.env['FORENSIC_MANIFEST_PUBLIC_KEY_ID'],
  ) {
    if (privateKeyPem) {
      this.privateKeyPem = privateKeyPem;
      this.publicKeyPem =
        publicKeyPem ??
        createPublicKey(createPrivateKey(privateKeyPem)).export({ type: 'spki', format: 'pem' }).toString();
    } else {
      const generated = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
      this.privateKeyPem = generated.privateKey;
      this.publicKeyPem = generated.publicKey;
    }

    this.publicKeyId = publicKeyId ?? createHash('sha256').update(this.publicKeyPem).digest('hex').slice(0, 16);
  }

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
    const payload = { ...manifestBody, packageHash };
    const manifestSignature = this.signPayload(JSON.stringify(payload));

    return { ...payload, manifestSignature, publicKeyId: this.publicKeyId };
  }

  computePackageHash(content: string): string {
    return createHash('sha256').update(content, 'utf8').digest('hex');
  }

  verifyManifestSignature(manifest: ForensicManifest): boolean {
    if (!manifest.manifestSignature || manifest.publicKeyId !== this.publicKeyId) {
      return false;
    }

    const { manifestSignature, ...payloadWithKeyId } = manifest;
    const { publicKeyId, ...payload } = payloadWithKeyId;
    void publicKeyId;
    const verifier = createVerify('RSA-SHA256');
    verifier.update(JSON.stringify(payload), 'utf8');
    verifier.end();
    return verifier.verify(this.publicKeyPem, manifestSignature, 'base64');
  }

  private signPayload(payload: string): string {
    const signer = createSign('RSA-SHA256');
    signer.update(payload, 'utf8');
    signer.end();
    return signer.sign(this.privateKeyPem, 'base64');
  }
}
