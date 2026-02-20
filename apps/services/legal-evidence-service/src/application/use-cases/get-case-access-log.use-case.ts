import { AccessLog } from '../../domain/entities/access-log.entity.js';
import { IAccessLogRepository } from '../../domain/repositories/access-log.repository.js';

export class GetCaseAccessLogUseCase {
  constructor(private readonly accessLogRepository: IAccessLogRepository) {}

  async execute(caseId: string): Promise<AccessLog[]> {
    return this.accessLogRepository.findByCaseId(caseId);
  }
}
