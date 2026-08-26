# Error Context: TC_FR07_25 - Kiểm tra màu nút hành động và nút nguy hiểm

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:898

67) tests/fr07.spec.ts:898:7 › FR-07 - Shopping Cart › TC_FR07_25 - Kiểm tra màu nút hành động và nút nguy hiểm
Duration: 419ms

### Error
```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

### Stack Trace
```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:925:19
```

### Code Location
```typescript
  923 |     if (rgbValues && rgbValues.length >= 3) {
  924 |       const [red, green, blue] = rgbValues;
> 925 |       expect(red).toBeGreaterThan(green);
      |                   ^
  926 |       expect(red).toBeGreaterThan(blue);
  927 |     }
  928 |   });
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
