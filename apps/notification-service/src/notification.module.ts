import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationController } from './notification.controller';
import { NotificationService } from './service';
import { createEmailProvider } from './providers/email.provider';
import { createSMSProvider } from './providers/sms.provider';
import { createPushProvider } from './providers/push.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [NotificationController],
  providers: [
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
    NotificationService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}

