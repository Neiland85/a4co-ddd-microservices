import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { NotificationModule } from './notification.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/notifications');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Notification Service API')
    .setDescription('Multi-channel notification service for a4co-ddd-microservices')
    .setVersion('1.0')
    .addTag('notifications')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/notifications/docs', app, document);

  const port = process.env.PORT || 3007;
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
  📧 Email:    ${process.env.SENDGRID_API_KEY ? '✅ SendGrid' : '⚠️  Mock'}
  📱 SMS:      ${process.env.TWILIO_ACCOUNT_SID ? '✅ Twilio' : '⚠️  Mock'}
  🔔 Push:     ⚠️  Mock (Firebase not configured)

Environment:  ${process.env.NODE_ENV || 'development'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

bootstrap();

