# Error Context: TC_FR07_18 - Xóa sản phẩm và hủy xác nhận

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:703

51) tests/fr07.spec.ts:703:7 › FR-07 - Shopping Cart › TC_FR07_18 - Xóa sản phẩm và hủy xác nhận
Duration: 5451ms

### Error
```
Error: expect(locator).toBeVisible() failed

Locator: locator('[role="dialog"], .modal, .confirm-dialog, [data-testid="confirm-dialog"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[role="dialog"], .modal, .confirm-dialog, [data-testid="confirm-dialog"]').first()

```

### Stack Trace
```
Error: expect(locator).toBeVisible() failed

Locator: locator('[role="dialog"], .modal, .confirm-dialog, [data-testid="confirm-dialog"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[role="dialog"], .modal, .confirm-dialog, [data-testid="confirm-dialog"]').first()

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:723:26
```

### Code Location
```typescript
  721 |     const dialog = deleteDialog(page);
  722 |
> 723 |     await expect(dialog).toBeVisible();
      |                          ^
  724 |
  725 |     await dialog
  726 |       .getByRole('button', {
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
