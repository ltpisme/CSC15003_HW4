# Knowledge: Browser & Data-Driven Automation Testing

Core principles and patterns for automated browser testing using Playwright.

---

## 1. Resilient Locator Strategies

Playwright prioritizes user-facing and resilient locators over fragile DOM structures.

### Locator Hierarchy (Ranked by Preference)
1. **Accessibility / Semantic Role**: `page.getByRole('button', { name: 'Submit' })`
2. **Form Labels**: `page.getByLabel('Email Address')`
3. **Placeholder Text**: `page.getByPlaceholder('Enter password')`
4. **Visible Text Content**: `page.getByText('Welcome back')`
5. **Test IDs**: `page.getByTestId('submit-order-btn')`
6. **Scoped CSS / Multi-fallback**: `page.locator('form').locator('input[type="email"]')` or `.or(...)`

### Anti-Patterns
- Avoid deep hierarchical CSS (e.g. `div > div:nth-child(3) > span > button`).
- Avoid auto-generated or dynamic class selectors (e.g. `.css-1a2b3c`, `.sc-bdVaJa`).
- Avoid absolute XPaths (e.g. `/html/body/div[1]/div[2]/...`).

---

## 2. Assertion Models (Web-First vs Generic)

Always prefer **Web-First Assertions** because they automatically wait and retry until condition or timeout is reached.

| Type | Syntax | Auto-retry? | Usage |
| :--- | :--- | :--- | :--- |
| **Visibility** | `await expect(locator).toBeVisible()` | Yes | Element appears in DOM and is visible. |
| **State** | `await expect(locator).toBeEnabled()` | Yes | Element is interactive / not disabled. |
| **Content** | `await expect(locator).toHaveText(/regex/)` | Yes | Element text matches expected substring/regex. |
| **Value** | `await expect(locator).toHaveValue('foo')` | Yes | Input/select matches value. |
| **URL / Title**| `await expect(page).toHaveURL(/\/dashboard/)` | Yes | Page navigation completed. |
| **Generic (Sync)**| `expect(val).toBe(true)` | No | Synchronous data evaluation only. |

---

## 3. Synchronization & Timing

Playwright includes built-in auto-waiting for actionable states (visible, stable, enabled).

### Best Practices
- **Never use hard-coded sleep**: Do not use `page.waitForTimeout(milliseconds)`.
- **Page Load States**:
  - `await page.waitForLoadState('domcontentloaded')`
  - `await page.waitForLoadState('networkidle')` (use carefully if polling APIs exist)
- **Response Synchronization**:
  ```typescript
  const responsePromise = page.waitForResponse(resp => resp.url().includes('/api/items') && resp.status() === 200);
  await page.getByRole('button', { name: 'Save' }).click();
  await responsePromise;
  ```

---

## 4. Data-Driven Testing (DDT) Patterns

Decouple test logic from test permutations to maximize test coverage and maintainability.

### Data Formats
- **JSON**: Best for nested structures, complex payload assertions, and mixed types.
- **CSV**: Best for tabular matrix variations (boundary value analysis, decision tables).

### Parameterized Loop Pattern
```typescript
import testData from '../data/feature-cases.json';

test.describe('Parameterized Feature Test', () => {
  for (const scenario of testData) {
    test(`[${scenario.id}] ${scenario.title}`, async ({ page }) => {
      // Execute test step using scenario.inputs
      // Verify outcomes against scenario.expected
    });
  }
});
```
