import { HashService } from '../../domain/services/hash.service.js';
import { IEvidenceRepository } from '../../domain/repositories/evidence.repository.js';
import { EvidenceFile } from '../../domain/entities/evidence-file.entity.js';
import { ChainOfCustodyEvent } from '../../domain/entities/chain-of-custody-event.entity.js';
import { StructuredLogger } from '../../shared/structured-logger.js';

export interface UploadFileCommand {
  evidenceId: string;
  fileId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageUrl: string;
  content: Buffer | string;
  uploadedBy: string;
  correlationId?: string;
}

export class EvidenceService {
  constructor(
    private readonly evidenceRepository: IEvidenceRepository,
    private readonly hashService: HashService,
  ) {}

  async uploadFile(command: UploadFileCommand): Promise<{ sha256Hash: string }> {
    const evidence = await this.evidenceRepository.findById(command.evidenceId);
    if (!evidence) {
      throw new Error(`Evidence ${command.evidenceId} not found`);
    }

    const sha256Hash = this.hashService.calculateSha256(command.content);

    const file = new EvidenceFile(
      command.fileId,
      command.evidenceId,
      command.fileName,
      command.mimeType,
      command.sizeBytes,
      command.storageUrl,
    );

    evidence.uploadFile(file, sha256Hash, command.uploadedBy);

    await this.evidenceRepository.update(evidence);
    StructuredLogger.info({
      event: 'legal-evidence.evidence.created',
      correlationId: command.correlationId,
      evidenceId: command.evidenceId,
      fileId: command.fileId,
      uploadedBy: command.uploadedBy,
      sha256Hash,
    });

    return { sha256Hash };
  }

  async getTimeline(evidenceId: string): Promise<ChainOfCustodyEvent[]> {
    const timeline = await this.evidenceRepository.getCustodyTimeline(evidenceId);
    return timeline.sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
  }
}
