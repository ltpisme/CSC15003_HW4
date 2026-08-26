# Error Context: TC_FR07_12 - Không cho thêm sản phẩm với số lượng âm

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:501

37) tests/fr07.spec.ts:501:7 › FR-07 - Shopping Cart › TC_FR07_12 - Không cho thêm sản phẩm với số lượng âm
Duration: 406ms

### Error
```
Error: expect(received).toBeTruthy()

Received: false
```

### Stack Trace
```
Error: expect(received).toBeTruthy()

Received: false
    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:535:7
```

### Code Location
```typescript
  533 |         isInvalid ||
  534 |         currentValue !== String(caseData.quantity)
> 535 |     ).toBeTruthy();
      |       ^
  536 |   });
  537 |
  538 |   test('TC_FR07_13 - Không chấp nhận số lượng thập phân', async ({
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
