import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';

const LOGIN_URL = `${BASE_URL}/login`;
const IMPORT_URL = `${BASE_URL}/admin/import-products`;
const PRODUCTS_URL = `${BASE_URL}/admin/products`;

const ADMIN_EMAIL = 'admin@eshop.com';
const ADMIN_PASSWORD = 'Admin123!';

/*
 * Non-admin credentials are not specified by the SRS.
 * TC_FR16_02 is therefore skipped unless these values are provided
 * through environment variables.
 */
const NON_ADMIN_EMAIL = process.env.NON_ADMIN_EMAIL;
const NON_ADMIN_PASSWORD = process.env.NON_ADMIN_PASSWORD;

const TEST_DATA_DIR = path.join(
  process.cwd(),
  'test-data',
  'fr16'
);

/* ============================================================
 * Test Data Helpers
 * ========================================================== */

/**
 * Standard CSV header required by FR-16.
 */
const VALID_HEADER =
  'name,price,description,imageUrl,category_id';

/**
 * Create a CSV file used by browser upload tests.
 */
function createCsvFile(
  filename: string,
  content: string
): string {
  fs.mkdirSync(TEST_DATA_DIR, {
    recursive: true,
  });

  const filePath = path.join(
    TEST_DATA_DIR,
    filename
  );

  fs.writeFileSync(
    filePath,
    content,
    'utf8'
  );

  return filePath;
}

/**
 * Create CSV content.
 */
function createCsv(
  rows: string[],
  header: string = VALID_HEADER
): string {
  return `${header}\n${rows.join('\n')}\n`;
}

/**
 * Generate a unique product name to avoid collisions
 * between independent test cases.
 */
function uniqueProduct(
  prefix: string
): string {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 7)}`;
}

/* ============================================================
 * Navigation Helpers
 * ========================================================== */

/**
 * Navigate to login page and wait until the page is ready.
 */
async function openLoginPage(page: Page) {
  await page.goto(LOGIN_URL);
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Navigate to Import Products page.
 */
async function openImportPage(page: Page) {
  await page.goto(IMPORT_URL);
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Navigate to Products page.
 */
async function openProductsPage(page: Page) {
  await page.goto(PRODUCTS_URL);
  await page.waitForLoadState('domcontentloaded');
}

/* ============================================================
 * Authentication Helpers
 * ========================================================== */

/**
 * Fill login form.
 *
 * The implementation may use email or username as the
 * first field, therefore common selectors are supported.
 */
async function fillLoginForm(
  page: Page,
  email: string,
  password: string
) {
  const emailInput = page.locator(
    'input[type="email"], input[name="email"], input[name="username"]'
  ).first();

  const passwordInput = page.locator(
    'input[type="password"], input[name="password"]'
  ).first();

  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();

  await emailInput.fill(email);
  await passwordInput.fill(password);
}

/**
 * Submit login form.
 */
async function submitLogin(page: Page) {
  const submitButton = page.getByRole('button', {
    name: /Sign In|Login|Đăng nhập/i,
  });

  await expect(submitButton).toBeVisible();
  await submitButton.click();
}

/**
 * Login using Admin account.
 */
async function loginAsAdmin(page: Page) {
  await openLoginPage(page);

  await fillLoginForm(
    page,
    ADMIN_EMAIL,
    ADMIN_PASSWORD
  );

  await submitLogin(page);

  await expect(page).not.toHaveURL(/\/login$/);
}

/**
 * Login using non-admin account.
 */
async function loginAsNonAdmin(page: Page) {
  if (
    !NON_ADMIN_EMAIL ||
    !NON_ADMIN_PASSWORD
  ) {
    test.skip(
      true,
      'Non-admin credentials are not provided.'
    );
  }

  await openLoginPage(page);

  await fillLoginForm(
    page,
    NON_ADMIN_EMAIL!,
    NON_ADMIN_PASSWORD!
  );

  await submitLogin(page);
}

/* ============================================================
 * Import Helpers
 * ========================================================== */

/**
 * Find file input.
 */
async function fileInput(page: Page) {
  const input = page.locator(
    'input[type="file"]'
  ).first();

  await expect(input).toBeAttached();

  return input;
}

/**
 * Upload a file through the browser.
 */
async function uploadFile(
  page: Page,
  filePath: string
) {
  const input = await fileInput(page);

  await input.setInputFiles(filePath);
}

/**
 * Submit the Import form.
 *
 * The exact button text is not specified by the SRS.
 */
async function submitImport(page: Page) {
  const importButton = page.getByRole('button', {
    name: /Import|Upload|Import Products|Nhập/i,
  }).first();

  await expect(importButton).toBeVisible();

  await importButton.click();
}

/**
 * Upload and submit one CSV file.
 */
async function importCsv(
  page: Page,
  filename: string,
  content: string
) {
  const filePath = createCsvFile(
    filename,
    content
  );

  await uploadFile(
    page,
    filePath
  );

  await submitImport(page);
}

/* ============================================================
 * Result Helpers
 * ========================================================== */

/**
 * Locate generic import error.
 *
 * The exact message is not hard-coded because the SRS only
 * requires a clear error message.
 */
function importError(page: Page) {
  return page.locator(
    [
      '[role="alert"]',
      '.error',
      '.error-message',
      '.alert',
      '.alert-danger',
    ].join(', ')
  ).first();
}

/**
 * Locate generic import success message.
 */
function importSuccess(page: Page) {
  return page.locator(
    [
      '[role="alert"]',
      '.success',
      '.success-message',
      '.alert-success',
    ].join(', ')
  ).first();
}

/**
 * Verify an import error is displayed.
 */
async function expectImportError(page: Page) {
  const error = importError(page);

  await expect(error).toBeVisible();
}

/**
 * Verify an import success message is displayed.
 */
async function expectImportSuccess(page: Page) {
  const success = importSuccess(page);

  await expect(success).toBeVisible();
}

/**
 * Verify a specific error reason.
 */
async function expectErrorReason(
  page: Page,
  pattern: RegExp
) {
  const error = page.getByText(
    pattern
  ).first();

  await expect(error).toBeVisible();
}

/**
 * Verify that a product exists in the product list.
 */
async function expectProductExists(
  page: Page,
  productName: string
) {
  await expect(
    page.getByText(
      productName,
      { exact: true }
    )
  ).toBeVisible();
}

/**
 * Verify that a product does not exist in the product list.
 */
async function expectProductDoesNotExist(
  page: Page,
  productName: string
) {
  await expect(
    page.getByText(
      productName,
      { exact: true }
    )
  ).not.toBeVisible();
}

/**
 * Verify success count in the import report.
 *
 * Supports common formats such as:
 * "Success: 3"
 * "3 successful"
 * "3 rows imported successfully"
 */
async function expectSuccessCount(
  page: Page,
  count: number
) {
  const result = page.getByText(
    new RegExp(
      `(success|successful|imported|thành công)[^\\d]{0,30}${count}\\b|${count}[^\\d]{0,30}(success|successful|imported|thành công)`,
      'i'
    )
  ).first();

  await expect(result).toBeVisible();
}

/**
 * Verify error count in the import report.
 */
async function expectErrorCount(
  page: Page,
  count: number
) {
  const result = page.getByText(
    new RegExp(
      `(error|errors|failed|lỗi)[^\\d]{0,30}${count}\\b|${count}[^\\d]{0,30}(error|errors|failed|lỗi)`,
      'i'
    )
  ).first();

  await expect(result).toBeVisible();
}

/* ============================================================
 * FR-16 Functional Tests
 * ========================================================== */

test.describe(
  'FR-16 - Import Products from CSV',
  () => {

    /* ========================================================
     * Authentication / Authorization
     * ====================================================== */

    test(
      'TC_FR16_01 - Admin can access Import Products',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        const input = page.locator(
          'input[type="file"]'
        );

        await expect(input).toBeAttached();
      }
    );

    test(
      'TC_FR16_02 - Non-admin cannot import products',
      async ({ page }) => {
        await loginAsNonAdmin(page);

        await page.goto(
          IMPORT_URL
        );

        await page.waitForLoadState(
          'domcontentloaded'
        );

        const unauthorized = page.getByText(
          /forbidden|unauthorized|access denied|not authorized|không có quyền|truy cập bị từ chối/i
        ).first();

        if (await unauthorized.count()) {
          await expect(
            unauthorized
          ).toBeVisible();

          return;
        }

        const input = page.locator(
          'input[type="file"]'
        );

        await expect(
          input
        ).not.toBeVisible();
      }
    );

    /* ========================================================
     * File Extension
     * ====================================================== */

    test(
      'TC_FR16_03 - Import valid .csv file',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        const productName =
          uniqueProduct('FR16-CSV');

        await importCsv(
          page,
          'products.csv',
          createCsv([
            `${productName},1000,Desc,http://url.com,1`,
          ])
        );

        await expectImportSuccess(page);
      }
    );

    test(
      'TC_FR16_04 - Reject non-.csv file',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        /*
         * The file content itself is valid CSV, but the
         * extension is intentionally .xlsx.
         */
        const filePath = createCsvFile(
          'products.xlsx',
          createCsv([
            'FR16-XLSX,1000,Desc,http://url.com,1',
          ])
        );

        await uploadFile(
          page,
          filePath
        );

        await submitImport(page);

        await expectImportError(page);
      }
    );

    /* ========================================================
     * CSV Header
     * ====================================================== */

    test(
      'TC_FR16_05 - Accept valid CSV header',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        const productName =
          uniqueProduct('FR16-HEADER');

        await importCsv(
          page,
          'valid-header.csv',
          createCsv([
            `${productName},1000,Desc,http://url.com,1`,
          ])
        );

        await expectImportSuccess(page);
      }
    );

    test(
      'TC_FR16_06 - Reject CSV with missing header fields',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          'missing-header.csv',
          createCsv(
            [
              'FR16-MISSING-HEADER,1000',
            ],
            'name,price'
          )
        );

        await expectImportError(page);

        await expectErrorReason(
          page,
          /header|column|field|structure|format|cấu trúc/i
        );
      }
    );

    test(
      'TC_FR16_07 - Reject CSV with incorrect header name',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          'invalid-header.csv',
          createCsv(
            [
              'FR16-INVALID-HEADER,1000,Desc,http://url.com,1',
            ],
            'product_name,price,description,imageUrl,category_id'
          )
        );

        await expectImportError(page);

        await expectErrorReason(
          page,
          /header|column|field|structure|format/i
        );
      }
    );

    /* ========================================================
     * CSV Parsing / RFC 4180
     * ====================================================== */

    test(
      'TC_FR16_08 - Parse quoted comma in CSV field correctly',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        const productName =
          `iPhone, 13 ${Date.now()}`;

        await importCsv(
          page,
          'quoted-comma.csv',
          createCsv([
            `"${productName}",1000,"Desc, iPhone 13",http://url.com,1`,
          ])
        );

        await expectImportSuccess(page);

        /*
         * Verify the complete name was stored instead of
         * being split at the comma.
         */
        await openProductsPage(page);

        await expectProductExists(
          page,
          productName
        );
      }
    );

    test(
      'TC_FR16_09 - Reject unquoted comma in CSV field',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          'unquoted-comma.csv',
          createCsv([
            'iPhone, 13,1000,"Desc",http://url.com,1',
          ])
        );

        await expectImportError(page);
      }
    );

    /* ========================================================
     * Product Name Validation / BVA
     * ====================================================== */

    test(
      'TC_FR16_10 - Accept product name with minimum length 1',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        const productName =
          uniqueProduct('A');

        await importCsv(
          page,
          'name-min-length.csv',
          createCsv([
            `${productName},1000,Desc,http://url.com,1`,
          ])
        );

        await expectImportSuccess(page);
      }
    );

    test(
      'TC_FR16_11 - Reject empty product name',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          'empty-name.csv',
          createCsv([
            ',1000,Desc,http://url.com,1',
          ])
        );

        await expectImportError(page);

        await expectErrorReason(
          page,
          /name.*required|name.*empty|name.*blank|tên.*rỗng|tên.*bắt buộc/i
        );
      }
    );

    /* ========================================================
     * Product Price Validation / BVA
     * ====================================================== */

    test(
      'TC_FR16_12 - Reject price equal to 0',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          'price-zero.csv',
          createCsv([
            'FR16-PRICE-ZERO,0,Desc,http://url.com,1',
          ])
        );

        await expectImportError(page);

        await expectErrorReason(
          page,
          /price.*positive|price.*greater|price.*zero|giá.*lớn hơn|giá.*0/i
        );
      }
    );

    test(
      'TC_FR16_13 - Accept price equal to 0.01',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        const productName =
          uniqueProduct('FR16-PRICE-001');

        await importCsv(
          page,
          'price-0-01.csv',
          createCsv([
            `${productName},0.01,Desc,http://url.com,1`,
          ])
        );

        await expectImportSuccess(page);

        await openProductsPage(page);

        await expectProductExists(
          page,
          productName
        );
      }
    );

    test(
      'TC_FR16_14 - Reject negative price -0.01',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          'price-negative.csv',
          createCsv([
            'FR16-PRICE-NEGATIVE,-0.01,Desc,http://url.com,1',
          ])
        );

        await expectImportError(page);

        await expectErrorReason(
          page,
          /price.*positive|price.*greater|negative|giá.*lớn hơn|giá.*không hợp lệ/i
        );
      }
    );

    test(
      'TC_FR16_15 - Reject non-numeric price',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          'price-nonnumeric.csv',
          createCsv([
            'FR16-PRICE-NONNUMERIC,abc,Desc,http://url.com,1',
          ])
        );

        await expectImportError(page);

        await expectErrorReason(
          page,
          /price|number|numeric|giá|số/i
        );
      }
    );

    /* ========================================================
     * Atomic Rollback
     * ====================================================== */

    test(
      'TC_FR16_16 - Rollback entire import when middle row is invalid',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        const productA =
          uniqueProduct('FR16-ROLLBACK-A');

        const productB =
          uniqueProduct('FR16-ROLLBACK-B');

        const productC =
          uniqueProduct('FR16-ROLLBACK-C');

        await importCsv(
          page,
          'rollback-middle.csv',
          createCsv([
            `${productA},1000,Desc A,http://url-a.com,1`,
            `${productB},0,Desc B,http://url-b.com,1`,
            `${productC},2000,Desc C,http://url-c.com,1`,
          ])
        );

        await expectImportError(page);

        /*
         * All products must be absent because the import
         * transaction is atomic.
         */
        await openProductsPage(page);

        await expectProductDoesNotExist(
          page,
          productA
        );

        await expectProductDoesNotExist(
          page,
          productB
        );

        await expectProductDoesNotExist(
          page,
          productC
        );
      }
    );

    test(
      'TC_FR16_17 - Rollback previous rows when last row is invalid',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        const productA =
          uniqueProduct('FR16-ROLLBACK-LAST-A');

        const productB =
          uniqueProduct('FR16-ROLLBACK-LAST-B');

        const productC =
          uniqueProduct('FR16-ROLLBACK-LAST-C');

        await importCsv(
          page,
          'rollback-last.csv',
          createCsv([
            `${productA},1000,Desc A,http://url-a.com,1`,
            `${productB},2000,Desc B,http://url-b.com,1`,
            `${productC},0,Desc C,http://url-c.com,1`,
          ])
        );

        await expectImportError(page);

        await openProductsPage(page);

        await expectProductDoesNotExist(
          page,
          productA
        );

        await expectProductDoesNotExist(
          page,
          productB
        );

        await expectProductDoesNotExist(
          page,
          productC
        );
      }
    );

    test(
      'TC_FR16_18 - Multiple errors cause complete rollback',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        const productA =
          uniqueProduct('FR16-MULTI-A');

        const productC =
          uniqueProduct('FR16-MULTI-C');

        await importCsv(
          page,
          'multiple-errors.csv',
          createCsv([
            `${productA},1000,Desc A,http://url-a.com,1`,
            `,2000,Desc B,http://url-b.com,1`,
            `${productC},0,Desc C,http://url-c.com,1`,
          ])
        );

        await expectImportError(page);

        /*
         * Both validation errors should be reported.
         */
        await expectErrorReason(
          page,
          /name.*required|name.*empty|name.*blank|tên.*rỗng|tên.*bắt buộc/i
        );

        await expectErrorReason(
          page,
          /price.*positive|price.*greater|price.*zero|giá.*lớn hơn|giá.*0/i
        );

        /*
         * No valid row may remain in the database.
         */
        await openProductsPage(page);

        await expectProductDoesNotExist(
          page,
          productA
        );

        await expectProductDoesNotExist(
          page,
          productC
        );
      }
    );

    /* ========================================================
     * Import Result Reporting
     * ====================================================== */

    test(
      'TC_FR16_19 - Display successful import count',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        const productA =
          uniqueProduct('FR16-REPORT-A');

        const productB =
          uniqueProduct('FR16-REPORT-B');

        const productC =
          uniqueProduct('FR16-REPORT-C');

        await importCsv(
          page,
          'successful-report.csv',
          createCsv([
            `${productA},1000,Desc A,http://url-a.com,1`,
            `${productB},2000,Desc B,http://url-b.com,1`,
            `${productC},3000,Desc C,http://url-c.com,1`,
          ])
        );

        await expectImportSuccess(page);

        await expectSuccessCount(
          page,
          3
        );

        await expectErrorCount(
          page,
          0
        );
      }
    );

    test(
      'TC_FR16_20 - Display error count and error reasons',
      async ({ page }) => {
        await loginAsAdmin(page);

        await openImportPage(page);

        const productA =
          uniqueProduct('FR16-REPORT-ERROR-A');

        const productC =
          uniqueProduct('FR16-REPORT-ERROR-C');

        await importCsv(
          page,
          'error-report.csv',
          createCsv([
            `${productA},1000,Desc A,http://url-a.com,1`,
            `,2000,Desc B,http://url-b.com,1`,
            `${productC},0,Desc C,http://url-c.com,1`,
          ])
        );

        await expectImportError(page);

        /*
         * Because the transaction is atomic, successful
         * imported rows must be zero.
         */
        await expectSuccessCount(
          page,
          0
        );

        /*
         * Two rows contain validation errors.
         */
        await expectErrorCount(
          page,
          2
        );

        /*
         * Verify both error reasons are reported.
         */
        await expectErrorReason(
          page,
          /name.*required|name.*empty|name.*blank|tên.*rỗng|tên.*bắt buộc/i
        );

        await expectErrorReason(
          page,
          /price.*positive|price.*greater|price.*zero|giá.*lớn hơn|giá.*0/i
        );

        /*
         * Verify atomic rollback through the Product List UI.
         */
        await openProductsPage(page);

        await expectProductDoesNotExist(
          page,
          productA
        );

        await expectProductDoesNotExist(
          page,
          productC
        );
      }
    );
  }
);