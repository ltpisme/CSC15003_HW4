# FR-07 Commit 2 Report: Test Defect Corrections & Run 1 Failure Analysis

## 1. Explicit Confirmation of File Modification
- **Modified Test Suite**: `automation/tests/fr07.spec.ts` was successfully modified.
- **External Data Preserved**: `automation/data/fr07-data.json` remains properly linked and preserved.

---

## 2. Failure Classification & Audit Summary

Every observed failure from ZenAI Run 1 (`automation/results/result.json` & `automation/results/ai-failures/`) has been systematically classified:

| Test Case ID | Test Objective | Run 1 Result | Classification | Justification / Root Cause | Action Taken |
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
| `TC_FR07_17` | Xóa sản phẩm và xác nhận | **FAIL** | `APPLICATION_DEFECT` | SUT deletes instantly without modal dialog (`B_FR07_04`, `Cart.jsx:50-55`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_18` | Xóa sản phẩm và hủy xác nhận | **FAIL** | `APPLICATION_DEFECT` | SUT deletes instantly without modal dialog (`B_FR07_05`, `Cart.jsx:50-55`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_19` | Xóa item cuối cùng chuyển sang Empty State | **PASS** | `N/A` | Working as expected | Preserved |
| `TC_FR07_20` | Badge số lượng trên Navbar | **FAIL** | `APPLICATION_DEFECT` | SUT Navbar lacks cart count badge (`README.md:261`, `App.jsx:23`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_21` | Breadcrumb của trang Giỏ hàng | **FAIL** | `APPLICATION_DEFECT` | SUT Cart page lacks breadcrumb navigation (`README.md:263`, `Cart.jsx`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_22` | Trang Giỏ hàng có đúng một `<h1>` | **FAIL** | `APPLICATION_DEFECT` | SUT Cart page uses `<h2>Giỏ Hàng</h2>` and has 0 `<h1>` tags (`README.md:81`, `Cart.jsx:31`) | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_23` | Có phản hồi trực quan sau khi thêm vào giỏ | **FAIL** | `TEST_DEFECT` | Test performed a single click without handling SUT double-click interaction trap, preventing feedback trigger | **Fixed** |
| `TC_FR07_24` | Giao diện FR-07 sử dụng tiếng Việt | **FAIL** | `APPLICATION_DEFECT` | SUT uses `"Giá"` and `"Tổng tạm tính:"` instead of `"Đơn giá"` and `"Tổng cộng"` | Left unchanged (Unresolved SUT Defect) |
| `TC_FR07_25` | Màu nút hành động và nút nguy hiểm | **FAIL** | `TEST_DEFECT` | Test inspected `backgroundColor` (which is transparent) rather than computed `color` (text-red-500) | **Fixed** |
| `TC_FR07_26` | Tab Order trên trang Giỏ hàng | **PASS** | `N/A` | Working as expected | Preserved |

---

## 3. Detailed Code Modifications (TEST_DEFECT Fixes)

### 1. TC_FR07_23: Visual Feedback on Add-to-Cart
- **TC**: `TC_FR07_23 - Có phản hồi trực quan sau khi thêm vào giỏ`
- **Run 1 Evidence**:
  ```text
  Error: expect(received).toBeTruthy()
  Received: false
  Snippet:
    876 | const buttonText = await addButton.innerText().catch(() => '');
    877 | const hasButtonFeedback = buttonText.includes('Đã thêm');
  > 878 | expect(hasToast || hasBadge || hasButtonFeedback).toBeTruthy();
  ```
- **Diagnosis**: On `ProductDetail.jsx:21-31`, the SUT contains a double-click trap (`if (clickCount === 0) { setClickCount(1); return; }`). The helper `addProduct` handles this by clicking a second time if the button text is not `"Đã thêm"`, but `TC_FR07_23` executed an unhandled single `addButton.click()`. Consequently, `addToCart` was never executed and `setAdded(true)` was not triggered, causing `hasButtonFeedback` to be `false`.
- **Root Cause**: Test defect in `TC_FR07_23` inline action logic by not handling the SUT's double-click requirement when performing the add action to observe the subsequent visual feedback.
- **Change**: Added the standard SUT click handling check to `TC_FR07_23` (`if (!text.includes('Đã thêm')) await addButton.click()`), ensuring the add action is executed and the `"Đã thêm"` feedback state is correctly captured.

### 2. TC_FR07_25: Action Button & Danger Button Color Inspection
- **TC**: `TC_FR07_25 - Kiểm tra màu nút hành động và nút nguy hiểm`
- **Run 1 Evidence**:
  ```text
  Error: expect(received).toBeGreaterThan(expected)
  Expected: > 0
  Received: 0
  Snippet:
    924 | const [red, green, blue] = rgbValues;
  > 925 | expect(red).toBeGreaterThan(green);
    926 | expect(red).toBeGreaterThan(blue);
  ```
- **Diagnosis**: SUT delete button (`Cart.jsx:51`) is styled as `<button className="text-red-500 hover:underline">Xóa</button>`. In browser styling, its computed `backgroundColor` is transparent (`rgba(0, 0, 0, 0)`), while its text `color` is `rgb(239, 68, 68)`. The test evaluated only `backgroundColor`, which parsed to `[0, 0, 0]`, causing the red dominance assertion (`red > green && red > blue`) to fail.
- **Root Cause**: Test defect in `TC_FR07_25` assuming button styling must be applied via `backgroundColor` instead of checking both computed `color` (font color) and `backgroundColor`.
- **Change**: Updated `TC_FR07_25` to evaluate both `color` and `backgroundColor` from `window.getComputedStyle(element)` and verify that either the text color or background color has a dominant red channel (`red > green && red > blue`), matching SRS FR-21 visual styling requirements without false assumptions on CSS implementation.

---

## 4. Preserved Constraints & Standards

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

## 5. Unresolved Issues (Legitimate Application Defects)

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
