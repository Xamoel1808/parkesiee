import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3200',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run db:setup && npm run dev -- -p 3200',
    url: 'http://127.0.0.1:3200',
    timeout: 120_000,
    reuseExistingServer: false,
    env: {
      DATABASE_URL: 'file:./dev.db',
      JWT_SECRET: 'playwright-local-secret-12345',
      NODE_ENV: 'test',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
