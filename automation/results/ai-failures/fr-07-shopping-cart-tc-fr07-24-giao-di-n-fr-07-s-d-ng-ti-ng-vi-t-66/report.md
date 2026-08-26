# Error Context: TC_FR07_24 - Giao diện FR-07 sử dụng tiếng Việt

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:885

66) tests/fr07.spec.ts:885:7 › FR-07 - Shopping Cart › TC_FR07_24 - Giao diện FR-07 sử dụng tiếng Việt
Duration: 5480ms

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

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:894:9
```

### Code Location
```typescript
  892 |       await expect(
  893 |         page.getByText(text, { exact: true })
> 894 |       ).toBeVisible();
      |         ^
  895 |     }
  896 |   });
  897 |
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
