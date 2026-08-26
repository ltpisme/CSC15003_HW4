# Error Context: TC_FR07_23 - Có phản hồi trực quan sau khi thêm vào giỏ

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:841

75) tests/fr07.spec.ts:841:7 › FR-07 - Shopping Cart › TC_FR07_23 - Có phản hồi trực quan sau khi thêm vào giỏ
Duration: 1183ms

### Error
```
Error: expect(received).toBeTruthy()

Received: false
```

### Stack Trace
```
Error: expect(received).toBeTruthy()

Received: false
    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:878:55
```

### Code Location
```typescript
  876 |     const hasButtonFeedback = buttonText.includes('Đã thêm');
  877 |
> 878 |     expect(hasToast || hasBadge || hasButtonFeedback).toBeTruthy();
      |                                                       ^
  879 |   });
  880 |
  881 |   /* ============================================================
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
