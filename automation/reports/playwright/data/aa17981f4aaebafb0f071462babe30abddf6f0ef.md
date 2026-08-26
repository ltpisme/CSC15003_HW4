# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr02.spec.ts >> FR-02 - Login and Lock Account >> TC_FR02_07 - Third consecutive failed login attempt locks account
- Location: tests/fr02.spec.ts:199:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=f2e3]:
  - banner [ref=f2e4]:
    - link "EShop" [ref=f2e5] [cursor=pointer]:
      - /url: /
    - navigation [ref=f2e6]:
      - link "Giỏ hàng" [ref=f2e7] [cursor=pointer]:
        - /url: /cart
      - link "Đăng nhập" [ref=f2e8] [cursor=pointer]:
        - /url: /login
      - link "Đăng ký" [ref=f2e9] [cursor=pointer]:
        - /url: /register
  - main [ref=f2e10]:
    - generic [ref=f2e11]:
      - heading "Đăng Ký" [level=2] [ref=f2e12]
      - generic [ref=f2e13]:
        - generic [ref=f2e14]:
          - generic [ref=f2e15]: Username
          - textbox [ref=f2e16]: test@eshop.com
        - generic [ref=f2e17]:
          - generic [ref=f2e18]: Mật khẩu
          - textbox [ref=f2e19]: WrongPass
        - link "Quên mật khẩu?" [ref=f2e21] [cursor=pointer]:
          - /url: /forgot-password
        - button "Sign In" [active] [ref=f2e22] [cursor=pointer]
        - generic [ref=f2e23]:
          - text: Chưa có tài khoản?
          - link "Đăng ký ngay" [ref=f2e24] [cursor=pointer]:
            - /url: /register
      - generic [ref=f2e25]: Đăng nhập thất bại. Vui lòng kiểm tra lại.
  - contentinfo [ref=f2e26]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  119 | 
  120 |     // HTML5 validation should prevent form submission
  121 |     await expect(emailInput).toHaveJSProperty('validity.valid', false);
  122 |     await expect(page).toHaveURL(/\/login$/);
  123 |   });
  124 | 
  125 |   test('TC_FR02_03 - Reject login with non-existing email', async ({
  126 |     page,
  127 |   }) => {
  128 |     const testCase = functionalCases.find((c: any) => c.id === 'TC_FR02_03')!;
  129 |     await fillLoginForm(page, testCase.email, testCase.password);
  130 |     await submitLogin(page);
  131 | 
  132 |     await expect(page).toHaveURL(/\/login$/);
  133 | 
  134 |     const error = authError(page);
  135 |     await expect(error).toBeVisible();
  136 | 
  137 |     // The system must not reveal whether the email exists
  138 |     const errorText = await error.textContent();
  139 |     expect(errorText?.toLowerCase()).not.toContain('email does not exist');
  140 |     expect(errorText?.toLowerCase()).not.toContain('user not found');
  141 |   });
  142 | 
  143 |   test('TC_FR02_04 - Reject login with incorrect password', async ({
  144 |     page,
  145 |   }) => {
  146 |     const testCase = functionalCases.find((c: any) => c.id === 'TC_FR02_04')!;
  147 |     await fillLoginForm(page, testCase.email, testCase.password);
  148 |     await submitLogin(page);
  149 | 
  150 |     await expect(page).toHaveURL(/\/login$/);
  151 | 
  152 |     const error = authError(page);
  153 |     await expect(error).toBeVisible();
  154 |   });
  155 | 
  156 |   /* ============================================================
  157 |    * Lock Account / Boundary Tests (Data-Driven)
  158 |    * ========================================================== */
  159 | 
  160 |   test('TC_FR02_05 - First failed login attempt does not lock account', async ({
  161 |     page,
  162 |   }) => {
  163 |     const testCase = lockoutCases.find((c: any) => c.id === 'TC_FR02_05')!;
  164 |     for (let i = 0; i < testCase.failedAttempts; i++) {
  165 |       if (i > 0) await openLoginPage(page);
  166 |       await failedLogin(page);
  167 |     }
  168 | 
  169 |     await expect(page).toHaveURL(/\/login$/);
  170 | 
  171 |     const error = authError(page);
  172 |     await expect(error).toBeVisible();
  173 | 
  174 |     // Account should still be usable with valid credentials
  175 |     await successfulLogin(page);
  176 |     await expect(page).not.toHaveURL(/\/login$/);
  177 |   });
  178 | 
  179 |   test('TC_FR02_06 - Second consecutive failed login attempt does not lock account', async ({
  180 |     page,
  181 |   }) => {
  182 |     const testCase = lockoutCases.find((c: any) => c.id === 'TC_FR02_06')!;
  183 |     for (let i = 0; i < testCase.failedAttempts; i++) {
  184 |       if (i > 0) await openLoginPage(page);
  185 |       await failedLogin(page);
  186 |     }
  187 | 
  188 |     await expect(page).toHaveURL(/\/login$/);
  189 | 
  190 |     const error = authError(page);
  191 |     await expect(error).toBeVisible();
  192 | 
  193 |     // Account should accept valid credentials after 2 consecutive failures
  194 |     await openLoginPage(page);
  195 |     await successfulLogin(page);
  196 |     await expect(page).not.toHaveURL(/\/login$/);
  197 |   });
  198 | 
  199 |   test('TC_FR02_07 - Third consecutive failed login attempt locks account', async ({
  200 |     page,
  201 |   }) => {
  202 |     const testCase = lockoutCases.find((c: any) => c.id === 'TC_FR02_07')!;
  203 |     for (let i = 0; i < testCase.failedAttempts; i++) {
  204 |       if (i > 0) await openLoginPage(page);
  205 |       await failedLogin(page);
  206 |     }
  207 | 
  208 |     await expect(page).toHaveURL(/\/login$/);
  209 | 
  210 |     const error = authError(page);
  211 |     await expect(error).toBeVisible();
  212 | 
  213 |     // Third failure must lock account
  214 |     const errorText = (await error.textContent())?.toLowerCase() ?? '';
  215 |     expect(
  216 |       errorText.includes('khóa') ||
  217 |       errorText.includes('locked') ||
  218 |       errorText.includes('30')
> 219 |     ).toBeTruthy();
      |       ^ Error: expect(received).toBeTruthy()
  220 |   });
  221 | 
  222 |   test('TC_FR02_08 - Correct password is rejected while account is locked', async ({
  223 |     page,
  224 |   }) => {
  225 |     const testCase = lockoutCases.find((c: any) => c.id === 'TC_FR02_08')!;
  226 |     for (let i = 0; i < testCase.failedAttempts; i++) {
  227 |       if (i > 0) await openLoginPage(page);
  228 |       await failedLogin(page);
  229 |     }
  230 | 
  231 |     // Attempt login using correct credentials while locked
  232 |     await openLoginPage(page);
  233 |     await fillLoginForm(page, credentials.validUser.email, credentials.validUser.password);
  234 |     await submitLogin(page);
  235 | 
  236 |     // Account must remain locked
  237 |     await expect(page).toHaveURL(/\/login$/);
  238 |     const error = authError(page);
  239 |     await expect(error).toBeVisible();
  240 |   });
  241 | 
  242 |   test('TC_FR02_09 - Account can login again after 30-second lock period', async ({
  243 |     page,
  244 |   }) => {
  245 |     const testCase = lockoutCases.find((c: any) => c.id === 'TC_FR02_09')!;
  246 |     for (let i = 0; i < testCase.failedAttempts; i++) {
  247 |       if (i > 0) await openLoginPage(page);
  248 |       await failedLogin(page);
  249 |     }
  250 | 
  251 |     // Wait for specified lockout duration (30 seconds)
  252 |     await page.waitForTimeout(testCase.waitMs ?? lockoutConfig.lockoutDurationMs);
  253 | 
  254 |     await openLoginPage(page);
  255 |     await successfulLogin(page);
  256 |     await expect(page).not.toHaveURL(/\/login$/);
  257 |   });
  258 | 
  259 |   test('TC_FR02_10 - Account remains locked while lock period is active', async ({
  260 |     page,
  261 |   }) => {
  262 |     const testCase = lockoutCases.find((c: any) => c.id === 'TC_FR02_10')!;
  263 |     for (let i = 0; i < testCase.failedAttempts; i++) {
  264 |       if (i > 0) await openLoginPage(page);
  265 |       await failedLogin(page);
  266 |     }
  267 | 
  268 |     // Attempt login immediately while lockout is active
  269 |     await openLoginPage(page);
  270 |     await fillLoginForm(page, credentials.validUser.email, credentials.validUser.password);
  271 |     await submitLogin(page);
  272 | 
  273 |     await expect(page).toHaveURL(/\/login$/);
  274 |     const error = authError(page);
  275 |     await expect(error).toBeVisible();
  276 |   });
  277 | 
  278 |   /* ============================================================
  279 |    * GUI / HTML Tests (Data-Driven)
  280 |    * ========================================================== */
  281 | 
  282 |   test('TC_FR02_11 - Email field uses type=email', async ({
  283 |     page,
  284 |   }) => {
  285 |     const testCase = guiCases.find((c: any) => c.id === 'TC_FR02_11')!;
  286 |     const emailInput = page.locator(
  287 |       'input[name="email"], input[type="email"]'
  288 |     ).or(page.locator('form input').first());
  289 | 
  290 |     await expect(emailInput).toBeVisible();
  291 |     await expect(emailInput).toHaveAttribute('type', testCase.expectedType);
  292 |   });
  293 | 
  294 |   test('TC_FR02_12 - Password field uses type=password', async ({
  295 |     page,
  296 |   }) => {
  297 |     const testCase = guiCases.find((c: any) => c.id === 'TC_FR02_12')!;
  298 |     const passwordInput = page.locator(
  299 |       'input[name="password"], input[type="password"]'
  300 |     ).or(page.locator('form input').nth(1));
  301 | 
  302 |     await expect(passwordInput).toBeVisible();
  303 |     await expect(passwordInput).toHaveAttribute('type', testCase.expectedType);
  304 |   });
  305 | 
  306 |   test('TC_FR02_13 - Login page contains exactly one h1', async ({
  307 |     page,
  308 |   }) => {
  309 |     const testCase = guiCases.find((c: any) => c.id === 'TC_FR02_13')!;
  310 |     const h1 = page.locator('h1');
  311 | 
  312 |     await expect(h1).toHaveCount(testCase.expectedH1Count);
  313 |     await expect(h1.first()).toBeVisible();
  314 |   });
  315 | 
  316 |   test('TC_FR02_14 - Required login fields are marked as required', async ({
  317 |     page,
  318 |   }) => {
  319 |     const emailInput = page.locator(
```