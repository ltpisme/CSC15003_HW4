# Playwright Report Metadata Configuration

## 1. Files Changed
- `automation/playwright.config.ts`: Configured `metadata` (`Run by`, `Timestamp`), integrated `.env` reader, and registered custom `MetadataReporter`.
- `automation/reporters/metadata-reporter.ts`: Custom Playwright reporter injecting execution metadata (`Run by: <StudentID>`, `Timestamp: <ISO-8601>`) into console logs and failure markdown reports.
- `automation/package.json`: Added `"test": "playwright test"` npm script.
- `automation/tsconfig.json`: Added `reporters/**/*.ts` to included compilation paths.
- `automation/.gitignore`: Configured Git to ignore local `.env` files.
- `automation/.env.example`: Template configuration file with placeholder student ID.

## 2. How StudentID is Supplied
- Read dynamically from the environment variable: `process.env.STUDENT_ID`.
- Optionally loaded from `automation/.env` if created by the student.
- Defaults to `'Unknown'` if neither is provided.
- Zero hard-coded student IDs across all test scripts.

## 3. How Timestamp is Generated
- Automatically generated on each test run using standard ISO 8601 representation:
  ```typescript
  const runTimestamp = new Date().toISOString();
  ```
- No locale-dependent date formatting is used.

## 4. How the ZenAI Reporter is Preserved
- All existing reporters (`list`, `html`, `json`, `@zenai/playwright-coding-agent-reporter`) remain completely intact with original configuration options and directory targets (`reports/playwright`, `results/result.json`, `results/ai-failures`).
- `MetadataReporter` runs in addition to existing reporters without interfering with reporter lifecycles.

## 5. Exact Manual Command to Run

From the `automation/` directory:

### Option A: Inline Environment Variable (Recommended)
```bash
STUDENT_ID=23127452 npx playwright test
```
or
```bash
STUDENT_ID=23127452 npm test
```

### Option B: Local `.env` File
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` with your student ID:
   ```text
   STUDENT_ID=23127452
   ```
3. Execute:
   ```bash
   npm test
   ```

## 6. Required One-Time Setup
- If using `.env`, create `automation/.env` by copying `automation/.env.example` and setting `STUDENT_ID=<YourStudentID>`.
- Git is configured to ignore `automation/.env` to prevent accidental credential commits.

## 7. Static Verification Result
1. **StudentID Origin**: Sourced from `process.env.STUDENT_ID` / `.env`.
2. **No Hard-coding**: Validated across all `.ts` files.
3. **ISO-8601 Timestamp**: Automated via `new Date().toISOString()`.
4. **ZenAI Reporter**: Preserved at `results/ai-failures`.
5. **HTML Reporter**: Preserved at `reports/playwright`.
6. **JSON Reporter**: Preserved at `results/result.json`.
7. **Output Paths**: All directory targets unchanged.
8. **Test Scripts**: 0 test cases modified in `automation/tests/`.
9. **TypeScript Compilation**: `npx tsc --noEmit` passed with 0 errors.
