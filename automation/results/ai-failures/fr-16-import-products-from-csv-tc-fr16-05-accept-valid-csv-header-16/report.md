# Error Context: TC_FR16_05 - Accept valid CSV header

## Test Location
/home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:565

16) tests/fr16.spec.ts:565:7 › FR-16 - Import Products from CSV › TC_FR16_05 - Accept valid CSV header
Duration: 5336ms

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
    at /home/ltp/CSC15003_HW4/automation/tests/fr16.spec.ts:578:15
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
