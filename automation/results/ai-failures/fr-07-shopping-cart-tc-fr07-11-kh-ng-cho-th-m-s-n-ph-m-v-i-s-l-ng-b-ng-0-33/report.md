# Error Context: TC_FR07_11 - Không cho thêm sản phẩm với số lượng bằng 0

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:464

33) tests/fr07.spec.ts:464:7 › FR-07 - Shopping Cart › TC_FR07_11 - Không cho thêm sản phẩm với số lượng bằng 0
Duration: 1044ms

### Error
```
Error: expect(received).toBeTruthy()

Received: false
```

### Stack Trace
```
Error: expect(received).toBeTruthy()

Received: false
    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:498:7
```

### Code Location
```typescript
  496 |         isInvalid ||
  497 |         currentValue !== String(caseData.quantity)
> 498 |     ).toBeTruthy();
      |       ^
  499 |   });
  500 |
  501 |   test('TC_FR07_12 - Không cho thêm sản phẩm với số lượng âm', async ({
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
