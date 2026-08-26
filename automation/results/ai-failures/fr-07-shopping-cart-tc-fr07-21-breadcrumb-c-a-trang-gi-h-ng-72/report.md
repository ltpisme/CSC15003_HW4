# Error Context: TC_FR07_21 - Breadcrumb của trang Giỏ hàng

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:845

72) tests/fr07.spec.ts:845:7 › FR-07 - Shopping Cart › TC_FR07_21 - Breadcrumb của trang Giỏ hàng
Duration: 5984ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]').first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]').first()

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:854:30
```

### Code Location
```typescript
  852 |     ).first();
  853 |
> 854 |     await expect(breadcrumb).toBeVisible();
      |                              ^
  855 |
  856 |     await expect(
  857 |       breadcrumb
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
