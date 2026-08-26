# Baseline Audit: FR-07 Shopping Cart

## 1. Test Suite Summary

- **Test Case Count**: 26 test cases (`TC_FR07_01` through `TC_FR07_26`)
- **Test File**: `automation/tests/fr07.spec.ts`
- **Test Data Location**: Hardcoded constants in `automation/tests/fr07.spec.ts:8-17` (not externalized)
- **Baseline Execution Result (ZenAI)**: 1 passed (`TC_FR07_02`), 25 failed (75 failure runs across retries/workers in `automation/results/result.json`)

---

## 2. Test Case Inventory & Requirement Traceability

| Test Case ID | Test Objective | Requirement Source | Category / Technique | SUT Expected vs Actual |
|---|---|---|---|---|
| `TC_FR07_01` | Hiển thị Empty State khi giỏ hàng trống | `README.md:100, 269` | Functional / GUI | Expects empty-cart illustration/icon & container; SUT has text-only `div.text-center` |
| `TC_FR07_02` | Nút "Tiếp tục mua sắm" từ Empty State | `README.md:98` | Navigation | Click link → navigates to `/` (PASSED) |
| `TC_FR07_03` | Hiển thị giỏ hàng có sản phẩm | `README.md:95, 99` | Functional / UI | Displays product row, unit price, quantity, subtotal, "Tổng cộng" |
| `TC_FR07_04` | Kiểm tra cấu trúc các cột của giỏ hàng | `README.md:95` | UI Columns | Expects: "Sản phẩm", "Đơn giá", "Số lượng", "Thành tiền", "Thao tác" |
| `TC_FR07_05` | Kiểm tra nhãn tổng tiền là "Tổng cộng" | `README.md:99` | UI Label | Expects "Tổng cộng", not "Tổng tạm tính" (SUT displays "Tổng tạm tính:") |
| `TC_FR07_06` | Kiểm tra định dạng tiền tệ | `README.md:245-249` | UI Format | Expects `₫` symbol and thousands separators |
| `TC_FR07_07` | Thêm sản phẩm chưa tồn tại vào giỏ | `README.md:83-88, 95` | Functional | Adds product with Q=3; subtotal = 90,000,000 ₫ |
| `TC_FR07_08` | Thêm cùng sản phẩm lần thứ hai cộng dồn | `README.md:96` | Functional / Regression (`B_FR07_01`) | Must accumulate quantity in 1 row; SUT creates duplicate rows |
| `TC_FR07_09` | Thêm sản phẩm với số lượng bằng 1 | `README.md:86` | BVA (Lower Bound = 1) | Adds product with Q=1 successfully |
| `TC_FR07_10` | Thêm sản phẩm với số lượng bằng 2 | `README.md:86` | BVA (LB + 1 = 2) | Adds product with Q=2 successfully |
| `TC_FR07_11` | Không cho thêm sản phẩm với số lượng bằng 0 | `README.md:86` | Boundary / Negative (`B_FR07_06`) | Rejects Q=0; SUT allows Q=0 |
| `TC_FR07_12` | Không cho thêm sản phẩm với số lượng âm | `README.md:86` | Negative (`B_FR07_03`) | Rejects Q=-5; SUT allows negative quantity |
| `TC_FR07_13` | Không chấp nhận số lượng thập phân | `README.md:86` | Negative (`B_FR07_02`) | Rejects Q=1.5; SUT truncates to 1 via `parseInt` |
| `TC_FR07_14` | Tăng số lượng bằng nút `+` | `README.md:95` | Functional (`+` Modifier) | Increases Q: 1 → 2; SUT lacks `+` button |
| `TC_FR07_15` | Giảm số lượng bằng nút `-` | `README.md:95` | Functional (`-` Modifier) | Decreases Q: 2 → 1; SUT lacks `-` button |
| `TC_FR07_16` | Không cho giảm quantity xuống dưới 1 | `README.md:95` | Boundary | Bound Q $\ge 1$; SUT lacks `-` button |
| `TC_FR07_17` | Xóa sản phẩm và xác nhận | `README.md:97, 268` | Functional / Dialog (`B_FR07_04`) | Expects confirmation dialog before deletion; SUT deletes immediately |
| `TC_FR07_18` | Xóa sản phẩm và hủy xác nhận | `README.md:97, 268` | Functional / Dialog (`B_FR07_05`) | Cancels dialog → item retained; SUT deletes immediately |
| `TC_FR07_19` | Xóa item cuối cùng chuyển sang Empty State | `README.md:100, 269` | State Transition | Deleting last item transitions to Empty State |
| `TC_FR07_20` | Badge số lượng trên Navbar | `README.md:261` | UI / State | Navbar cart badge updates with quantity; SUT has no badge |
| `TC_FR07_21` | Breadcrumb của trang Giỏ hàng | `README.md:263` | Navigation / UI | Breadcrumb displays on `/cart`; SUT lacks breadcrumb |
| `TC_FR07_22` | Trang Giỏ hàng có đúng một `<h1>` | `README.md:81` | Accessibility / UI | Exactly one `<h1>`; SUT uses `<h2>Giỏ Hàng</h2>` |
| `TC_FR07_23` | Phản hồi trực quan sau khi thêm vào giỏ | `README.md:87, 267` | Feedback | Toast notification or badge change |
| `TC_FR07_24` | Giao diện FR-07 sử dụng tiếng Việt | GUI standard | UI Localization | Vietnamese strings present on Cart UI |
| `TC_FR07_25` | Màu nút hành động và nút nguy hiểm | GUI standard | Visual / UI | Red delete button (RGB red > green, blue) |
| `TC_FR07_26` | Tab Order trên trang Giỏ hàng | GUI standard | Accessibility | Focus moves across interactive elements |

---

## 3. Assertion Patterns

1. **Locator Visibility / Invisibility (`toBeVisible()`, `not.toBeVisible()`)**:
   - `expect(emptyState).toBeVisible()` (`TC_FR07_01`)
   - `expect(row).toBeVisible()` (`TC_FR07_03`, `TC_FR07_07`)
   - `expect(page.getByText('Tổng tạm tính', { exact: true })).not.toBeVisible()` (`TC_FR07_05`)
   - `expect(deleteButton).toBeVisible()` (`TC_FR07_17`, `TC_FR07_25`)
2. **Text / Substring / Regex Matchers (`toContainText()`, `toMatch()`, `toContain()`):**
   - `expect(row).toContainText(PRODUCT_NAME)` (`TC_FR07_03`)
   - `expect(row).toContainText(/30[.,]?000[.,]?000/)` (`TC_FR07_03`, `TC_FR07_15`)
   - `expect(rowText).toContain('₫')` & `expect(rowText).toMatch(/\d{1,3}(?:[.,]\d{3})+/)` (`TC_FR07_06`)
   - `expect(breadcrumb).toContainText(/Giỏ hàng/i)` (`TC_FR07_21`)
3. **Element Count Assertions (`toHaveCount()`):**
   - `expect(rows).toHaveCount(1)` (`TC_FR07_08`)
   - `expect(h1).toHaveCount(1)` (`TC_FR07_22`)
4. **URL Matching (`toHaveURL()`):**
   - `expect(page).toHaveURL(/.../$)` (`TC_FR07_02`)
5. **State / Poll / Functional Assertions (`expect.poll()`, `toBe()`, `toBeGreaterThanOrEqual()`, `evaluate()`):**
   - `expect.poll(() => getCartQuantity(page)).toBe(2)` (`TC_FR07_14`)
   - `expect(await getCartQuantity(page)).toBe(VALID_QUANTITY)` (`TC_FR07_07`)
   - `expect(focusOrder.length).toBeGreaterThan(0)` (`TC_FR07_26`)
   - Computed RGB evaluation for button colors (`TC_FR07_25`)

---

## 4. Issue Breakdown (TC → Problem → Evidence → Diagnosis)

### Issue 1: Product Link Navigation Failure in Helper (`openProductPage`)
- **TC**: `TC_FR07_03`, `TC_FR07_04`, `TC_FR07_05`, `TC_FR07_06`, `TC_FR07_07`, `TC_FR07_08`, `TC_FR07_09`, `TC_FR07_10`, `TC_FR07_11`, `TC_FR07_12`, `TC_FR07_13`, `TC_FR07_14`, `TC_FR07_15`, `TC_FR07_16`, `TC_FR07_17`, `TC_FR07_18`, `TC_FR07_19`, `TC_FR07_20`, `TC_FR07_23`, `TC_FR07_24`, `TC_FR07_25`, `TC_FR07_26`
- **Problem**: `openProductPage(page)` times out waiting for `getByRole('link', { name: /iPhone 15 Pro Max/i }).first()`.
- **Evidence**:
  - `automation/results/ai-failures/fr-07-shopping-cart-tc-fr07-03-hi-n-th-gi-h-ng-c-s-n-ph-m-9/report.md`:
    ```text
    Locator: getByRole('link', { name: /iPhone 15 Pro Max/i }).first()
    Expected: visible
    Timeout: 5000ms
    ```
  - `frontend-web/src/pages/Home.jsx:97-103`: Product items on Home page render as card structures; if product cards use direct navigation/button or differing accessible names, `getByRole('link', { name: ... })` fails to resolve.
- **Diagnosis**: Helper function `openProductPage` uses an overly rigid link locator that fails if the product card links do not match the exact regex accessible name, or if direct URL navigation (`/product/:id`) / resilient card selectors are needed.

### Issue 2: ProductDetail Add-to-Cart Double-Click Trap
- **TC**: `TC_FR07_03`, `TC_FR07_07`, `TC_FR07_08`, `TC_FR07_09`, `TC_FR07_10`, `TC_FR07_11`, `TC_FR07_12`, `TC_FR07_13`, `TC_FR07_14`, `TC_FR07_15`, `TC_FR07_16`, `TC_FR07_17`, `TC_FR07_18`, `TC_FR07_19`, `TC_FR07_20`, `TC_FR07_23`, `TC_FR07_24`, `TC_FR07_25`, `TC_FR07_26`
- **Problem**: Helper `addProduct()` only clicks "Thêm vào giỏ hàng" once, but SUT requires 2 consecutive clicks to trigger `addToCart()`.
- **Evidence**:
  - `frontend-web/src/pages/ProductDetail.jsx:21-31`:
    ```javascript
    const handleAddToCart = () => {
      if (clickCount === 0) {
        setClickCount(1);
        return; // Defect: first click does nothing!
      }
      addToCart(product, parseInt(quantity));
      setAdded(true);
      setClickCount(0);
    };
    ```
- **Diagnosis**: The helper in `fr07.spec.ts:123` executes `await addButton.click()` only once, leaving `clickCount === 1` without actually adding the item to the cart. Consequently, the cart remains empty when navigating to `/cart`.

### Issue 3: Missing Empty State Selectors & Illustration
- **TC**: `TC_FR07_01`
- **Problem**: Locator `locator('[data-testid="empty-cart"], .empty-cart, .empty-state')` times out.
- **Evidence**:
  - `automation/results/ai-failures/fr-07-shopping-cart-tc-fr07-01-hi-n-th-empty-state-khi-gi-h-ng-tr-ng-3/report.md`:
    ```text
    Locator: locator('[data-testid="empty-cart"], .empty-cart, .empty-state').first()
    Expected: visible
    Timeout: 5000ms
    ```
  - `frontend-web/src/pages/Cart.jsx:20-27`:
    ```jsx
    if (cart.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
          <Link to="/" className="text-blue-500 hover:underline">Tiếp tục mua sắm</Link>
        </div>
      );
    }
    ```
- **Diagnosis**: SUT renders a plain `div.text-center` with no `data-testid`, no `.empty-cart` class, and no `<img>` or `<svg>` illustration. The test asserts implementation details not present in the DOM.

### Issue 4: Missing Breadcrumb Component
- **TC**: `TC_FR07_21`
- **Problem**: Locator `locator('[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]')` times out.
- **Evidence**:
  - `automation/results/ai-failures/fr-07-shopping-cart-tc-fr07-21-breadcrumb-c-a-trang-gi-h-ng-60/report.md`:
    ```text
    Locator: locator('[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]').first()
    Expected: visible
    Timeout: 5000ms
    ```
  - `frontend-web/src/pages/Cart.jsx:1-80`: No breadcrumb navigation element is rendered in `Cart.jsx`.
- **Diagnosis**: SUT defect — Cart page omits breadcrumb navigation specified in `README.md:263`.

### Issue 5: Heading Tag Mismatch (`h2` vs `h1`)
- **TC**: `TC_FR07_22`
- **Problem**: `expect(locator('h1')).toHaveCount(1)` receives 0.
- **Evidence**:
  - `automation/results/ai-failures/fr-07-shopping-cart-tc-fr07-22-trang-gi-h-ng-c-ng-m-t-h1-63/report.md`:
    ```text
    Locator: locator('h1')
    Expected: 1
    Received: 0
    ```
  - `frontend-web/src/pages/Cart.jsx:31`: SUT uses `<h2 className="text-2xl font-bold mb-6">Giỏ Hàng</h2>` instead of `<h1>`.
- **Diagnosis**: SUT defect — Cart page uses `<h2>` instead of the mandatory single `<h1>` (`README.md:81`).

### Issue 6: Missing Quantity Modifiers (`+` / `-`) on Cart Table
- **TC**: `TC_FR07_14`, `TC_FR07_15`, `TC_FR07_16`
- **Problem**: Tests look for `row.getByRole('button', { name: /\+/i })` and `row.getByRole('button', { name: /-/i })`, which do not exist.
- **Evidence**:
  - `frontend-web/src/pages/Cart.jsx:47`: `<td className="p-2">{item.quantity}</td>` renders static text without modification buttons.
- **Diagnosis**: SUT defect — Cart view lacks `+` / `-` interactive quantity adjustment buttons specified in `README.md:95`.

### Issue 7: Instant Deletion Without Confirmation Dialog
- **TC**: `TC_FR07_17`, `TC_FR07_18`
- **Problem**: Tests assert `deleteDialog(page).toBeVisible()`, but SUT deletes immediately without prompting.
- **Evidence**:
  - `frontend-web/src/pages/Cart.jsx:50-55`:
    ```jsx
    <button onClick={() => removeFromCart(index)} className="text-red-500 hover:underline">
      Xóa
    </button>
    ```
- **Diagnosis**: SUT defects `B_FR07_04` and `B_FR07_05` — `Cart.jsx` directly calls `removeFromCart(index)` without any modal/confirm dialog.

### Issue 8: Non-Accumulating Duplicate Rows for Same Product
- **TC**: `TC_FR07_08`
- **Problem**: Tests assert `rows.toHaveCount(1)` after adding the same product twice, but SUT creates 2 rows.
- **Evidence**:
  - `frontend-web/src/context/CartContext.jsx:8-10`:
    ```javascript
    const addToCart = (product, quantity) => {
      setCart([...cart, { ...product, quantity }]);
    };
    ```
- **Diagnosis**: SUT defect `B_FR07_01` — `addToCart` unconditionally appends items to array without checking matching `product.id`.

### Issue 9: Total Label is "Tổng tạm tính:" Instead of "Tổng cộng"
- **TC**: `TC_FR07_05`, `TC_FR07_03`
- **Problem**: UI displays `"Tổng tạm tính:"` rather than `"Tổng cộng"`.
- **Evidence**:
  - `frontend-web/src/pages/Cart.jsx:63`: `<div className="text-xl font-bold">Tổng tạm tính: <span ...>{cartTotal.toLocaleString()} ₫</span></div>`.
- **Diagnosis**: SUT defect — Non-compliance with exact SRS label requirement (`README.md:99`).

### Issue 10: Missing Navbar Cart Badge
- **TC**: `TC_FR07_20`, `TC_FR07_23`
- **Problem**: Tests search for `[data-testid="cart-badge"], .cart-badge, .badge` in navbar.
- **Evidence**:
  - `frontend-web/src/App.jsx:23`: `<Link to="/cart">Giỏ hàng</Link>` contains no badge element.
- **Diagnosis**: SUT defect — Navbar link does not display item count badge (`README.md:261`).

---

## 5. Risks & Limitations

1. **Selector Fragility**:
   - Helper locators depend on specific container classes (`.empty-cart`, `.badge`, `.breadcrumb`) that do not exist in the Tailwind CSS codebase.
   - `openProductPage` relies on regex matching for product links which can break if the card markup structure changes.
2. **State & Isolation**:
   - Cart data resides entirely in React memory (`CartContext`); browser reload (F5) purges all items.
   - Tests performing page reloads will inadvertently reset the cart to empty.
3. **Data Hardcoding**:
   - Test data (`iPhone 15 Pro Max`, prices, quantities) is hardcoded inside the spec file rather than externalized in JSON.
