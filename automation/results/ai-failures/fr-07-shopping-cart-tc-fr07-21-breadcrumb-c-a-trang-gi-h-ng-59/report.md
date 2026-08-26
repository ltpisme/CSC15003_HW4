# Error Context: TC_FR07_21 - Breadcrumb của trang Giỏ hàng

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:812

59) tests/fr07.spec.ts:812:7 › FR-07 - Shopping Cart › TC_FR07_21 - Breadcrumb của trang Giỏ hàng
Duration: 5163ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"], nav ol, nav ul').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"], nav ol, nav ul').first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"], nav ol, nav ul').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"], nav ol, nav ul').first()

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:824:30
```

### Code Location
```typescript
  822 |       .first();
  823 |
> 824 |     await expect(breadcrumb).toBeVisible();
      |                              ^
  825 |     await expect(breadcrumb).toContainText(new RegExp(caseData.expectedText, 'i'));
  826 |   });
  827 |
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
