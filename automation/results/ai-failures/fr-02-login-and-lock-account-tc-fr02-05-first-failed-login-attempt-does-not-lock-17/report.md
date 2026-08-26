# Error Context: TC_FR02_05 - First failed login attempt does not lock account

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:160

17) tests/fr02.spec.ts:160:7 › FR-02 - Login and Lock Account › TC_FR02_05 - First failed login attempt does not lock account
Duration: 5555ms

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

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:176:28
```

### Code Location
```typescript
  174 |     // Account should still be usable with valid credentials
  175 |     await successfulLogin(page);
> 176 |     await expect(page).not.toHaveURL(/\/login$/);
      |                            ^
  177 |   });
  178 |
  179 |   test('TC_FR02_06 - Second consecutive failed login attempt does not lock account', async ({
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
