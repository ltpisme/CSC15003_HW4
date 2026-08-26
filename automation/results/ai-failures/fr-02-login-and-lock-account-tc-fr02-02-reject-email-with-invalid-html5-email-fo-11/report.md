# Error Context: TC_FR02_02 - Reject email with invalid HTML5 email format

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:102

11) tests/fr02.spec.ts:102:7 › FR-02 - Login and Lock Account › TC_FR02_02 - Reject email with invalid HTML5 email format
Duration: 5396ms

### Error
```
Error: expect(locator).toHaveJSProperty(expected) failed

Locator:  locator('input[type="email"], input[name="email"]').or(locator('form input').first())
Expected: false
Received: true
Timeout:  5000ms

Call log:
  - Expect "toHaveJSProperty" with timeout 5000ms
  - waiting for locator('input[type="email"], input[name="email"]').or(locator('form input').first())
    14 × locator resolved to <input required="" type="text" value="invalid-email" class="w-full border p-2 rounded"/>
       - unexpected value "true"

```

### Stack Trace
```
Error: expect(locator).toHaveJSProperty(expected) failed

Locator:  locator('input[type="email"], input[name="email"]').or(locator('form input').first())
Expected: false
Received: true
Timeout:  5000ms

Call log:
  - Expect "toHaveJSProperty" with timeout 5000ms
  - waiting for locator('input[type="email"], input[name="email"]').or(locator('form input').first())
    14 × locator resolved to <input required="" type="text" value="invalid-email" class="w-full border p-2 rounded"/>
       - unexpected value "true"

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:121:30
```

### Code Location
```typescript
  119 |
  120 |     // HTML5 validation should prevent form submission
> 121 |     await expect(emailInput).toHaveJSProperty('validity.valid', false);
      |                              ^
  122 |     await expect(page).toHaveURL(/\/login$/);
  123 |   });
  124 |
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
