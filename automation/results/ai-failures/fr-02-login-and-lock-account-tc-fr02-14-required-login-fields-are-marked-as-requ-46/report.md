# Error Context: TC_FR02_14 - Required login fields are marked as required

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:423

46) tests/fr02.spec.ts:423:7 › FR-02 - Login and Lock Account › TC_FR02_14 - Required login fields are marked as required
Duration: 5801ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[name="email"], input[type="email"], input[name="username"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[name="email"], input[type="email"], input[name="username"]').first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[name="email"], input[type="email"], input[name="username"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[name="email"], input[type="email"], input[name="username"]').first()

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:434:30
```

### Code Location
```typescript
  432 |     ).first();
  433 |
> 434 |     await expect(emailInput).toBeVisible();
      |                              ^
  435 |     await expect(passwordInput).toBeVisible();
  436 |
  437 |     /*
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
