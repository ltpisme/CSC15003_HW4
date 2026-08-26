# Error Context: TC_FR02_13 - Login page contains exactly one h1

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:306

45) tests/fr02.spec.ts:306:7 › FR-02 - Login and Lock Account › TC_FR02_13 - Login page contains exactly one h1
Duration: 5876ms

### Error
```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('h1')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('h1')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

### Stack Trace
```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('h1')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('h1')
    14 × locator resolved to 0 elements
       - unexpected value "0"

    at /home/ltp/CSC15003_HW4/automation/tests/fr02.spec.ts:312:22
```

### Code Location
```typescript
  310 |     const h1 = page.locator('h1');
  311 |
> 312 |     await expect(h1).toHaveCount(testCase.expectedH1Count);
      |                      ^
  313 |     await expect(h1.first()).toBeVisible();
  314 |   });
  315 |
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
