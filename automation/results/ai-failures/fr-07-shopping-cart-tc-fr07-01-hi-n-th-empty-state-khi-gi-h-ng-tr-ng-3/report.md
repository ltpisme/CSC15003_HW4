# Error Context: TC_FR07_01 - Hiển thị Empty State khi giỏ hàng trống

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:219

3) tests/fr07.spec.ts:219:7 › FR-07 - Shopping Cart › TC_FR07_01 - Hiển thị Empty State khi giỏ hàng trống
Duration: 5637ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="empty-cart"], .empty-cart, .empty-state').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="empty-cart"], .empty-cart, .empty-state').first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="empty-cart"], .empty-cart, .empty-state').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="empty-cart"], .empty-cart, .empty-state').first()

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:226:30
```

### Code Location
```typescript
  224 |     const emptyState = emptyCartState(page);
  225 |
> 226 |     await expect(emptyState).toBeVisible();
      |                              ^
  227 |
  228 |     await expect(
  229 |       page.getByText(
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
