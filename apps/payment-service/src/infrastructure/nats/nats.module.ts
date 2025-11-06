import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_CONFIG } from './nats.constants';
import { NatsService } from './nats.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: NATS_CONFIG,
      },
    ]),
  ],
  providers: [NatsService],
  exports: [NatsService],
})
export class NatsModule {}
