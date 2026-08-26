# Error Context: TC_FR02_09 - Account can login again after 30-second lock period

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:242

29) tests/fr02.spec.ts:242:7 › FR-02 - Login and Lock Account › TC_FR02_09 - Account can login again after 30-second lock period
Duration: 30020ms

### Error
```
Test timeout of 30000ms exceeded.
---
Error: page.waitForTimeout: Test timeout of 30000ms exceeded.
```

### Stack Trace
```
at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:252:16
```

### Code Location
```typescript
  250 |
  251 |     // Wait for specified lockout duration (30 seconds)
> 252 |     await page.waitForTimeout(testCase.waitMs ?? lockoutConfig.lockoutDurationMs);
      |                ^
  253 |
  254 |     await openLoginPage(page);
  255 |     await successfulLogin(page);
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
