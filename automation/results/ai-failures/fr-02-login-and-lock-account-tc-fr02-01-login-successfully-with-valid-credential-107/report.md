# Error Context: TC_FR02_01 - Login successfully with valid credentials

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:91

107) tests/fr02.spec.ts:91:7 › FR-02 - Login and Lock Account › TC_FR02_01 - Login successfully with valid credentials
Duration: 5795ms

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

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:99:28
```

### Code Location
```typescript
   97 |
   98 |     // Verify user leaves login page upon successful authentication
>  99 |     await expect(page).not.toHaveURL(/\/login$/);
      |                            ^
  100 |   });
  101 |
  102 |   test('TC_FR02_02 - Reject email with invalid HTML5 email format', async ({
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
