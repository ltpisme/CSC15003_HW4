# Error Context: TC_FR07_16 - Không cho giảm quantity xuống dưới 1

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:633

54) tests/fr07.spec.ts:633:7 › FR-07 - Shopping Cart › TC_FR07_16 - Không cho giảm quantity xuống dưới 1
Duration: 6385ms

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

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:646:31
```

### Code Location
```typescript
  644 |     });
  645 |
> 646 |     await expect(minusButton).toBeVisible();
      |                               ^
  647 |
  648 |     expect(await getCartQuantity(page)).toBe(caseData.initialQuantity);
  649 |
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
