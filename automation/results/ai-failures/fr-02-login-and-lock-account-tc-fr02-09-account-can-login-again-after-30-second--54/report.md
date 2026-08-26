# Error Context: TC_FR02_09 - Account can login again after 30-second lock period

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:242

54) tests/fr02.spec.ts:242:7 › FR-02 - Login and Lock Account › TC_FR02_09 - Account can login again after 30-second lock period
Duration: 35809ms

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

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:257:28
```

### Code Location
```typescript
  255 |     await openLoginPage(page);
  256 |     await successfulLogin(page);
> 257 |     await expect(page).not.toHaveURL(/\/login$/);
      |                            ^
  258 |   });
  259 |
  260 |   test('TC_FR02_10 - Account remains locked while lock period is active', async ({
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
