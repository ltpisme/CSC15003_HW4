# Error Context: TC_FR02_09 - Account can login again after 30-second lock period

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:314

26) tests/fr02.spec.ts:314:7 › FR-02 - Login and Lock Account › TC_FR02_09 - Account can login again after 30-second lock period
Duration: 5132ms

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
    at failedLogin (/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:65:9)
    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:320:11
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
