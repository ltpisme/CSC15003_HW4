---
name: browser-data-driven-testing
description: End-to-end browser automation and data-driven testing workflow using Playwright. Covers requirement analysis, SUT discovery, parameterized test design, script generation, and execution reporting.
---

# Browser Data-Driven Automation Testing

Workflow and standards for generating robust, data-driven browser automation tests using Playwright.

## Workflow

Follow the 6-phase lifecycle sequentially. **Never skip phases or generate test scripts immediately without discovering and analyzing the SUT.**

```
[1. Discover] ➔ [2. Analyze] ➔ [3. Design] ➔ [4. Generate] ➔ [5. Review] ➔ [6. Output]
```

### 1. Discover
Inspect the target workspace before designing or coding:
- **Project Structure & Config**: Locate `playwright.config.ts`, `package.json`, base URL, and existing test directories (`tests/`, `e2e/`, `data/`).
- **Dependencies**: Identify installed runner (`@playwright/test`), TypeScript setup, and existing helper utilities.
- **Specifications & Documentation**: Read feature specs, API documentation, and README to understand business goals and acceptance criteria.
- **Source Code (SUT)**: Inspect frontend routes, HTML markup, form structures, and component selectors to verify actual DOM elements.

### 2. Analyze
- **Identify Test Scenarios**: Extract happy paths, edge cases, negative validations, boundary values, and error states.
- **Identify Data Variances**: Determine which inputs and expected outputs vary across runs to parameterize them.
- **Map Locators**: Identify stable, user-visible attributes (`role`, `label`, `placeholder`, `data-testid`) directly from SUT source.
- **Consult Guidelines**: Review [automation-rules.md](rules/automation-rules.md) and [automation-testing.md](knowledge/automation-testing.md).

### 3. Design
- **Data Model**: Structure external test data (JSON/CSV) separating inputs, execution flags, and expected assertions.
- **Test Structure**: Plan test suites with clear requirement traceability tags (e.g., requirement ID, test case ID).
- **Reusable Helpers**: Identify shared workflows (login, navigation, form filling, modal handling).

### 4. Generate
- **Test Data**: Produce structured data files using [test-data.csv.template](templates/test-data.csv.template) or JSON equivalents.
- **Test Script**: Implement Playwright tests adhering to [test-script.ts.template](templates/test-script.ts.template).
- **Decoupling**: Load external test datasets dynamically; never hard-code test matrices inside test bodies.
- **Assertions**: Use web-first assertions (`expect(locator).toBeVisible()`, `expect(locator).toHaveText()`) with auto-retry.

### 5. Review
- **Conventions & Rules**: Validate generated code against [automation-rules.md](rules/automation-rules.md).
- **No Flakiness**: Ensure no arbitrary sleeps (`page.waitForTimeout`) exist; verify explicit state synchronization.
- **Traceability**: Verify each test case maps to a specific requirement and expected outcome.

### 6. Output & Report
- **Execute**: Run tests via the project's test runner command.
- **Report**: Summarize results, failure root causes, and coverage using [test-report.md.template](templates/test-report.md.template).
- **Never claim a test passed without actual execution.**
