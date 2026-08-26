# Baseline Audit: FR-16 Import Sản phẩm từ CSV

## 1. Test Case Count
- **Total Test Cases:** 20 test cases (`TC_FR16_01` – `TC_FR16_20`)
- **Total Test Executions (3 Browser Projects):** 60 test executions (20 TCs × Chromium, Firefox, WebKit)

---

## 2. Test Case IDs
| Test Case ID | Test Title |
|---|---|
| `TC_FR16_01` | Admin can access Import Products |
| `TC_FR16_02` | Non-admin cannot import products |
| `TC_FR16_03` | Import valid .csv file |
| `TC_FR16_04` | Reject non-.csv file |
| `TC_FR16_05` | Accept valid CSV header |
| `TC_FR16_06` | Reject CSV with missing header fields |
| `TC_FR16_07` | Reject CSV with incorrect header name |
| `TC_FR16_08` | Parse quoted comma in CSV field correctly |
| `TC_FR16_09` | Reject unquoted comma in CSV field |
| `TC_FR16_10` | Accept product name with minimum length 1 |
| `TC_FR16_11` | Reject empty product name |
| `TC_FR16_12` | Reject price equal to 0 |
| `TC_FR16_13` | Accept price equal to 0.01 |
| `TC_FR16_14` | Reject negative price -0.01 |
| `TC_FR16_15` | Reject non-numeric price |
| `TC_FR16_16` | Rollback entire import when middle row is invalid |
| `TC_FR16_17` | Rollback previous rows when last row is invalid |
| `TC_FR16_18` | Multiple errors cause complete rollback |
| `TC_FR16_19` | Display successful import count |
| `TC_FR16_20` | Display error count and error reasons |

---

## 3. Requirement Traceability
| Test Case ID | Requirement / Rule Ref | Description |
|---|---|---|
| `TC_FR16_01` | `README_sut.md:174-180`, `FR-12`, `FR-16` | Admin authorization & UI access for import |
| `TC_FR16_02` | `README_sut.md:174-180`, `FR-12` | Non-admin access control restriction |
| `TC_FR16_03` | `README_sut.md:204`, `E1` | Import valid `.csv` file |
| `TC_FR16_04` | `README_sut.md:204`, `E2`, `B_FR16_01` | Reject unsupported non-`.csv` file (`.xlsx`) |
| `TC_FR16_05` | `README_sut.md:205`, `E3` | Accept valid standard CSV header (`name,price,description,imageUrl,category_id`) |
| `TC_FR16_06` | `README_sut.md:205`, `E4`, `B_FR16_02` | Reject CSV with missing required header fields |
| `TC_FR16_07` | `README_sut.md:205`, `C2` | Reject CSV with invalid header column names (`product_name`) |
| `TC_FR16_08` | `README_sut.md:206`, `E5`, `C3`, `B_FR16_03` | RFC 4180 compliance: support quoted commas in fields |
| `TC_FR16_09` | `README_sut.md:206`, `E6`, `C3`, `B_FR16_03` | Reject unquoted commas in fields causing column splitting |
| `TC_FR16_10` | `README_sut.md:208`, `E7`, `BVA2` | Accept minimum length 1 for product `name` |
| `TC_FR16_11` | `README_sut.md:208`, `E8`, `BVA1` | Reject empty product `name` |
| `TC_FR16_12` | `README_sut.md:209`, `E10`, `BVA3`, `B_FR16_04` | Reject `price = 0` (boundary lower invalid) |
| `TC_FR16_13` | `README_sut.md:209`, `E9`, `BVA4` | Accept `price = 0.01` (boundary lower valid) |
| `TC_FR16_14` | `README_sut.md:209`, `E10`, `BVA5`, `B_FR16_04` | Reject negative `price = -0.01` |
| `TC_FR16_15` | `README_sut.md:209`, Price Validation | Reject non-numeric price (`price = "abc"`) |
| `TC_FR16_16` | `README_sut.md:210`, Atomicity | All-or-nothing rollback when middle row is invalid |
| `TC_FR16_17` | `README_sut.md:210`, Atomicity | All-or-nothing rollback when last row is invalid |
| `TC_FR16_18` | `README_sut.md:210-211`, Atomicity & Reporting | Multiple validation errors cause rollback and are all reported |
| `TC_FR16_19` | `README_sut.md:211`, Result Reporting | Report display for successful import (count = 3, error = 0) |
| `TC_FR16_20` | `README_sut.md:210-211`, Reporting & Atomicity | Report error count (2), reasons, and verify no products created |

---

## 4. Test Data Location
- **Directory:** Dynamic runtime generation under `process.cwd()/test-data/fr16/` (`automation/tests/fr16.spec.ts:22-26`).
- **File Generation:** Created synchronously via `createCsvFile(filename, content)` (`automation/tests/fr16.spec.ts:41-61`).
- **Data Uniqueness:** Product names generated dynamically using `uniqueProduct(prefix)` via `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}` to avoid collisions across runs.

---

## 5. Assertion Patterns
- **Visibility Assertions:** `await expect(locator).toBeVisible()`, `await expect(locator).not.toBeVisible()`
- **Attachment Assertions:** `await expect(locator).toBeAttached()`
- **URL Assertions:** `await expect(page).not.toHaveURL(/\/login$/)`
- **Dynamic Text Regex Search:** `page.getByText(pattern).first()` for error messages, error reasons, and count strings.
- **Product UI Search:** `page.getByText(productName, { exact: true })` on the Products page.

---

## 6. Selector Risks
- **Login Locators:**
  - `fillLoginForm` uses `locator('input[type="email"], input[name="email"], input[name="username"]').first()` and `locator('input[type="password"], input[name="password"]').first()`.
  - In Web Admin (`frontend-admin`), the app is a single-page interface mounted at `http://localhost:5174`, which may not use a dedicated `/login` page or matching input selectors.
- **Route Navigation Selectors / URLs:**
  - Hardcoded navigation paths `http://localhost:5174/login`, `http://localhost:5174/admin/import-products`, and `http://localhost:5174/admin/products` do not match the single-page tab structure of `frontend-admin/src/App.jsx` (`activeTab === "products"`).
- **Import Button Locator:**
  - `submitImport` relies on `getByRole('button', { name: /Import|Upload|Import Products|Nhập/i })`. If the file preview state is empty, the button is disabled or text is not ready.
- **Alert / Message Box Selectors:**
  - `importError` and `importSuccess` use `[role="alert"]`, `.error`, `.error-message`, `.alert`, `.alert-danger`, `.alert-success`.
  - SUT `frontend-admin/src/App.jsx:459-480` renders results in `div` with Tailwind classes `bg-green-100` / `bg-red-100`, which lack `.alert` or `role="alert"`.

---

## 7. Assertion Risks
- **Rollback Assertions (`TC_FR16_16`, `TC_FR16_17`, `TC_FR16_18`, `TC_FR16_20`):**
  - Script asserts `expectProductDoesNotExist` for valid rows in a partially invalid CSV. Because backend (`backend/server.js:213-232`) lacks SQLite transaction rollback, valid rows are permanently inserted, causing rollback assertions to fail.
- **Non-.csv File Rejection (`TC_FR16_04`):**
  - Script asserts `expectImportError(page)`. SUT `<input type="file">` (`App.jsx:356`) has no `accept=".csv"` and `FileReader` reads any file text, rendering preview and allowing import.
- **Header Structure Assertions (`TC_FR16_06`, `TC_FR16_07`):**
  - SUT frontend maps aliases and provides default fallbacks (`price = 0`, `category_id = 1`) without throwing header syntax errors.
- **RFC 4180 Parsing Assertions (`TC_FR16_08`):**
  - SUT parses CSV via `line.split(",")` (`App.jsx:371`), splitting quoted strings and misaligning columns. Product name assertion `expectProductExists(page, productName)` will fail.
- **Price Validation Assertions (`TC_FR16_12`, `TC_FR16_14`, `TC_FR16_15`):**
  - SUT backend and frontend do not validate `price > 0`. Price `0`, `-0.01`, or `"abc"` are accepted and inserted into SQLite.
- **Reporting Regex Assertions (`TC_FR16_19`, `TC_FR16_20`):**
  - `expectSuccessCount` and `expectErrorCount` look for specific English/Vietnamese regex patterns. SUT message format (`"Import hoàn tất: X/Y sản phẩm được thêm"`) and `errors` list structure may not match expected regex structures.

---

## 8. State / Isolation Risks
- **Database Pollution on Partial Imports:**
  - Because backend does not execute transactions atomically, tests with partial errors (`TC_FR16_16`, `TC_FR16_17`, `TC_FR16_18`, `TC_FR16_20`) insert records into SQLite `products` table without rollback.
- **Local Disk Artifacts:**
  - CSV files created in `test-data/fr16/` remain on disk across test executions without cleanup.

---

## 9. Implementation Assumptions
- Script assumes Web Admin operates standard URL routes `/login`, `/admin/import-products`, and `/admin/products`.
- Script assumes frontend and backend implement SRS requirements (RFC 4180 parsing, strict CSV header verification, file type filtering, atomic transaction rollback, `price > 0` validation).
- Script assumes standard CSS alert class conventions (`.alert-success`, `.alert-danger`, `[role="alert"]`).

---

## 10. Relevant ZenAI Evidence
- **Report Reference:** `automation/results/result.json` and `automation/results/ai-failures/all-failures.md`.
- **Metrics Summary:**
  - Total Tests: 60 (20 TCs × 3 browsers: Chromium, Firefox, WebKit)
  - Passed: 0 ✅
  - Failed: 57 ❌ (Timeout waiting for login inputs)
  - Skipped: 3 ⏭️ (`TC_FR16_02` skipped across Chromium, Firefox, WebKit due to missing `NON_ADMIN_EMAIL` / `NON_ADMIN_PASSWORD` env vars)
  - Duration: 126.34s
- **Primary Failure Root Cause in Baseline Execution:**
  - 100% of non-skipped tests timed out at `fillLoginForm` (`automation/tests/fr16.spec.ts:136:28`) waiting for `locator('input[type="email"], input[name="email"], input[name="username"]').first()`.

---

## 11. Issue Traceability (TC → Problem → Evidence → Diagnosis)

### Issue 1: Authentication / Navigation Failure Blocks All Tests
- **TC:** `TC_FR16_01`, `TC_FR16_03` – `TC_FR16_20`
- **Problem:** All tests fail at the initial login step with timeout.
- **Evidence:**
  - `automation/results/ai-failures/all-failures.md:12-188`
  - `automation/tests/fr16.spec.ts:136`
  - `Error: expect(locator).toBeVisible() failed - Locator: locator('input[type="email"], input[name="email"], input[name="username"]').first() (Timeout 5000ms)`
- **Diagnosis:** The test suite attempts to navigate to `http://localhost:5174/login` and fill an email input. Web Admin is structured as a single-page app (`frontend-admin/src/App.jsx`), causing the login locator to timeout.

---

### Issue 2: Non-Admin Test Skipped Due to Missing Credentials
- **TC:** `TC_FR16_02`
- **Problem:** Test is skipped in all browser runs.
- **Evidence:**
  - `automation/tests/fr16.spec.ts:176-184` (`test.skip(true, 'Non-admin credentials are not provided.')`)
  - `automation/results/ai-failures/all-failures.md:7` (Skipped: 3)
- **Diagnosis:** `NON_ADMIN_EMAIL` and `NON_ADMIN_PASSWORD` environment variables are undefined, and no default non-admin account is configured in the test script.

---

### Issue 3: Result Alert Selectors Incompatible with SUT DOM
- **TC:** `TC_FR16_03`, `TC_FR16_04`, `TC_FR16_05`, `TC_FR16_06`, `TC_FR16_07`, `TC_FR16_08`, `TC_FR16_09`, `TC_FR16_10`, `TC_FR16_11`, `TC_FR16_12`, `TC_FR16_13`, `TC_FR16_14`, `TC_FR16_15`, `TC_FR16_16`, `TC_FR16_17`, `TC_FR16_18`, `TC_FR16_19`, `TC_FR16_20`
- **Problem:** Generic alert locators (`.alert`, `[role="alert"]`, `.error`, `.success`) will fail to find SUT feedback containers.
- **Evidence:**
  - `automation/tests/fr16.spec.ts:272-296`
  - `frontend-admin/src/App.jsx:459-480` (`div` with class `p-3 rounded mb-4 bg-green-100 text-green-800` or `bg-red-100 text-red-800`)
- **Diagnosis:** SUT uses Tailwind utility classes for status banners rather than semantic `.alert` classes or ARIA roles.

---

### Issue 4: SUT Implementation Gaps vs SRS Requirements
- **TC:** `TC_FR16_04`, `TC_FR16_06`, `TC_FR16_07`, `TC_FR16_08`, `TC_FR16_12`, `TC_FR16_14`, `TC_FR16_15`, `TC_FR16_16`, `TC_FR16_17`, `TC_FR16_18`, `TC_FR16_20`
- **Problem:** Tests will fail against the current SUT codebase due to known implementation bugs identified in SUT audit.
- **Evidence:**
  - `docs/AI_Audit/FR16/02_implementation_evidence.md:137-154`
  - `docs/AI_Audit/FR-16_Extract.md:133-141` (`B_FR16_01`, `B_FR16_02`, `B_FR16_03`, `B_FR16_04`)
  - `backend/server.js:213-232` (No transaction rollback, no price validation)
  - `frontend-admin/src/App.jsx:356-384` (No file extension check, CSV split by comma breaking RFC 4180)
- **Diagnosis:** SUT has implementation deviations from SRS (lack of rollback, missing price validation, non-RFC 4180 CSV parsing, lack of extension validation) which will trigger assertion failures once navigation/auth blockers are resolved.
