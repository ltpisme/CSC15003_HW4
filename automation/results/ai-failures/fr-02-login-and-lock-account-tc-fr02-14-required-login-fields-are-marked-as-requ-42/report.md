# Error Context: TC_FR02_14 - Required login fields are marked as required

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:316

42) tests/fr02.spec.ts:316:7 › FR-02 - Login and Lock Account › TC_FR02_14 - Required login fields are marked as required
Duration: 5337ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[name="password"], input[type="password"], form input:nth-of-type(2)').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[name="password"], input[type="password"], form input:nth-of-type(2)').first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[name="password"], input[type="password"], form input:nth-of-type(2)').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[name="password"], input[type="password"], form input:nth-of-type(2)').first()

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:328:33
```

### Code Location
```typescript
  326 |
  327 |     await expect(emailInput).toBeVisible();
> 328 |     await expect(passwordInput).toBeVisible();
      |                                 ^
  329 |
  330 |     await expect(emailInput).toHaveAttribute('required', '');
  331 |     await expect(passwordInput).toHaveAttribute('required', '');
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
