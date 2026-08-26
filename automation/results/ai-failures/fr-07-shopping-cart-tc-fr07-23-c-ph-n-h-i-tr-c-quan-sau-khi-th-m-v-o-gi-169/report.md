# Error Context: TC_FR07_23 - Có phản hồi trực quan sau khi thêm vào giỏ

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:841

169) tests/fr07.spec.ts:841:7 › FR-07 - Shopping Cart › TC_FR07_23 - Có phản hồi trực quan sau khi thêm vào giỏ
Duration: 1028ms

### Error
```
Error: expect(received).toBeTruthy()

Received: false
```

### Stack Trace
```
Error: expect(received).toBeTruthy()

Received: false
    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:895:55
```

### Code Location
```typescript
  893 |       (await page.getByText(/Đã thêm/i).isVisible().catch(() => false));
  894 |
> 895 |     expect(hasToast || hasBadge || hasButtonFeedback).toBeTruthy();
      |                                                       ^
  896 |   });
  897 |
  898 |   /* ============================================================
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
