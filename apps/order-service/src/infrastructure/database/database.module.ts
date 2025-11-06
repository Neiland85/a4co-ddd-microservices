import { Module, Global } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaOrderRepository } from '../repositories/prisma-order.repository';
import { IOrderRepository } from '../../domain';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => new PrismaClient(),
    },
    {
      provide: 'IOrderRepository',
      useClass: PrismaOrderRepository,
    },
  ],
  exports: [PrismaClient, 'IOrderRepository'],
})
export class DatabaseModule {}
