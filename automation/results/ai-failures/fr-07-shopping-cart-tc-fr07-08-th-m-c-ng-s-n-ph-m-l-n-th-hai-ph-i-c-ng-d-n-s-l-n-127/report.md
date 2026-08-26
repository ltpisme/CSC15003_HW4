# Error Context: TC_FR07_08 - Thêm cùng sản phẩm lần thứ hai phải cộng dồn số lượng

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:387

127) tests/fr07.spec.ts:387:7 › FR-07 - Shopping Cart › TC_FR07_08 - Thêm cùng sản phẩm lần thứ hai phải cộng dồn số lượng
Duration: 2571ms

### Error
```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 4
Received: 1
```

### Stack Trace
```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 4
Received: 1
    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:426:41
```

### Code Location
```typescript
  424 |      * iPhone × 4
  425 |      */
> 426 |     expect(await getCartQuantity(page)).toBe(quantities.accumulated);
      |                                         ^
  427 |
  428 |     /*
  429 |      * The same product must remain a single row.
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
