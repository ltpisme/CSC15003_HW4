import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import testData from '../data/fr16-data.json';

const BASE_URL = testData.urls.baseUrl;
const LOGIN_URL = testData.urls.login;
const IMPORT_URL = testData.urls.import;
const PRODUCTS_URL = testData.urls.products;

const ADMIN_EMAIL = testData.credentials.admin.email;
const ADMIN_PASSWORD = testData.credentials.admin.password;

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
const VALID_HEADER = testData.headers.valid;

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
  await page.goto(LOGIN_URL).catch(async () => {
    await page.goto(BASE_URL);
  });
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Navigate to Import Products page.
 */
async function openImportPage(page: Page) {
  await page.goto(IMPORT_URL).catch(async () => {
    await page.goto(BASE_URL);
  });
  await page.waitForLoadState('domcontentloaded');

  const productsTab = page.locator('button, a, [role="tab"]').filter({
    hasText: /Sản phẩm|Products/i,
  }).first();

  if (await productsTab.isVisible({ timeout: 1000 }).catch(() => false)) {
    await productsTab.click();
    await page.waitForLoadState('domcontentloaded');
  }
}

/**
 * Navigate to Products page.
 */
async function openProductsPage(page: Page) {
  await page.goto(PRODUCTS_URL).catch(async () => {
    await page.goto(BASE_URL);
  });
  await page.waitForLoadState('domcontentloaded');

  const productsTab = page.locator('button, a, [role="tab"]').filter({
    hasText: /Sản phẩm|Products/i,
  }).first();

  if (await productsTab.isVisible({ timeout: 1000 }).catch(() => false)) {
    await productsTab.click();
    await page.waitForLoadState('domcontentloaded');
  }
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

  if (await emailInput.isVisible({ timeout: 1000 }).catch(() => false)) {
    await emailInput.fill(email);
    if (await passwordInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await passwordInput.fill(password);
    }
  }
}

/**
 * Submit login form.
 */
async function submitLogin(page: Page) {
  const submitButton = page.getByRole('button', {
    name: /Sign In|Login|Đăng nhập/i,
  }).first();

  if (await submitButton.isVisible({ timeout: 1000 }).catch(() => false)) {
    await submitButton.click();
  }
}

/**
 * Login using Admin account.
 */
async function loginAsAdmin(page: Page) {
  await openLoginPage(page);

  const emailInput = page.locator(
    'input[type="email"], input[name="email"], input[name="username"]'
  ).first();

  if (await emailInput.isVisible({ timeout: 1500 }).catch(() => false)) {
    await fillLoginForm(
      page,
      ADMIN_EMAIL,
      ADMIN_PASSWORD
    );

    await submitLogin(page);

    await expect(page).not.toHaveURL(/\/login$/);
  }
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
  const importButton = page.locator('button').filter({
    hasText: /Import|Upload|Nhập/i,
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
      '.bg-red-100',
      '.text-red-800',
      '.text-red-600',
      '[data-testid="import-error"]',
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
      '.bg-green-100',
      '.text-green-800',
      '.text-green-600',
      '[data-testid="import-success"]',
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
 * "Import hoàn tất: 3/3 sản phẩm được thêm"
 */
async function expectSuccessCount(
  page: Page,
  count: number
) {
  const result = page.getByText(
    new RegExp(
      `(success|successful|imported|thành công|được thêm)[^\\d]{0,30}${count}\\b|${count}[^\\d]{0,30}(success|successful|imported|thành công|được thêm)|\\b${count}/\\d+`,
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
      `(error|errors|failed|lỗi)[^\\d]{0,30}${count}\\b|${count}[^\\d]{0,30}(error|errors|failed|lỗi)|\\b${count}\\s*lỗi\\b`,
      'i'
    )
  ).first();

  await expect(result).toBeVisible();
}

/* ============================================================
 * FR-16 Functional Tests (Data-driven)
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
        const tcData = testData.testCases.TC_FR16_01;
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
        const tcData = testData.testCases.TC_FR16_02;
        await loginAsNonAdmin(page);

        await page.goto(
          tcData.targetUrl
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
        const tcData = testData.testCases.TC_FR16_03;
        await loginAsAdmin(page);

        await openImportPage(page);

        const productName =
          uniqueProduct(tcData.prefix);

        const row = tcData.rows[0].replace('{prefix}', productName);

        await importCsv(
          page,
          tcData.filename,
          createCsv([row], testData.headers[tcData.headerType as keyof typeof testData.headers])
        );

        await expectImportSuccess(page);
      }
    );

    test(
      'TC_FR16_04 - Reject non-.csv file',
      async ({ page }) => {
        const tcData = testData.testCases.TC_FR16_04;
        await loginAsAdmin(page);

        await openImportPage(page);

        /*
         * The file content itself is valid CSV, but the
         * extension is intentionally .xlsx.
         */
        const filePath = createCsvFile(
          tcData.filename,
          createCsv(
            tcData.rows,
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
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
        const tcData = testData.testCases.TC_FR16_05;
        await loginAsAdmin(page);

        await openImportPage(page);

        const productName =
          uniqueProduct(tcData.prefix);

        const row = tcData.rows[0].replace('{prefix}', productName);

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            [row],
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
        );

        await expectImportSuccess(page);
      }
    );

    test(
      'TC_FR16_06 - Reject CSV with missing header fields',
      async ({ page }) => {
        const tcData = testData.testCases.TC_FR16_06;
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            tcData.rows,
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
        );

        await expectImportError(page);

        await expectErrorReason(
          page,
          new RegExp(tcData.expectedReasonPattern, 'i')
        );
      }
    );

    test(
      'TC_FR16_07 - Reject CSV with incorrect header name',
      async ({ page }) => {
        const tcData = testData.testCases.TC_FR16_07;
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            tcData.rows,
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
        );

        await expectImportError(page);

        await expectErrorReason(
          page,
          new RegExp(tcData.expectedReasonPattern, 'i')
        );
      }
    );

    /* ========================================================
     * CSV Parsing / RFC 4180
     * ====================================================== */

    test(
      'TC_FR16_08 - Parse quoted comma in CSV field correctly',
      async ({ page }) => {
        const tcData = testData.testCases.TC_FR16_08;
        await loginAsAdmin(page);

        await openImportPage(page);

        const productName =
          `${tcData.baseProductName} ${Date.now()}`;

        const row = tcData.rowTemplate.replace('{productName}', productName);

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            [row],
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
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
        const tcData = testData.testCases.TC_FR16_09;
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            tcData.rows,
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
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
        const tcData = testData.testCases.TC_FR16_10;
        await loginAsAdmin(page);

        await openImportPage(page);

        const productName =
          uniqueProduct(tcData.prefix);

        const row = tcData.rowTemplate.replace('{productName}', productName);

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            [row],
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
        );

        await expectImportSuccess(page);
      }
    );

    test(
      'TC_FR16_11 - Reject empty product name',
      async ({ page }) => {
        const tcData = testData.testCases.TC_FR16_11;
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            tcData.rows,
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
        );

        await expectImportError(page);

        await expectErrorReason(
          page,
          new RegExp(tcData.expectedReasonPattern, 'i')
        );
      }
    );

    /* ========================================================
     * Product Price Validation / BVA
     * ====================================================== */

    test(
      'TC_FR16_12 - Reject price equal to 0',
      async ({ page }) => {
        const tcData = testData.testCases.TC_FR16_12;
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            tcData.rows,
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
        );

        await expectImportError(page);

        await expectErrorReason(
          page,
          new RegExp(tcData.expectedReasonPattern, 'i')
        );
      }
    );

    test(
      'TC_FR16_13 - Accept price equal to 0.01',
      async ({ page }) => {
        const tcData = testData.testCases.TC_FR16_13;
        await loginAsAdmin(page);

        await openImportPage(page);

        const productName =
          uniqueProduct(tcData.prefix);

        const row = tcData.rowTemplate.replace('{productName}', productName);

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            [row],
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
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
        const tcData = testData.testCases.TC_FR16_14;
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            tcData.rows,
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
        );

        await expectImportError(page);

        await expectErrorReason(
          page,
          new RegExp(tcData.expectedReasonPattern, 'i')
        );
      }
    );

    test(
      'TC_FR16_15 - Reject non-numeric price',
      async ({ page }) => {
        const tcData = testData.testCases.TC_FR16_15;
        await loginAsAdmin(page);

        await openImportPage(page);

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            tcData.rows,
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
        );

        await expectImportError(page);

        await expectErrorReason(
          page,
          new RegExp(tcData.expectedReasonPattern, 'i')
        );
      }
    );

    /* ========================================================
     * Atomic Rollback
     * ====================================================== */

    test(
      'TC_FR16_16 - Rollback entire import when middle row is invalid',
      async ({ page }) => {
        const tcData = testData.testCases.TC_FR16_16;
        await loginAsAdmin(page);

        await openImportPage(page);

        const productA =
          uniqueProduct(tcData.prefixes.productA);

        const productB =
          uniqueProduct(tcData.prefixes.productB);

        const productC =
          uniqueProduct(tcData.prefixes.productC);

        const rows = [
          tcData.rowTemplates[0].replace('{productA}', productA),
          tcData.rowTemplates[1].replace('{productB}', productB),
          tcData.rowTemplates[2].replace('{productC}', productC),
        ];

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            rows,
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
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
        const tcData = testData.testCases.TC_FR16_17;
        await loginAsAdmin(page);

        await openImportPage(page);

        const productA =
          uniqueProduct(tcData.prefixes.productA);

        const productB =
          uniqueProduct(tcData.prefixes.productB);

        const productC =
          uniqueProduct(tcData.prefixes.productC);

        const rows = [
          tcData.rowTemplates[0].replace('{productA}', productA),
          tcData.rowTemplates[1].replace('{productB}', productB),
          tcData.rowTemplates[2].replace('{productC}', productC),
        ];

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            rows,
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
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
        const tcData = testData.testCases.TC_FR16_18;
        await loginAsAdmin(page);

        await openImportPage(page);

        const productA =
          uniqueProduct(tcData.prefixes.productA);

        const productC =
          uniqueProduct(tcData.prefixes.productC);

        const rows = [
          tcData.rowTemplates[0].replace('{productA}', productA),
          tcData.rowTemplates[1],
          tcData.rowTemplates[2].replace('{productC}', productC),
        ];

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            rows,
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
        );

        await expectImportError(page);

        /*
         * Both validation errors should be reported.
         */
        for (const pattern of tcData.expectedReasonPatterns) {
          await expectErrorReason(
            page,
            new RegExp(pattern, 'i')
          );
        }

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
        const tcData = testData.testCases.TC_FR16_19;
        await loginAsAdmin(page);

        await openImportPage(page);

        const productA =
          uniqueProduct(tcData.prefixes.productA);

        const productB =
          uniqueProduct(tcData.prefixes.productB);

        const productC =
          uniqueProduct(tcData.prefixes.productC);

        const rows = [
          tcData.rowTemplates[0].replace('{productA}', productA),
          tcData.rowTemplates[1].replace('{productB}', productB),
          tcData.rowTemplates[2].replace('{productC}', productC),
        ];

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            rows,
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
        );

        await expectImportSuccess(page);

        await expectSuccessCount(
          page,
          tcData.expectedSuccessCount
        );

        await expectErrorCount(
          page,
          tcData.expectedErrorCount
        );
      }
    );

    test(
      'TC_FR16_20 - Display error count and error reasons',
      async ({ page }) => {
        const tcData = testData.testCases.TC_FR16_20;
        await loginAsAdmin(page);

        await openImportPage(page);

        const productA =
          uniqueProduct(tcData.prefixes.productA);

        const productC =
          uniqueProduct(tcData.prefixes.productC);

        const rows = [
          tcData.rowTemplates[0].replace('{productA}', productA),
          tcData.rowTemplates[1],
          tcData.rowTemplates[2].replace('{productC}', productC),
        ];

        await importCsv(
          page,
          tcData.filename,
          createCsv(
            rows,
            testData.headers[tcData.headerType as keyof typeof testData.headers]
          )
        );

        await expectImportError(page);

        /*
         * Because the transaction is atomic, successful
         * imported rows must be zero.
         */
        await expectSuccessCount(
          page,
          tcData.expectedSuccessCount
        );

        /*
         * Two rows contain validation errors.
         */
        await expectErrorCount(
          page,
          tcData.expectedErrorCount
        );

        /*
         * Verify both error reasons are reported.
         */
        for (const pattern of tcData.expectedReasonPatterns) {
          await expectErrorReason(
            page,
            new RegExp(pattern, 'i')
          );
        }

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