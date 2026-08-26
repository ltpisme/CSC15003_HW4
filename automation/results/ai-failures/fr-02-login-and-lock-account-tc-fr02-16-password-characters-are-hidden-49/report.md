# Error Context: TC_FR02_16 - Password characters are hidden

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:484

49) tests/fr02.spec.ts:484:7 › FR-02 - Login and Lock Account › TC_FR02_16 - Password characters are hidden
Duration: 30020ms

### Error
```
Test timeout of 30000ms exceeded.
---
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="password"], input[type="password"]').first()

```

### Stack Trace
```
at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:491:25
```

### Code Location
```typescript
  489 |     ).first();
  490 |
> 491 |     await passwordInput.fill(VALID_PASSWORD);
      |                         ^
  492 |
  493 |     await expect(passwordInput).toHaveAttribute(
  494 |       'type',
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
