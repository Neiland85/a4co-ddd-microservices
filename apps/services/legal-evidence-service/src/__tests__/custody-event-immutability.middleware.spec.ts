import { PrismaEvidenceRepository } from '../infrastructure/repositories/prisma-evidence.repository';
import {
  assertCustodyEventMutationAllowed,
  CUSTODY_EVENT_IMMUTABLE_ERROR,
  custodyEventImmutabilityMiddleware,
} from '../infrastructure/prisma/custody-event-immutability.middleware';

describe('CustodyEvent immutability guards', () => {
  it('should block updateMany/deleteMany in Prisma middleware for ChainOfCustodyEvent', async () => {
    await expect(
      custodyEventImmutabilityMiddleware(
        { model: 'ChainOfCustodyEvent', action: 'updateMany' } as never,
        jest.fn(),
      ),
    ).rejects.toThrow(CUSTODY_EVENT_IMMUTABLE_ERROR);

    await expect(
      custodyEventImmutabilityMiddleware(
        { model: 'ChainOfCustodyEvent', action: 'deleteMany' } as never,
        jest.fn(),
      ),
    ).rejects.toThrow(CUSTODY_EVENT_IMMUTABLE_ERROR);
  });

  it('should throw in repository guard when attempting custody event update/delete', async () => {
    const repository = new PrismaEvidenceRepository({} as never);

    await expect(repository.updateCustodyEvent()).rejects.toThrow(CUSTODY_EVENT_IMMUTABLE_ERROR);
    await expect(repository.deleteCustodyEvent()).rejects.toThrow(CUSTODY_EVENT_IMMUTABLE_ERROR);
  });

  it('should allow non-mutation actions', () => {
    expect(() =>
      assertCustodyEventMutationAllowed('ChainOfCustodyEvent', 'findMany' as never),
    ).not.toThrow();
  });
});
