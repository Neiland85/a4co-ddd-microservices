import { connect, JSONCodec, NatsConnection } from 'nats';
import { Logger } from '@nestjs/common';

export * from './domain';
export * from './security';
export * from './types';
export class NatsEventBus {
  private nc: NatsConnection;
  private logger = new Logger('NatsEventBus');
  private codec = JSONCodec();

  async connect(url: string = 'nats://localhost:4222') {
    this.nc = await connect({ servers: url });
    this.logger.log(`✅ Conectado a NATS en ${url}`);
  }

  async publish<T>(subject: string, data: T) {
    if (!this.nc) await this.connect();
    this.nc.publish(subject, this.codec.encode(data));
    this.logger.log(`📤 Evento publicado → ${subject}`);
  }

  async subscribe<T>(subject: string, handler: (data: T) => Promise<void>) {
    if (!this.nc) await this.connect();
    const sub = this.nc.subscribe(subject);
    for await (const msg of sub) {
      const decoded = this.codec.decode(msg.data) as T;
      this.logger.log(`📥 Evento recibido → ${subject}`);
      await handler(decoded);
    }
  }
}
