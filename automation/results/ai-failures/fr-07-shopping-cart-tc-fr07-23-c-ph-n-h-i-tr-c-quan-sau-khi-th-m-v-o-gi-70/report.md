# Error Context: TC_FR07_23 - Có phản hồi trực quan sau khi thêm vào giỏ

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:841

70) tests/fr07.spec.ts:841:7 › FR-07 - Shopping Cart › TC_FR07_23 - Có phản hồi trực quan sau khi thêm vào giỏ
Duration: 3147ms

### Error
```
Error: expect(received).toBeTruthy()

Received: false
```

### Stack Trace
```
Error: expect(received).toBeTruthy()

Received: false
    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:886:55
```

### Code Location
```typescript
  884 |     const hasButtonFeedback = buttonText.includes('Đã thêm');
  885 |
> 886 |     expect(hasToast || hasBadge || hasButtonFeedback).toBeTruthy();
      |                                                       ^
  887 |   });
  888 |
  889 |   /* ============================================================
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
