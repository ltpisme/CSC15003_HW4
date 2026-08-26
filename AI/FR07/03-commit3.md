# FR-07 Commit 3 Report: Test Defect Corrections & Run 2 Failure Analysis

## 1. Explicit Confirmation of File Modification
- **Modified Test Suite**: `automation/tests/fr07.spec.ts` was successfully modified.
- **External Data Preserved**: `automation/data/fr07-data.json` remains properly configured and linked.

---

## 2. Failure Classification & Audit Summary (Run 2 Evidence)

All 26 test cases have been evaluated against ZenAI Run 2 test results (`automation/results/result.json` & `automation/results/ai-failures/`):

| Test Case ID | Test Objective | Run 2 Result | Classification | Justification / Root Cause | Action Taken |
|---|---|---|---|---|---|
| `TC_FR07_01` | Hiển thị Empty State khi giỏ hàng trống | **PASS** | `N/A` | Working as expected | Preserved |
| `TC_FR07_02` | Nút Tiếp tục mua sắm từ Empty State | **PASS** | `N/A` | Working as expected | Preserved |
| `TC_FR07_03` | Hiển thị giỏ hàng có sản phẩm | **FAIL** | `APPLICATION_DEFECT` | SUT displays `"Tổng tạm tính:"` instead of SRS `"Tổng cộng"` (`README.md:99`, `Cart.jsx:63`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_04` | Cấu trúc các cột của giỏ hàng | **FAIL** | `APPLICATION_DEFECT` | SUT renders table column `"Giá"` instead of SRS `"Đơn giá"` (`README.md:95`, `Cart.jsx:36`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_05` | Nhãn tổng tiền là Tổng cộng | **FAIL** | `APPLICATION_DEFECT` | SUT renders `"Tổng tạm tính:"` instead of `"Tổng cộng"` (`Cart.jsx:63`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_06` | Kiểm tra định dạng tiền tệ | **PASS** | `N/A` | Working as expected | Preserved |
| `TC_FR07_07` | Thêm sản phẩm chưa tồn tại vào giỏ | **PASS** | `N/A` | Working as expected | Preserved |
| `TC_FR07_08` | Thêm cùng sản phẩm lần thứ hai cộng dồn | **FAIL** | `APPLICATION_DEFECT` | SUT duplicates row instead of accumulating quantity (`B_FR07_01`, `CartContext.jsx:9`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_09` | Thêm sản phẩm với số lượng bằng 1 (LB) | **PASS** | `N/A` | Working as expected | Preserved |
| `TC_FR07_10` | Thêm sản phẩm với số lượng bằng 2 (LB+1) | **PASS** | `N/A` | Working as expected | Preserved |
| `TC_FR07_11` | Không cho thêm sản phẩm với số lượng = 0 | **FAIL** | `APPLICATION_DEFECT` | SUT allows Q=0 to be added without validation (`B_FR07_06`, `ProductDetail.jsx:27`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_12` | Không cho thêm sản phẩm với số lượng âm | **FAIL** | `APPLICATION_DEFECT` | SUT allows Q=-5 to be added without validation (`B_FR07_03`, `ProductDetail.jsx:27`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_13` | Không chấp nhận số lượng thập phân | **PASS** | `N/A` | Working as expected (truncated via `parseInt`) | Preserved |
| `TC_FR07_14` | Tăng số lượng bằng nút `+` | **FAIL** | `APPLICATION_DEFECT` | SUT cart table lacks `+` interactive button (`README.md:95`, `Cart.jsx:47`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_15` | Giảm số lượng bằng nút `-` | **FAIL** | `APPLICATION_DEFECT` | SUT cart table lacks `-` interactive button (`README.md:95`, `Cart.jsx:47`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_16` | Không cho giảm quantity xuống dưới 1 | **FAIL** | `APPLICATION_DEFECT` | SUT cart table lacks `-` interactive button (`README.md:95`, `Cart.jsx:47`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_17` | Xóa sản phẩm và xác nhận | **FAIL** | `APPLICATION_DEFECT` | SUT deletes instantly without confirmation modal dialog (`B_FR07_04`, `Cart.jsx:50-55`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_18` | Xóa sản phẩm và hủy xác nhận | **FAIL** | `APPLICATION_DEFECT` | SUT deletes instantly without confirmation modal dialog (`B_FR07_05`, `Cart.jsx:50-55`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_19` | Xóa item cuối cùng chuyển sang Empty State | **PASS** | `N/A` | Working as expected | Preserved |
| `TC_FR07_20` | Badge số lượng trên Navbar | **FAIL** | `APPLICATION_DEFECT` | SUT Navbar lacks cart count badge (`README.md:261`, `App.jsx:23`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_21` | Breadcrumb của trang Giỏ hàng | **FAIL** | `APPLICATION_DEFECT` | SUT Cart page lacks breadcrumb navigation (`README.md:263`, `Cart.jsx`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_22` | Trang Giỏ hàng có đúng một `<h1>` | **FAIL** | `APPLICATION_DEFECT` | SUT Cart page uses `<h2>Giỏ Hàng</h2>` and has 0 `<h1>` tags (`README.md:81`, `Cart.jsx:31`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_23` | Có phản hồi trực quan sau khi thêm vào giỏ | **FAIL** | `TEST_DEFECT` | Scoped button locator `getByRole('button', { name: /Thêm vào giỏ/i })` failed to find button once its accessible name dynamically changed to `"Đã thêm"` | **Fixed** |
| `TC_FR07_24` | Giao diện FR-07 sử dụng tiếng Việt | **FAIL** | `APPLICATION_DEFECT` | SUT uses `"Giá"` and `"Tổng tạm tính:"` instead of `"Đơn giá"` and `"Tổng cộng"` | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_25` | Màu nút hành động và nút nguy hiểm | **PASS** | `N/A` | Successfully verified in Run 2 following Commit 2 fix | Preserved |
| `TC_FR07_26` | Tab Order trên trang Giỏ hàng | **PASS** | `N/A` | Working as expected | Preserved |

---

## 3. Detailed Code Modifications (TEST_DEFECT Fixes)

### TC_FR07_23: Visual Feedback on Add-to-Cart
- **TC**: `TC_FR07_23 - Có phản hồi trực quan sau khi thêm vào giỏ`
- **Run 2 Evidence**:
  ```text
  Error: expect(received).toBeTruthy()
  Received: false
  Snippet:
    884 | const hasButtonFeedback = buttonText.includes('Đã thêm');
  > 886 | expect(hasToast || hasBadge || hasButtonFeedback).toBeTruthy();
  ```
- **Diagnosis**: 
  - On `ProductDetail.jsx:21-31`, clicking the add button a second time sets `added = true`, which dynamically updates the button text from `"Thêm vào giỏ hàng"` to `"Đã thêm"` for 2000ms.
  - In `TC_FR07_23`, `addButton` was defined as `page.getByRole('button', { name: new RegExp(`${labels.addToCartButton}|Thêm vào giỏ`, 'i') })`.
  - When `const buttonText = await addButton.innerText().catch(() => '')` executed, Playwright re-evaluated the locator looking strictly for an element matching `/Thêm vào giỏ hàng|Thêm vào giỏ/i`. Because the button's accessible name had transformed to `"Đã thêm"`, the selector failed to match, timed out, and returned `''` via `.catch()`. Consequently, `hasButtonFeedback` resolved to `false`.
- **Root Cause**: Test defect due to an over-constrained locator that assumed the button name would still match `"Thêm vào giỏ hàng"` after the dynamic state update to `"Đã thêm"`.
- **Change**: Updated `TC_FR07_23` to evaluate dynamic feedback using `feedbackButton` with composite matching (`name: /Thêm vào giỏ hàng|Thêm vào giỏ|Đã thêm/i`) and fallback to direct visibility check `page.getByText(/Đã thêm/i).isVisible()`, accurately detecting the visual feedback state transition.

---

## 4. Regression Analysis for Commit 2

- **Commit 2 Impact Verification**:
  - `TC_FR07_25` (Danger button color inspection): Successfully moved from **FAIL** in Run 1 to **PASS** in Run 2.
  - No previously passing tests (`TC_FR07_01`, `TC_FR07_02`, `TC_FR07_06`, `TC_FR07_07`, `TC_FR07_09`, `TC_FR07_10`, `TC_FR07_13`, `TC_FR07_19`, `TC_FR07_26`) regressed.
  - **Regressions Introduced**: **0**.

---

## 5. Preserved Constraints & Standards

- **Minimum 12 Test Cases**: Maintained **26 test cases** (`TC_FR07_01` to `TC_FR07_26`).
- **All Test Case IDs**: Preserved exact IDs and titles.
- **External Test Data**: `automation/data/fr07-data.json` maintained with full parameterization.
- **Assertion Patterns (Minimum 3)**:
  1. `toBeVisible()` / `not.toBeVisible()` (Element visibility & absence)
  2. `toContainText()` / `toMatch()` / `toContain()` (Text & regex matching)
  3. `toHaveCount()` (DOM count matching)
  4. `toHaveURL()` (Navigation URL matching)
  5. `expect.poll()` / `toBe()` / `toBeTruthy()` / Computed RGB evaluation (State polling, bounds, visual styling)
- **Requirement Traceability**: Fully traced back to `README.md` (FR-07, FR-21 to FR-24) and `docs/AI_Audit/FR-07_Extract.md`.

---

## 6. Unresolved Issues (Legitimate Application Defects)

The following 11 SUT defects remain strictly asserted by the test suite as `APPLICATION_DEFECT`:
1. `B_FR07_01`: Adding the same product twice creates duplicate table rows instead of accumulating quantity (`TC_FR07_08`).
2. `B_FR07_03`: Negative quantity (`-5`) is accepted without error (`TC_FR07_12`).
3. `B_FR07_04`: Deleting a product removes it immediately without confirmation dialog (`TC_FR07_17`).
4. `B_FR07_05`: Inability to cancel deletion due to missing confirmation dialog (`TC_FR07_18`).
5. `B_FR07_06`: Quantity `0` is accepted without validation error (`TC_FR07_11`).
6. `SUT-COL-01`: Cart table column displays `"Giá"` instead of `"Đơn giá"` (`TC_FR07_04`, `TC_FR07_24`).
7. `SUT-LBL-01`: Cart total label displays `"Tổng tạm tính:"` instead of `"Tổng cộng"` (`TC_FR07_03`, `TC_FR07_05`, `TC_FR07_24`).
8. `SUT-BTN-01`: Cart table lacks interactive `+` / `-` quantity adjustment buttons (`TC_FR07_14`, `TC_FR07_15`, `TC_FR07_16`).
9. `SUT-NAV-01`: Missing Navbar cart count badge (`TC_FR07_20`).
10. `SUT-NAV-02`: Missing Breadcrumb navigation on Cart page (`TC_FR07_21`).
11. `SUT-A11Y-01`: Cart page uses `<h2>Giỏ Hàng</h2>` and has 0 `<h1>` tags (`TC_FR07_22`).

---

## 7. Insufficient Evidence / Environment Issues
- **Insufficient Evidence**: None. All behaviors are corroborated by application source inspection (`frontend-web/` and `backend/`) and test reports.
- **Environment Issues**: None.
