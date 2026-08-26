# Error Context: TC_FR16_08 - Parse quoted comma in CSV field correctly

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:600

28) tests/fr16.spec.ts:600:7 › FR-16 - Import Products from CSV › TC_FR16_08 - Parse quoted comma in CSV field correctly
Duration: 5755ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type="email"], input[name="email"], input[name="username"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[type="email"], input[name="email"], input[name="username"]').first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type="email"], input[name="email"], input[name="username"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[type="email"], input[name="email"], input[name="username"]').first()

    at fillLoginForm (/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:136:28)
    at loginAsAdmin (/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:161:9)
    at /home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:603:9
```

### Code Location
```typescript
  134 |   ).first();
  135 |
> 136 |   await expect(emailInput).toBeVisible();
      |                            ^
  137 |   await expect(passwordInput).toBeVisible();
  138 |
  139 |   await emailInput.fill(email);
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
