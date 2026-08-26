# Commit 1 Audit: FR-16 Data-Driven Testing Conversion

## 1. Explicit Confirmation of Modification
- File `automation/tests/fr16.spec.ts` was **modified**.
- External test data created at `automation/data/fr16-data.json`.

---

## 2. Data-Driven Changes
- **External Data Source:** Created `automation/data/fr16-data.json` storing all input rows, headers (`valid`, `missing`, `invalid`), filenames, regex patterns for error validation, target URLs, credentials, expected counts, and row templates.
- **Dynamic Parameterization:** Refactored all 20 test cases in `automation/tests/fr16.spec.ts` to source parameters directly from `testData`:
  - `TC_FR16_01` – `TC_FR16_02`: Credentials and target URLs extracted from `testData.credentials` and `testData.urls`.
  - `TC_FR16_03` – `TC_FR16_05`: Filenames, headers, and dynamic row prefix generation parameterization from `testData.testCases`.
  - `TC_FR16_06` – `TC_FR16_07`: Header schema inputs and dynamic regex matching strings from `testData.testCases`.
  - `TC_FR16_08` – `TC_FR16_09`: RFC 4180 parsing data strings and quoted/unquoted comma patterns from `testData.testCases`.
  - `TC_FR16_10` – `TC_FR16_15`: BVA and domain validation parameters (name length, empty name, price zero, price 0.01, price negative, non-numeric) from `testData.testCases`.
  - `TC_FR16_16` – `TC_FR16_18`: Multi-row rollback and atomic failure dataset templates from `testData.testCases`.
  - `TC_FR16_19` – `TC_FR16_20`: Reporting metrics (`expectedSuccessCount`, `expectedErrorCount`) and multi-pattern error assertion lists from `testData.testCases`.

---

## 3. Additional Evidence-Based Fixes

### Fix 1: Multi-Pattern Error Reason Assertions
- **TC:** `TC_FR16_18`, `TC_FR16_20`
- **Evidence:** `docs/AI_Audit/FR-16_TestPlan.md:440-446`, `docs/AI_Audit/FR-16_Extract.md:13` requiring multiple validation errors in a single file to all be reported with reasons.
- **Root Cause:** In the baseline script, multiple error assertions were manually repeated with hardcoded regex literals instead of iterating over data-driven expected patterns.
- **Code Change:** Iterated over `tcData.expectedReasonPatterns` array loaded from JSON to assert visibility of all expected validation error reasons.
- **Reason:** Ensures scalability and coverage of multi-error scenarios without hardcoded duplicate assertion logic.

---

## 4. Files Changed
- `[NEW]` [fr16-data.json](file:///home/ltp/Code/Course/Testing/HW/CSC15003_HW4/automation/data/fr16-data.json)
- `[MODIFY]` [fr16.spec.ts](file:///home/ltp/Code/Course/Testing/HW/CSC15003_HW4/automation/tests/fr16.spec.ts)

---

## 5. Test Count
- **Total Test Cases:** 20 (`TC_FR16_01` – `TC_FR16_20`)
- **Preserved Count:** 20 (100% preserved, exceeds minimum 12)

---

## 6. Assertion-Pattern Count
5 distinct assertion patterns preserved:
1. `expect(locator).toBeVisible()` / `not.toBeVisible()` (UI element visibility and exclusion)
2. `expect(locator).toBeAttached()` (DOM presence verification)
3. `expect(page).not.toHaveURL(regex)` (URL transition verification)
4. `expect(page.getByText(regex)).toBeVisible()` (Regex-based dynamic message & count verification)
5. `expect(page.getByText(exactName, { exact: true })).not.toBeVisible()` / `toBeVisible()` (Exact product record inventory verification)

---

## 7. Unresolved Issues
1. **Admin Navigation / Single-Page Tab Structure:**
   - Web Admin UI is implemented in `frontend-admin/src/App.jsx` as a tabbed interface (`activeTab === "products"`). Hardcoded route navigation (`/login`, `/admin/import-products`, `/admin/products`) may fail when executed against standard single-page app routing unless tab switching or SPA routing is addressed.
2. **SUT Implementation Bugs (Known SUT Deviations):**
   - No transaction rollback in `backend/server.js:213-232` (Partial import occurs instead of atomic rollback).
   - No file extension validation in `frontend-admin/src/App.jsx:356-384` (`.xlsx` accepted).
   - Non-RFC 4180 CSV parser (`line.split(",")`) breaking quoted strings with commas.
   - Missing `price > 0` validation in both frontend and backend.
3. **Missing Non-Admin Credentials:**
   - `TC_FR16_02` remains skipped when `NON_ADMIN_EMAIL` / `NON_ADMIN_PASSWORD` are not provided via environment.

---

## 8. Validation Status
- **Syntax & Schema Check:** Validated TypeScript syntax and JSON data schema matching `automation/tsconfig.json` (`resolveJsonModule: true`).
- **Playwright Execution:** Not executed (per instruction rule: *Do NOT run Playwright*).
