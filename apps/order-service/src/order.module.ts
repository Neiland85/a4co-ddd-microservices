import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NatsModule } from './infrastructure/nats/nats.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { OrderSaga } from './application/sagas/order.saga';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { OrderController } from './presentation/controllers/controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NatsModule,
    DatabaseModule,
  ],
  controllers: [OrderController, OrderSaga],
  providers: [
    OrderSaga,
    CreateOrderUseCase,
  ],
  exports: [CreateOrderUseCase],
})
export class OrderModule {}

