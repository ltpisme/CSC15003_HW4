# Error Context: TC_FR02_11 - Email field uses type=email

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:282

33) tests/fr02.spec.ts:282:7 › FR-02 - Login and Lock Account › TC_FR02_11 - Email field uses type=email
Duration: 5330ms

### Error
```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('input[name="email"], input[type="email"], form input:first-of-type').first()
Expected: "email"
Received: "text"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('input[name="email"], input[type="email"], form input:first-of-type').first()
    14 × locator resolved to <input value="" required="" type="text" class="w-full border p-2 rounded"/>
       - unexpected value "text"

```

### Stack Trace
```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('input[name="email"], input[type="email"], form input:first-of-type').first()
Expected: "email"
Received: "text"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('input[name="email"], input[type="email"], form input:first-of-type').first()
    14 × locator resolved to <input value="" required="" type="text" class="w-full border p-2 rounded"/>
       - unexpected value "text"

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:291:30
```

### Code Location
```typescript
  289 |
  290 |     await expect(emailInput).toBeVisible();
> 291 |     await expect(emailInput).toHaveAttribute('type', testCase.expectedType);
      |                              ^
  292 |   });
  293 |
  294 |   test('TC_FR02_12 - Password field uses type=password', async ({
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
