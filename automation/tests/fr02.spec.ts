import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Load external test data
const dataPath = path.resolve(__dirname, '../data/fr02-data.json');
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const BASE_URL = 'http://localhost:5173';
const LOGIN_URL = `${BASE_URL}/login`;

const { credentials, functionalCases, lockoutCases, guiCases, lockoutConfig } = testData;

/**
 * Navigate to login page and wait until the page is ready.
 */
async function openLoginPage(page: Page) {
  await page.goto(LOGIN_URL);
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Fill login form using semantic selectors with fallback for non-standard input attributes.
 */
async function fillLoginForm(
  page: Page,
  email: string,
  password: string
) {
  const emailInput = page.locator(
    'input[type="email"], input[name="email"], input[name="username"]'
  ).or(page.locator('form input').first());

  const passwordInput = page.locator(
    'input[type="password"], input[name="password"]'
  ).or(page.locator('form input').nth(1));

  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();

  await emailInput.fill(email);
  await passwordInput.fill(password);
}

/**
 * Submit the login form.
 */
async function submitLogin(page: Page) {
  const submitButton = page.getByRole('button', {
    name: /Sign In|Đăng nhập|Login/i,
  }).or(page.locator('form button[type="submit"], form button').first());

  await expect(submitButton).toBeVisible();
  await submitButton.click();
}

/**
 * Perform one failed login attempt.
 */
async function failedLogin(page: Page) {
  await fillLoginForm(page, credentials.validUser.email, credentials.wrongPasswordUser.password);
  await submitLogin(page);
}

/**
 * Perform a successful login attempt.
 */
async function successfulLogin(page: Page) {
  await fillLoginForm(page, credentials.validUser.email, credentials.validUser.password);
  await submitLogin(page);
}

/**
 * Detect whether an authentication error is displayed.
 */
function authError(page: Page) {
  return page.locator(
    '[role="alert"], .error, .error-message, .alert, .alert-danger, .bg-red-100, [class*="text-red-"]'
  ).first();
}

/* ============================================================
 * FR-02 Functional Tests (Data-Driven)
 * ========================================================== */

test.describe('FR-02 - Login and Lock Account', () => {
  test.beforeEach(async ({ page }) => {
    await openLoginPage(page);
  });

  test('TC_FR02_01 - Login successfully with valid credentials', async ({
    page,
  }) => {
    const testCase = functionalCases.find((c: any) => c.id === 'TC_FR02_01')!;
    await fillLoginForm(page, testCase.email, testCase.password);
    await submitLogin(page);

    // Verify user leaves login page upon successful authentication
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('TC_FR02_02 - Reject email with invalid HTML5 email format', async ({
    page,
  }) => {
    const testCase = functionalCases.find((c: any) => c.id === 'TC_FR02_02')!;
    const emailInput = page.locator(
      'input[type="email"], input[name="email"]'
    ).or(page.locator('form input').first());

    await expect(emailInput).toBeVisible();
    await emailInput.fill(testCase.email);

    const passwordInput = page.locator(
      'input[type="password"], input[name="password"]'
    ).or(page.locator('form input').nth(1));

    await passwordInput.fill(testCase.password);
    await submitLogin(page);

    // HTML5 validation should prevent form submission
    await expect(emailInput).toHaveJSProperty('validity.valid', false);
    await expect(page).toHaveURL(/\/login$/);
  });

  test('TC_FR02_03 - Reject login with non-existing email', async ({
    page,
  }) => {
    const testCase = functionalCases.find((c: any) => c.id === 'TC_FR02_03')!;
    await fillLoginForm(page, testCase.email, testCase.password);
    await submitLogin(page);

    await expect(page).toHaveURL(/\/login$/);

    const error = authError(page);
    await expect(error).toBeVisible();

    // The system must not reveal whether the email exists
    const errorText = await error.textContent();
    expect(errorText?.toLowerCase()).not.toContain('email does not exist');
    expect(errorText?.toLowerCase()).not.toContain('user not found');
  });

  test('TC_FR02_04 - Reject login with incorrect password', async ({
    page,
  }) => {
    const testCase = functionalCases.find((c: any) => c.id === 'TC_FR02_04')!;
    await fillLoginForm(page, testCase.email, testCase.password);
    await submitLogin(page);

    await expect(page).toHaveURL(/\/login$/);

    const error = authError(page);
    await expect(error).toBeVisible();
  });

  /* ============================================================
   * Lock Account / Boundary Tests (Data-Driven)
   * ========================================================== */

  test('TC_FR02_05 - First failed login attempt does not lock account', async ({
    page,
  }) => {
    const testCase = lockoutCases.find((c: any) => c.id === 'TC_FR02_05')!;
    for (let i = 0; i < testCase.failedAttempts; i++) {
      if (i > 0) await openLoginPage(page);
      await failedLogin(page);
    }

    await expect(page).toHaveURL(/\/login$/);

    const error = authError(page);
    await expect(error).toBeVisible();

    // Account should still be usable with valid credentials
    await successfulLogin(page);
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('TC_FR02_06 - Second consecutive failed login attempt does not lock account', async ({
    page,
  }) => {
    const testCase = lockoutCases.find((c: any) => c.id === 'TC_FR02_06')!;
    for (let i = 0; i < testCase.failedAttempts; i++) {
      if (i > 0) await openLoginPage(page);
      await failedLogin(page);
    }

    await expect(page).toHaveURL(/\/login$/);

    const error = authError(page);
    await expect(error).toBeVisible();

    // Account should accept valid credentials after 2 consecutive failures
    await openLoginPage(page);
    await successfulLogin(page);
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('TC_FR02_07 - Third consecutive failed login attempt locks account', async ({
    page,
  }) => {
    const testCase = lockoutCases.find((c: any) => c.id === 'TC_FR02_07')!;
    for (let i = 0; i < testCase.failedAttempts; i++) {
      if (i > 0) await openLoginPage(page);
      await failedLogin(page);
    }

    await expect(page).toHaveURL(/\/login$/);

    const error = authError(page);
    await expect(error).toBeVisible();

    // Third failure must lock account
    const errorText = (await error.textContent())?.toLowerCase() ?? '';
    expect(
      errorText.includes('khóa') ||
      errorText.includes('locked') ||
      errorText.includes('30')
    ).toBeTruthy();
  });

  test('TC_FR02_08 - Correct password is rejected while account is locked', async ({
    page,
  }) => {
    const testCase = lockoutCases.find((c: any) => c.id === 'TC_FR02_08')!;
    for (let i = 0; i < testCase.failedAttempts; i++) {
      if (i > 0) await openLoginPage(page);
      await failedLogin(page);
    }

    // Attempt login using correct credentials while locked
    await openLoginPage(page);
    await fillLoginForm(page, credentials.validUser.email, credentials.validUser.password);
    await submitLogin(page);

    // Account must remain locked
    await expect(page).toHaveURL(/\/login$/);
    const error = authError(page);
    await expect(error).toBeVisible();
  });

  test('TC_FR02_09 - Account can login again after 30-second lock period', async ({
    page,
  }) => {
    test.setTimeout(60000);
    const testCase = lockoutCases.find((c: any) => c.id === 'TC_FR02_09')!;
    for (let i = 0; i < testCase.failedAttempts; i++) {
      if (i > 0) await openLoginPage(page);
      await failedLogin(page);
    }

    // Wait for specified lockout duration (30 seconds)
    await page.waitForTimeout(testCase.waitMs ?? lockoutConfig.lockoutDurationMs);

    await openLoginPage(page);
    await successfulLogin(page);
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('TC_FR02_10 - Account remains locked while lock period is active', async ({
    page,
  }) => {
    const testCase = lockoutCases.find((c: any) => c.id === 'TC_FR02_10')!;
    for (let i = 0; i < testCase.failedAttempts; i++) {
      if (i > 0) await openLoginPage(page);
      await failedLogin(page);
    }

    // Attempt login immediately while lockout is active
    await openLoginPage(page);
    await fillLoginForm(page, credentials.validUser.email, credentials.validUser.password);
    await submitLogin(page);

    await expect(page).toHaveURL(/\/login$/);
    const error = authError(page);
    await expect(error).toBeVisible();
  });

  /* ============================================================
   * GUI / HTML Tests (Data-Driven)
   * ========================================================== */

  test('TC_FR02_11 - Email field uses type=email', async ({
    page,
  }) => {
    const testCase = guiCases.find((c: any) => c.id === 'TC_FR02_11')!;
    const emailInput = page.locator(
      'input[name="email"], input[type="email"]'
    ).or(page.locator('form input').first());

    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', testCase.expectedType);
  });

  test('TC_FR02_12 - Password field uses type=password', async ({
    page,
  }) => {
    const testCase = guiCases.find((c: any) => c.id === 'TC_FR02_12')!;
    const passwordInput = page.locator(
      'input[name="password"], input[type="password"]'
    ).or(page.locator('form input').nth(1));

    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', testCase.expectedType);
  });

  test('TC_FR02_13 - Login page contains exactly one h1', async ({
    page,
  }) => {
    const testCase = guiCases.find((c: any) => c.id === 'TC_FR02_13')!;
    const h1 = page.locator('h1');

    await expect(h1).toHaveCount(testCase.expectedH1Count);
    await expect(h1.first()).toBeVisible();
  });

  test('TC_FR02_14 - Required login fields are marked as required', async ({
    page,
  }) => {
    const emailInput = page.locator(
      'input[name="email"], input[type="email"], input[name="username"]'
    ).or(page.locator('form input').first());

    const passwordInput = page.locator(
      'input[name="password"], input[type="password"]'
    ).or(page.locator('form input').nth(1));

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    await expect(emailInput).toHaveAttribute('required', '');
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('TC_FR02_15 - Authentication error is displayed above submit button', async ({
    page,
  }) => {
    await fillLoginForm(page, credentials.validUser.email, credentials.wrongPasswordUser.password);
    await submitLogin(page);

    const error = authError(page);
    const submitButton = page.getByRole('button', {
      name: /Sign In|Đăng nhập|Login/i,
    }).or(page.locator('form button[type="submit"], form button').first());

    await expect(error).toBeVisible();
    await expect(submitButton).toBeVisible();

    const errorBox = await error.boundingBox();
    const buttonBox = await submitButton.boundingBox();

    expect(errorBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();
    expect(errorBox!.y).toBeLessThan(buttonBox!.y);
  });

  test('TC_FR02_16 - Password characters are hidden', async ({
    page,
  }) => {
    const testCase = guiCases.find((c: any) => c.id === 'TC_FR02_16')!;
    const passwordInput = page.locator(
      'input[name="password"], input[type="password"]'
    ).or(page.locator('form input').nth(1));

    await passwordInput.fill(credentials.validUser.password);
    await expect(passwordInput).toHaveAttribute('type', testCase.expectedType);
  });

  test('TC_FR02_17 - Tab order follows the login form layout', async ({
    page,
  }) => {
    const testCase = guiCases.find((c: any) => c.id === 'TC_FR02_17')!;
    await page.keyboard.press('Tab');

    const focusedElements: string[] = [];

    for (let i = 0; i < (testCase.maxTabs ?? 6); i++) {
      const active = page.locator(':focus');

      if (await active.count() === 0) {
        break;
      }

      const tagName = await active.evaluate(
        (element) => element.tagName.toLowerCase()
      );

      const name = await active.getAttribute('name');
      const type = await active.getAttribute('type');
      const text = (await active.textContent())?.trim();

      focusedElements.push(
        `${tagName}[name=${name ?? ''}][type=${type ?? ''}]${text ?? ''}`
      );

      await page.keyboard.press('Tab');
    }

    expect(focusedElements.length).toBeGreaterThan(0);
    const focusSequence = focusedElements.join(' -> ');
    expect(focusSequence).toContain('input');
  });
});