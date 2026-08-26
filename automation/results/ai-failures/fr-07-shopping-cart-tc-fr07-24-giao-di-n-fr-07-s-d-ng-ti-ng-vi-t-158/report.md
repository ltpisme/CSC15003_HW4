# Error Context: TC_FR07_24 - Giao diện FR-07 sử dụng tiếng Việt

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:902

158) tests/fr07.spec.ts:902:7 › FR-07 - Shopping Cart › TC_FR07_24 - Giao diện FR-07 sử dụng tiếng Việt
Duration: 5827ms

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

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:911:9
```

### Code Location
```typescript
  909 |       await expect(
  910 |         page.getByText(text, { exact: true })
> 911 |       ).toBeVisible();
      |         ^
  912 |     }
  913 |   });
  914 |
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
