# FR-02 Commit 1 Report: Data-Driven Migration & Evidence-Based Refinements

## 1. Explicit Confirmation of File Modification
- **Modified Test Suite**: `automation/tests/fr02.spec.ts` was successfully modified.
- **External Data Added**: `automation/data/fr02-data.json` was created and linked.

## 2. Data-Driven Changes
- **Externalized Test Data**: Extracted credentials, lockout parameters, boundary iterations, and GUI expectations into `automation/data/fr02-data.json`.
- **Dynamic Test Parameterization**:
  - `functionalCases`: `TC_FR02_01` through `TC_FR02_04` consume parameterized credentials and expected error types.
  - `lockoutCases`: `TC_FR02_05` through `TC_FR02_10` parameterize failed attempt counts (`failedAttempts: 1, 2, 3`), lockout wait intervals (`waitMs: 30000`), and lockout state verification flows.
  - `guiCases`: `TC_FR02_11` through `TC_FR02_17` read expected attributes (`type="email"`, `type="password"`), expected heading count (`expectedH1Count: 1`), and tab limit configs from JSON.

## 3. Additional Evidence-Based Fixes
Every additional fix adheres to the format `TC → evidence → root cause → code change → reason`:

- **All Helper Actions (`fillLoginForm`)** → `automation/results/ai-failures/all-failures.md` (`expect(locator).toBeVisible()` timeout on `input[type="email"]`) & `frontend-web/src/pages/Login.jsx:29-45` → SUT uses `<input type="text" ...>` without `name` or `type="email"`/`type="password"` attributes → Added fallback selector chain `input[type="email"], input[name="email"], input[name="username"], form input:not([type="password"]):not([type="submit"])` and `input[type="password"], input[name="password"], form input[type="text"]:nth-of-type(2), form input:nth-of-type(2)` → Allows functional helper to interact with form inputs while keeping strict HTML attribute assertions in GUI test cases (`TC_FR02_11`, `TC_FR02_12`, `TC_FR02_16`).
- **All Error Assertions (`authError`)** → `automation/results/ai-failures/all-failures.md` (Timeout waiting for `[role="alert"], .error, ...`) & `frontend-web/src/pages/Login.jsx:66` → SUT error box uses Tailwind utility classes `<div className="bg-red-100 text-red-700 ...">` without standard ARIA alert role → Added `.bg-red-100, [class*="text-red-"]` to `authError` selector → Enables locator to capture error alerts in both semantic and utility-class-based UI implementations.
- **`TC_FR02_15` (Submit Button Resolution)** → `frontend-web/src/pages/Login.jsx:58` → Submit button text in SUT is `"Sign In"` / `"Đăng nhập"` → Updated button locator to `/Sign In|Đăng nhập|Login/i` → Prevents submit button lookup failure across localized and English UI variants.

## 4. Files Changed
- `automation/data/fr02-data.json` (New data artifact)
- `automation/tests/fr02.spec.ts` (Modified test suite)

## 5. Test Count
- **Total Test Cases**: 17
- **Preserved Test Case IDs**:
  1. `TC_FR02_01`
  2. `TC_FR02_02`
  3. `TC_FR02_03`
  4. `TC_FR02_04`
  5. `TC_FR02_05`
  6. `TC_FR02_06`
  7. `TC_FR02_07`
  8. `TC_FR02_08`
  9. `TC_FR02_09`
  10. `TC_FR02_10`
  11. `TC_FR02_11`
  12. `TC_FR02_12`
  13. `TC_FR02_13`
  14. `TC_FR02_14`
  15. `TC_FR02_15`
  16. `TC_FR02_16`
  17. `TC_FR02_17`

## 6. Assertion-Pattern Count
- **Distinct Assertion Patterns**: 5
  1. *URL Navigation & Route Matching*: `expect(page).toHaveURL(...)`, `expect(page).not.toHaveURL(...)`
  2. *Element Visibility & Count*: `expect(locator).toBeVisible()`, `expect(locator).toHaveCount(...)`
  3. *DOM Property & Attribute Checks*: `expect(locator).toHaveAttribute(...)`, `expect(locator).toHaveJSProperty(...)`
  4. *String Content Inclusion & Exclusion*: `expect(text).toContain(...)`, `expect(text).not.toContain(...)`
  5. *Spatial Geometry & Layout Positioning*: `expect(box1.y).toBeLessThan(box2.y)`

## 7. Unresolved Issues (SUT Bugs & Implementation Gaps)
1. **SUT HTML Input Attributes**: SUT `Login.jsx` uses `type="text"` for email and password. `TC_FR02_11`, `TC_FR02_12`, and `TC_FR02_16` will correctly catch this non-compliance.
2. **SUT Heading Tag**: SUT `Login.jsx` uses `<h2>` instead of `<h1>`. `TC_FR02_13` will detect this.
3. **SUT Lockout Increment (+2 instead of +1)**: SUT backend `server.js:54` increments `login_attempts` by 2, causing lockout at attempt 2. `TC_FR02_06` will catch this premature lockout.
4. **SUT Lockout Duration (180s instead of 30s)**: SUT backend `server.js:57` locks for 180s instead of 30s. `TC_FR02_09` will detect that login fails after 30s.
5. **SUT Error Message Masking**: SUT `Login.jsx:18` hardcodes generic error string and swallows backend 403 error. `TC_FR02_07` will catch missing lockout notice.
6. **SUT Error Box Position**: SUT `Login.jsx:66` renders error box below submit button. `TC_FR02_15` will catch this GUI layout violation.

## 8. Validation Status
- **Static Analysis**: TypeScript syntax and module resolution verified (`fr02.spec.ts` imports JSON via standard Node `fs`/`path`).
- **Data-Driven Coverage**: 100% of test cases parameterize or source data from `automation/data/fr02-data.json`.
- **Compliance**: All constraints, test IDs, and assertion patterns strictly preserved.
