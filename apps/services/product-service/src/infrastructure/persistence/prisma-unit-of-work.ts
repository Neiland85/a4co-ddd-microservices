import { PrismaClient } from '@prisma/client';
import { UnitOfWork } from '../../application/ports/unit-of-work.port';

export class PrismaUnitOfWork implements UnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async () => {
      return fn();
    });
  }
}
