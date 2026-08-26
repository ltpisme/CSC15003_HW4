# Error Context: TC_FR02_02 - Reject email with invalid HTML5 email format

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:102

6) tests/fr02.spec.ts:102:7 › FR-02 - Login and Lock Account › TC_FR02_02 - Reject email with invalid HTML5 email format
Duration: 30017ms

### Error
```
Test timeout of 30000ms exceeded.
---
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[type="password"], input[name="password"], form input:nth-of-type(2)').first()

```

### Stack Trace
```
at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:117:25
```

### Code Location
```typescript
  115 |     ).first();
  116 |
> 117 |     await passwordInput.fill(testCase.password);
      |                         ^
  118 |     await submitLogin(page);
  119 |
  120 |     // HTML5 validation should prevent form submission
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
