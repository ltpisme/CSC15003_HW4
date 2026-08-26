# Error Context: TC_FR02_12 - Password field uses type=password

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:295

159) tests/fr02.spec.ts:295:7 › FR-02 - Login and Lock Account › TC_FR02_12 - Password field uses type=password
Duration: 5460ms

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
    14 × locator resolved to <input value="" required="" type="text" class="w-full border p-2 rounded"/>
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
    14 × locator resolved to <input value="" required="" type="text" class="w-full border p-2 rounded"/>
       - unexpected value "text"

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:304:33
```

### Code Location
```typescript
  302 |
  303 |     await expect(passwordInput).toBeVisible();
> 304 |     await expect(passwordInput).toHaveAttribute('type', testCase.expectedType);
      |                                 ^
  305 |   });
  306 |
  307 |   test('TC_FR02_13 - Login page contains exactly one h1', async ({
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
