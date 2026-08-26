# Error Context: TC_FR16_12 - Reject price equal to 0

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:766

57) tests/fr16.spec.ts:766:7 › FR-16 - Import Products from CSV › TC_FR16_12 - Reject price equal to 0
Duration: 5139ms

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

    at fileInput (/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:241:23)
    at uploadFile (/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:253:23)
    at importCsv (/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:286:9)
    at /home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:774:15
```

### Code Location
```typescript
  239 |   ).first();
  240 |
> 241 |   await expect(input).toBeAttached();
      |                       ^
  242 |
  243 |   return input;
  244 | }
```

### Page State When Failed
**URL:** unknown  
**Title:** unknown  
