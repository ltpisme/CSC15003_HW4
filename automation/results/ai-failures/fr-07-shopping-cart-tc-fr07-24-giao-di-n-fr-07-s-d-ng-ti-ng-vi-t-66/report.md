# Error Context: TC_FR07_24 - Giao diện FR-07 sử dụng tiếng Việt

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:893

66) tests/fr07.spec.ts:893:7 › FR-07 - Shopping Cart › TC_FR07_24 - Giao diện FR-07 sử dụng tiếng Việt
Duration: 5483ms

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

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:902:9
```

### Code Location
```typescript
  900 |       await expect(
  901 |         page.getByText(text, { exact: true })
> 902 |       ).toBeVisible();
      |         ^
  903 |     }
  904 |   });
  905 |
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
