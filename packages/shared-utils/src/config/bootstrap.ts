import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

/**
 * Configuration options for NestJS application bootstrap
 */
export interface BootstrapOptions {
  /**
   * The service name (used for logging)
   */
  serviceName: string;

  /**
   * The port to listen on (defaults to PORT env var or 3000)
   */
  port?: number;

  /**
   * The global API prefix (e.g., 'api/v1')
   */
  globalPrefix?: string;

  /**
   * Allowed CORS origins (defaults to ALLOWED_ORIGINS env var or localhost)
   */
  allowedOrigins?: string[];

  /**
   * Whether to enable Swagger documentation
   */
  enableSwagger?: boolean;

  /**
   * Custom Swagger path (defaults to 'api' or 'api/docs')
   */
  swaggerPath?: string;

  /**
   * Swagger configuration
   */
  swaggerConfig?: {
    title: string;
    description: string;
    version: string;
    tags?: string[];
  };

  /**
   * Whether to disable the default NestJS logger
   */
  disableLogger?: boolean;

  /**
   * Custom helmet configuration
   */
  helmetConfig?: Parameters<typeof helmet>[0];

  /**
   * Custom CORS configuration
   */
  corsConfig?: {
    credentials?: boolean;
    methods?: string[];
    allowedHeaders?: string[];
  };
}

/**
 * Applies common security middleware to the application
 * @param app - The NestJS application instance
 * @param options - Bootstrap options
 */
export function applySecurityMiddleware(
  app: INestApplication,
  options: BootstrapOptions,
): void {
  // Helmet security headers
  const helmetConfig = options.helmetConfig || {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  };
  
  app.use(helmet(helmetConfig));
}

/**
 * Applies CORS configuration to the application
 * @param app - The NestJS application instance
 * @param options - Bootstrap options
 */
export function applyCorsConfiguration(
  app: INestApplication,
  options: BootstrapOptions,
): void {
  const allowedOrigins = 
    options.allowedOrigins ||
    (process.env['ALLOWED_ORIGINS']
      ? process.env['ALLOWED_ORIGINS'].split(',').map((o) => o.trim())
      : ['http://localhost:3000', 'http://localhost:3001']);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: options.corsConfig?.credentials ?? true,
    methods: options.corsConfig?.methods || ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: options.corsConfig?.allowedHeaders || [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ],
  });
}

/**
 * Applies global validation pipe to the application
 * @param app - The NestJS application instance
 */
export function applyValidationPipe(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}

/**
 * Sets up the global API prefix
 * @param app - The NestJS application instance
 * @param prefix - The global prefix to use
 */
export function applyGlobalPrefix(app: INestApplication, prefix?: string): void {
  if (prefix) {
    app.setGlobalPrefix(prefix);
  }
}

/**
 * Creates and configures a NestJS application with common settings
 * @param moduleClass - The root module class
 * @param options - Bootstrap options
 * @returns The configured NestJS application
 */
export async function createApp<T>(
  moduleClass: T,
  options: BootstrapOptions,
): Promise<INestApplication> {
  const app = options.disableLogger 
    ? await NestFactory.create(moduleClass as any, { logger: false })
    : await NestFactory.create(moduleClass as any);

  // Apply middleware and configuration
  applySecurityMiddleware(app, options);
  applyValidationPipe(app);
  applyCorsConfiguration(app, options);
  applyGlobalPrefix(app, options.globalPrefix);

  return app;
}

/**
 * Gets the port number from options or environment variables
 * @param options - Bootstrap options
 * @returns The port number
 */
export function getPort(options: BootstrapOptions): number {
  return options.port || (process.env['PORT'] ? Number(process.env['PORT']) : 3000);
}
