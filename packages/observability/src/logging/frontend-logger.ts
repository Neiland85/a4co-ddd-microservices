import { type Logger } from 'winston';

export function createFrontendLogger(logger: Logger): Logger {
  return logger.child({
    context: 'frontend',
  });
}
