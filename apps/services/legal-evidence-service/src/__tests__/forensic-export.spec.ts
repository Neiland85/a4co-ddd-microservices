import { createHash, generateKeyPairSync } from 'crypto';
import {
  Evidence,
  EvidenceType,
  EvidenceStatus,
} from '../domain/aggregates/evidence.aggregate';
import { EvidenceFile, EvidenceFileStatus } from '../domain/entities/evidence-file.entity';
import { ChainOfCustodyEvent, CustodyEventType } from '../domain/entities/chain-of-custody-event.entity';
import { HashRecord } from '../domain/value-objects/hash-record.vo';
import {
  ForensicManifestService,
  CaseMetadata,
  ForensicManifest,
} from '../domain/services/forensic-manifest.service';
import { EvidenceExportedEvent } from '../domain/events/evidence-exported.event';

describe('ForensicManifestService', () => {
  let manifestService: ForensicManifestService;
  let evidence: Evidence;
  let caseMetadata: CaseMetadata;

  beforeEach(() => {
    const generatedKeyPair = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    manifestService = new ForensicManifestService(generatedKeyPair.privateKey, generatedKeyPair.publicKey);

    evidence = new Evidence(
      'evidence-001',
      'Contract signed by both parties',
      'Original signed contract',
      EvidenceType.DOCUMENT,
      'case-001',
      'user-juan',
      EvidenceStatus.ACCEPTED,
      [],
      [],
      new Date('2025-01-10T10:00:00Z'),
      new Date('2025-01-15T12:00:00Z'),
      'tenant-1',
    );

    caseMetadata = {
      id: 'case-001',
      title: 'Commercial dispute - ACME vs BETACORP',
      description: 'Breach of contract claim',
    };
  });

  describe('buildManifest', () => {
    it('should return a manifest with version 1.0', () => {
      const manifest = manifestService.buildManifest(evidence, caseMetadata);
      expect(manifest.version).toBe('1.0');
    });

    it('should include a generatedAt ISO timestamp', () => {
      const before = new Date().toISOString();
      const manifest = manifestService.buildManifest(evidence, caseMetadata);
      const after = new Date().toISOString();
      expect(manifest.generatedAt >= before).toBe(true);
      expect(manifest.generatedAt <= after).toBe(true);
    });

    it('should include case metadata in the manifest', () => {
      const manifest = manifestService.buildManifest(evidence, caseMetadata);
      expect(manifest.caseMetadata).toEqual(caseMetadata);
    });

    it('should include evidence core fields', () => {
      const manifest = manifestService.buildManifest(evidence, caseMetadata);
      expect(manifest.evidence.id).toBe('evidence-001');
      expect(manifest.evidence.title).toBe('Contract signed by both parties');
      expect(manifest.evidence.description).toBe('Original signed contract');
      expect(manifest.evidence.evidenceType).toBe(EvidenceType.DOCUMENT);
      expect(manifest.evidence.status).toBe(EvidenceStatus.ACCEPTED);
      expect(manifest.evidence.submittedBy).toBe('user-juan');
    });

    it('should include evidence timestamps as ISO strings', () => {
      const manifest = manifestService.buildManifest(evidence, caseMetadata);
      expect(manifest.evidence.createdAt).toBe('2025-01-10T10:00:00.000Z');
      expect(manifest.evidence.updatedAt).toBe('2025-01-15T12:00:00.000Z');
    });

    it('should include all EvidenceFiles in the manifest', () => {
      const hash = new HashRecord('SHA-256', 'a'.repeat(64), new Date('2025-01-10T11:00:00Z'));
      const file = new EvidenceFile(
        'file-001',
        'evidence-001',
        'contract.pdf',
        'application/pdf',
        204800,
        'https://storage.example.com/files/file-001',
        hash,
        EvidenceFileStatus.VERIFIED,
        new Date('2025-01-10T11:00:00Z'),
      );
      evidence.addFile(file);

      const manifest = manifestService.buildManifest(evidence, caseMetadata);
      expect(manifest.evidence.files).toHaveLength(1);

      const fileEntry = manifest.evidence.files[0];
      expect(fileEntry.id).toBe('file-001');
      expect(fileEntry.evidenceId).toBe('evidence-001');
      expect(fileEntry.fileName).toBe('contract.pdf');
      expect(fileEntry.mimeType).toBe('application/pdf');
      expect(fileEntry.sizeBytes).toBe(204800);
      expect(fileEntry.storageUrl).toBe('https://storage.example.com/files/file-001');
      expect(fileEntry.hashAlgorithm).toBe('SHA-256');
      expect(fileEntry.hashValue).toBe('a'.repeat(64));
      expect(fileEntry.status).toBe(EvidenceFileStatus.VERIFIED);
    });

    it('should include files with null hash fields when no hash is attached', () => {
      const file = new EvidenceFile(
        'file-002',
        'evidence-001',
        'photo.jpg',
        'image/jpeg',
        1024000,
        'https://storage.example.com/files/file-002',
      );
      evidence.addFile(file);

      const manifest = manifestService.buildManifest(evidence, caseMetadata);
      const fileEntry = manifest.evidence.files[0];
      expect(fileEntry.hashAlgorithm).toBeNull();
      expect(fileEntry.hashValue).toBeNull();
    });

    it('should include all ChainOfCustodyEvents in the custody timeline', () => {
      const custodyEvent = new ChainOfCustodyEvent(
        'custody-001',
        'evidence-001',
        null,
        'user-juan',
        'Initial custody assignment',
        'user-juan',
        CustodyEventType.CUSTODY_TRANSFER,
        new Date('2025-01-10T10:00:00Z'),
        'tenant-1',
      );
      evidence.transferCustody(custodyEvent);
      evidence.clearDomainEvents();

      const manifest = manifestService.buildManifest(evidence, caseMetadata);
      expect(manifest.evidence.custodyTimeline).toHaveLength(1);

      const entry = manifest.evidence.custodyTimeline[0];
      expect(entry.id).toBe('custody-001');
      expect(entry.fromCustodian).toBeNull();
      expect(entry.toCustodian).toBe('user-juan');
      expect(entry.reason).toBe('Initial custody assignment');
      expect(entry.recordedBy).toBe('user-juan');
      expect(entry.occurredAt).toBe('2025-01-10T10:00:00.000Z');
    });

    it('should generate a non-empty SHA-256 packageHash', () => {
      const manifest = manifestService.buildManifest(evidence, caseMetadata);
      expect(manifest.packageHash).toBeTruthy();
      expect(manifest.packageHash).toMatch(/^[a-f0-9]{64}$/);
      expect(manifest.manifestSignature).toBeTruthy();
      expect(manifest.publicKeyId).toBeTruthy();
    });

    it('should produce a deterministic packageHash for the same input', () => {
      const fixedEvidence = new Evidence(
        'evidence-001',
        'Test evidence',
        'desc',
        EvidenceType.DIGITAL,
        'case-001',
        'user-a',
        EvidenceStatus.SUBMITTED,
        [],
        [],
        new Date('2025-06-01T00:00:00Z'),
        new Date('2025-06-01T00:00:00Z'),
        'tenant-1',
      );
      const fixedCase: CaseMetadata = { id: 'case-001', title: 'Test Case' };

      const manifest1 = manifestService.buildManifest(fixedEvidence, fixedCase);
      const manifest2 = manifestService.buildManifest(fixedEvidence, fixedCase);

      expect(manifest1.packageHash).toBe(manifest2.packageHash);
    });

    it('should produce different packageHash for different evidences', () => {
      const evidenceA = new Evidence(
        'ev-A',
        'Evidence A',
        'desc A',
        EvidenceType.IMAGE,
        'case-001',
        'user-a',
        EvidenceStatus.SUBMITTED,
        [],
        [],
        new Date('2025-06-01T00:00:00Z'),
        new Date('2025-06-01T00:00:00Z'),
        'tenant-1',
      );
      const evidenceB = new Evidence(
        'ev-B',
        'Evidence B',
        'desc B',
        EvidenceType.AUDIO,
        'case-001',
        'user-b',
        EvidenceStatus.SUBMITTED,
        [],
        [],
        new Date('2025-06-01T00:00:00Z'),
        new Date('2025-06-01T00:00:00Z'),
        'tenant-1',
      );
      const fixedCase: CaseMetadata = { id: 'case-001' };

      const manifestA = manifestService.buildManifest(evidenceA, fixedCase);
      const manifestB = manifestService.buildManifest(evidenceB, fixedCase);

      expect(manifestA.packageHash).not.toBe(manifestB.packageHash);
    });

    it('should include all evidence files when multiple files are attached', () => {
      for (let i = 0; i < 3; i++) {
        evidence.addFile(
          new EvidenceFile(
            `file-${i}`,
            'evidence-001',
            `document-${i}.pdf`,
            'application/pdf',
            1024,
            `https://storage.example.com/files/file-${i}`,
          ),
        );
      }

      const manifest = manifestService.buildManifest(evidence, caseMetadata);
      expect(manifest.evidence.files).toHaveLength(3);
    });

    it('should include all custody events when multiple transfers occurred', () => {
      const custodians = ['user-a', 'user-b', 'user-c'];
      for (let i = 0; i < custodians.length; i++) {
        const event = new ChainOfCustodyEvent(
          `custody-${i}`,
          'evidence-001',
          i === 0 ? null : custodians[i - 1],
          custodians[i],
          `Transfer ${i}`,
          'admin',
          CustodyEventType.CUSTODY_TRANSFER,
          new Date(),
          'tenant-1',
        );
        evidence.transferCustody(event);
      }
      evidence.clearDomainEvents();

      const manifest = manifestService.buildManifest(evidence, caseMetadata);
      expect(manifest.evidence.custodyTimeline).toHaveLength(3);
    });
  });

  describe('computePackageHash', () => {
    it('should compute the correct SHA-256 hash of the given content', () => {
      const content = '{"test":"value"}';
      const expected = createHash('sha256').update(content, 'utf8').digest('hex');
      expect(manifestService.computePackageHash(content)).toBe(expected);
    });

    it('should return a 64-character hex string', () => {
      const hash = manifestService.computePackageHash('any content');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should return the SHA-256 of the empty string correctly', () => {
      const emptyHash = manifestService.computePackageHash('');
      expect(emptyHash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    });
  });

  describe('verifyManifestSignature', () => {
    it('should return true for a generated manifest', () => {
      const manifest = manifestService.buildManifest(evidence, caseMetadata);
      expect(manifestService.verifyManifestSignature(manifest)).toBe(true);
    });

    it('should return false when manifest payload is tampered', () => {
      const manifest = manifestService.buildManifest(evidence, caseMetadata);
      const tamperedManifest: ForensicManifest = {
        ...manifest,
        evidence: { ...manifest.evidence, title: 'tampered-title' },
      };
      expect(manifestService.verifyManifestSignature(tamperedManifest)).toBe(false);
    });
  });
});

describe('Evidence.recordExport', () => {
  let evidence: Evidence;

  beforeEach(() => {
    evidence = new Evidence(
      'ev-001',
      'Key document',
      'desc',
      EvidenceType.DOCUMENT,
      'case-001',
      'user-alice',
      EvidenceStatus.ACCEPTED,
      [],
      [],
      new Date('2025-01-01T00:00:00Z'),
      new Date('2025-01-02T00:00:00Z'),
      'tenant-1',
    );
    evidence.clearDomainEvents();
  });

  it('should add a ChainOfCustodyEvent with reason EVIDENCE_EXPORTED', () => {
    expect(evidence.custodyChain).toHaveLength(0);
    evidence.recordExport('auditor-bob', 'abc123hash');
    expect(evidence.custodyChain).toHaveLength(1);
    expect(evidence.custodyChain[0].reason).toBe('EVIDENCE_EXPORTED');
  });

  it('should set toCustodian and recordedBy to exportedBy', () => {
    evidence.recordExport('auditor-bob', 'abc123hash');
    const custodyEvent = evidence.custodyChain[0];
    expect(custodyEvent.toCustodian).toBe('auditor-bob');
    expect(custodyEvent.recordedBy).toBe('auditor-bob');
  });

  it('should emit an EvidenceExportedEvent domain event', () => {
    evidence.recordExport('auditor-bob', 'abc123hash');
    const events = evidence.domainEvents;
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(EvidenceExportedEvent);
  });

  it('should include the correct payload in EvidenceExportedEvent', () => {
    evidence.recordExport('auditor-bob', 'packagehash-xyz');
    const event = evidence.domainEvents[0] as EvidenceExportedEvent;
    expect(event.evidenceId).toBe('ev-001');
    expect(event.caseId).toBe('case-001');
    expect(event.exportedBy).toBe('auditor-bob');
    expect(event.packageHash).toBe('packagehash-xyz');
  });

  it('should generate a unique custody event id on each call', () => {
    evidence.recordExport('auditor-bob', 'hash1');
    const firstId = evidence.custodyChain[0].id;
    evidence.clearDomainEvents();
    evidence.recordExport('auditor-carol', 'hash2');
    const secondId = evidence.custodyChain[1].id;
    expect(firstId).not.toBe(secondId);
  });

  it('should log export with structured payload', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    evidence.recordExport('auditor-bob', 'hash-001');

    const logEntry = JSON.parse(String(consoleSpy.mock.calls[0][0]));
    expect(logEntry.event).toBe('legal-evidence.evidence.exported');
    expect(logEntry.evidenceId).toBe('ev-001');
    expect(logEntry.exportedBy).toBe('auditor-bob');

    consoleSpy.mockRestore();
  });
});
