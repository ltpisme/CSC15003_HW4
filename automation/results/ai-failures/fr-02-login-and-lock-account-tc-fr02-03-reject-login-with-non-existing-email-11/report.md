# Error Context: TC_FR02_03 - Reject login with non-existing email

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:137

11) tests/fr02.spec.ts:137:7 › FR-02 - Login and Lock Account › TC_FR02_03 - Reject login with non-existing email
Duration: 5751ms

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

    at fillLoginForm (/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:40:28)
    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:140:11
```

### Code Location
```typescript
  38 |   ).first();
  39 |
> 40 |   await expect(emailInput).toBeVisible();
     |                            ^
  41 |   await expect(passwordInput).toBeVisible();
  42 |
  43 |   await emailInput.fill(email);
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
