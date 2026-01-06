import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import {
  applySecurityMiddleware,
  applyValidationPipe,
  applyCorsConfiguration,
  setupSwagger,
  createStandardSwaggerConfig,
  getPort,
} from '@a4co/shared-utils';
import { NotificationModule } from './notification.module';

const logger = new Logger('NotificationService');

async function bootstrap() {
  // === APP HÍBRIDA (HTTP + NATS) ===
  const app = await NestFactory.create(NotificationModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  // === CONEXIÓN NATS ===
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [process.env['NATS_SERVERS'] || 'nats://localhost:4222'],
      queue: 'notification-service-queue',
    },
  });

  // === SEGURIDAD, VALIDACIÓN Y CORS ===
  applySecurityMiddleware(app, { serviceName: 'Notification Service' });
  applyValidationPipe(app);
  applyCorsConfiguration(app, {
    serviceName: 'Notification Service',
    corsConfig: {
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
  });

  // Set global prefix
  app.setGlobalPrefix('api/notifications');

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

  // Start all microservices
  await app.startAllMicroservices();
  await app.listen(port);

  logger.log('NATS microservice connected (notification-service-queue)');

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
