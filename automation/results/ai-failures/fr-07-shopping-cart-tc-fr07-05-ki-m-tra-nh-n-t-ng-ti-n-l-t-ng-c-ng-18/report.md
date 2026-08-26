# Error Context: TC_FR07_05 - Kiểm tra nhãn tổng tiền là Tổng cộng

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:326

18) tests/fr07.spec.ts:326:7 › FR-07 - Shopping Cart › TC_FR07_05 - Kiểm tra nhãn tổng tiền là Tổng cộng
Duration: 5684ms

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

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:334:7
```

### Code Location
```typescript
  332 |     await expect(
  333 |       page.getByText(labels.totalExpected, { exact: true })
> 334 |     ).toBeVisible();
      |       ^
  335 |
  336 |     await expect(
  337 |       page.getByText(labels.totalInvalid, { exact: true })
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
