# Error Context: TC_FR07_03 - Hiển thị giỏ hàng có sản phẩm

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:292

9) tests/fr07.spec.ts:292:7 › FR-07 - Shopping Cart › TC_FR07_03 - Hiển thị giỏ hàng có sản phẩm
Duration: 5579ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Tổng cộng', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Tổng cộng', { exact: true })

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Tổng cộng', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Tổng cộng', { exact: true })

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:310:7
```

### Code Location
```typescript
  308 |     await expect(
  309 |       page.getByText(labels.totalExpected, { exact: true })
> 310 |     ).toBeVisible();
      |       ^
  311 |   });
  312 |
  313 |   test('TC_FR07_04 - Kiểm tra cấu trúc các cột của giỏ hàng', async ({
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
