# Error Context: TC_FR02_12 - Password field uses type=password

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:398

33) tests/fr02.spec.ts:398:7 › FR-02 - Login and Lock Account › TC_FR02_12 - Password field uses type=password
Duration: 5141ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[name="password"], input[type="password"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[name="password"], input[type="password"]').first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[name="password"], input[type="password"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[name="password"], input[type="password"]').first()

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:405:33
```

### Code Location
```typescript
  403 |     ).first();
  404 |
> 405 |     await expect(passwordInput).toBeVisible();
      |                                 ^
  406 |
  407 |     await expect(passwordInput).toHaveAttribute(
  408 |       'type',
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
