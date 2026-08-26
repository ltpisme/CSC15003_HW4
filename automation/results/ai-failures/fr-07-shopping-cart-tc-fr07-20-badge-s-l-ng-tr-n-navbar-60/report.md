# Error Context: TC_FR07_20 - Badge số lượng trên Navbar

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:762

60) tests/fr07.spec.ts:762:7 › FR-07 - Shopping Cart › TC_FR07_20 - Badge số lượng trên Navbar
Duration: 5340ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="cart-badge"], .cart-badge, .badge, nav a[href="/cart"] span, header a[href="/cart"] span').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="cart-badge"], .cart-badge, .badge, nav a[href="/cart"] span, header a[href="/cart"] span').first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="cart-badge"], .cart-badge, .badge, nav a[href="/cart"] span, header a[href="/cart"] span').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="cart-badge"], .cart-badge, .badge, nav a[href="/cart"] span, header a[href="/cart"] span').first()

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:777:25
```

### Code Location
```typescript
  775 |
  776 |     const badge = cartBadge(page);
> 777 |     await expect(badge).toBeVisible();
      |                         ^
  778 |
  779 |     await addProduct(page, caseData.initialAdd);
  780 |     await openHomePage(page);
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
