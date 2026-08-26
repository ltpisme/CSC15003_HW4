# Error Context: TC_FR07_17 - Xóa sản phẩm và xác nhận

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:666

136) tests/fr07.spec.ts:666:7 › FR-07 - Shopping Cart › TC_FR07_17 - Xóa sản phẩm và xác nhận
Duration: 6930ms

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

    at /home/ltp/CSC15003_HW4/automation/tests/fr07.spec.ts:688:26
```

### Code Location
```typescript
  686 |     const dialog = deleteDialog(page);
  687 |
> 688 |     await expect(dialog).toBeVisible();
      |                          ^
  689 |
  690 |     await expect(
  691 |       dialog.getByText(/xóa|xác nhận/i)
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
