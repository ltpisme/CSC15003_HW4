# Error Context: TC_FR16_20 - Display error count and error reasons

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:1008

57) tests/fr16.spec.ts:1008:7 › FR-16 - Import Products from CSV › TC_FR16_20 - Display error count and error reasons
Duration: 5133ms

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
    at /home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:1011:9
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
