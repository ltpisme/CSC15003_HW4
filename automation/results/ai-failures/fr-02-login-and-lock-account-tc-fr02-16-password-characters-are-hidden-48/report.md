# Error Context: TC_FR02_16 - Password characters are hidden

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:356

48) tests/fr02.spec.ts:356:7 › FR-02 - Login and Lock Account › TC_FR02_16 - Password characters are hidden
Duration: 30016ms

### Error
```
Test timeout of 30000ms exceeded.
---
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="password"], input[type="password"], form input:nth-of-type(2)').first()

```

### Stack Trace
```
at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:364:25
```

### Code Location
```typescript
  362 |     ).first();
  363 |
> 364 |     await passwordInput.fill(credentials.validUser.password);
      |                         ^
  365 |     await expect(passwordInput).toHaveAttribute('type', testCase.expectedType);
  366 |   });
  367 |
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
