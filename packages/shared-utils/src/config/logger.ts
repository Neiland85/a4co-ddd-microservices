import { Logger } from '@nestjs/common';

/**
 * Logger configuration options
 */
export interface LoggerConfig {
  /**
   * The service name
   */
  serviceName: string;

  /**
   * The log level (defaults to environment-based)
   */
  logLevel?: 'log' | 'error' | 'warn' | 'debug' | 'verbose';

  /**
   * Whether to enable timestamps
   */
  timestamp?: boolean;
}

/**
 * Creates a standardized logger for a service
 * @param config - Logger configuration
 * @returns Logger instance
 */
export function createServiceLogger(config: LoggerConfig): Logger {
  return new Logger(config.serviceName);
}

/**
 * Logs service startup information
 * @param logger - The logger instance
 * @param serviceName - The service name
 * @param port - The port the service is running on
 * @param additionalInfo - Additional information to log
 */
export function logServiceStartup(
  logger: Logger,
  serviceName: string,
  port: number,
  additionalInfo?: {
    swaggerPath?: string;
    healthPath?: string;
    environment?: string;
    databaseConnected?: boolean;
  },
): void {
  logger.log(`🚀 ${serviceName} running on http://localhost:${port}`);
  
  if (additionalInfo?.swaggerPath) {
    logger.log(`📚 Documentation: http://localhost:${port}/${additionalInfo.swaggerPath}`);
  }
  
  if (additionalInfo?.healthPath) {
    logger.log(`🔍 Health Check: http://localhost:${port}/${additionalInfo.healthPath}`);
  }
  
  if (additionalInfo?.environment) {
    logger.log(`🌍 Environment: ${additionalInfo.environment}`);
  }
  
  if (additionalInfo?.databaseConnected !== undefined) {
    const dbStatus = additionalInfo.databaseConnected ? '✅ Connected' : '⚠️  Not configured';
    logger.log(`💾 Database: ${dbStatus}`);
  }
}

/**
 * Logs service startup error
 * @param logger - The logger instance
 * @param serviceName - The service name
 * @param error - The error that occurred
 */
export function logServiceStartupError(
  logger: Logger,
  serviceName: string,
  error: unknown,
): void {
  logger.error(`❌ Failed to start ${serviceName}:`, error);
}
