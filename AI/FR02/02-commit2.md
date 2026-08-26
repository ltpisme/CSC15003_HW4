# FR-02 Commit 2 Report: Test Defect Corrections & Failure Classification

## 1. Explicit Confirmation of File Modification
- **Modified Test Suite**: `automation/tests/fr02.spec.ts` was successfully modified.
- **External Data Retained**: `automation/data/fr02-data.json` is preserved and linked.

---

## 2. Failure Classification

Every failure observed in ZenAI execution evidence is classified under one of the four categories:
`TEST_DEFECT`, `APPLICATION_DEFECT`, `ENVIRONMENT`, `INSUFFICIENT_EVIDENCE`.

| Test Case ID | Test Name | Classification | Notes / Justification |
|---|---|---|---|
| `TC_FR02_01` | Login successfully with valid credentials | `TEST_DEFECT` | Password input locator used CSS `:nth-of-type(2)` which fails when inputs reside in separate `<div>` containers. |
| `TC_FR02_02` | Reject email with invalid HTML5 email format | `TEST_DEFECT` / `APPLICATION_DEFECT` | Test defect in password locator fixed. Underlying HTML5 validation failure is an `APPLICATION_DEFECT` (SUT uses `type="text"`). |
| `TC_FR02_03` | Reject login with non-existing email | `TEST_DEFECT` | Failed due to password input locator in `fillLoginForm`. |
| `TC_FR02_04` | Reject login with incorrect password | `TEST_DEFECT` | Failed due to password input locator in `fillLoginForm`. |
| `TC_FR02_05` | First failed login attempt does not lock account | `TEST_DEFECT` | Failed due to password input locator in helper `failedLogin` / `fillLoginForm`. |
| `TC_FR02_06` | Second consecutive failed login attempt does not lock account | `TEST_DEFECT` / `APPLICATION_DEFECT` | Test defect in helper fixed. Will uncover `APPLICATION_DEFECT` (SUT backend increments attempts by +2, locking at attempt 2). |
| `TC_FR02_07` | Third consecutive failed login attempt locks account | `TEST_DEFECT` / `APPLICATION_DEFECT` | Test defect in helper fixed. Will uncover `APPLICATION_DEFECT` (SUT frontend masks lockout message). |
| `TC_FR02_08` | Correct password is rejected while account is locked | `TEST_DEFECT` | Failed due to password input locator in `fillLoginForm`. |
| `TC_FR02_09` | Account can login again after 30-second lock period | `TEST_DEFECT` / `APPLICATION_DEFECT` | Test defect in helper fixed. Will uncover `APPLICATION_DEFECT` (SUT backend locks for 180s instead of 30s). |
| `TC_FR02_10` | Account remains locked while lock period is active | `TEST_DEFECT` | Failed due to password input locator in `fillLoginForm`. |
| `TC_FR02_11` | Email field uses type=email | `APPLICATION_DEFECT` | SUT `Login.jsx:30` renders `<input type="text" ... />` instead of `type="email"`. |
| `TC_FR02_12` | Password field uses type=password | `TEST_DEFECT` / `APPLICATION_DEFECT` | Locator used `:nth-of-type(2)` which failed before asserting. Fixed locator exposes `APPLICATION_DEFECT` (SUT uses `type="text"`). |
| `TC_FR02_13` | Login page contains exactly one h1 | `APPLICATION_DEFECT` | SUT `Login.jsx:24` uses `<h2>` and has 0 `<h1>` tags. |
| `TC_FR02_14` | Required login fields are marked as required | `TEST_DEFECT` | Password field locator failed due to `:nth-of-type(2)`. |
| `TC_FR02_15` | Authentication error is displayed above submit button | `TEST_DEFECT` / `APPLICATION_DEFECT` | Helper locator fixed. Layout assertion exposes `APPLICATION_DEFECT` (SUT renders error below submit button). |
| `TC_FR02_16` | Password characters are hidden | `TEST_DEFECT` / `APPLICATION_DEFECT` | Password locator fixed. Attribute assertion exposes `APPLICATION_DEFECT` (SUT uses `type="text"`). |
| `TC_FR02_17` | Tab order follows the login form layout | `PASS` | SUT satisfies basic focus flow check. |

---

## 3. Evidence-Based Code Changes

### Change 1: Helper `fillLoginForm` & `submitLogin` Locators
- **TC**: `TC_FR02_01`, `TC_FR02_03`, `TC_FR02_04`, `TC_FR02_05`, `TC_FR02_06`, `TC_FR02_07`, `TC_FR02_08`, `TC_FR02_09`, `TC_FR02_10`, `TC_FR02_15`
- **Run1 Evidence**: `automation/results/ai-failures/all-failures.md` (`Error: expect(locator).toBeVisible() failed` on locator `input[type="password"], input[name="password"], form input[type="text"]:nth-of-type(2), form input:nth-of-type(2)`)
- **Diagnosis**: The CSS selector `form input:nth-of-type(2)` failed to locate the password input because each `<input>` in `Login.jsx` is wrapped in its own `<div className="mb-4">` container. Under CSS specification, `:nth-of-type` is scoped to direct siblings within the same parent `<div>`, where each input is the 1st input of that `<div>`.
- **Root Cause**: Flawed CSS pseudo-class selector assumption regarding DOM hierarchy.
- **Change**: Replaced compound CSS selector with Playwright `.or()` chaining:
  - Email: `page.locator('input[type="email"], input[name="email"], input[name="username"]').or(page.locator('form input').first())`
  - Password: `page.locator('input[type="password"], input[name="password"]').or(page.locator('form input').nth(1))`
  - Submit: `page.getByRole('button', { name: /Sign In|Đăng nhập|Login/i }).or(page.locator('form button[type="submit"], form button').first())`

---

### Change 2: Password Input Locator in `TC_FR02_02`
- **TC**: `TC_FR02_02`
- **Run1 Evidence**: `automation/results/ai-failures/fr-02-login-and-lock-account-tc-fr02-02-reject-email-with-invalid-html5-email-fo-6/report.md` (`Error: locator.fill: Test timeout of 30000ms exceeded` waiting for `locator('input[type="password"], input[name="password"], form input:nth-of-type(2)').first()`)
- **Diagnosis**: Test timed out attempting to fill the password input due to the broken `form input:nth-of-type(2)` selector.
- **Root Cause**: Reliance on broken sibling `:nth-of-type(2)` CSS selector.
- **Change**: Updated password locator to `page.locator('input[type="password"], input[name="password"]').or(page.locator('form input').nth(1))`.

---

### Change 3: Input Locators in `TC_FR02_11` & `TC_FR02_12`
- **TC**: `TC_FR02_11`, `TC_FR02_12`
- **Run1 Evidence**: `automation/results/ai-failures/fr-02-login-and-lock-account-tc-fr02-12-password-field-uses-type-password-35/report.md` (`expect(locator).toBeVisible()` failed on `form input:nth-of-type(2)`)
- **Diagnosis**: `TC_FR02_12` failed before evaluating `toHaveAttribute('type', 'password')` because the element locator timed out.
- **Root Cause**: Broken CSS selector `form input:nth-of-type(2)`.
- **Change**: Updated locator to `page.locator('input[name="password"], input[type="password"]').or(page.locator('form input').nth(1))`. Strict assertion `expect(passwordInput).toHaveAttribute('type', testCase.expectedType)` is preserved to faithfully detect SUT non-compliance (`APPLICATION_DEFECT`).

---

### Change 4: Input Locators in `TC_FR02_14`, `TC_FR02_15`, `TC_FR02_16`
- **TC**: `TC_FR02_14`, `TC_FR02_15`, `TC_FR02_16`
- **Run1 Evidence**: `automation/results/ai-failures/fr-02-login-and-lock-account-tc-fr02-14-required-login-fields-are-marked-as-requ-40/report.md`, `fr-02-login-and-lock-account-tc-fr02-15-authentication-error-is-displayed-above--43/report.md`, `fr-02-login-and-lock-account-tc-fr02-16-password-characters-are-hidden-48/report.md`
- **Diagnosis**: All three tests crashed during input/button element resolution rather than executing their required GUI assertions.
- **Root Cause**: Sibling selector `:nth-of-type(2)` mismatch across form input locators.
- **Change**: Replaced input locators with Playwright `.or()` chaining while preserving all assertions (`toHaveAttribute('required', '')`, spatial bounding box comparison `errorBox.y < buttonBox.y`, and `toHaveAttribute('type', 'password')`).

---

## 4. Unresolved Failures & Suspected Application Defects

The following failures are genuine `APPLICATION_DEFECT` instances in the SUT and must remain unchanged in the test suite:

1. **HTML Input `type` Non-Compliance (`TC_FR02_02`, `TC_FR02_11`, `TC_FR02_12`, `TC_FR02_16`)**:
   - *Requirement*: Email input must use `type="email"` (with HTML5 format validation), password input must use `type="password"`.
   - *SUT Reality*: `frontend-web/src/pages/Login.jsx:30,40` renders both inputs with `type="text"`.
2. **Missing `<h1>` Heading Tag (`TC_FR02_13`)**:
   - *Requirement*: Login page must have exactly one `<h1>` tag.
   - *SUT Reality*: `frontend-web/src/pages/Login.jsx:24` uses `<h2>Đăng Ký</h2>` and contains zero `<h1>` elements.
3. **Premature Account Lockout (`TC_FR02_06`)**:
   - *Requirement*: Account must lock only after 3 consecutive failed attempts.
   - *SUT Reality*: `backend/server.js:54` calculates `newAttempts = user.login_attempts + 2`, causing lockout after only 2 failed attempts.
4. **Swallowed Lockout Message (`TC_FR02_07`)**:
   - *Requirement*: Error notice must indicate account is locked for 30s.
   - *SUT Reality*: `frontend-web/src/pages/Login.jsx:18` catches backend 403 response and hardcodes `"Đăng nhập thất bại. Vui lòng kiểm tra lại."`.
5. **Lockout Duration Mismatch (`TC_FR02_09`)**:
   - *Requirement*: Lockout expires after 30 seconds.
   - *SUT Reality*: `backend/server.js:57` sets `Date.now() + 180000` (180s = 3 minutes).
6. **Error Notification Box Placement (`TC_FR02_15`)**:
   - *Requirement*: Error message box must be positioned above the submit button.
   - *SUT Reality*: `frontend-web/src/pages/Login.jsx:66` renders error container below the submit button.

---

## 5. Test Suite Metrics & Preservation Checklist
- [x] **Test Cases**: 17 total (Exceeds minimum 12)
- [x] **Test Case IDs**: Preserved `TC_FR02_01` through `TC_FR02_17` without deletion or renaming
- [x] **External Data**: Sourced from `automation/data/fr02-data.json`
- [x] **Assertion Patterns**: 5 distinct patterns preserved (`toHaveURL`, `toBeVisible`, `toHaveAttribute`, `toContain`, spatial bounding box)
- [x] **Requirement Traceability**: 100% mapped to SRS & GUI specifications
- [x] **No Unrelated Refactoring / No Weakened Assertions / No Invented Behavior**
