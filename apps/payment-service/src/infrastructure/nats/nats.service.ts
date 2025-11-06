import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';

@Injectable()
export class NatsService implements OnModuleInit {
  constructor(@Inject('NATS_CLIENT') private readonly natsClient: ClientNats) {}

  async onModuleInit() {
    await this.natsClient.connect();
  }

  async publish(subject: string, data: any): Promise<void> {
    this.natsClient.emit(subject, data);
  }
}
