# Error Context: TC_FR02_06 - Second consecutive failed login attempt does not lock account

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:179

26) tests/fr02.spec.ts:179:7 › FR-02 - Login and Lock Account › TC_FR02_06 - Second consecutive failed login attempt does not lock account
Duration: 5586ms

### Error
```
Error: expect(page).not.toHaveURL(expected) failed

Expected pattern: not /\/login$/
Received string: "http://localhost:5173/login"
Timeout: 5000ms

Call log:
  - Expect "not toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://localhost:5173/login"

```

### Stack Trace
```
Error: expect(page).not.toHaveURL(expected) failed

Expected pattern: not /\/login$/
Received string: "http://localhost:5173/login"
Timeout: 5000ms

Call log:
  - Expect "not toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="en">…</html>
       - unexpected value "http://localhost:5173/login"

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:196:28
```

### Code Location
```typescript
  194 |     await openLoginPage(page);
  195 |     await successfulLogin(page);
> 196 |     await expect(page).not.toHaveURL(/\/login$/);
      |                            ^
  197 |   });
  198 |
  199 |   test('TC_FR02_07 - Third consecutive failed login attempt locks account', async ({
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
