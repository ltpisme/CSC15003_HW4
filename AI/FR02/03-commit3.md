# FR-02 Commit 3 Report: Run 2 Failure Analysis, Test Corrections & SUT Defect Catalog

## 1. Explicit Confirmation of File Modification
- **Modified Test Suite**: `automation/tests/fr02.spec.ts` was successfully modified.
- **External Data Retained**: `automation/data/fr02-data.json` is preserved and linked.

---

## 2. Failure Classification (Run 2 Evidence)

Every failure observed during ZenAI Run 2 execution is classified under one of the four required categories:
`TEST_DEFECT`, `APPLICATION_DEFECT`, `ENVIRONMENT`, `INSUFFICIENT_EVIDENCE`.

| Test Case ID | Test Name | Classification | Run 2 Status | Notes / Root Cause Diagnosis |
|---|---|---|---|---|
| `TC_FR02_01` | Login successfully with valid credentials | `PASS` | ✅ PASSED (3/3) | Verified across Chromium, Firefox, WebKit. |
| `TC_FR02_02` | Reject email with invalid HTML5 email format | `APPLICATION_DEFECT` | ❌ FAILED (3/3) | SUT `Login.jsx:30` uses `<input type="text">`, so browser HTML5 email validation is never triggered (`validity.valid` is `true`). |
| `TC_FR02_03` | Reject login with non-existing email | `PASS` | ✅ PASSED (3/3) | Form submission and generic error handling pass across all browsers. |
| `TC_FR02_04` | Reject login with incorrect password | `PASS` | ✅ PASSED (3/3) | Form submission and generic error handling pass across all browsers. |
| `TC_FR02_05` | First failed login attempt does not lock account | `APPLICATION_DEFECT` | ❌ FAILED (3/3) | SUT backend (`server.js:54`) adds `+2` to `login_attempts` per failure instead of `+1`. After `TC_FR02_04` and attempt 1 in `TC_FR02_05`, attempts reach 4 ($\ge 3$), prematurely locking `test@eshop.com`. |
| `TC_FR02_06` | Second consecutive failed login attempt does not lock account | `APPLICATION_DEFECT` | ❌ FAILED (3/3) | SUT backend prematurely locks account at 2 failed attempts (`newAttempts = 0 + 2 + 2 = 4 >= 3`). |
| `TC_FR02_07` | Third consecutive failed login attempt locks account | `APPLICATION_DEFECT` | ❌ FAILED (3/3) | SUT `Login.jsx:18` catches backend 403 response and hardcodes `"Đăng nhập thất bại. Vui lòng kiểm tra lại."`, swallowing the lockout notice. |
| `TC_FR02_08` | Correct password is rejected while account is locked | `PASS` | ✅ PASSED (3/3) | Successfully asserts locked account rejection. |
| `TC_FR02_09` | Account can login again after 30-second lock period | `TEST_DEFECT` / `APPLICATION_DEFECT` | ❌ FAILED (3/3) | **Test Defect**: Default Playwright test timeout (30s) aborts the test during `page.waitForTimeout(30000)` before login assertion can run. **App Defect**: SUT locks for 180s instead of 30s. |
| `TC_FR02_10` | Account remains locked while lock period is active | `PASS` | ✅ PASSED (3/3) | Successfully asserts immediate retry is rejected while lockout is active. |
| `TC_FR02_11` | Email field uses type=email | `APPLICATION_DEFECT` | ❌ FAILED (3/3) | SUT `Login.jsx:30` renders `type="text"`. |
| `TC_FR02_12` | Password field uses type=password | `APPLICATION_DEFECT` | ❌ FAILED (3/3) | SUT `Login.jsx:40` renders `type="text"`. |
| `TC_FR02_13` | Login page contains exactly one h1 | `APPLICATION_DEFECT` | ❌ FAILED (3/3) | SUT `Login.jsx:24` uses `<h2>Đăng Ký</h2>` with 0 `<h1>` tags. |
| `TC_FR02_14` | Required login fields are marked as required | `PASS` | ✅ PASSED (3/3) | Successfully asserts `required` attribute on both fields. |
| `TC_FR02_15` | Authentication error is displayed above submit button | `APPLICATION_DEFECT` | ❌ FAILED (3/3) | SUT `Login.jsx:66` renders error container below submit button (`errorBox.y = 517 > buttonBox.y = 425`). |
| `TC_FR02_16` | Password characters are hidden | `APPLICATION_DEFECT` | ❌ FAILED (3/3) | SUT `Login.jsx:40` uses `type="text"` (plaintext password). |
| `TC_FR02_17` | Tab order follows the login form layout | `PASS` | ✅ PASSED (3/3) | Focus navigation passes across all browsers. |

---

## 3. Evidence-Based Code Changes

### Change: Test Timeout Extension in `TC_FR02_09`
- **TC**: `TC_FR02_09`
- **Run 2 Evidence**: `automation/results/ai-failures/fr-02-login-and-lock-account-tc-fr02-09-account-can-login-again-after-30-second--27/report.md`, `fr-02-login-and-lock-account-tc-fr02-09-account-can-login-again-after-30-second--29/report.md`, `fr-02-login-and-lock-account-tc-fr02-09-account-can-login-again-after-30-second--32/report.md`
  ```
  Test timeout of 30000ms exceeded.
  Error: page.waitForTimeout: Test timeout of 30000ms exceeded.
  at automation/tests/fr02.spec.ts:252:16
  ```
- **Diagnosis**: The test executes pre-requisite login attempts and then waits for the 30-second lockout period via `page.waitForTimeout(30000)`. Because Playwright's global test timeout defaults to 30,000 ms, the test timeout is exceeded *inside* `waitForTimeout`, cutting the test off prematurely before the recovery login assertion (`successfulLogin` -> `expect(page).not.toHaveURL(/\/login$/)`) can execute.
- **Root Cause**: Missing per-test timeout override for long-duration wait test in Playwright.
- **Change**: Added `test.setTimeout(60000)` at the beginning of `TC_FR02_09` in [automation/tests/fr02.spec.ts](file:///home/ltp/Code/Course/Testing/HW/CSC15003_HW4/automation/tests/fr02.spec.ts#L242-L257).

---

## 4. Regression Analysis from Commit 2
- In Run 1 (Baseline), 16 of 17 tests failed due to brittle `:nth-of-type(2)` compound CSS selectors.
- In Run 2 (Commit 2), 7 tests passed completely (`TC_FR02_01`, `TC_FR02_03`, `TC_FR02_04`, `TC_FR02_08`, `TC_FR02_10`, `TC_FR02_14`, `TC_FR02_17`), representing **0 regressions** and a 600% increase in passing tests.
- All remaining 10 failures now faithfully evaluate and expose underlying SUT application defects without failing on invalid selector locators.

---

## 5. Unresolved Failures & Suspected Application Defects

The following 10 failures are genuine SUT defects where the test suite faithfully adheres to SRS and GUI specifications:

1. **Missing HTML5 Email Validation (`TC_FR02_02`, `TC_FR02_11`)**:
   - *Requirement*: Email field must use `type="email"` to ensure HTML5 format validation prior to form submission.
   - *SUT Implementation*: `frontend-web/src/pages/Login.jsx:30` renders `<input required type="text" ... />`.
2. **Plaintext Password Input (`TC_FR02_12`, `TC_FR02_16`)**:
   - *Requirement*: Password field must use `type="password"` to mask sensitive credentials (SEC-01).
   - *SUT Implementation*: `frontend-web/src/pages/Login.jsx:40` renders `<input required type="text" ... />`.
3. **Heading Hierarchy Non-Compliance (`TC_FR02_13`)**:
   - *Requirement*: Login page must contain exactly one `<h1>` heading tag (FR-21).
   - *SUT Implementation*: `frontend-web/src/pages/Login.jsx:24` uses `<h2>Đăng Ký</h2>` and contains 0 `<h1>` elements.
4. **Error Alert Positioning (`TC_FR02_15`)**:
   - *Requirement*: Authentication error notices must be displayed above the submit button (FR-22).
   - *SUT Implementation*: `frontend-web/src/pages/Login.jsx:66` renders error message container below the submit button.
5. **Backend Increment Step Defect (`TC_FR02_05`, `TC_FR02_06`)**:
   - *Requirement*: Account locks after 3 consecutive failed login attempts; attempts 1 and 2 must not lock the account.
   - *SUT Implementation*: `backend/server.js:54` increments `login_attempts` by `+2` per failure, locking accounts at attempt 2 (`2 + 2 = 4 >= 3`).
6. **Masked Lockout Notification (`TC_FR02_07`)**:
   - *Requirement*: UI must notify user that the account has been locked for 30 seconds upon the 3rd failed attempt.
   - *SUT Implementation*: `frontend-web/src/pages/Login.jsx:18` catches backend 403 responses and replaces the message with generic string `"Đăng nhập thất bại. Vui lòng kiểm tra lại."`.
7. **Lockout Duration Mismatch (`TC_FR02_09`)**:
   - *Requirement*: Lockout expires and user can log in again after 30 seconds.
   - *SUT Implementation*: `backend/server.js:57` sets `Date.now() + 180000` (180s = 3 minutes).

---

## 6. Insufficient Evidence
- None. All failures are directly corroborated by Run 2 logs, traces, and SUT source code (`backend/server.js`, `frontend-web/src/pages/Login.jsx`).

---

## 7. Test Suite Metrics & Preservation Checklist
- [x] **Test Cases**: 17 total (Exceeds minimum 12)
- [x] **Test Case IDs**: Preserved `TC_FR02_01` through `TC_FR02_17` without deletion or renaming
- [x] **External Data**: Sourced from `automation/data/fr02-data.json`
- [x] **Assertion Patterns**: 5 distinct patterns preserved (`toHaveURL`, `toBeVisible`, `toHaveAttribute`, `toHaveJSProperty`, spatial bounding box)
- [x] **Requirement Traceability**: 100% mapped to SRS & GUI specifications
- [x] **No Unrelated Refactoring / No Weakened Assertions / No Invented Behavior**
