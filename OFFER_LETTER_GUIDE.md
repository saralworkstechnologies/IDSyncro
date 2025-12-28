# Offer Letter Generator - Implementation Guide

## Overview
The Offer Letter Generator is a comprehensive feature that allows organizations to create, manage, and verify offer letters in both individual and bulk modes.

## Features Implemented

### 1. Individual Offer Letter Generation
- Create single offer letters through a web form
- Auto-generated unique offer letter numbers (Format: `OL-YYYY-XXXXXX`)
- All form data is captured and stored
- Instant generation with unique number assignment

### 2. Bulk Offer Letter Generation via Excel Import

#### Excel Import Workflow
1. **Upload Excel File**: Users upload .xls or .xlsx files
2. **Staging**: All rows and columns are imported and stored in a staging table
3. **No Numbers Generated**: Offer letter numbers are NOT generated during import
4. **Review**: Users can review staged data before generation
5. **Generate**: Click "Generate Offer Letters" to create unique numbers for all records

#### Key Features
- All Excel columns are preserved exactly as imported
- Data remains in draft state until generation
- Transaction-based generation (all or nothing)
- Unique offer letter numbers enforced at database level
- Immutable numbers (cannot be changed or reused)

### 3. Data Persistence & Metadata

#### Stored Metadata
- Original Excel filename
- File checksum/hash (SHA-256)
- Import timestamp
- Generated timestamp
- Batch ID
- Row number from Excel
- Offer Letter Number
- Generation status

#### Database Tables
- `offer_letters_staging`: Temporary storage for imported data
- `offer_letters`: Final generated offer letters
- `offer_letter_batches`: Batch metadata and tracking

### 4. Export Functionality
Export offer letter data to Excel with:
- All original columns from imported Excel
- Generated Offer Letter Number
- Batch ID and generation timestamp
- Status information

### 5. Reporting
- View all generated offer letters
- Filter by batch
- Sort and search capabilities
- Batch statistics and information
- Generation history

### 6. Public Verification
Public verification page accessible via unified verification route (http://localhost:3000/verify) showing:
- Offer Letter Number
- Company name
- Designation
- Offer validity period
- Issuance status

**Protected Data**: Personal and sensitive information is NOT exposed on verification page.

**Access**: Select "Offer Letter" tab on the verification page.

## API Endpoints

### Offer Letter Routes
- `POST /api/offer-letters/upload-excel` - Upload Excel for staging
- `GET /api/offer-letters/staging` - Get staged data
- `POST /api/offer-letters/generate` - Generate offer letters from staging
- `POST /api/offer-letters/create-single` - Create individual offer letter
- `GET /api/offer-letters` - Get all offer letters
- `GET /api/offer-letters/verify/:offerNumber` - Verify offer letter (public)
- `GET /api/offer-letters/export` - Export offer letters to Excel
- `GET /api/offer-letters/batches` - Get batch information

## Frontend Components

### 1. OfferLetters.js
Main component with routing for all offer letter features

### 2. CreateOfferLetter.js
Form for creating individual offer letters with fields:
- Candidate Name
- Company Name
- Designation
- Department
- Salary
- Joining Date
- Validity Period
- Location
- Email
- Phone

### 3. BulkOfferLetter.js
Bulk generation interface with:
- Excel file upload
- Data staging preview
- Generation trigger
- Result display

### 4. ManageOfferLetters.js
Management interface with:
- List all offer letters
- Filter by batch
- Export to Excel
- View batch information
- Statistics dashboard

### 5. VerifyOfferLetter.js
Public verification interface:
- Enter offer letter number
- View public information only
- Verification status display

## Security Features

1. **Unique Number Generation**: System-generated, globally unique, immutable
2. **Database Constraints**: UNIQUE constraint on offer_letter_number
3. **Transaction Safety**: All-or-nothing generation process
4. **Data Validation**: Input validation on all endpoints
5. **Public Data Control**: Only predefined fields exposed on verification
6. **File Hash Verification**: SHA-256 hash for Excel file integrity

## Usage Instructions

### Creating Individual Offer Letter
1. Navigate to "Offer Letters" → "Create Single"
2. Fill in the form with candidate details
3. Click "Generate Offer Letter"
4. Unique offer letter number is generated instantly

### Bulk Generation Workflow
1. Navigate to "Offer Letters" → "Bulk Generation"
2. Prepare Excel file with offer letter data
3. Click "Choose Excel File" and select your file
4. Click "Upload & Stage" to import data
5. Review the staged data preview
6. Click "Generate Offer Letters" to create unique numbers
7. View generation results with all offer letter numbers

### Managing Offer Letters
1. Navigate to "Offer Letters" → "Manage"
2. View all generated offer letters
3. Filter by batch if needed
4. Click "Export to Excel" to download data
5. View batch information and statistics

### Verifying Offer Letters
1. Navigate to "Offer Letters" → "Verify"
2. Enter the offer letter number
3. Click "Verify"
4. View public information and verification status

## Database Schema

### offer_letters_staging
```sql
CREATE TABLE offer_letters_staging (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staging_id TEXT UNIQUE NOT NULL,
  excel_data TEXT NOT NULL,
  excel_filename TEXT,
  excel_hash TEXT,
  row_number INTEGER,
  import_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'draft'
);
```

### offer_letters
```sql
CREATE TABLE offer_letters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  offer_letter_number TEXT UNIQUE NOT NULL,
  offer_data TEXT NOT NULL,
  batch_id TEXT,
  excel_filename TEXT,
  excel_hash TEXT,
  row_number INTEGER,
  import_timestamp DATETIME,
  generated_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  generated_by TEXT,
  status TEXT DEFAULT 'active'
);
```

### offer_letter_batches
```sql
CREATE TABLE offer_letter_batches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id TEXT UNIQUE NOT NULL,
  excel_filename TEXT,
  excel_hash TEXT,
  offer_count INTEGER DEFAULT 0,
  import_timestamp DATETIME,
  generated_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  generated_by TEXT
);
```

## Offer Letter Number Format
- Format: `OL-YYYY-XXXXXX`
- Example: `OL-2024-123456`
- YYYY: Current year
- XXXXXX: Last 6 digits of timestamp (ensures uniqueness)

## Best Practices

1. **Excel Preparation**: Ensure Excel files have consistent column headers
2. **Data Review**: Always review staged data before generation
3. **Batch Tracking**: Use batch IDs to track related offer letters
4. **Regular Exports**: Export data regularly for backup
5. **Verification**: Test verification before sharing offer letter numbers

## Future Enhancements

- Email notifications for offer letter generation
- PDF generation with company branding
- Digital signatures
- Offer letter templates
- Expiry date tracking
- Acceptance/rejection tracking
- Integration with HR systems
- Audit logging for all operations

## Troubleshooting

### Issue: Excel upload fails
- Check file format (.xlsx or .xls)
- Ensure file size is under 10MB
- Verify file is not corrupted

### Issue: Generation fails
- Ensure staging data exists
- Check database connectivity
- Verify no duplicate offer letter numbers

### Issue: Verification not working
- Confirm offer letter number format
- Check if offer letter status is "active"
- Verify database connection

## Support
For issues or questions, refer to the main IDSyncro documentation or contact the development team.
