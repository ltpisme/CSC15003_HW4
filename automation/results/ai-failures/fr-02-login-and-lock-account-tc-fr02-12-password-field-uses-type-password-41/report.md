# Error Context: TC_FR02_12 - Password field uses type=password

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:294

41) tests/fr02.spec.ts:294:7 › FR-02 - Login and Lock Account › TC_FR02_12 - Password field uses type=password
Duration: 5814ms

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

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:302:33
```

### Code Location
```typescript
  300 |     ).first();
  301 |
> 302 |     await expect(passwordInput).toBeVisible();
      |                                 ^
  303 |     await expect(passwordInput).toHaveAttribute('type', testCase.expectedType);
  304 |   });
  305 |
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
