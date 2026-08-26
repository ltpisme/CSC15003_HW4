# Error Context: TC_FR07_07 - Thêm sản phẩm chưa tồn tại vào giỏ

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:373

20) tests/fr07.spec.ts:373:7 › FR-07 - Shopping Cart › TC_FR07_07 - Thêm sản phẩm chưa tồn tại vào giỏ
Duration: 5164ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: /iPhone 15 Pro Max/i }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: /iPhone 15 Pro Max/i }).first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: /iPhone 15 Pro Max/i }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: /iPhone 15 Pro Max/i }).first()

    at openProductPage (/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:47:29)
    at addProduct (/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:111:3)
    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:376:5
```

### Code Location
```typescript
  45 |   }).first();
  46 |
> 47 |   await expect(productLink).toBeVisible();
     |                             ^
  48 |   await productLink.click();
  49 |
  50 |   await page.waitForLoadState('domcontentloaded');
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
