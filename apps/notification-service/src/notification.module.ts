import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationController } from './notification.controller';
import { NotificationService as LegacyNotificationService } from './service';
import { NotificationService } from './services/notification.service';
import { SendGridService } from './services/sendgrid.service';
import { TwilioService } from './services/twilio.service';
import { OrderConfirmedListener } from './listeners/order-confirmed.listener';
import { ShipmentDeliveredListener } from './listeners/shipment-delivered.listener';
import { createEmailProvider } from './providers/email.provider';
import { createSMSProvider } from './providers/sms.provider';
import { createPushProvider } from './providers/push.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // NATS Client for Event Bus
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: {
          servers: [process.env['NATS_SERVERS'] || 'nats://localhost:4222'],
          queue: 'notification-service-queue',
        },
      },
    ]),
  ],
  controllers: [
    NotificationController,
    OrderConfirmedListener,
    ShipmentDeliveredListener,
  ],
  providers: [
    // Legacy notification service
    LegacyNotificationService,
    // New services
    NotificationService,
    SendGridService,
    TwilioService,
    // Legacy providers
    {
      provide: 'EMAIL_PROVIDER',
      useFactory: () => createEmailProvider(),
    },
    {
      provide: 'SMS_PROVIDER',
      useFactory: () => createSMSProvider(),
    },
    {
      provide: 'PUSH_PROVIDER',
      useFactory: () => createPushProvider(),
    },
  ],
  exports: [NotificationService, LegacyNotificationService],
})
export class NotificationModule {}

