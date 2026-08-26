# Error Context: TC_FR07_22 - Trang Giỏ hàng có đúng một h1

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:828

61) tests/fr07.spec.ts:828:7 › FR-07 - Shopping Cart › TC_FR07_22 - Trang Giỏ hàng có đúng một h1
Duration: 5211ms

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

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:836:22
```

### Code Location
```typescript
  834 |     const h1 = page.locator('h1');
  835 |
> 836 |     await expect(h1).toHaveCount(caseData.expectedH1Count);
      |                      ^
  837 |     await expect(h1.first()).toBeVisible();
  838 |     await expect(h1.first()).toContainText(new RegExp(caseData.expectedText, 'i'));
  839 |   });
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
