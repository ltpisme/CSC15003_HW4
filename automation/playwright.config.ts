import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  reporter: [
    ['list'],

    [
      'html',
      {
        outputFolder: 'reports/playwright',
        open: 'never',
      },
    ],

    [
      'json',
      {
        outputFile: 'results/result.json',
      },
    ],

    [
      '@zenai/playwright-coding-agent-reporter',
      {
        outputDir: 'results/ai-failures',
        includeScreenshots: true,
        includeConsoleErrors: true,
        includeNetworkErrors: true,
        capturePageState: true,
        showCodeSnippet: true,
        singleReportFile: true,
      },
    ],
  ],

  use: {
    baseURL: 'http://localhost:5173',

    // Screenshot và trace được ZenAI reporter xử lý.
    screenshot: 'off',
    trace: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});