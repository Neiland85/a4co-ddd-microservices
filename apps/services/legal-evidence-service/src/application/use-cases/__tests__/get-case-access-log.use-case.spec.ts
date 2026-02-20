import { GetCaseAccessLogUseCase } from '../get-case-access-log.use-case';
import { AccessAction, AccessLog } from '../../../domain/entities/access-log.entity';
import { IAccessLogRepository } from '../../../domain/repositories/access-log.repository';

describe('GetCaseAccessLogUseCase', () => {
  it('should return access logs for the requested case id', async () => {
    const logs = [
      new AccessLog(
        'log-1',
        'user-1',
        'case-1',
        'evidence-1',
        AccessAction.VIEW,
        '127.0.0.1',
        'jest',
        new Date('2026-01-01T00:00:00.000Z'),
      ),
    ];

    const accessLogRepository: IAccessLogRepository = {
      save: jest.fn(),
      findByCaseId: jest.fn().mockResolvedValue(logs),
    };

    const useCase = new GetCaseAccessLogUseCase(accessLogRepository);
    const result = await useCase.execute('case-1');

    expect(result).toEqual(logs);
    expect(accessLogRepository.findByCaseId).toHaveBeenCalledWith('case-1');
  });
});
