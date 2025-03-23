import { config } from '../config';
import chalk from 'chalk';
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = chalk.gray(this.getTimestamp());
    const metaString = meta ? chalk.gray(` ${JSON.stringify(meta)}`) : '';
    const levelStyle = {
      info: chalk.white.bgBlue,
      warn: chalk.black.bgYellow,
      error: chalk.white.bgRed,
      debug: chalk.white.bgMagenta
    }[level];
    
    return `${timestamp} ${levelStyle(` ${level.toUpperCase()} `)} ${message}${metaString}`;
  }

  info(message: string, meta?: any): void {
    if (config.nodeEnv !== 'test') {
      console.log(this.formatMessage('info', message, meta));
    }
  }

  warn(message: string, meta?: any): void {
    if (config.nodeEnv !== 'test') {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  error(message: string, meta?: any): void {
    if (config.nodeEnv !== 'test') {
      console.error(this.formatMessage('error', message, meta));
    }
  }

  debug(message: string, meta?: any): void {
    if (config.nodeEnv === 'development') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
}

export const logger = new Logger();
