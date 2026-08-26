# FR-02 Baseline Audit Report

## 1. Test Case Count
- **Total Test Cases**: 17
- **Test File**: `automation/tests/fr02.spec.ts`

## 2. Test Case IDs
- `TC_FR02_01`: Login successfully with valid credentials
- `TC_FR02_02`: Reject email with invalid HTML5 email format
- `TC_FR02_03`: Reject login with non-existing email
- `TC_FR02_04`: Reject login with incorrect password
- `TC_FR02_05`: First failed login attempt does not lock account
- `TC_FR02_06`: Second consecutive failed login attempt does not lock account
- `TC_FR02_07`: Third consecutive failed login attempt locks account
- `TC_FR02_08`: Correct password is rejected while account is locked
- `TC_FR02_09`: Account can login again after 30-second lock period
- `TC_FR02_10`: Account remains locked while lock period is active
- `TC_FR02_11`: Email field uses type=email
- `TC_FR02_12`: Password field uses type=password
- `TC_FR02_13`: Login page contains exactly one h1
- `TC_FR02_14`: Required login fields are marked as required
- `TC_FR02_15`: Authentication error is displayed above submit button
- `TC_FR02_16`: Password characters are hidden
- `TC_FR02_17`: Tab order follows the login form layout

## 3. Requirement Traceability
| Test Case ID | SRS / Feature Ref | Category | Description |
|---|---|---|---|
| `TC_FR02_01` | `README.md:38-45`, E1, E3, E5 | Functional | Đăng nhập thành công với thông tin hợp lệ |
| `TC_FR02_02` | `README.md:44, 253`, E2, C1 | Validation / GUI | Từ chối email sai định dạng HTML5 validation |
| `TC_FR02_03` | `README.md:42`, E4 | Security / Error | Xử lý email không tồn tại, thông báo chung không lộ nguyên nhân |
| `TC_FR02_04` | `README.md:41-42`, E6 | Functional / Error | Xử lý mật khẩu không đúng |
| `TC_FR02_05` | `README.md:41-42`, E7, BVA-LB+1 (1) | Boundary / State | Đăng nhập sai lần 1 không khóa tài khoản |
| `TC_FR02_06` | `README.md:41-42`, E7, BVA-UB-1 (2) | Boundary / State | Đăng nhập sai 2 lần liên tiếp không khóa tài khoản |
| `TC_FR02_07` | `README.md:42`, E8, BVA-UB (3) | Boundary / State | Đăng nhập sai 3 lần liên tiếp khóa tài khoản 30 giây |
| `TC_FR02_08` | `README.md:42`, Lock state | State Verification | Từ chối mật khẩu đúng khi tài khoản đang bị khóa |
| `TC_FR02_09` | `README.md:42`, Lock duration (30s) | Boundary / Time | Tự động mở khóa sau khi hết thời gian 30 giây |
| `TC_FR02_10` | `README.md:42`, E8 | State / Robustness | Duy trì trạng thái khóa khi tiếp tục gửi request trong thời gian khóa |
| `TC_FR02_11` | `README.md:44, 253`, FR-22 | GUI / Form | Input email có thuộc tính `type="email"` |
| `TC_FR02_12` | `README.md:254`, FR-22 | GUI / Form | Input password có thuộc tính `type="password"` |
| `TC_FR02_13` | `README.md:247`, FR-21 | GUI Standard | Trang đăng nhập có đúng 1 thẻ `<h1>` |
| `TC_FR02_14` | `README.md:252`, FR-22 | GUI / Form | Các trường bắt buộc có thuộc tính `required` |
| `TC_FR02_15` | `README.md:255`, FR-22 | GUI / Form | Thông báo lỗi hiển thị phía trên nút submit |
| `TC_FR02_16` | `README.md:254`, SEC-01 | Security / GUI | Mật khẩu được ẩn ký tự, không hiển thị plaintext |
| `TC_FR02_17` | `README.md:248`, FR-21 | GUI / A11y | Thứ tự phím Tab đi từ trên xuống dưới, trái sang phải |

## 4. Test Data Location
- Hardcoded directly inside `automation/tests/fr02.spec.ts` (lines 3-10):
  - `BASE_URL`: `'http://localhost:5173'`
  - `LOGIN_URL`: `'http://localhost:5173/login'`
  - `VALID_EMAIL`: `'test@eshop.com'`
  - `VALID_PASSWORD`: `'Test1234!'`
  - `WRONG_PASSWORD`: `'WrongPass'`
  - `UNKNOWN_EMAIL`: `'unknown@eshop.com'`
  - `INVALID_EMAIL`: `'invalid-email'`
- Default seeded database accounts in SUT (`backend/database.js:91-94`):
  - User: `test@eshop.com` / `Test1234!`
  - Admin: `admin@eshop.com` / `Admin123!`

## 5. Assertion Patterns
- **URL navigation assertions**: `await expect(page).not.toHaveURL(/\/login$/)` / `await expect(page).toHaveURL(/\/login$/)`
- **Element visibility assertions**: `await expect(locator).toBeVisible()`
- **HTML DOM attribute assertions**: `await expect(input).toHaveAttribute('type', 'email')`, `await expect(input).toHaveAttribute('required', '')`
- **HTML5 Validity property**: `await expect(emailInput).toHaveJSProperty('validity.valid', false)`
- **Element count assertion**: `await expect(h1).toHaveCount(1)`
- **Error message content assertions**:
  - `expect(errorText?.toLowerCase()).not.toContain('email does not exist')`
  - `expect(errorText.includes('khóa') || errorText.includes('locked') || errorText.includes('30')).toBeTruthy()`
- **DOM layout geometry comparison**: `expect(errorBox!.y).toBeLessThan(buttonBox!.y)`
- **Tab focus sequence heuristic**: `expect(focusSequence).toContain('input')`

## 6. Selector Risks
1. **Email Input Selector**: `fillLoginForm` uses `locator('input[type="email"], input[name="email"], input[name="username"]').first()`. In SUT (`frontend-web/src/pages/Login.jsx:29-35`), the input is rendered as `<input type="text" ... />` without `name="email"` or `name="username"`. This causes timeout failures in all tests trying to fill the login form.
2. **Password Input Selector**: `fillLoginForm` uses `locator('input[type="password"], input[name="password"]').first()`. In SUT (`Login.jsx:39-45`), the input is rendered as `<input type="text" ... />` without `name="password"`.
3. **Auth Error Container Selector**: Helper `authError(page)` searches for `[role="alert"], .error, .error-message, .alert, .alert-danger`. In SUT (`Login.jsx:66`), the error box is `<div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">`, which lacks any of those classes or ARIA roles.
4. **Submit Button Selector**: `page.getByRole('button', { name: /Sign In|Đăng nhập/i })`. Works against SUT's `"Sign In"`, but is fragile if button text changes.

## 7. Assertion Risks
1. **Error Message Text Assertion (`TC_FR02_07`)**: Asserts text contains `'khóa'`, `'locked'`, or `'30'`. SUT frontend (`Login.jsx:18`) hardcodes `"Đăng nhập thất bại. Vui lòng kiểm tra lại."`, swallowing the backend 403 message.
2. **Error Box Placement Assertion (`TC_FR02_15`)**: Asserts `errorBox.y < buttonBox.y`. SUT (`Login.jsx:66`) renders error below the submit button.
3. **Heading Count Assertion (`TC_FR02_13`)**: Asserts `page.locator('h1').toHaveCount(1)`. SUT (`Login.jsx:24`) uses `<h2>Đăng Ký</h2>` and contains zero `<h1>` elements.
4. **HTML5 Validation Assertion (`TC_FR02_02`)**: Asserts `validity.valid === false`. SUT uses `type="text"`, which always evaluates to `validity.valid === true`.
5. **Fixed Sleep in `TC_FR02_09`**: Uses `await page.waitForTimeout(30_000)`. SUT backend (`backend/server.js:57`) locks for 180s (3 minutes). After 30s, the account remains locked, failing the login assertion.

## 8. State / Isolation Risks
1. **Shared Database State on `test@eshop.com`**: All lockout tests mutate `users.login_attempts` and `users.locked_until` in SQLite database. Without database reset between tests, failed attempts in one test leak into subsequent tests.
2. **Backend Failure Increment Bug (`+2` instead of `+1`)**: SUT backend (`backend/server.js:54`) executes `newAttempts = user.login_attempts + 2`. Thus, 2 failed attempts result in `attempts = 4 >= 3`, locking the account earlier than specified.
3. **Backend Lock Duration Bug (180s instead of 30s)**: SUT backend sets lock duration to 180s. A locked account blocks subsequent test execution unless reset.
4. **No Clean Reset Hook**: `fr02.spec.ts` only navigates to `/login` in `beforeEach`; it does not clear `localStorage`, reset cookies, or restore database state.

## 9. Implementation Assumptions
1. Assumes SUT implements standard HTML semantic attributes (`type="email"`, `type="password"`, `name="email"`, `name="password"`, `role="alert"`).
2. Assumes backend increments `login_attempts` by 1 and locks for exactly 30s upon reaching 3 failed attempts.
3. Assumes frontend displays backend error details (including lockout error messages).
4. Assumes frontend complies with SRS GUI guidelines (single `<h1>`, error position above submit button).

## 10. Relevant ZenAI Evidence
- **Raw Evidence Files**: `automation/results/result.json`, `automation/results/ai-failures/all-failures.md`
- **Execution Summary**:
  - Total test executions: 51 (17 test cases across 3 browser engines: Chromium, Firefox, WebKit)
  - Passed: 3 (only `TC_FR02_17` passed on all 3 browsers)
  - Failed: 48 (16 test cases failed on all 3 browsers)
  - Primary failure mechanism: Locator timeouts (5000ms) on `input[type="email"]`, `input[type="password"]`, and `authError` due to SUT rendering `type="text"` without names and Tailwind classes without alert roles.

---

## Issue Diagnosis (TC → Problem → Evidence → Diagnosis)

- **TC_FR02_01** → Email and Password input locators not found → `automation/results/ai-failures/all-failures.md` (`expect(locator).toBeVisible()` failed on locator `'input[type="email"], input[name="email"], input[name="username"]')`) → SUT `frontend-web/src/pages/Login.jsx:29-45` uses `<input type="text" ...>` without `name` attributes, causing selector timeout.
- **TC_FR02_02** → Email input locator not found and HTML5 validation not triggered → `automation/results/ai-failures/all-failures.md` (`waiting for locator('input[type="email"], input[name="email"]')`) → SUT `Login.jsx:30` uses `type="text"` instead of `type="email"`, so locator fails and native email format validation is absent.
- **TC_FR02_03** → Input and error container locators not found → `automation/results/ai-failures/all-failures.md` (Timeout on input locator and `authError` locator) → SUT `Login.jsx:66` uses `<div className="bg-red-100 text-red-700 ...">` without `role="alert"` or `.error`/`.alert` class names.
- **TC_FR02_04** → Input and error container locators not found → `automation/results/ai-failures/all-failures.md` (Timeout on `toBeVisible()`) → Selectors mismatch between test helper and SUT implementation.
- **TC_FR02_05** → Input/error locators fail and backend increments attempts by +2 → `automation/results/ai-failures/all-failures.md` & `backend/server.js:54` → In addition to selector mismatch, backend increments `login_attempts` by 2 on failure instead of 1.
- **TC_FR02_06** → Selectors fail and account is prematurely locked after 2 attempts → `automation/results/ai-failures/all-failures.md` & `backend/server.js:54` (`newAttempts = user.login_attempts + 2`) → Backend triggers lockout on attempt 2 (attempts = 4 >= 3); test expects account to remain usable after 2 failures.
- **TC_FR02_07** → Selectors fail and error text assertion fails → `automation/results/ai-failures/all-failures.md` & `frontend-web/src/pages/Login.jsx:18` (`setError("Đăng nhập thất bại. Vui lòng kiểm tra lại.")`) → Frontend catch handler swallows backend 403 message; assertion expecting "khóa"/"locked"/"30" cannot pass.
- **TC_FR02_08** → Input and error container locators fail → `automation/results/ai-failures/all-failures.md` (Timeout on locator visibility) → Selectors mismatch with SUT.
- **TC_FR02_09** → Input locator fails and lock duration is 180s instead of 30s → `automation/results/ai-failures/all-failures.md` & `backend/server.js:57` (`Date.now() + 180000`) → SUT locks account for 180s; test waiting only 30s will still find account locked.
- **TC_FR02_10** → Input and error container locators fail → `automation/results/ai-failures/all-failures.md` (Timeout on locator visibility) → Selectors mismatch with SUT.
- **TC_FR02_11** → Email input attribute check fails → `automation/results/ai-failures/all-failures.md` (Locator `'input[name="email"], input[type="email"]'` not found) → SUT `Login.jsx:30` uses `type="text"`.
- **TC_FR02_12** → Password input attribute check fails → `automation/results/ai-failures/all-failures.md` (Locator `'input[name="password"], input[type="password"]'` not found) → SUT `Login.jsx:40` uses `type="text"`.
- **TC_FR02_13** → `<h1>` element count assertion fails (expected 1, received 0) → `automation/results/ai-failures/all-failures.md` (Locator `'h1'` has count 0) → SUT `Login.jsx:24` uses `<h2>` instead of `<h1>`.
- **TC_FR02_14** → Required fields locators fail → `automation/results/ai-failures/all-failures.md` (Timeout waiting for input locators) → Input selectors fail due to `type="text"` and missing `name` attribute.
- **TC_FR02_15** → Error box position assertion fails → `automation/results/ai-failures/all-failures.md` & `Login.jsx:66` → SUT renders error box below the submit button, violating FR-22 GUI layout requirement.
- **TC_FR02_16** → Password masking check fails → `automation/results/ai-failures/all-failures.md` (Locator not found) → SUT `Login.jsx:40` uses `type="text"`, displaying password characters in plaintext.
- **TC_FR02_17** → Tab order test passes shallowly but does not verify full form tab order → `automation/results/result.json:1174` → Test passes because focus lands on generic elements, but fails to check that `tabIndex={1}` on submit button (`Login.jsx:54`) disrupts natural tab flow.
