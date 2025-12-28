# Offer Letter Generator - Test Checklist

## Backend Tests

### Database Tables
- [ ] `offer_letters_staging` table created
- [ ] `offer_letters` table created
- [ ] `offer_letter_batches` table created
- [ ] Indexes created on offer_letter_number, batch_id, status
- [ ] UNIQUE constraint on offer_letter_number

### API Endpoints
- [ ] POST /api/offer-letters/upload-excel - Upload and stage Excel
- [ ] GET /api/offer-letters/staging - Retrieve staged data
- [ ] POST /api/offer-letters/generate - Generate from staging
- [ ] POST /api/offer-letters/create-single - Create individual offer
- [ ] GET /api/offer-letters - Get all offer letters
- [ ] GET /api/offer-letters/verify/:offerNumber - Public verification
- [ ] GET /api/offer-letters/export - Export to Excel
- [ ] GET /api/offer-letters/batches - Get batch info

### Functionality Tests
- [ ] Excel upload accepts .xlsx and .xls files
- [ ] File size limit enforced (10MB)
- [ ] SHA-256 hash generated for uploaded files
- [ ] All Excel columns preserved in staging
- [ ] Staging data can be retrieved
- [ ] Generate creates unique offer letter numbers
- [ ] Offer letter number format: OL-YYYY-XXXXXX
- [ ] Batch ID generated: BATCH-OL-timestamp
- [ ] Staging cleared after successful generation
- [ ] Transaction rollback on generation failure
- [ ] Single offer letter creation works
- [ ] Verification returns only public fields
- [ ] Export includes all original data + generated fields

## Frontend Tests

### Navigation
- [ ] "Offer Letters" link in main navigation
- [ ] Offer Letters page loads correctly
- [ ] Sub-navigation tabs work (Create, Bulk, Manage, Verify)

### Create Single Offer Letter
- [ ] Form displays all fields
- [ ] Required field validation works
- [ ] Form submission creates offer letter
- [ ] Success message shows offer letter number
- [ ] Form resets after successful creation

### Bulk Generation
- [ ] File upload button works
- [ ] File name displays after selection
- [ ] Upload button disabled without file
- [ ] Upload shows import summary
- [ ] Preview table displays first 5 rows
- [ ] Column headers displayed correctly
- [ ] Staged data count shown
- [ ] Warning message about no numbers generated
- [ ] Generate button appears after staging
- [ ] Generation shows success message
- [ ] Batch ID and count displayed
- [ ] Generated offer letter numbers listed
- [ ] Instructions section visible

### Manage Offer Letters
- [ ] Table displays all offer letters
- [ ] Columns: Number, Name, Company, Designation, Batch, Date, Status
- [ ] Filter by batch works
- [ ] Statistics cards show correct counts
- [ ] Export to Excel button works
- [ ] Batch information section displays
- [ ] Batch cards show metadata

### Verify Offer Letter
- [ ] Input field for offer letter number
- [ ] Verify button triggers verification
- [ ] Success shows verification result
- [ ] Public fields displayed correctly
- [ ] Error message for invalid number
- [ ] Reset button clears form
- [ ] Info section explains verification

### Dashboard Integration
- [ ] "Offer Letters" button in Quick Actions
- [ ] "Offer Letters Report" in Reports section
- [ ] Export offer letters works from dashboard

## Integration Tests

### End-to-End Single Creation
1. [ ] Navigate to Offer Letters → Create Single
2. [ ] Fill form with test data
3. [ ] Submit form
4. [ ] Verify offer letter number generated
5. [ ] Navigate to Manage
6. [ ] Verify offer letter appears in list
7. [ ] Navigate to Verify
8. [ ] Enter offer letter number
9. [ ] Verify public data displayed

### End-to-End Bulk Generation
1. [ ] Create test Excel file with 5 rows
2. [ ] Navigate to Offer Letters → Bulk Generation
3. [ ] Upload Excel file
4. [ ] Verify import summary shows 5 rows
5. [ ] Verify preview shows data
6. [ ] Click Generate Offer Letters
7. [ ] Verify 5 unique numbers generated
8. [ ] Verify batch ID created
9. [ ] Navigate to Manage
10. [ ] Verify all 5 offer letters in list
11. [ ] Filter by batch ID
12. [ ] Verify only those 5 shown
13. [ ] Export to Excel
14. [ ] Verify Excel contains all data + numbers

### Data Integrity Tests
- [ ] Duplicate offer letter numbers prevented
- [ ] All Excel columns preserved
- [ ] Metadata stored correctly
- [ ] Timestamps accurate
- [ ] File hash matches original
- [ ] Row numbers preserved
- [ ] Batch associations correct

### Security Tests
- [ ] Only .xlsx and .xls files accepted
- [ ] File size limit enforced
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] Only public fields in verification
- [ ] Personal data not exposed
- [ ] Input validation on all fields

## Performance Tests
- [ ] Upload 100 rows - completes in < 5 seconds
- [ ] Generate 100 offers - completes in < 10 seconds
- [ ] Export 100 offers - completes in < 5 seconds
- [ ] Verification response < 1 second
- [ ] Page load times acceptable

## Error Handling Tests
- [ ] Empty Excel file rejected
- [ ] Invalid file format rejected
- [ ] File too large rejected
- [ ] Generate without staging shows error
- [ ] Invalid offer number shows not found
- [ ] Network errors handled gracefully
- [ ] Database errors handled gracefully

## Browser Compatibility
- [ ] Chrome - All features work
- [ ] Firefox - All features work
- [ ] Safari - All features work
- [ ] Edge - All features work
- [ ] Mobile responsive design works

## Test Data

### Sample Excel Structure
```
Candidate Name | Company | Designation | Department | Salary | Joining Date | Validity Period | Location | Email | Phone
John Doe | ABC Corp | Software Engineer | IT | 50000 | 2024-02-01 | 30 days | New York | john@example.com | 1234567890
Jane Smith | XYZ Inc | Data Analyst | Analytics | 45000 | 2024-02-15 | 30 days | Boston | jane@example.com | 0987654321
```

### Sample Single Offer Data
- Candidate Name: Test User
- Company: Test Company
- Designation: Test Position
- Department: Test Dept
- Salary: 60000
- Joining Date: 2024-03-01
- Validity Period: 45 days
- Location: Test City
- Email: test@example.com
- Phone: 5555555555

## Notes
- All tests should be performed on a clean database
- Test with various Excel formats and structures
- Verify all error messages are user-friendly
- Check console for any JavaScript errors
- Monitor network requests for proper API calls
- Verify database records after each operation

## Sign-off
- [ ] All backend tests passed
- [ ] All frontend tests passed
- [ ] All integration tests passed
- [ ] All security tests passed
- [ ] Documentation complete
- [ ] Ready for production
