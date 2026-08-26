# Error Context: TC_FR02_15 - Authentication error is displayed above submit button

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:334

43) tests/fr02.spec.ts:334:7 › FR-02 - Login and Lock Account › TC_FR02_15 - Authentication error is displayed above submit button
Duration: 455ms

### Error
```
Error: expect(received).toBeLessThan(expected)

Expected: < 425
Received:   517
```

### Stack Trace
```
Error: expect(received).toBeLessThan(expected)

Expected: < 425
Received:   517
    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:353:25
```

### Code Location
```typescript
  351 |     expect(errorBox).not.toBeNull();
  352 |     expect(buttonBox).not.toBeNull();
> 353 |     expect(errorBox!.y).toBeLessThan(buttonBox!.y);
      |                         ^
  354 |   });
  355 |
  356 |   test('TC_FR02_16 - Password characters are hidden', async ({
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
