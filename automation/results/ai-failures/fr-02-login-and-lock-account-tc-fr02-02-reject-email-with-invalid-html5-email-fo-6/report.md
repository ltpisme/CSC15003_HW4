# Error Context: TC_FR02_02 - Reject email with invalid HTML5 email format

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:110

6) tests/fr02.spec.ts:110:7 › FR-02 - Login and Lock Account › TC_FR02_02 - Reject email with invalid HTML5 email format
Duration: 5300ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type="email"], input[name="email"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[type="email"], input[name="email"]').first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type="email"], input[name="email"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[type="email"], input[name="email"]').first()

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:117:30
```

### Code Location
```typescript
  115 |     ).first();
  116 |
> 117 |     await expect(emailInput).toBeVisible();
      |                              ^
  118 |
  119 |     await emailInput.fill(INVALID_EMAIL);
  120 |
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
