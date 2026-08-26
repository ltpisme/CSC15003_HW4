# Error Context: TC_FR02_07 - Third consecutive failed login attempt locks account

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:199

19) tests/fr02.spec.ts:199:7 › FR-02 - Login and Lock Account › TC_FR02_07 - Third consecutive failed login attempt locks account
Duration: 470ms

### Error
```
Error: expect(received).toBeTruthy()

Received: false
```

### Stack Trace
```
Error: expect(received).toBeTruthy()

Received: false
    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:219:7
```

### Code Location
```typescript
  217 |       errorText.includes('locked') ||
  218 |       errorText.includes('30')
> 219 |     ).toBeTruthy();
      |       ^
  220 |   });
  221 |
  222 |   test('TC_FR02_08 - Correct password is rejected while account is locked', async ({
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
