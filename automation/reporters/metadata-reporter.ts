import type { FullConfig, FullResult, Reporter } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

export interface MetadataReporterOptions {
  studentId?: string;
  timestamp?: string;
}

export default class MetadataReporter implements Reporter {
  private config!: FullConfig;
  private studentId: string;
  private timestamp: string;

  constructor(options: MetadataReporterOptions = {}) {
    this.studentId = options.studentId || process.env.STUDENT_ID || 'Unknown';
    this.timestamp = options.timestamp || new Date().toISOString();
  }

  onBegin(config: FullConfig) {
    this.config = config;
  }

  async onEnd(_result: FullResult) {
    const studentId = (this.config?.metadata?.['Run by'] as string) || this.studentId;
    const timestamp = (this.config?.metadata?.['Timestamp'] as string) || this.timestamp;

    // 1. Log to console
    console.log(`\n========================================`);
    console.log(`Run by: ${studentId}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log(`========================================\n`);

    // 2. Augment ZenAI failure report if all-failures.md was generated
    const outputDir = path.resolve(process.cwd(), 'results/ai-failures');
    const allFailuresFile = path.join(outputDir, 'all-failures.md');

    if (fs.existsSync(allFailuresFile)) {
      try {
        const content = fs.readFileSync(allFailuresFile, 'utf-8');
        if (!content.includes('Run by:')) {
          let updated = content;
          if (content.includes('## Summary')) {
            updated = content.replace(
              /(## Summary\s*\n)/,
              `$1- **Run by**: ${studentId}\n- **Timestamp**: ${timestamp}\n`
            );
          } else {
            updated = `# Test Error Context Report\n\n- **Run by**: ${studentId}\n- **Timestamp**: ${timestamp}\n\n${content}`;
          }
          fs.writeFileSync(allFailuresFile, updated, 'utf-8');
        }
      } catch {
        // Silently preserve file if write fails
      }
    }
  }
}
