import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

const HOME_URL = `${BASE_URL}/`;
const CART_URL = `${BASE_URL}/cart`;

const PRODUCT_NAME = 'iPhone 15 Pro Max';
const PRODUCT_PRICE = 30_000_000;

const VALID_QUANTITY = 3;
const MIN_QUANTITY = 1;
const MIN_QUANTITY_PLUS_ONE = 2;
const ZERO_QUANTITY = 0;
const NEGATIVE_QUANTITY = -5;
const DECIMAL_QUANTITY = 1.5;

/**
 * Navigate to the home page and wait until the page is ready.
 */
async function openHomePage(page: Page) {
  await page.goto(HOME_URL);
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Navigate to the cart page and wait until the page is ready.
 */
async function openCartPage(page: Page) {
  await page.goto(CART_URL);
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Open the product detail page.
 *
 * The current test plan uses iPhone 15 Pro Max as representative
 * product data.
 */
async function openProductPage(page: Page) {
  await openHomePage(page);

  const productLink = page.getByRole('link', {
    name: new RegExp(PRODUCT_NAME, 'i'),
  }).first();

  await expect(productLink).toBeVisible();
  await productLink.click();

  await page.waitForLoadState('domcontentloaded');
}

/**
 * Locate the product quantity input on the product detail page.
 */
function productQuantityInput(page: Page) {
  return page.locator(
    'input[type="number"], input[name="quantity"]'
  ).first();
}

/**
 * Locate the cart row containing the specified product.
 */
function productCartRow(
  page: Page,
  productName = PRODUCT_NAME
) {
  return page.locator(
    'tr, .cart-item, [data-testid="cart-item"]'
  ).filter({
    hasText: productName,
  }).first();
}

/**
 * Locate the cart badge.
 *
 * The helper supports common implementations without depending
 * on a single CSS class.
 */
function cartBadge(page: Page) {
  return page.locator(
    '[data-testid="cart-badge"], .cart-badge, .badge'
  ).first();
}

/**
 * Locate the empty-cart state.
 */
function emptyCartState(page: Page) {
  return page.locator(
    '[data-testid="empty-cart"], .empty-cart, .empty-state'
  ).first();
}

/**
 * Locate the delete confirmation dialog.
 */
function deleteDialog(page: Page) {
  return page.getByRole('dialog').first();
}

/**
 * Add the representative product to the cart.
 */
async function addProduct(
  page: Page,
  quantity: number
) {
  await openProductPage(page);

  const quantityInput = productQuantityInput(page);

  await expect(quantityInput).toBeVisible();
  await quantityInput.fill(String(quantity));

  const addButton = page.getByRole('button', {
    name: /Thêm vào giỏ hàng/i,
  });

  await expect(addButton).toBeVisible();
  await addButton.click();
}

/**
 * Open the cart through the navbar.
 */
async function openCartFromNavbar(page: Page) {
  const cartLink = page.getByRole('link', {
    name: /Giỏ hàng/i,
  }).first();

  await expect(cartLink).toBeVisible();
  await cartLink.click();

  await page.waitForLoadState('domcontentloaded');
}

/**
 * Get the quantity displayed for a product in the cart.
 */
async function getCartQuantity(
  page: Page,
  productName = PRODUCT_NAME
) {
  const row = productCartRow(page, productName);

  await expect(row).toBeVisible();

  const quantityInput = row.locator(
    'input[type="number"], input[name="quantity"]'
  ).first();

  if (await quantityInput.count() > 0) {
    return Number(await quantityInput.inputValue());
  }

  const quantityElement = row.locator(
    '[data-testid="quantity"], .quantity'
  ).first();

  await expect(quantityElement).toBeVisible();

  return Number(await quantityElement.innerText());
}

/**
 * Locate the total amount section.
 */
function cartTotal(page: Page) {
  return page.getByText(
    'Tổng cộng',
    { exact: true }
  ).last();
}

/**
 * Remove a product and confirm the deletion.
 *
 * The SRS requires a confirmation dialog before deletion.
 */
async function deleteProductAndConfirm(page: Page) {
  const row = productCartRow(page);

  await expect(row).toBeVisible();

  const deleteButton = row.getByRole('button', {
    name: /Xóa/i,
  });

  await expect(deleteButton).toBeVisible();

  await deleteButton.click();

  const dialog = deleteDialog(page);

  await expect(dialog).toBeVisible();

  const confirmButton = dialog.getByRole('button', {
    name: /Có|Đồng ý|Xác nhận/i,
  });

  await expect(confirmButton).toBeVisible();

  await confirmButton.click();
}

/* ============================================================
 * FR-07 - Shopping Cart
 * ========================================================== */

test.describe('FR-07 - Shopping Cart', () => {

  /* ============================================================
   * Empty State / Navigation
   * ========================================================== */

  test('TC_FR07_01 - Hiển thị Empty State khi giỏ hàng trống', async ({
    page,
  }) => {
    await openCartPage(page);

    const emptyState = emptyCartState(page);

    await expect(emptyState).toBeVisible();

    await expect(
      page.getByText(
        /giỏ hàng.*trống/i
      )
    ).toBeVisible();

    const illustration = emptyState.locator(
      'img, svg'
    ).first();

    await expect(illustration).toBeVisible();

    await expect(
      page.getByRole('link', {
        name: /Tiếp tục mua sắm/i,
      })
    ).toBeVisible();
  });

  test('TC_FR07_02 - Nút Tiếp tục mua sắm từ Empty State', async ({
    page,
  }) => {
    await openCartPage(page);

    const continueShopping = page.getByRole('link', {
      name: /Tiếp tục mua sắm/i,
    });

    await expect(continueShopping).toBeVisible();

    await continueShopping.click();

    await expect(page).toHaveURL(
      new RegExp(`${BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`)
    );
  });

  /* ============================================================
   * Cart Content / GUI
   * ========================================================== */

  test('TC_FR07_03 - Hiển thị giỏ hàng có sản phẩm', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    await expect(row).toBeVisible();

    await expect(row).toContainText(PRODUCT_NAME);
    await expect(row).toContainText('1');

    await expect(row).toContainText(
      /30[.,]?000[.,]?000/
    );

    await expect(
      page.getByText(
        'Tổng cộng',
        { exact: true }
      )
    ).toBeVisible();
  });

  test('TC_FR07_04 - Kiểm tra cấu trúc các cột của giỏ hàng', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY);
    await openCartFromNavbar(page);

    const columns = [
      'Sản phẩm',
      'Đơn giá',
      'Số lượng',
      'Thành tiền',
      'Thao tác',
    ];

    for (const column of columns) {
      await expect(
        page.getByText(
          column,
          { exact: true }
        )
      ).toBeVisible();
    }
  });

  test('TC_FR07_05 - Kiểm tra nhãn tổng tiền là Tổng cộng', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY);
    await openCartFromNavbar(page);

    await expect(
      page.getByText(
        'Tổng cộng',
        { exact: true }
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        'Tổng tạm tính',
        { exact: true }
      )
    ).not.toBeVisible();
  });

  test('TC_FR07_06 - Kiểm tra định dạng tiền tệ', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    const rowText = await row.innerText();

    /*
     * SRS requires:
     * - Vietnamese Dong symbol ₫
     * - Thousands separator
     */
    expect(rowText).toContain('₫');
    expect(rowText).toMatch(
      /\d{1,3}(?:[.,]\d{3})+/
    );

    const total = cartTotal(page);

    const totalText = await total.locator('..').innerText();

    expect(totalText).toContain('₫');
    expect(totalText).toMatch(
      /\d{1,3}(?:[.,]\d{3})+/
    );
  });

  /* ============================================================
   * Add Product
   * ========================================================== */

  test('TC_FR07_07 - Thêm sản phẩm chưa tồn tại vào giỏ', async ({
    page,
  }) => {
    await addProduct(page, VALID_QUANTITY);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    await expect(row).toBeVisible();
    await expect(row).toContainText(PRODUCT_NAME);

    expect(
      await getCartQuantity(page)
    ).toBe(VALID_QUANTITY);

    await expect(row).toContainText(
      /90[.,]?000[.,]?000/
    );
  });

  test('TC_FR07_08 - Thêm cùng sản phẩm lần thứ hai phải cộng dồn số lượng', async ({
    page,
  }) => {
    /*
     * First addition:
     * iPhone × 3
     */
    await addProduct(page, VALID_QUANTITY);
    await openCartFromNavbar(page);

    expect(
      await getCartQuantity(page)
    ).toBe(VALID_QUANTITY);

    /*
     * Second addition:
     * iPhone × 1
     */
    await openProductPage(page);

    const quantityInput = productQuantityInput(page);

    await quantityInput.fill('1');

    await page.getByRole('button', {
      name: /Thêm vào giỏ hàng/i,
    }).click();

    await openCartFromNavbar(page);

    /*
     * Expected:
     * iPhone × 4
     */
    expect(
      await getCartQuantity(page)
    ).toBe(4);

    /*
     * The same product must remain a single row.
     */
    const rows = page.locator(
      'tr, .cart-item, [data-testid="cart-item"]'
    ).filter({
      hasText: PRODUCT_NAME,
    });

    await expect(rows).toHaveCount(1);
  });

  /* ============================================================
   * Boundary Value Analysis
   * ========================================================== */

  test('TC_FR07_09 - Thêm sản phẩm với số lượng bằng 1', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY);
    await openCartFromNavbar(page);

    expect(
      await getCartQuantity(page)
    ).toBe(1);
  });

  test('TC_FR07_10 - Thêm sản phẩm với số lượng bằng 2', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY_PLUS_ONE);
    await openCartFromNavbar(page);

    expect(
      await getCartQuantity(page)
    ).toBe(2);
  });

  test('TC_FR07_11 - Không cho thêm sản phẩm với số lượng bằng 0', async ({
    page,
  }) => {
    await openProductPage(page);

    const quantityInput = productQuantityInput(page);

    await expect(quantityInput).toBeVisible();

    await quantityInput.fill(
      String(ZERO_QUANTITY)
    );

    await page.getByRole('button', {
      name: /Thêm vào giỏ hàng/i,
    }).click();

    /*
     * The implementation may use:
     * - HTML5 validation
     * - custom validation message
     * - input normalization
     *
     * But it must not successfully add quantity 0.
     */
    const validationMessage = page.locator(
      '[role="alert"], .error, .error-message, .alert'
    ).first();

    const hasValidationMessage =
      await validationMessage.count() > 0 &&
      await validationMessage.isVisible().catch(() => false);

    const isInvalid = await quantityInput.evaluate(
      (element) =>
        !(element as HTMLInputElement).validity.valid
    );

    const currentValue =
      await quantityInput.inputValue();

    expect(
      hasValidationMessage ||
      isInvalid ||
      currentValue !== String(ZERO_QUANTITY)
    ).toBeTruthy();
  });

  test('TC_FR07_12 - Không cho thêm sản phẩm với số lượng âm', async ({
    page,
  }) => {
    await openProductPage(page);

    const quantityInput = productQuantityInput(page);

    await expect(quantityInput).toBeVisible();

    await quantityInput.fill(
      String(NEGATIVE_QUANTITY)
    );

    await page.getByRole('button', {
      name: /Thêm vào giỏ hàng/i,
    }).click();

    const validationMessage = page.locator(
      '[role="alert"], .error, .error-message, .alert'
    ).first();

    const hasValidationMessage =
      await validationMessage.count() > 0 &&
      await validationMessage.isVisible().catch(() => false);

    const isInvalid = await quantityInput.evaluate(
      (element) =>
        !(element as HTMLInputElement).validity.valid
    );

    const currentValue =
      await quantityInput.inputValue();

    expect(
      hasValidationMessage ||
      isInvalid ||
      currentValue !== String(NEGATIVE_QUANTITY)
    ).toBeTruthy();
  });

  test('TC_FR07_13 - Không chấp nhận số lượng thập phân', async ({
    page,
  }) => {
    await openProductPage(page);

    const quantityInput = productQuantityInput(page);

    await expect(quantityInput).toBeVisible();

    await quantityInput.fill(
      String(DECIMAL_QUANTITY)
    );

    await page.getByRole('button', {
      name: /Thêm vào giỏ hàng/i,
    }).click();

    /*
     * The current SUT reportedly normalizes 1.5 to 1.
     * The regression requirement is that 1.5 must not be
     * silently accepted as quantity 1.
     */
    const validationMessage = page.locator(
      '[role="alert"], .error, .error-message, .alert'
    ).first();

    const hasValidationMessage =
      await validationMessage.count() > 0 &&
      await validationMessage.isVisible().catch(() => false);

    const isInvalid = await quantityInput.evaluate(
      (element) =>
        !(element as HTMLInputElement).validity.valid
    );

    const currentValue =
      await quantityInput.inputValue();

    expect(
      hasValidationMessage ||
      isInvalid ||
      currentValue !== String(MIN_QUANTITY)
    ).toBeTruthy();
  });

  /* ============================================================
   * Quantity + / -
   * ========================================================== */

  test('TC_FR07_14 - Tăng số lượng bằng nút +', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    expect(
      await getCartQuantity(page)
    ).toBe(1);

    const plusButton = row.getByRole('button', {
      name: /\+/i,
    });

    await expect(plusButton).toBeVisible();

    await plusButton.click();

    await expect.poll(
      () => getCartQuantity(page)
    ).toBe(2);

    await expect(row).toContainText(
      /60[.,]?000[.,]?000/
    );
  });

  test('TC_FR07_15 - Giảm số lượng bằng nút -', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY_PLUS_ONE);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    expect(
      await getCartQuantity(page)
    ).toBe(2);

    const minusButton = row.getByRole('button', {
      name: /-/i,
    });

    await expect(minusButton).toBeVisible();

    await minusButton.click();

    await expect.poll(
      () => getCartQuantity(page)
    ).toBe(1);

    await expect(row).toContainText(
      /30[.,]?000[.,]?000/
    );
  });

  test('TC_FR07_16 - Không cho giảm quantity xuống dưới 1', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    const minusButton = row.getByRole('button', {
      name: /-/i,
    });

    await expect(minusButton).toBeVisible();

    expect(
      await getCartQuantity(page)
    ).toBe(1);

    await minusButton.click();

    await page.waitForTimeout(300);

    /*
     * Quantity must never become 0 or negative.
     */
    expect(
      await getCartQuantity(page)
    ).toBeGreaterThanOrEqual(1);
  });

  /* ============================================================
   * Delete
   * ========================================================== */

  test('TC_FR07_17 - Xóa sản phẩm và xác nhận', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    await expect(row).toBeVisible();

    const deleteButton = row.getByRole('button', {
      name: /Xóa/i,
    });

    await expect(deleteButton).toBeVisible();

    await deleteButton.click();

    /*
     * Confirmation must appear before deletion.
     */
    const dialog = deleteDialog(page);

    await expect(dialog).toBeVisible();

    await expect(
      dialog.getByText(
        /xóa|xác nhận/i
      )
    ).toBeVisible();

    await dialog.getByRole('button', {
      name: /Có|Đồng ý|Xác nhận/i,
    }).click();

    await expect(row).not.toBeVisible();
  });

  test('TC_FR07_18 - Xóa sản phẩm và hủy xác nhận', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    await expect(row).toBeVisible();

    const quantityBefore =
      await getCartQuantity(page);

    const deleteButton = row.getByRole('button', {
      name: /Xóa/i,
    });

    await deleteButton.click();

    const dialog = deleteDialog(page);

    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', {
      name: /Không|Hủy|Cancel/i,
    }).click();

    await expect(dialog).not.toBeVisible();

    /*
     * Product and quantity must remain unchanged.
     */
    await expect(row).toBeVisible();

    expect(
      await getCartQuantity(page)
    ).toBe(quantityBefore);
  });

  test('TC_FR07_19 - Xóa item cuối cùng chuyển giỏ hàng sang Empty State', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY);
    await openCartFromNavbar(page);

    await deleteProductAndConfirm(page);

    await expect(
      page.getByText(
        /giỏ hàng.*trống/i
      )
    ).toBeVisible();

    await expect(
      emptyCartState(page)
    ).toBeVisible();

    const productRow = productCartRow(page);

    await expect(productRow).not.toBeVisible();
  });

  /* ============================================================
   * Navbar / Breadcrumb / Feedback
   * ========================================================== */

  test('TC_FR07_20 - Badge số lượng trên Navbar', async ({
    page,
  }) => {
    await openHomePage(page);

    const cartLink = page.getByRole('link', {
      name: /Giỏ hàng/i,
    }).first();

    await expect(cartLink).toBeVisible();

    const badge = cartBadge(page);

    await expect(badge).toBeVisible();

    await addProduct(page, MIN_QUANTITY);

    await openHomePage(page);

    await expect(badge).toContainText('1');

    /*
     * Add the same product again with quantity 1.
     */
    await openProductPage(page);

    const quantityInput =
      productQuantityInput(page);

    await quantityInput.fill('1');

    await page.getByRole('button', {
      name: /Thêm vào giỏ hàng/i,
    }).click();

    await openHomePage(page);

    /*
     * The SRS requires the badge to reflect cart quantity.
     */
    await expect(badge).toContainText('2');
  });

  test('TC_FR07_21 - Breadcrumb của trang Giỏ hàng', async ({
    page,
  }) => {
    await openCartPage(page);

    const breadcrumb = page.locator(
      '[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]'
    ).first();

    await expect(breadcrumb).toBeVisible();

    await expect(
      breadcrumb
    ).toContainText(/Giỏ hàng/i);
  });

  test('TC_FR07_22 - Trang Giỏ hàng có đúng một h1', async ({
    page,
  }) => {
    await openCartPage(page);

    const h1 = page.locator('h1');

    await expect(h1).toHaveCount(1);

    await expect(h1.first()).toBeVisible();

    await expect(h1.first()).toContainText(
      /Giỏ hàng/i
    );
  });

  test('TC_FR07_23 - Có phản hồi trực quan sau khi thêm vào giỏ', async ({
    page,
  }) => {
    await openProductPage(page);

    const quantityInput =
      productQuantityInput(page);

    await quantityInput.fill(
      String(MIN_QUANTITY)
    );

    await page.getByRole('button', {
      name: /Thêm vào giỏ hàng/i,
    }).click();

    /*
     * SRS permits visual feedback such as:
     * - toast
     * - cart badge update
     * - equivalent visual feedback
     */
    const toast = page.locator(
      '[role="alert"], [data-testid="toast"], .toast'
    ).first();

    const badge = cartBadge(page);

    const hasToast =
      await toast.count() > 0 &&
      await toast.isVisible().catch(() => false);

    const hasBadge =
      await badge.count() > 0 &&
      await badge.isVisible().catch(() => false);

    expect(
      hasToast || hasBadge
    ).toBeTruthy();
  });

  /* ============================================================
   * GUI / Accessibility
   * ========================================================== */

  test('TC_FR07_24 - Giao diện FR-07 sử dụng tiếng Việt', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY);
    await openCartFromNavbar(page);

    const requiredTexts = [
      'Giỏ hàng',
      'Sản phẩm',
      'Đơn giá',
      'Số lượng',
      'Thành tiền',
      'Thao tác',
      'Tổng cộng',
    ];

    for (const text of requiredTexts) {
      await expect(
        page.getByText(
          text,
          { exact: true }
        )
      ).toBeVisible();
    }
  });

  test('TC_FR07_25 - Kiểm tra màu nút hành động và nút nguy hiểm', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    const deleteButton = row.getByRole('button', {
      name: /Xóa/i,
    });

    await expect(deleteButton).toBeVisible();

    const backgroundColor =
      await deleteButton.evaluate(
        (element) =>
          window.getComputedStyle(
            element
          ).backgroundColor
      );

    /*
     * SRS requires dangerous actions to use red.
     *
     * The exact hex value is not specified,
     * therefore avoid hard-coding one implementation color.
     */
    const rgbValues =
      backgroundColor.match(/\d+/g)?.map(Number);

    expect(rgbValues).toBeDefined();

    if (
      rgbValues &&
      rgbValues.length >= 3
    ) {
      const [red, green, blue] =
        rgbValues;

      expect(red).toBeGreaterThan(green);
      expect(red).toBeGreaterThan(blue);
    }
  });

  test('TC_FR07_26 - Tab Order trên trang Giỏ hàng', async ({
    page,
  }) => {
    await addProduct(page, MIN_QUANTITY);
    await openCartFromNavbar(page);

    /*
     * Collect focusable elements while moving through
     * the page using keyboard navigation.
     */
    const focusOrder: string[] = [];

    const maxTabs = 30;

    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');

      if (await focused.count() === 0) {
        break;
      }

      const description =
        await focused.evaluate(
          (element) => {
            const tag =
              element.tagName.toLowerCase();

            const ariaLabel =
              element.getAttribute(
                'aria-label'
              ) ?? '';

            const text =
              (
                element.textContent ?? ''
              )
                .trim()
                .replace(/\s+/g, ' ');

            return `${tag}:${ariaLabel || text}`
              .slice(0, 150);
          }
        );

      focusOrder.push(description);
    }

    /*
     * The page must contain keyboard-focusable
     * interactive elements.
     */
    expect(
      focusOrder.length
    ).toBeGreaterThan(0);

    /*
     * Focus should stay on interactive controls.
     */
    for (const element of focusOrder) {
      expect(element).toMatch(
        /^(a|button|input|select|textarea):/i
      );
    }
  });
});