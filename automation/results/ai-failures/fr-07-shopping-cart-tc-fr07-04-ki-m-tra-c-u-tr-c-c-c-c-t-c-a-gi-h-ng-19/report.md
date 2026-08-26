# Error Context: TC_FR07_04 - Kiểm tra cấu trúc các cột của giỏ hàng

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:313

19) tests/fr07.spec.ts:313:7 › FR-07 - Shopping Cart › TC_FR07_04 - Kiểm tra cấu trúc các cột của giỏ hàng
Duration: 5575ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Đơn giá', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Đơn giá', { exact: true })

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Đơn giá', { exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Đơn giá', { exact: true })

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:322:9
```

### Code Location
```typescript
  320 |       await expect(
  321 |         page.getByText(column, { exact: true })
> 322 |       ).toBeVisible();
      |         ^
  323 |     }
  324 |   });
  325 |
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
