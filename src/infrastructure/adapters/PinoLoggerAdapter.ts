import pino from 'pino';
import type { ILogger } from '../../domain/adapters/ILogger.js';

export class PinoLoggerAdapter implements ILogger {
  private logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  });

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(meta, message);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.logger.error(meta, message);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(meta, message);
  }
}