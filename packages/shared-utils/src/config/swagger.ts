import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Swagger configuration options
 */
export interface SwaggerConfig {
  /**
   * The title of the API
   */
  title: string;

  /**
   * The description of the API
   */
  description: string;

  /**
   * The version of the API
   */
  version: string;

  /**
   * Tags to group endpoints
   */
  tags?: string[];

  /**
   * Whether to add Bearer authentication
   */
  addBearerAuth?: boolean;

  /**
   * The path where Swagger UI will be available (defaults to 'api')
   */
  path?: string;

  /**
   * Contact information
   */
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };

  /**
   * License information
   */
  license?: {
    name: string;
    url?: string;
  };

  /**
   * External documentation
   */
  externalDocs?: {
    description: string;
    url: string;
  };

  /**
   * Additional servers
   */
  servers?: Array<{
    url: string;
    description?: string;
  }>;
}

/**
 * Sets up Swagger documentation for a NestJS application
 * @param app - The NestJS application instance
 * @param config - Swagger configuration
 */
export function setupSwagger(app: INestApplication, config: SwaggerConfig): void {
  const builder = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(config.version);

  // Add tags if provided
  if (config.tags && config.tags.length > 0) {
    config.tags.forEach((tag) => builder.addTag(tag));
  }

  // Add Bearer authentication if enabled
  if (config.addBearerAuth !== false) {
    builder.addBearerAuth();
  }

  // Add contact information if provided
  if (config.contact) {
    builder.setContact(
      config.contact.name || '',
      config.contact.url || '',
      config.contact.email || '',
    );
  }

  // Add license information if provided
  if (config.license) {
    builder.setLicense(config.license.name, config.license.url || '');
  }

  // Add external documentation if provided
  if (config.externalDocs) {
    builder.setExternalDoc(config.externalDocs.description, config.externalDocs.url);
  }

  // Add additional servers if provided
  if (config.servers && config.servers.length > 0) {
    config.servers.forEach((server) => {
      builder.addServer(server.url, server.description);
    });
  }

  const documentConfig = builder.build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  const swaggerPath = config.path || 'api';
  
  SwaggerModule.setup(swaggerPath, app, document);
}

/**
 * Creates a standard Swagger configuration for a service
 * @param serviceName - The name of the service
 * @param description - The service description
 * @param version - The API version
 * @param tags - Optional tags for grouping endpoints
 * @returns Swagger configuration object
 */
export function createStandardSwaggerConfig(
  serviceName: string,
  description: string,
  version: string = '1.0',
  tags?: string[],
): SwaggerConfig {
  const config: SwaggerConfig = {
    title: `A4CO ${serviceName}`,
    description,
    version,
    addBearerAuth: true,
    path: 'api',
  };
  if (tags) {
    config.tags = tags;
  }
  return config;
}
