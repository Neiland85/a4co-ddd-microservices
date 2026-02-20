import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import {
  CaseNotFoundError,
  EvidenceNotFoundError,
  VerifyEvidenceManifestUseCase,
} from '../../application/use-cases/verify-evidence-manifest.use-case.js';

@Controller('evidence')
export class EvidenceController {
  constructor(private readonly verifyEvidenceManifestUseCase: VerifyEvidenceManifestUseCase) {}

  @Get(':id/verify')
  @HttpCode(HttpStatus.OK)
  async verifyEvidenceManifest(@Param('id') evidenceId: string): Promise<boolean> {
    try {
      return await this.verifyEvidenceManifestUseCase.execute(evidenceId);
    } catch (error) {
      if (error instanceof EvidenceNotFoundError || error instanceof CaseNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
