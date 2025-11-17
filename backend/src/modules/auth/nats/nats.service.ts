import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';

@Injectable()
export class NatsService implements OnModuleInit {
  constructor(@Inject('NATS_CLIENT') private readonly natsClient: ClientNats) {}

  async onModuleInit() {
    await this.natsClient.connect();
  }

  publish(subject: string, data: any) {
    this.natsClient.emit(subject, data);
  }
}

