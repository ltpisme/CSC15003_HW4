# Error Context: TC_FR07_15 - Giảm số lượng bằng nút -

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:606

50) tests/fr07.spec.ts:606:7 › FR-07 - Shopping Cart › TC_FR07_15 - Giảm số lượng bằng nút -
Duration: 6584ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('tr, .cart-item, [data-testid="cart-item"], tbody tr').filter({ hasText: 'iPhone 15 Pro Max' }).first().getByRole('button', { name: /-/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('tr, .cart-item, [data-testid="cart-item"], tbody tr').filter({ hasText: 'iPhone 15 Pro Max' }).first().getByRole('button', { name: /-/i })

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('tr, .cart-item, [data-testid="cart-item"], tbody tr').filter({ hasText: 'iPhone 15 Pro Max' }).first().getByRole('button', { name: /-/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('tr, .cart-item, [data-testid="cart-item"], tbody tr').filter({ hasText: 'iPhone 15 Pro Max' }).first().getByRole('button', { name: /-/i })

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:621:31
```

### Code Location
```typescript
  619 |     });
  620 |
> 621 |     await expect(minusButton).toBeVisible();
      |                               ^
  622 |     await minusButton.click();
  623 |
  624 |     await expect
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
