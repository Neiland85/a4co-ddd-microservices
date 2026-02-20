import { EvidenceAccessMiddleware } from '../evidence-access.middleware';
import { AccessAction } from '../../../domain/entities/access-log.entity';
import { IAccessLogRepository } from '../../../domain/repositories/access-log.repository';
import { IEvidenceRepository } from '../../../domain/repositories/evidence.repository';

function makeEvidenceRepository(caseId = 'case-1', evidenceId = 'evidence-1'): IEvidenceRepository {
  return {
    save: jest.fn(),
    findById: jest.fn().mockResolvedValue({ id: evidenceId, caseId }),
    findByCaseId: jest.fn(),
    findByStatus: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as IEvidenceRepository;
}

describe('EvidenceAccessMiddleware', () => {
  it('logs VIEW action for GET /evidence/:id', async () => {
    const accessLogRepository: IAccessLogRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findByCaseId: jest.fn(),
    };
    const evidenceRepository = makeEvidenceRepository();
    const middleware = new EvidenceAccessMiddleware(accessLogRepository, evidenceRepository);
    const next = jest.fn();

    await middleware.use(
      {
        method: 'GET',
        path: '/evidence/evidence-1',
        headers: { 'x-user-id': 'user-1', 'user-agent': 'jest-agent' },
        ip: '10.0.0.1',
      } as never,
      {} as never,
      next,
    );

    expect(accessLogRepository.save).toHaveBeenCalledTimes(1);
    const log = (accessLogRepository.save as jest.Mock).mock.calls[0][0];
    expect(log.action).toBe(AccessAction.VIEW);
    expect(log.caseId).toBe('case-1');
    expect(log.evidenceId).toBe('evidence-1');
    expect(next).toHaveBeenCalled();
  });

  it('logs DOWNLOAD action for evidence download paths', async () => {
    const accessLogRepository: IAccessLogRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findByCaseId: jest.fn(),
    };
    const evidenceRepository = makeEvidenceRepository();
    const middleware = new EvidenceAccessMiddleware(accessLogRepository, evidenceRepository);

    await middleware.use(
      {
        method: 'POST',
        path: '/evidence/evidence-1/download',
        headers: { 'x-user-id': 'user-2' },
        ip: '10.0.0.2',
      } as never,
      {} as never,
      jest.fn(),
    );

    const log = (accessLogRepository.save as jest.Mock).mock.calls[0][0];
    expect(log.action).toBe(AccessAction.DOWNLOAD);
  });
});
