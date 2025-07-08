import { defineConfig } from '@playwright/test';
import { CustomLogger } from './custom-logger';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: '.',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      logger: new CustomLogger(),
    },
    locale: 'en-En',
  },

  projects: [
    {
      name: 'Chromium',
      use: {
        browserName: 'chromium',
      },
    },
    /* {
      name: 'Firefox',
      use: {
        browserName: 'firefox',
      },
    },
    {
      name: 'WebKit',
      timeout: 90 * 1000,
      use: {
        browserName: 'webkit',
      },
    }, */
  ],
});
