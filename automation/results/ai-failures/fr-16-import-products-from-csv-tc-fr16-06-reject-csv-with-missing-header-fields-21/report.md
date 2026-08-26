# Error Context: TC_FR16_06 - Reject CSV with missing header fields

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:591

21) tests/fr16.spec.ts:591:7 › FR-16 - Import Products from CSV › TC_FR16_06 - Reject CSV with missing header fields
Duration: 6141ms

### Error
```
Error: expect(locator).toBeAttached() failed

Locator: locator('input[type="file"]').first()
Expected: attached
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeAttached" with timeout 5000ms
  - waiting for locator('input[type="file"]').first()

```

### Stack Trace
```
Error: expect(locator).toBeAttached() failed

Locator: locator('input[type="file"]').first()
Expected: attached
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeAttached" with timeout 5000ms
  - waiting for locator('input[type="file"]').first()

    at fileInput (/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:240:23)
    at uploadFile (/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:252:23)
    at importCsv (/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:285:9)
    at /home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:599:15
```

### Code Location
```typescript
  238 |   ).first();
  239 |
> 240 |   await expect(input).toBeAttached();
      |                       ^
  241 |
  242 |   return input;
  243 | }
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
