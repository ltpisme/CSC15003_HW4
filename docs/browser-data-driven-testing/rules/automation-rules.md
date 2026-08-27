# Automation Testing Rules

Mandatory constraints for authoring browser automation and data-driven tests.

---

## 1. Rules: MUST

1. **MUST Inspect SUT First**: Inspect actual frontend source code, DOM structure, and existing configuration (`playwright.config.ts`) before writing any test logic or assertions.
2. **MUST Decouple Test Logic from Data**: Store all test inputs, boundary values, and expected messages in external data files (JSON/CSV). Test scripts must strictly contain workflow orchestration and assertion logic.
3. **MUST Use Stable Locators**: Prioritize user-facing accessibility locators (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId`) over brittle DOM paths or dynamic CSS classes.
4. **MUST Use Web-First Assertions**: Use auto-retrying assertions (`await expect(locator)...`) for all asynchronous DOM state verifications.
5. **MUST Maintain Requirement Traceability**: Every test case must explicitly reference a requirement or specification ID in its title/tags and documentation.
6. **MUST Align with Existing Project Conventions**: Respect the project's directory structure, TypeScript configurations, helper utilities, and base URL setup.
7. **MUST Ensure Explicit Synchronization**: Synchronize using event promises (`waitForResponse`, `waitForLoadState`) or state assertions.

---

## 2. Rules: MUST NOT

1. **MUST NOT Guess Selectors or Behaviors**: Never assume element IDs, class names, API endpoints, or error messages without inspecting the application under test (SUT) or its formal specification.
2. **MUST NOT Generate Scripts Prematurely**: Do not output test code before completing the Discover, Analyze, and Design phases.
3. **MUST NOT Use Arbitrary Sleeps**: Never use hardcoded sleep calls (e.g. `page.waitForTimeout(5000)` or `setTimeout`).
4. **MUST NOT Hardcode Test Matrices in Spec Files**: Never embed repetitive input/output literals directly inside `test(...)` code blocks.
5. **MUST NOT Claim Execution Results Without Running**: Never declare a test as "Passed", "Verified", or "Bug Free" without executing the test suite with the test runner and inspecting the execution report.
