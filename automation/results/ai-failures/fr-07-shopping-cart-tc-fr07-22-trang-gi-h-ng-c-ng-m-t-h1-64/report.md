# Error Context: TC_FR07_22 - Trang Giỏ hàng có đúng một h1

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:861

64) tests/fr07.spec.ts:861:7 › FR-07 - Shopping Cart › TC_FR07_22 - Trang Giỏ hàng có đúng một h1
Duration: 5320ms

### Error
```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('h1')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('h1')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

### Stack Trace
```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('h1')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('h1')
    14 × locator resolved to 0 elements
       - unexpected value "0"

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:868:22
```

### Code Location
```typescript
  866 |     const h1 = page.locator('h1');
  867 |
> 868 |     await expect(h1).toHaveCount(1);
      |                      ^
  869 |
  870 |     await expect(h1.first()).toBeVisible();
  871 |
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
