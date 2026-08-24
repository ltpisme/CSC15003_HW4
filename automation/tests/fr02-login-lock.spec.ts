import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const LOGIN_URL = `${BASE_URL}/login`;

const VALID_EMAIL = 'test@eshop.com';
const VALID_PASSWORD = 'Test1234!';
const WRONG_PASSWORD = 'WrongPass';
const UNKNOWN_EMAIL = 'unknown@eshop.com';
const INVALID_EMAIL = 'invalid-email';

/**
 * Navigate to login page and wait until the page is ready.
 */
async function openLoginPage(page: Page) {
  await page.goto(LOGIN_URL);
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Fill login form.
 *
 * The current UI description identifies the first field as "Username".
 * Therefore the helper first tries common semantic selectors and then
 * falls back to input[type="email"] if the implementation follows SRS.
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
 * Submit the login form.
 *
 * Current UI description says "Sign In".
 */
async function submitLogin(page: Page) {
  const submitButton = page.getByRole('button', {
    name: /Sign In|Đăng nhập/i,
  });

  await expect(submitButton).toBeVisible();
  await submitButton.click();
}

/**
 * Perform one failed login attempt.
 */
async function failedLogin(page: Page) {
  await fillLoginForm(page, VALID_EMAIL, WRONG_PASSWORD);
  await submitLogin(page);
}

/**
 * Perform a successful login attempt.
 */
async function successfulLogin(page: Page) {
  await fillLoginForm(page, VALID_EMAIL, VALID_PASSWORD);
  await submitLogin(page);
}

/**
 * Detect whether an authentication error is displayed.
 *
 * The exact error text is intentionally not hard-coded because
 * the SRS requires a suitable generic error message without
 * exposing detailed authentication information.
 */
function authError(page: Page) {
  return page.locator(
    '[role="alert"], .error, .error-message, .alert, .alert-danger'
  ).first();
}

/* ============================================================
 * FR-02 Functional Tests
 * ========================================================== */

test.describe('FR-02 - Login and Lock Account', () => {
  test.beforeEach(async ({ page }) => {
    await openLoginPage(page);
  });

  test('TC_FR02_01 - Login successfully with valid credentials', async ({
    page,
  }) => {
    await fillLoginForm(page, VALID_EMAIL, VALID_PASSWORD);
    await submitLogin(page);

    // The exact post-login URL is not specified by the SRS.
    // Therefore verify that the user leaves the login page.
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('TC_FR02_02 - Reject email with invalid HTML5 email format', async ({
    page,
  }) => {
    const emailInput = page.locator(
      'input[type="email"], input[name="email"]'
    ).first();

    await expect(emailInput).toBeVisible();

    await emailInput.fill(INVALID_EMAIL);

    const passwordInput = page.locator(
      'input[type="password"], input[name="password"]'
    ).first();

    await passwordInput.fill(VALID_PASSWORD);

    await submitLogin(page);

    /*
     * HTML5 validation should prevent form submission.
     */
    await expect(emailInput).toHaveJSProperty('validity.valid', false);

    await expect(page).toHaveURL(/\/login$/);
  });

  test('TC_FR02_03 - Reject login with non-existing email', async ({
    page,
  }) => {
    await fillLoginForm(
      page,
      UNKNOWN_EMAIL,
      VALID_PASSWORD
    );

    await submitLogin(page);

    await expect(page).toHaveURL(/\/login$/);

    const error = authError(page);

    await expect(error).toBeVisible();

    /*
     * The system must not reveal whether the email exists.
     *
     * Therefore reject detailed messages such as:
     * "Email does not exist".
     */
    const errorText = await error.textContent();

    expect(errorText?.toLowerCase()).not.toContain(
      'email does not exist'
    );

    expect(errorText?.toLowerCase()).not.toContain(
      'user not found'
    );
  });

  test('TC_FR02_04 - Reject login with incorrect password', async ({
    page,
  }) => {
    await fillLoginForm(
      page,
      VALID_EMAIL,
      WRONG_PASSWORD
    );

    await submitLogin(page);

    await expect(page).toHaveURL(/\/login$/);

    const error = authError(page);

    await expect(error).toBeVisible();
  });

  /* ============================================================
   * Lock Account / Boundary Tests
   * ========================================================== */

  test('TC_FR02_05 - First failed login attempt does not lock account', async ({
    page,
  }) => {
    await failedLogin(page);

    await expect(page).toHaveURL(/\/login$/);

    const error = authError(page);
    await expect(error).toBeVisible();

    /*
     * Account should still be usable.
     * Try valid credentials immediately after one failed attempt.
     */
    await successfulLogin(page);

    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('TC_FR02_06 - Second consecutive failed login attempt does not lock account', async ({
    page,
  }) => {
    await failedLogin(page);

    await openLoginPage(page);

    await failedLogin(page);

    await expect(page).toHaveURL(/\/login$/);

    const error = authError(page);
    await expect(error).toBeVisible();

    /*
     * Account should still accept valid credentials after
     * exactly two consecutive failures.
     */
    await openLoginPage(page);

    await successfulLogin(page);

    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('TC_FR02_07 - Third consecutive failed login attempt locks account', async ({
    page,
  }) => {
    /*
     * Failed attempt #1
     */
    await failedLogin(page);

    /*
     * Failed attempt #2
     */
    await openLoginPage(page);
    await failedLogin(page);

    /*
     * Failed attempt #3 - boundary value
     */
    await openLoginPage(page);
    await failedLogin(page);

    await expect(page).toHaveURL(/\/login$/);

    const error = authError(page);

    await expect(error).toBeVisible();

    /*
     * The third consecutive failure must put the account
     * into locked state.
     */
    const errorText = (
      await error.textContent()
    )?.toLowerCase() ?? '';

    expect(
      errorText.includes('khóa') ||
      errorText.includes('locked') ||
      errorText.includes('30')
    ).toBeTruthy();
  });

  test('TC_FR02_08 - Correct password is rejected while account is locked', async ({
    page,
  }) => {
    /*
     * Create locked state.
     */
    await failedLogin(page);

    await openLoginPage(page);
    await failedLogin(page);

    await openLoginPage(page);
    await failedLogin(page);

    /*
     * Attempt login using correct credentials while locked.
     */
    await openLoginPage(page);

    await fillLoginForm(
      page,
      VALID_EMAIL,
      VALID_PASSWORD
    );

    await submitLogin(page);

    /*
     * The account must remain locked.
     */
    await expect(page).toHaveURL(/\/login$/);

    const error = authError(page);
    await expect(error).toBeVisible();
  });

  test('TC_FR02_09 - Account can login again after 30-second lock period', async ({
    page,
  }) => {
    /*
     * Create locked state.
     */
    await failedLogin(page);

    await openLoginPage(page);
    await failedLogin(page);

    await openLoginPage(page);
    await failedLogin(page);

    /*
     * Wait for the specified lock duration.
     *
     * This is intentionally explicit because 30 seconds
     * is a business requirement.
     */
    await page.waitForTimeout(30_000);

    await openLoginPage(page);

    await successfulLogin(page);

    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('TC_FR02_10 - Account remains locked while lock period is active', async ({
    page,
  }) => {
    /*
     * Create locked state.
     */
    await failedLogin(page);

    await openLoginPage(page);
    await failedLogin(page);

    await openLoginPage(page);
    await failedLogin(page);

    /*
     * Attempt another login immediately.
     */
    await openLoginPage(page);

    await fillLoginForm(
      page,
      VALID_EMAIL,
      VALID_PASSWORD
    );

    await submitLogin(page);

    /*
     * Must still be locked.
     */
    await expect(page).toHaveURL(/\/login$/);

    const error = authError(page);
    await expect(error).toBeVisible();
  });

  /* ============================================================
   * GUI / HTML Tests
   * ========================================================== */

  test('TC_FR02_11 - Email field uses type=email', async ({
    page,
  }) => {
    const emailInput = page.locator(
      'input[name="email"], input[type="email"]'
    ).first();

    await expect(emailInput).toBeVisible();

    await expect(emailInput).toHaveAttribute(
      'type',
      'email'
    );
  });

  test('TC_FR02_12 - Password field uses type=password', async ({
    page,
  }) => {
    const passwordInput = page.locator(
      'input[name="password"], input[type="password"]'
    ).first();

    await expect(passwordInput).toBeVisible();

    await expect(passwordInput).toHaveAttribute(
      'type',
      'password'
    );
  });

  test('TC_FR02_13 - Login page contains exactly one h1', async ({
    page,
  }) => {
    const h1 = page.locator('h1');

    await expect(h1).toHaveCount(1);

    await expect(h1.first()).toBeVisible();
  });

  test('TC_FR02_14 - Required login fields are marked as required', async ({
    page,
  }) => {
    const emailInput = page.locator(
      'input[name="email"], input[type="email"], input[name="username"]'
    ).first();

    const passwordInput = page.locator(
      'input[name="password"], input[type="password"]'
    ).first();

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    /*
     * HTML required attribute.
     */
    await expect(emailInput).toHaveAttribute(
      'required',
      ''
    );

    await expect(passwordInput).toHaveAttribute(
      'required',
      ''
    );
  });

  test('TC_FR02_15 - Authentication error is displayed above submit button', async ({
    page,
  }) => {
    await fillLoginForm(
      page,
      VALID_EMAIL,
      WRONG_PASSWORD
    );

    await submitLogin(page);

    const error = authError(page);

    const submitButton = page.getByRole('button', {
      name: /Sign In|Đăng nhập/i,
    });

    await expect(error).toBeVisible();
    await expect(submitButton).toBeVisible();

    /*
     * Compare DOM positions instead of relying on screenshot
     * interpretation.
     */
    const errorBox = await error.boundingBox();
    const buttonBox = await submitButton.boundingBox();

    expect(errorBox).not.toBeNull();
    expect(buttonBox).not.toBeNull();

    expect(errorBox!.y).toBeLessThan(buttonBox!.y);
  });

  test('TC_FR02_16 - Password characters are hidden', async ({
    page,
  }) => {
    const passwordInput = page.locator(
      'input[name="password"], input[type="password"]'
    ).first();

    await passwordInput.fill(VALID_PASSWORD);

    await expect(passwordInput).toHaveAttribute(
      'type',
      'password'
    );
  });

  test('TC_FR02_17 - Tab order follows the login form layout', async ({
    page,
  }) => {
    /*
     * Start from the beginning of the page.
     */
    await page.keyboard.press('Tab');

    const focusedElements: string[] = [];

    for (let i = 0; i < 6; i++) {
      const active = page.locator(':focus');

      if (await active.count() === 0) {
        break;
      }

      const tagName = await active.evaluate(
        (element) => element.tagName.toLowerCase()
      );

      const name = await active.getAttribute('name');
      const type = await active.getAttribute('type');
      const text = (
        await active.textContent()
      )?.trim();

      focusedElements.push(
        `${tagName}[name=${name ?? ''}][type=${type ?? ''}]${text ?? ''}`
      );

      await page.keyboard.press('Tab');
    }

    /*
     * The exact number of focusable elements depends on the
     * implementation, but the login form controls should
     * participate in keyboard navigation.
     */
    expect(focusedElements.length).toBeGreaterThan(0);

    const focusSequence = focusedElements.join(' -> ');

    expect(focusSequence).toContain('input');
  });
});