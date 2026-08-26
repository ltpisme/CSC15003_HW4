# Error Context: TC_FR02_16 - Password characters are hidden

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:357

76) tests/fr02.spec.ts:357:7 › FR-02 - Login and Lock Account › TC_FR02_16 - Password characters are hidden
Duration: 5196ms

### Error
```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('input[name="password"], input[type="password"]').or(locator('form input').nth(1))
Expected: "password"
Received: "text"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('input[name="password"], input[type="password"]').or(locator('form input').nth(1))
    14 × locator resolved to <input required="" type="text" value="Test1234!" class="w-full border p-2 rounded"/>
       - unexpected value "text"

```

### Stack Trace
```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('input[name="password"], input[type="password"]').or(locator('form input').nth(1))
Expected: "password"
Received: "text"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('input[name="password"], input[type="password"]').or(locator('form input').nth(1))
    14 × locator resolved to <input required="" type="text" value="Test1234!" class="w-full border p-2 rounded"/>
       - unexpected value "text"

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:366:33
```

### Code Location
```typescript
  364 |
  365 |     await passwordInput.fill(credentials.validUser.password);
> 366 |     await expect(passwordInput).toHaveAttribute('type', testCase.expectedType);
      |                                 ^
  367 |   });
  368 |
  369 |   test('TC_FR02_17 - Tab order follows the login form layout', async ({
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
