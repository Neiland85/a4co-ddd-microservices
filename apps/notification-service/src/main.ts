import { Logger } from '@nestjs/common';
import {
  createApp,
  getPort,
  setupSwagger,
  createStandardSwaggerConfig,
} from '@a4co/shared-utils';
import { NotificationModule } from './notification.module';

const logger = new Logger('NotificationService');

async function bootstrap() {
  // === APP (usando shared-utils) ===
  const app = await createApp(NotificationModule, {
    serviceName: 'Notification Service',
    port: 3007,
    globalPrefix: 'api/notifications',
    enableSwagger: true,
  });

  // === SWAGGER ===
  setupSwagger(
    app,
    {
      ...createStandardSwaggerConfig(
        'Notification Service',
        'Multi-channel notification service for a4co-ddd-microservices',
        '1.0',
        ['notifications']
      ),
      path: 'api/notifications/docs',
    }
  );

  const port = getPort({ serviceName: 'Notification Service', port: 3007 });
  await app.listen(port);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Notification Service is running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 Server:     http://localhost:${port}/api/notifications
📚 Swagger:    http://localhost:${port}/api/notifications/docs
🔍 Health:     http://localhost:${port}/api/notifications/health
📊 Stats:      http://localhost:${port}/api/notifications/stats

Channels:
  📧 Email:    ${process.env['SENDGRID_API_KEY'] ? '✅ SendGrid' : '⚠️  Mock'}
  📱 SMS:      ${process.env['TWILIO_ACCOUNT_SID'] ? '✅ Twilio' : '⚠️  Mock'}
  🔔 Push:     ⚠️  Mock (Firebase not configured)

Environment:  ${process.env['NODE_ENV'] || 'development'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

bootstrap().catch((err) => {
  logger.error('Error al iniciar Notification Service:', err);
  process.exit(1);
});
