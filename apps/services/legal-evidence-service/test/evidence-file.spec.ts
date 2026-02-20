import { EvidenceFile } from '../src/domain/entities/evidence-file.entity';
import { HashService } from '../src/domain/services/hash.service';

describe('EvidenceFile', () => {
  let hashService: HashService;

  beforeEach(() => {
    hashService = new HashService();
  });

  describe('create', () => {
    it('should create an EvidenceFile with filename and content', () => {
      const file = EvidenceFile.create('contract.pdf', 'document body', hashService);
      expect(file.filename).toBe('contract.pdf');
      expect(file.content).toBe('document body');
    });

    it('should automatically generate a HashRecord', () => {
      const file = EvidenceFile.create('invoice.pdf', 'invoice content', hashService);
      expect(file.hashRecord).toBeDefined();
      expect(file.hashRecord.id).toBeTruthy();
      expect(file.hashRecord.hash).toHaveLength(64);
      expect(file.hashRecord.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should use the file content to compute the hash', () => {
      const content = 'evidence text';
      const file = EvidenceFile.create('doc.txt', content, hashService);
      expect(file.hashRecord.hash).toBe(hashService.calculateSha256(content));
    });

    it('should set the entity id from the HashRecord id', () => {
      const file = EvidenceFile.create('report.pdf', 'report content', hashService);
      expect(file.id).toBe(file.hashRecord.id);
    });

    it('should produce different HashRecords for different contents', () => {
      const file1 = EvidenceFile.create('a.pdf', 'content A', hashService);
      const file2 = EvidenceFile.create('b.pdf', 'content B', hashService);
      expect(file1.hashRecord.hash).not.toBe(file2.hashRecord.hash);
    });

    it('should allow creating multiple files without collision', () => {
      const files = Array.from({ length: 5 }, (_, i) =>
        EvidenceFile.create(`file${i}.pdf`, `content ${i}`, hashService),
      );
      const ids = files.map((f) => f.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(5);
    });
  });
});
