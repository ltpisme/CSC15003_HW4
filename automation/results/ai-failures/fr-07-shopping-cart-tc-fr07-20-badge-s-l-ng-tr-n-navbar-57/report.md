# Error Context: TC_FR07_20 - Badge số lượng trên Navbar

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:802

57) tests/fr07.spec.ts:802:7 › FR-07 - Shopping Cart › TC_FR07_20 - Badge số lượng trên Navbar
Duration: 5200ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="cart-badge"], .cart-badge, .badge').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="cart-badge"], .cart-badge, .badge').first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="cart-badge"], .cart-badge, .badge').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[data-testid="cart-badge"], .cart-badge, .badge').first()

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:815:25
```

### Code Location
```typescript
  813 |     const badge = cartBadge(page);
  814 |
> 815 |     await expect(badge).toBeVisible();
      |                         ^
  816 |
  817 |     await addProduct(page, MIN_QUANTITY);
  818 |
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
