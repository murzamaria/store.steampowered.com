import type { Logger } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class CustomLogger implements Logger {
  private logFilePath: string;

  constructor() {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this.logFilePath = path.join(logDir, 'test.log');

    fs.writeFileSync(this.logFilePath, 'Tests started\n', { flag: 'w' });
  }

  isEnabled(name: string, severity: 'error' | 'warning' | 'info' | 'verbose'): boolean {
    return severity === 'error' || severity === 'warning';
  }

  log(name: string, severity: 'error' | 'warning' | 'info' | 'verbose', message: string): void {
    const time = new Date().toISOString();
    const formatted = `[${time}] [${name}] [${severity.toUpperCase()}]: ${message}`;
    console.log(formatted);
    fs.appendFileSync(this.logFilePath, formatted + '\n');
  }
}
