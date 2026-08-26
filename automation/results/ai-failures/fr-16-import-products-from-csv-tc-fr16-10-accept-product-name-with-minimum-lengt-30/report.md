# Error Context: TC_FR16_10 - Accept product name with minimum length 1

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:668

30) tests/fr16.spec.ts:668:7 › FR-16 - Import Products from CSV › TC_FR16_10 - Accept product name with minimum length 1
Duration: 5239ms

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

    at fillLoginForm (/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:135:28)
    at loginAsAdmin (/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:160:9)
    at /home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:672:9
```

### Code Location
```typescript
  133 |   ).first();
  134 |
> 135 |   await expect(emailInput).toBeVisible();
      |                            ^
  136 |   await expect(passwordInput).toBeVisible();
  137 |
  138 |   await emailInput.fill(email);
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
