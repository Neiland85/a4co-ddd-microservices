import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../infrastructure/database/database.module';
import { PrismaClient } from '@prisma/client';
import { NATS_CONFIG } from '../infrastructure/nats/nats.constants';
import { PrismaOrderRepository } from '../infrastructure/repositories/prisma-order.repository';
import { IOrderRepository } from '../../domain';
import { OrderSaga } from '../application/sagas/order.saga';
import { CreateOrderUseCase, GetOrderUseCase, GetAllOrdersUseCase } from '../application/use-cases/create-order.use-case';
import { OrderController } from '../presentation/controllers/controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        ClientsModule.register([
            {
                name: 'NATS_CLIENT',
                transport: Transport.NATS,
                options: NATS_CONFIG,
            },
        ]),
    ],
    controllers: [OrderController, OrderSaga],
    providers: [
        {
            provide: 'IOrderRepository',
            useFactory: (prisma: PrismaClient) => {
                return new PrismaOrderRepository(prisma);
            },
            inject: [PrismaClient],
        },
        {
            provide: PrismaOrderRepository,
            useFactory: (prisma: PrismaClient) => {
                return new PrismaOrderRepository(prisma);
            },
            inject: [PrismaClient],
        },
        OrderSaga,
        CreateOrderUseCase,
        GetOrderUseCase,
        GetAllOrdersUseCase,
    ],
    exports: ['IOrderRepository', PrismaOrderRepository],
})
export class OrderModule {}
