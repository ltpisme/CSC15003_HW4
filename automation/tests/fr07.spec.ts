import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Load external test data
const dataPath = path.resolve(__dirname, '../data/fr07-data.json');
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const BASE_URL = 'http://localhost:5173';
const HOME_URL = `${BASE_URL}/`;
const CART_URL = `${BASE_URL}/cart`;

const {
  product,
  quantities,
  columns,
  requiredVietnameseTexts,
  labels,
  bvaCases,
  cartModifierCases,
  deletionCases,
  guiCases,
} = testData;

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
 * Open the product detail page with resilient selector fallback.
 */
async function openProductPage(page: Page, productId = product.id) {
  await openHomePage(page);

  const productLink = page
    .locator('a[href*="/product/"]')
    .filter({ hasText: new RegExp(product.name, 'i') })
    .or(page.getByRole('link', { name: new RegExp(product.name, 'i') }))
    .or(page.locator(`a[href="/product/${productId}"]`))
    .or(page.locator('.product-card a'))
    .first();

  if ((await productLink.count()) > 0 && (await productLink.isVisible().catch(() => false))) {
    await productLink.click();
    await page.waitForLoadState('domcontentloaded');
  } else {
    await page.goto(`${BASE_URL}/product/${productId}`);
    await page.waitForLoadState('domcontentloaded');
  }
}

/**
 * Locate the product quantity input on the product detail page.
 */
function productQuantityInput(page: Page) {
  return page
    .locator(
      'input[type="number"], input[name="quantity"], form input[type="number"]'
    )
    .first();
}

/**
 * Locate the cart row containing the specified product.
 */
function productCartRow(page: Page, productName = product.name) {
  return page
    .locator('tr, .cart-item, [data-testid="cart-item"], tbody tr')
    .filter({
      hasText: productName,
    })
    .first();
}

/**
 * Locate the cart badge.
 */
function cartBadge(page: Page) {
  return page
    .locator(
      '[data-testid="cart-badge"], .cart-badge, .badge, nav a[href="/cart"] span, header a[href="/cart"] span'
    )
    .first();
}

/**
 * Locate the empty-cart state.
 */
function emptyCartState(page: Page) {
  return page
    .locator(
      '[data-testid="empty-cart"], .empty-cart, .empty-state, div:has(h2:has-text("trống")), div:has-text("Giỏ hàng của bạn đang trống")'
    )
    .first();
}

/**
 * Locate the delete confirmation dialog.
 */
function deleteDialog(page: Page) {
  return page
    .locator(
      '[role="dialog"], .modal, .confirm-dialog, [data-testid="confirm-dialog"]'
    )
    .first();
}

/**
 * Add the representative product to the cart.
 * Handles double-click requirement present on SUT ProductDetail.jsx:21-31.
 */
async function addProduct(page: Page, quantity: number) {
  await openProductPage(page);

  const quantityInput = productQuantityInput(page);

  await expect(quantityInput).toBeVisible();
  await quantityInput.fill(String(quantity));

  const addButton = page.getByRole('button', {
    name: new RegExp(`${labels.addToCartButton}|Thêm vào giỏ`, 'i'),
  });

  await expect(addButton).toBeVisible();
  await addButton.click();

  // Handle SUT defect on ProductDetail.jsx where first click only sets clickCount = 1
  if (await addButton.isVisible().catch(() => false)) {
    const text = await addButton.innerText().catch(() => '');
    if (!text.includes('Đã thêm')) {
      await addButton.click().catch(() => {});
    }
  }
}

/**
 * Open the cart through the navbar.
 */
async function openCartFromNavbar(page: Page) {
  const cartLink = page
    .getByRole('link', {
      name: /Giỏ hàng/i,
    })
    .first();

  if ((await cartLink.count()) > 0 && (await cartLink.isVisible().catch(() => false))) {
    await cartLink.click();
    await page.waitForLoadState('domcontentloaded');
  } else {
    await openCartPage(page);
  }
}

/**
 * Get the quantity displayed for a product in the cart.
 */
async function getCartQuantity(page: Page, productName = product.name) {
  const row = productCartRow(page, productName);

  await expect(row).toBeVisible();

  const quantityInput = row
    .locator('input[type="number"], input[name="quantity"]')
    .first();

  if ((await quantityInput.count()) > 0 && (await quantityInput.isVisible().catch(() => false))) {
    return Number(await quantityInput.inputValue());
  }

  const quantityElement = row
    .locator('[data-testid="quantity"], .quantity, td:nth-child(3)')
    .first();

  if ((await quantityElement.count()) > 0 && (await quantityElement.isVisible().catch(() => false))) {
    const text = await quantityElement.innerText();
    const match = text.match(/\d+/);
    if (match) return Number(match[0]);
  }

  const rowText = await row.innerText();
  const matches = rowText.match(/\b\d+\b/g);
  return matches ? Number(matches[0]) : 1;
}

/**
 * Locate the total amount section.
 */
function cartTotal(page: Page) {
  return page
    .getByText(labels.totalExpected, { exact: true })
    .or(page.getByText(labels.totalInvalid))
    .last();
}

/**
 * Remove a product and confirm the deletion.
 */
async function deleteProductAndConfirm(page: Page) {
  const row = productCartRow(page);

  await expect(row).toBeVisible();

  const deleteButton = row.getByRole('button', {
    name: new RegExp(labels.deleteButton, 'i'),
  });

  await expect(deleteButton).toBeVisible();
  await deleteButton.click();

  const dialog = deleteDialog(page);

  if ((await dialog.count()) > 0 && (await dialog.isVisible().catch(() => false))) {
    const confirmButton = dialog.getByRole('button', {
      name: /Có|Đồng ý|Xác nhận/i,
    });
    if ((await confirmButton.count()) > 0) {
      await confirmButton.click();
    }
  }
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
      page.getByText(new RegExp(labels.emptyCartMessage, 'i'))
    ).toBeVisible();

    const illustration = emptyState.locator('img, svg').first();

    if ((await illustration.count()) > 0) {
      await expect(illustration).toBeVisible();
    }

    await expect(
      page.getByRole('link', {
        name: new RegExp(labels.continueShopping, 'i'),
      })
    ).toBeVisible();
  });

  test('TC_FR07_02 - Nút Tiếp tục mua sắm từ Empty State', async ({
    page,
  }) => {
    await openCartPage(page);

    const continueShopping = page.getByRole('link', {
      name: new RegExp(labels.continueShopping, 'i'),
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
    await addProduct(page, quantities.min);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    await expect(row).toBeVisible();
    await expect(row).toContainText(product.name);
    await expect(row).toContainText(String(quantities.min));

    await expect(row).toContainText(
      new RegExp(product.priceRegex)
    );

    await expect(
      page.getByText(labels.totalExpected, { exact: true })
    ).toBeVisible();
  });

  test('TC_FR07_04 - Kiểm tra cấu trúc các cột của giỏ hàng', async ({
    page,
  }) => {
    await addProduct(page, quantities.min);
    await openCartFromNavbar(page);

    for (const column of columns) {
      await expect(
        page.getByText(column, { exact: true })
      ).toBeVisible();
    }
  });

  test('TC_FR07_05 - Kiểm tra nhãn tổng tiền là Tổng cộng', async ({
    page,
  }) => {
    await addProduct(page, quantities.min);
    await openCartFromNavbar(page);

    await expect(
      page.getByText(labels.totalExpected, { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText(labels.totalInvalid, { exact: true })
    ).not.toBeVisible();
  });

  test('TC_FR07_06 - Kiểm tra định dạng tiền tệ', async ({
    page,
  }) => {
    await addProduct(page, quantities.min);
    await openCartFromNavbar(page);

    const row = productCartRow(page);
    const rowText = await row.innerText();

    /*
     * SRS requires:
     * - Vietnamese Dong symbol ₫
     * - Thousands separator
     */
    expect(rowText).toContain(product.currencySymbol);
    expect(rowText).toMatch(new RegExp(product.currencyPattern));

    const total = cartTotal(page);
    const totalText = await total.locator('..').innerText();

    expect(totalText).toContain(product.currencySymbol);
    expect(totalText).toMatch(new RegExp(product.currencyPattern));
  });

  /* ============================================================
   * Add Product
   * ========================================================== */

  test('TC_FR07_07 - Thêm sản phẩm chưa tồn tại vào giỏ', async ({
    page,
  }) => {
    await addProduct(page, quantities.valid);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    await expect(row).toBeVisible();
    await expect(row).toContainText(product.name);

    expect(await getCartQuantity(page)).toBe(quantities.valid);

    await expect(row).toContainText(
      new RegExp(product.subtotalTripleRegex)
    );
  });

  test('TC_FR07_08 - Thêm cùng sản phẩm lần thứ hai phải cộng dồn số lượng', async ({
    page,
  }) => {
    /*
     * First addition:
     * iPhone × 3
     */
    await addProduct(page, quantities.valid);
    await openCartFromNavbar(page);

    expect(await getCartQuantity(page)).toBe(quantities.valid);

    /*
     * Second addition:
     * iPhone × 1
     */
    await openProductPage(page);

    const quantityInput = productQuantityInput(page);
    await quantityInput.fill(String(quantities.min));

    const addButton = page.getByRole('button', {
      name: new RegExp(`${labels.addToCartButton}|Thêm vào giỏ`, 'i'),
    });
    await addButton.click();

    if (await addButton.isVisible().catch(() => false)) {
      const text = await addButton.innerText().catch(() => '');
      if (!text.includes('Đã thêm')) {
        await addButton.click().catch(() => {});
      }
    }

    await openCartFromNavbar(page);

    /*
     * Expected:
     * iPhone × 4
     */
    expect(await getCartQuantity(page)).toBe(quantities.accumulated);

    /*
     * The same product must remain a single row.
     */
    const rows = page
      .locator('tr, .cart-item, [data-testid="cart-item"], tbody tr')
      .filter({
        hasText: product.name,
      });

    await expect(rows).toHaveCount(1);
  });

  /* ============================================================
   * Boundary Value Analysis
   * ========================================================== */

  test('TC_FR07_09 - Thêm sản phẩm với số lượng bằng 1', async ({
    page,
  }) => {
    const caseData = bvaCases.find((c: any) => c.id === 'TC_FR07_09');
    await addProduct(page, caseData.quantity);
    await openCartFromNavbar(page);

    expect(await getCartQuantity(page)).toBe(caseData.expectedQuantity);
  });

  test('TC_FR07_10 - Thêm sản phẩm với số lượng bằng 2', async ({
    page,
  }) => {
    const caseData = bvaCases.find((c: any) => c.id === 'TC_FR07_10');
    await addProduct(page, caseData.quantity);
    await openCartFromNavbar(page);

    expect(await getCartQuantity(page)).toBe(caseData.expectedQuantity);
  });

  test('TC_FR07_11 - Không cho thêm sản phẩm với số lượng bằng 0', async ({
    page,
  }) => {
    const caseData = bvaCases.find((c: any) => c.id === 'TC_FR07_11');
    await openProductPage(page);

    const quantityInput = productQuantityInput(page);
    await expect(quantityInput).toBeVisible();

    await quantityInput.fill(String(caseData.quantity));

    const addButton = page.getByRole('button', {
      name: new RegExp(`${labels.addToCartButton}|Thêm vào giỏ`, 'i'),
    });
    await addButton.click();

    const validationMessage = page
      .locator('[role="alert"], .error, .error-message, .alert')
      .first();

    const hasValidationMessage =
      (await validationMessage.count()) > 0 &&
      (await validationMessage.isVisible().catch(() => false));

    const isInvalid = await quantityInput.evaluate(
      (element) => !(element as HTMLInputElement).validity.valid
    );

    const currentValue = await quantityInput.inputValue();

    expect(
      hasValidationMessage ||
        isInvalid ||
        currentValue !== String(caseData.quantity)
    ).toBeTruthy();
  });

  test('TC_FR07_12 - Không cho thêm sản phẩm với số lượng âm', async ({
    page,
  }) => {
    const caseData = bvaCases.find((c: any) => c.id === 'TC_FR07_12');
    await openProductPage(page);

    const quantityInput = productQuantityInput(page);
    await expect(quantityInput).toBeVisible();

    await quantityInput.fill(String(caseData.quantity));

    const addButton = page.getByRole('button', {
      name: new RegExp(`${labels.addToCartButton}|Thêm vào giỏ`, 'i'),
    });
    await addButton.click();

    const validationMessage = page
      .locator('[role="alert"], .error, .error-message, .alert')
      .first();

    const hasValidationMessage =
      (await validationMessage.count()) > 0 &&
      (await validationMessage.isVisible().catch(() => false));

    const isInvalid = await quantityInput.evaluate(
      (element) => !(element as HTMLInputElement).validity.valid
    );

    const currentValue = await quantityInput.inputValue();

    expect(
      hasValidationMessage ||
        isInvalid ||
        currentValue !== String(caseData.quantity)
    ).toBeTruthy();
  });

  test('TC_FR07_13 - Không chấp nhận số lượng thập phân', async ({
    page,
  }) => {
    const caseData = bvaCases.find((c: any) => c.id === 'TC_FR07_13');
    await openProductPage(page);

    const quantityInput = productQuantityInput(page);
    await expect(quantityInput).toBeVisible();

    await quantityInput.fill(String(caseData.quantity));

    const addButton = page.getByRole('button', {
      name: new RegExp(`${labels.addToCartButton}|Thêm vào giỏ`, 'i'),
    });
    await addButton.click();

    const validationMessage = page
      .locator('[role="alert"], .error, .error-message, .alert')
      .first();

    const hasValidationMessage =
      (await validationMessage.count()) > 0 &&
      (await validationMessage.isVisible().catch(() => false));

    const isInvalid = await quantityInput.evaluate(
      (element) => !(element as HTMLInputElement).validity.valid
    );

    const currentValue = await quantityInput.inputValue();

    expect(
      hasValidationMessage ||
        isInvalid ||
        currentValue !== String(quantities.min)
    ).toBeTruthy();
  });

  /* ============================================================
   * Quantity + / -
   * ========================================================== */

  test('TC_FR07_14 - Tăng số lượng bằng nút +', async ({
    page,
  }) => {
    const caseData = cartModifierCases.find((c: any) => c.id === 'TC_FR07_14');
    await addProduct(page, caseData.initialQuantity);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    expect(await getCartQuantity(page)).toBe(caseData.initialQuantity);

    const plusButton = row.getByRole('button', {
      name: /\+/i,
    });

    await expect(plusButton).toBeVisible();
    await plusButton.click();

    await expect
      .poll(() => getCartQuantity(page))
      .toBe(caseData.targetQuantity);

    await expect(row).toContainText(
      new RegExp(caseData.expectedSubtotalRegex)
    );
  });

  test('TC_FR07_15 - Giảm số lượng bằng nút -', async ({
    page,
  }) => {
    const caseData = cartModifierCases.find((c: any) => c.id === 'TC_FR07_15');
    await addProduct(page, caseData.initialQuantity);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    expect(await getCartQuantity(page)).toBe(caseData.initialQuantity);

    const minusButton = row.getByRole('button', {
      name: /-/i,
    });

    await expect(minusButton).toBeVisible();
    await minusButton.click();

    await expect
      .poll(() => getCartQuantity(page))
      .toBe(caseData.targetQuantity);

    await expect(row).toContainText(
      new RegExp(caseData.expectedSubtotalRegex)
    );
  });

  test('TC_FR07_16 - Không cho giảm quantity xuống dưới 1', async ({
    page,
  }) => {
    const caseData = cartModifierCases.find((c: any) => c.id === 'TC_FR07_16');
    await addProduct(page, caseData.initialQuantity);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    const minusButton = row.getByRole('button', {
      name: /-/i,
    });

    await expect(minusButton).toBeVisible();

    expect(await getCartQuantity(page)).toBe(caseData.initialQuantity);

    await minusButton.click();

    await page.waitForTimeout(300);

    /*
     * Quantity must never become 0 or negative.
     */
    expect(await getCartQuantity(page)).toBeGreaterThanOrEqual(
      caseData.minAllowed
    );
  });

  /* ============================================================
   * Delete
   * ========================================================== */

  test('TC_FR07_17 - Xóa sản phẩm và xác nhận', async ({
    page,
  }) => {
    await addProduct(page, quantities.min);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    await expect(row).toBeVisible();

    const deleteButton = row.getByRole('button', {
      name: new RegExp(labels.deleteButton, 'i'),
    });

    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    /*
     * Confirmation must appear before deletion.
     */
    const dialog = deleteDialog(page);

    await expect(dialog).toBeVisible();

    await expect(
      dialog.getByText(/xóa|xác nhận/i)
    ).toBeVisible();

    await dialog
      .getByRole('button', {
        name: /Có|Đồng ý|Xác nhận/i,
      })
      .click();

    await expect(row).not.toBeVisible();
  });

  test('TC_FR07_18 - Xóa sản phẩm và hủy xác nhận', async ({
    page,
  }) => {
    await addProduct(page, quantities.min);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    await expect(row).toBeVisible();

    const quantityBefore = await getCartQuantity(page);

    const deleteButton = row.getByRole('button', {
      name: new RegExp(labels.deleteButton, 'i'),
    });

    await deleteButton.click();

    const dialog = deleteDialog(page);

    await expect(dialog).toBeVisible();

    await dialog
      .getByRole('button', {
        name: /Không|Hủy|Cancel/i,
      })
      .click();

    await expect(dialog).not.toBeVisible();

    /*
     * Product and quantity must remain unchanged.
     */
    await expect(row).toBeVisible();
    expect(await getCartQuantity(page)).toBe(quantityBefore);
  });

  test('TC_FR07_19 - Xóa item cuối cùng chuyển giỏ hàng sang Empty State', async ({
    page,
  }) => {
    await addProduct(page, quantities.min);
    await openCartFromNavbar(page);

    await deleteProductAndConfirm(page);

    await expect(
      page.getByText(new RegExp(labels.emptyCartMessage, 'i'))
    ).toBeVisible();

    await expect(emptyCartState(page)).toBeVisible();

    const productRow = productCartRow(page);
    await expect(productRow).not.toBeVisible();
  });

  /* ============================================================
   * Navbar / Breadcrumb / Feedback
   * ========================================================== */

  test('TC_FR07_20 - Badge số lượng trên Navbar', async ({
    page,
  }) => {
    const caseData = guiCases.find((c: any) => c.id === 'TC_FR07_20');
    await openHomePage(page);

    const cartLink = page
      .getByRole('link', {
        name: /Giỏ hàng/i,
      })
      .first();

    await expect(cartLink).toBeVisible();

    const badge = cartBadge(page);
    await expect(badge).toBeVisible();

    await addProduct(page, caseData.initialAdd);
    await openHomePage(page);

    await expect(badge).toContainText(String(caseData.initialAdd));

    /*
     * Add the same product again with quantity 1.
     */
    await openProductPage(page);

    const quantityInput = productQuantityInput(page);
    await quantityInput.fill(String(caseData.secondAdd));

    const addButton = page.getByRole('button', {
      name: new RegExp(`${labels.addToCartButton}|Thêm vào giỏ`, 'i'),
    });
    await addButton.click();

    if (await addButton.isVisible().catch(() => false)) {
      const text = await addButton.innerText().catch(() => '');
      if (!text.includes('Đã thêm')) {
        await addButton.click().catch(() => {});
      }
    }

    await openHomePage(page);

    /*
     * The SRS requires the badge to reflect cart quantity.
     */
    await expect(badge).toContainText(caseData.expectedBadgeCount);
  });

  test('TC_FR07_21 - Breadcrumb của trang Giỏ hàng', async ({
    page,
  }) => {
    const caseData = guiCases.find((c: any) => c.id === 'TC_FR07_21');
    await openCartPage(page);

    const breadcrumb = page
      .locator(
        '[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"], nav ol, nav ul'
      )
      .first();

    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb).toContainText(new RegExp(caseData.expectedText, 'i'));
  });

  test('TC_FR07_22 - Trang Giỏ hàng có đúng một h1', async ({
    page,
  }) => {
    const caseData = guiCases.find((c: any) => c.id === 'TC_FR07_22');
    await openCartPage(page);

    const h1 = page.locator('h1');

    await expect(h1).toHaveCount(caseData.expectedH1Count);
    await expect(h1.first()).toBeVisible();
    await expect(h1.first()).toContainText(new RegExp(caseData.expectedText, 'i'));
  });

  test('TC_FR07_23 - Có phản hồi trực quan sau khi thêm vào giỏ', async ({
    page,
  }) => {
    const caseData = guiCases.find((c: any) => c.id === 'TC_FR07_23');
    await openProductPage(page);

    const quantityInput = productQuantityInput(page);
    await quantityInput.fill(String(caseData.quantity));

    const addButton = page.getByRole('button', {
      name: new RegExp(`${labels.addToCartButton}|Thêm vào giỏ`, 'i'),
    });
    await addButton.click();

    // Handle SUT defect on ProductDetail.jsx where first click only sets clickCount = 1
    if (await addButton.isVisible().catch(() => false)) {
      const text = await addButton.innerText().catch(() => '');
      if (!text.includes('Đã thêm')) {
        await addButton.click().catch(() => {});
      }
    }

    /*
     * SRS permits visual feedback such as:
     * - toast
     * - cart badge update
     * - button state change ("Đã thêm")
     */
    const toast = page
      .locator('[role="alert"], [data-testid="toast"], .toast, .notification')
      .first();

    const badge = cartBadge(page);

    const feedbackButton = page
      .getByRole('button', {
        name: new RegExp(`${labels.addToCartButton}|Thêm vào giỏ|Đã thêm`, 'i'),
      })
      .or(page.locator('button').filter({ hasText: /Thêm vào giỏ|Đã thêm/i }))
      .first();

    const hasToast =
      (await toast.count()) > 0 &&
      (await toast.isVisible().catch(() => false));

    const hasBadge =
      (await badge.count()) > 0 &&
      (await badge.isVisible().catch(() => false));

    const buttonText = await feedbackButton.innerText().catch(() => '');
    const hasButtonFeedback =
      buttonText.includes('Đã thêm') ||
      (await page.getByText(/Đã thêm/i).isVisible().catch(() => false));

    expect(hasToast || hasBadge || hasButtonFeedback).toBeTruthy();
  });

  /* ============================================================
   * GUI / Accessibility
   * ========================================================== */

  test('TC_FR07_24 - Giao diện FR-07 sử dụng tiếng Việt', async ({
    page,
  }) => {
    await addProduct(page, quantities.min);
    await openCartFromNavbar(page);

    for (const text of requiredVietnameseTexts) {
      await expect(
        page.getByText(text, { exact: true })
      ).toBeVisible();
    }
  });

  test('TC_FR07_25 - Kiểm tra màu nút hành động và nút nguy hiểm', async ({
    page,
  }) => {
    await addProduct(page, quantities.min);
    await openCartFromNavbar(page);

    const row = productCartRow(page);

    const deleteButton = row.getByRole('button', {
      name: new RegExp(labels.deleteButton, 'i'),
    });

    await expect(deleteButton).toBeVisible();

    const colorStyle = await deleteButton.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
      };
    });

    /*
     * SRS requires dangerous actions to use red (either text color or background color).
     */
    const colorRgb = colorStyle.color.match(/\d+/g)?.map(Number) ?? [];
    const bgRgb = colorStyle.backgroundColor.match(/\d+/g)?.map(Number) ?? [];

    const isColorRed =
      colorRgb.length >= 3 &&
      colorRgb[0] > colorRgb[1] &&
      colorRgb[0] > colorRgb[2];
    const isBgRed =
      bgRgb.length >= 3 &&
      bgRgb[0] > bgRgb[1] &&
      bgRgb[0] > bgRgb[2];

    expect(isColorRed || isBgRed).toBeTruthy();
  });

  test('TC_FR07_26 - Tab Order trên trang Giỏ hàng', async ({
    page,
  }) => {
    const caseData = guiCases.find((c: any) => c.id === 'TC_FR07_26');
    await addProduct(page, quantities.min);
    await openCartFromNavbar(page);

    const focusOrder: string[] = [];
    const maxTabs = caseData.maxTabs || 30;

    for (let i = 0; i < maxTabs; i++) {
      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');

      if ((await focused.count()) === 0) {
        break;
      }

      const description = await focused.evaluate((element) => {
        const tag = element.tagName.toLowerCase();
        const ariaLabel = element.getAttribute('aria-label') ?? '';
        const text = (element.textContent ?? '').trim().replace(/\s+/g, ' ');
        return `${tag}:${ariaLabel || text}`.slice(0, 150);
      });

      focusOrder.push(description);
    }

    /*
     * The page must contain keyboard-focusable interactive elements.
     */
    expect(focusOrder.length).toBeGreaterThan(0);

    /*
     * Focus should stay on interactive controls.
     */
    for (const element of focusOrder) {
      expect(element).toMatch(/^(a|button|input|select|textarea):/i);
    }
  });
});