import { Inject, Injectable } from '@nestjs/common';
import { ICaseRepository } from '../../domain/repositories/case.repository.js';
import { IEvidenceRepository } from '../../domain/repositories/evidence.repository.js';
import { ForensicManifestService } from '../../domain/services/forensic-manifest.service.js';

export class EvidenceNotFoundError extends Error {}
export class CaseNotFoundError extends Error {}

@Injectable()
export class VerifyEvidenceManifestUseCase {
  constructor(
    @Inject('IEvidenceRepository')
    private readonly evidenceRepository: IEvidenceRepository,
    @Inject('ICaseRepository')
    private readonly caseRepository: ICaseRepository,
    private readonly manifestService: ForensicManifestService,
  ) {}

  async execute(evidenceId: string): Promise<boolean> {
    const evidence = await this.evidenceRepository.findById(evidenceId);
    if (!evidence) {
      throw new EvidenceNotFoundError(`Evidence ${evidenceId} not found`);
    }

    const legalCase = await this.caseRepository.findById(evidence.caseId);
    if (!legalCase) {
      throw new CaseNotFoundError(`Case ${evidence.caseId} not found`);
    }
    const manifest = this.manifestService.buildManifest(evidence, {
      id: evidence.caseId,
      title: legalCase.title,
      description: legalCase.description,
    });

    return this.manifestService.verifyManifestSignature(manifest);
  }
}
