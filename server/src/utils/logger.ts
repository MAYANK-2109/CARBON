/**
 * @module utils/logger
 * @description Structured logger. JSON output in production, pretty-print in dev.
 * Uses the pino interface without requiring the pino package — wraps console.
 * Swap with `pino` or `winston` if a full logging package is installed.
 */
import { env } from '../config/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogPayload {
  requestId?: string;
  [key: string]: unknown;
}

function log(level: LogLevel, msg: string, payload: LogPayload = {}): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    msg,
    env: env.NODE_ENV,
    ...payload,
  };

  if (env.isProduction) {
    // Structured JSON for log aggregators (Datadog, Render, etc.)
    process.stdout.write(JSON.stringify(entry) + '\n');
  } else {
    const colors: Record<LogLevel, string> = {
      debug: '\x1b[36m', // cyan
      info: '\x1b[32m',  // green
      warn: '\x1b[33m',  // yellow
      error: '\x1b[31m', // red
    };
    const reset = '\x1b[0m';
    console.log(`${colors[level]}[${level.toUpperCase()}]${reset} ${entry.timestamp} — ${msg}`, payload);
  }
}

export const logger = {
  debug: (msg: string, payload?: LogPayload) => log('debug', msg, payload),
  info:  (msg: string, payload?: LogPayload) => log('info',  msg, payload),
  warn:  (msg: string, payload?: LogPayload) => log('warn',  msg, payload),
  error: (msg: string, payload?: LogPayload) => log('error', msg, payload),
};
