import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Read .env if present in automation directory without external dependencies
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}

const studentId = process.env.STUDENT_ID || 'Unknown';
const runTimestamp = new Date().toISOString();

export default defineConfig({
  testDir: './tests',

  metadata: {
    'Run by': studentId,
    'Timestamp': runTimestamp,
    studentId,
    timestamp: runTimestamp,
  },

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

    [
      './reporters/metadata-reporter.ts',
      {
        studentId,
        timestamp: runTimestamp,
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