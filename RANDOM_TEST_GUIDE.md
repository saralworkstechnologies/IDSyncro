# Random Testing Scenarios - Offer Letter System

## Test Execution
```bash
# Ensure backend is running on port 5000
npm run dev

# In another terminal, run tests
node random-test.js
```

## Test Scenarios Covered

### 1. **Data Validation Tests**
- ✅ Minimal required fields only
- ✅ All fields populated
- ✅ Empty/missing required data
- ✅ Null values in optional fields
- ✅ Empty strings in optional fields

### 2. **Edge Case Tests**
- ✅ Special characters (', ", <, >, &, ™, ®)
- ✅ Very long strings (200+ characters)
- ✅ Unicode characters (Chinese, Spanish, French)
- ✅ Numeric strings as names
- ✅ SQL injection attempts (handled by parameterized queries)
- ✅ XSS attempts (script tags)

### 3. **Concurrency Tests**
- ✅ Rapid creation (5 simultaneous requests)
- ✅ Unique number generation under load
- ✅ No duplicate offer letter numbers

### 4. **Verification Tests**
- ✅ Verify existing offer letter
- ✅ Verify non-existent offer letter (404)
- ✅ Invalid format verification (404)
- ✅ Public data only returned
- ✅ Private data (salary, email, phone) not exposed

### 5. **Workflow Tests**
- ✅ Create → Verify workflow
- ✅ Get all offer letters
- ✅ Get staging data (empty)
- ✅ Generate without staging (400 error)
- ✅ Get batches
- ✅ Export functionality

### 6. **Format Tests**
- ✅ Date format handling (YYYY-MM-DD)
- ✅ Phone number formats
- ✅ Email formats
- ✅ Validity period text

## Expected Results

### Should Pass ✅
- All valid data submissions
- Unicode character handling
- Special character escaping
- Empty optional fields
- Null optional fields
- Rapid concurrent requests with unique numbers
- Public data verification
- Export with empty data

### Should Fail (Gracefully) ❌
- Missing required fields → 400 error
- Non-existent offer verification → 404 error
- Invalid format verification → 404 error
- Generate without staging → 400 error

## Security Tests Included

1. **SQL Injection Prevention**
   - Special characters in names
   - Quote characters
   - SQL keywords

2. **XSS Prevention**
   - Script tags in input
   - HTML entities
   - JavaScript code

3. **Data Privacy**
   - Salary not in verification
   - Email not in verification
   - Phone not in verification
   - Only public fields exposed

4. **Rate Limiting**
   - Multiple rapid requests
   - Verification endpoint protection

## Performance Tests

1. **Concurrent Creation**
   - 5 simultaneous requests
   - All should succeed
   - All should have unique numbers

2. **Large Data**
   - 200+ character strings
   - Multiple fields with max length

## Integration Tests

1. **End-to-End Workflow**
   - Create offer letter
   - Retrieve offer letter number
   - Verify using that number
   - Confirm data matches

2. **Data Consistency**
   - Created data matches retrieved data
   - Verification shows correct public fields
   - Export includes all created offers

## Manual Testing Checklist

### Frontend Tests
- [ ] Create single offer letter via form
- [ ] Upload Excel file (bulk)
- [ ] Review staged data
- [ ] Generate from staging
- [ ] View in manage page
- [ ] Filter by batch
- [ ] Export to Excel
- [ ] Verify offer letter number
- [ ] Check all three tabs in verification page

### Backend Tests
- [ ] Run random-test.js script
- [ ] Check database for created records
- [ ] Verify unique constraints
- [ ] Check indexes are used
- [ ] Monitor logs for errors

### Database Tests
- [ ] Check offer_letters table
- [ ] Check offer_letters_staging table
- [ ] Check offer_letter_batches table
- [ ] Verify UNIQUE constraint on offer_letter_number
- [ ] Check indexes exist

## Known Limitations

1. **Offer Letter Number Format**
   - Format: OL-YYYY-XXXXXX (9 digits)
   - Collision probability: Very low with random component
   - Database enforces uniqueness

2. **File Upload**
   - Max size: 10MB
   - Formats: .xlsx, .xls only
   - Staging cleared on new upload

3. **Verification**
   - Public fields only
   - Active status only
   - Rate limited (50 requests per 15 min)

## Test Results Interpretation

### 100% Pass Rate
- System is production ready
- All edge cases handled
- Security measures working

### 90-99% Pass Rate
- Minor issues to address
- Review failed tests
- May be acceptable for production

### <90% Pass Rate
- Critical issues present
- Do not deploy to production
- Fix failing tests first

## Troubleshooting

### Tests Fail to Connect
- Ensure backend is running on port 5000
- Check `npm run dev` is active
- Verify no firewall blocking

### Random Failures
- May indicate race conditions
- Run tests multiple times
- Check database locks

### All Tests Fail
- Backend not running
- Database connection issue
- Check server.js for errors

## Next Steps

1. Run the test script
2. Review results
3. Fix any failures
4. Re-run until 100% pass
5. Proceed with manual testing
6. Deploy to production

---

**Note**: This test script creates real data in the database. Run on a test database, not production!
