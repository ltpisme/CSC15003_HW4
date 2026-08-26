# Error Context: TC_FR02_07 - Third consecutive failed login attempt locks account

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:199

20) tests/fr02.spec.ts:199:7 › FR-02 - Login and Lock Account › TC_FR02_07 - Third consecutive failed login attempt locks account
Duration: 5228ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type="password"], input[name="password"], form input[type="text"]:nth-of-type(2), form input:nth-of-type(2)').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[type="password"], input[name="password"], form input[type="text"]:nth-of-type(2), form input:nth-of-type(2)').first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type="password"], input[name="password"], form input[type="text"]:nth-of-type(2), form input:nth-of-type(2)').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[type="password"], input[name="password"], form input[type="text"]:nth-of-type(2), form input:nth-of-type(2)').first()

    at fillLoginForm (/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:39:31)
    at failedLogin (/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:61:3)
    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:205:7
```

### Code Location
```typescript
  37 |
  38 |   await expect(emailInput).toBeVisible();
> 39 |   await expect(passwordInput).toBeVisible();
     |                               ^
  40 |
  41 |   await emailInput.fill(email);
  42 |   await passwordInput.fill(password);
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
