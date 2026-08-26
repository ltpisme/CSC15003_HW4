# Error Context: TC_FR02_11 - Email field uses type=email

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:383

33) tests/fr02.spec.ts:383:7 › FR-02 - Login and Lock Account › TC_FR02_11 - Email field uses type=email
Duration: 5246ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[name="email"], input[type="email"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[name="email"], input[type="email"]').first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[name="email"], input[type="email"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[name="email"], input[type="email"]').first()

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:390:30
```

### Code Location
```typescript
  388 |     ).first();
  389 |
> 390 |     await expect(emailInput).toBeVisible();
      |                              ^
  391 |
  392 |     await expect(emailInput).toHaveAttribute(
  393 |       'type',
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
