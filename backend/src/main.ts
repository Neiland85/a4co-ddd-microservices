import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { logger } from './common/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.enableCors();

  const port = process.env['PORT'] || 3000;
  await app.listen(port);

  logger.info(`�� Backend monolito iniciado en http://localhost:${port}`);
  logger.info(`📚 API Docs: http://localhost:${port}/api/docs`);
}

bootstrap().catch(error => {
  logger.error('Error al iniciar el backend monolito', { error });
  process.exit(1);
});
