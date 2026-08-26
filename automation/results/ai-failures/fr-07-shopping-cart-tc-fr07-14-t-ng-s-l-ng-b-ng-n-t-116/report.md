# Error Context: TC_FR07_14 - Tăng số lượng bằng nút +

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:579

116) tests/fr07.spec.ts:579:7 › FR-07 - Shopping Cart › TC_FR07_14 - Tăng số lượng bằng nút +
Duration: 5896ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('tr, .cart-item, [data-testid="cart-item"], tbody tr').filter({ hasText: 'iPhone 15 Pro Max' }).first().getByRole('button', { name: /\+/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('tr, .cart-item, [data-testid="cart-item"], tbody tr').filter({ hasText: 'iPhone 15 Pro Max' }).first().getByRole('button', { name: /\+/i })

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('tr, .cart-item, [data-testid="cart-item"], tbody tr').filter({ hasText: 'iPhone 15 Pro Max' }).first().getByRole('button', { name: /\+/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('tr, .cart-item, [data-testid="cart-item"], tbody tr').filter({ hasText: 'iPhone 15 Pro Max' }).first().getByRole('button', { name: /\+/i })

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:594:30
```

### Code Location
```typescript
  592 |     });
  593 |
> 594 |     await expect(plusButton).toBeVisible();
      |                              ^
  595 |     await plusButton.click();
  596 |
  597 |     await expect
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
