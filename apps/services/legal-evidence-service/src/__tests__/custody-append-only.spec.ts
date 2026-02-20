import { ChainOfCustodyEvent, CustodyEventType } from '../domain/entities/chain-of-custody-event.entity.js';
import { EvidenceFile } from '../domain/entities/evidence-file.entity.js';
import { Evidence, EvidenceType } from '../domain/aggregates/evidence.aggregate.js';

describe('CustodyEvent – append-only integrity', () => {
  describe('ChainOfCustodyEvent immutability', () => {
    it('should expose all fields as readonly', () => {
      const event = new ChainOfCustodyEvent(
        'evt-1',
        'evid-1',
        null,
        'officer-1',
        'File uploaded',
        'system',
        CustodyEventType.EVIDENCE_FILE_UPLOADED,
      );

      expect(event.id).toBe('evt-1');
      expect(event.evidenceId).toBe('evid-1');
      expect(event.eventType).toBe(CustodyEventType.EVIDENCE_FILE_UPLOADED);
      expect(event.toCustodian).toBe('officer-1');
      expect(event.reason).toBe('File uploaded');
      expect(event.recordedBy).toBe('system');
    });

    it('should not allow modification of readonly fields at runtime', () => {
      const event = new ChainOfCustodyEvent(
        'evt-2',
        'evid-1',
        null,
        'officer-1',
        'Hash computed',
        'system',
        CustodyEventType.EVIDENCE_HASHED,
      );

      expect(() => {
        (event as any).id = 'tampered-id';
      }).toThrow();

      expect(event.id).toBe('evt-2');
    });

    it('should preserve occurredAt immutably', () => {
      const before = new Date();
      const event = new ChainOfCustodyEvent(
        'evt-3',
        'evid-1',
        null,
        'officer-1',
        'Test reason',
        'system',
        CustodyEventType.CUSTODY_TRANSFER,
      );
      const after = new Date();

      expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(event.occurredAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('Evidence.uploadFile – automatic custody events', () => {
    function createEvidence(): Evidence {
      return Evidence.create('evid-1', 'Test Evidence', 'desc', EvidenceType.DOCUMENT, 'case-1', 'user-1');
    }

    function createFile(id: string): EvidenceFile {
      return new EvidenceFile(id, 'evid-1', 'contract.pdf', 'application/pdf', 1024, 'http://storage/file.pdf');
    }

    it('should add exactly two custody events on uploadFile', () => {
      const evidence = createEvidence();
      const file = createFile('file-1');
      const sha256 = 'a'.repeat(64);

      evidence.uploadFile(file, sha256, 'officer-1');

      const chain = evidence.custodyChain;
      expect(chain).toHaveLength(2);
    });

    it('should record EVIDENCE_FILE_UPLOADED as first custody event', () => {
      const evidence = createEvidence();
      const file = createFile('file-2');

      evidence.uploadFile(file, 'b'.repeat(64), 'officer-1');

      expect(evidence.custodyChain[0].eventType).toBe(CustodyEventType.EVIDENCE_FILE_UPLOADED);
    });

    it('should record EVIDENCE_HASHED as second custody event', () => {
      const evidence = createEvidence();
      const file = createFile('file-3');

      evidence.uploadFile(file, 'c'.repeat(64), 'officer-1');

      expect(evidence.custodyChain[1].eventType).toBe(CustodyEventType.EVIDENCE_HASHED);
    });

    it('should include hash value in EVIDENCE_HASHED reason', () => {
      const evidence = createEvidence();
      const file = createFile('file-4');
      const sha256 = 'd'.repeat(64);

      evidence.uploadFile(file, sha256, 'officer-1');

      expect(evidence.custodyChain[1].reason).toContain(sha256);
    });

    it('should attach HashRecord to file after uploadFile', () => {
      const evidence = createEvidence();
      const file = createFile('file-5');
      const sha256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

      evidence.uploadFile(file, sha256, 'officer-1');

      expect(file.hashRecord).not.toBeNull();
      expect(file.hashRecord!.hashValue).toBe(sha256);
      expect(file.hashRecord!.algorithm).toBe('SHA-256');
    });

    it('should throw when attempting to upload a duplicate file', () => {
      const evidence = createEvidence();
      const file = createFile('file-6');

      evidence.uploadFile(file, 'f'.repeat(64), 'officer-1');

      expect(() => evidence.uploadFile(file, 'f'.repeat(64), 'officer-1')).toThrow(
        'file-6',
      );
    });

    it('custody events should be immutable after creation', () => {
      const evidence = createEvidence();
      const file = createFile('file-7');

      evidence.uploadFile(file, '0'.repeat(64), 'officer-1');

      const evt = evidence.custodyChain[0];
      expect(() => {
        (evt as any).eventType = 'TAMPERED';
      }).toThrow();
      expect(evt.eventType).toBe(CustodyEventType.EVIDENCE_FILE_UPLOADED);
    });
  });

  describe('CustodyEventType enum values', () => {
    it('should expose EVIDENCE_FILE_UPLOADED', () => {
      expect(CustodyEventType.EVIDENCE_FILE_UPLOADED).toBe('EVIDENCE_FILE_UPLOADED');
    });

    it('should expose EVIDENCE_HASHED', () => {
      expect(CustodyEventType.EVIDENCE_HASHED).toBe('EVIDENCE_HASHED');
    });
  });
});
