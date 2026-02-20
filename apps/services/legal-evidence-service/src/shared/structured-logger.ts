type StructuredLogLevel = 'info' | 'error';

interface StructuredLogPayload {
  event: string;
  correlationId?: string;
  [key: string]: unknown;
}

export class StructuredLogger {
  static info(payload: StructuredLogPayload): void {
    this.write('info', payload);
  }

  static error(payload: StructuredLogPayload): void {
    this.write('error', payload);
  }

  private static write(level: StructuredLogLevel, payload: StructuredLogPayload): void {
    const logEntry = {
      level,
      timestamp: new Date().toISOString(),
      ...payload,
    };
    console.log(JSON.stringify(logEntry));
  }
}
