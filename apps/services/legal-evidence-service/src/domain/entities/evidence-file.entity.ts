import { HashRecord } from '../value-objects/hash-record.vo';
import { HashService } from '../services/hash.service';

export class EvidenceFile {
  readonly id: string;
  readonly filename: string;
  readonly content: string;
  readonly hashRecord: HashRecord;

  private constructor(id: string, filename: string, content: string, hashRecord: HashRecord) {
    this.id = id;
    this.filename = filename;
    this.content = content;
    this.hashRecord = hashRecord;
  }

  static create(filename: string, content: string, hashService: HashService): EvidenceFile {
    const hashRecord = hashService.generateHashRecord(content);
    return new EvidenceFile(hashRecord.id, filename, content, hashRecord);
  }
}
