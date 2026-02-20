import { Prisma } from '@prisma/client';

export const CUSTODY_EVENT_IMMUTABLE_ERROR =
  'CustodyEvent is append-only and cannot be updated or deleted';

const blockedCustodyActions = new Set<Prisma.PrismaAction>([
  'update',
  'updateMany',
  'delete',
  'deleteMany',
]);

export function assertCustodyEventMutationAllowed(
  model: string | undefined,
  action: Prisma.PrismaAction,
): void {
  if (model === 'ChainOfCustodyEvent' && blockedCustodyActions.has(action)) {
    throw new Error(CUSTODY_EVENT_IMMUTABLE_ERROR);
  }
}

export const custodyEventImmutabilityMiddleware: Prisma.Middleware = async (params, next) => {
  assertCustodyEventMutationAllowed(params.model, params.action);
  return next(params);
};
