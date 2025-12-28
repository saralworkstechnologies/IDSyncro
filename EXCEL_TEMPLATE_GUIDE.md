# Sample Excel Template for Bulk Offer Letter Generation

## Required Columns

The Excel file should contain the following columns (column names can vary):

### Basic Information
- **Candidate Name** or **Name**: Full name of the candidate
- **Company** or **Company Name**: Name of the hiring company
- **Designation** or **Position**: Job title/position

### Optional Columns
- **Department**: Department name
- **Salary**: Salary amount
- **Joining Date**: Expected joining date
- **Validity Period**: Offer validity (e.g., "30 days")
- **Location**: Work location
- **Email**: Candidate email
- **Phone**: Contact number

### Additional Custom Columns
You can add any additional columns you need. All columns will be preserved in the system.

## Sample Data

```
Candidate Name | Company      | Designation          | Department  | Salary | Joining Date | Validity Period | Location  | Email                | Phone
---------------|--------------|---------------------|-------------|--------|--------------|----------------|-----------|---------------------|------------
John Doe       | ABC Corp     | Software Engineer   | IT          | 50000  | 2024-02-01   | 30 days        | New York  | john@example.com    | 1234567890
Jane Smith     | ABC Corp     | Data Analyst        | Analytics   | 45000  | 2024-02-15   | 30 days        | Boston    | jane@example.com    | 0987654321
Mike Johnson   | XYZ Inc      | Product Manager     | Product     | 70000  | 2024-03-01   | 45 days        | Chicago   | mike@example.com    | 5551234567
Sarah Williams | ABC Corp     | UX Designer         | Design      | 55000  | 2024-02-20   | 30 days        | New York  | sarah@example.com   | 5559876543
Tom Brown      | XYZ Inc      | DevOps Engineer     | IT          | 60000  | 2024-03-15   | 30 days        | Seattle   | tom@example.com     | 5555555555
```

## Excel File Requirements

### File Format
- Supported formats: `.xlsx` (Excel 2007+) or `.xls` (Excel 97-2003)
- Maximum file size: 10 MB

### Data Requirements
- First row must contain column headers
- At least one data row required
- No empty rows between data
- Column headers should be descriptive

### Best Practices
1. **Consistent Data**: Ensure data format is consistent across rows
2. **No Special Characters**: Avoid special characters in column names
3. **Date Format**: Use standard date format (YYYY-MM-DD or MM/DD/YYYY)
4. **No Formulas**: Use plain values, not Excel formulas
5. **Clean Data**: Remove any extra spaces or formatting

## Creating Your Excel File

### Method 1: Using Microsoft Excel
1. Open Microsoft Excel
2. Create column headers in the first row
3. Enter data starting from the second row
4. Save as `.xlsx` or `.xls`

### Method 2: Using Google Sheets
1. Create your spreadsheet in Google Sheets
2. File → Download → Microsoft Excel (.xlsx)

### Method 3: Using LibreOffice Calc
1. Create your spreadsheet in LibreOffice Calc
2. File → Save As → Select Excel format

## Example Excel Template

You can create a template with these exact columns:

| Column Name      | Data Type | Example           | Required |
|-----------------|-----------|-------------------|----------|
| Candidate Name  | Text      | John Doe          | Yes      |
| Company         | Text      | ABC Corporation   | Yes      |
| Designation     | Text      | Software Engineer | Yes      |
| Department      | Text      | IT                | No       |
| Salary          | Number    | 50000             | No       |
| Joining Date    | Date      | 2024-02-01        | No       |
| Validity Period | Text      | 30 days           | No       |
| Location        | Text      | New York          | No       |
| Email           | Email     | john@example.com  | No       |
| Phone           | Text      | 1234567890        | No       |

## Upload Process

1. **Prepare Excel**: Create your Excel file with the data
2. **Upload**: Go to Offer Letters → Bulk Generation
3. **Select File**: Click "Choose Excel File" and select your file
4. **Upload & Stage**: Click "Upload & Stage" button
5. **Review**: Check the preview to ensure data is correct
6. **Generate**: Click "Generate Offer Letters" to create unique numbers

## Important Notes

### Data Preservation
- All columns from your Excel file will be preserved
- Data is stored exactly as provided
- No data transformation or modification

### Staging Process
- Data is first staged (no offer letter numbers generated)
- You can review staged data before generation
- Offer letter numbers are only created when you click "Generate"

### Unique Numbers
- Each offer letter gets a unique number: `OL-YYYY-XXXXXX`
- Numbers are immutable (cannot be changed)
- Numbers are globally unique (enforced by database)

### Batch Tracking
- All offer letters from one upload are grouped in a batch
- Batch ID format: `BATCH-OL-timestamp`
- You can filter and export by batch

## Troubleshooting

### Upload Fails
- Check file format (.xlsx or .xls)
- Verify file size is under 10 MB
- Ensure file is not corrupted
- Close file in Excel before uploading

### Data Not Showing Correctly
- Check column headers are in first row
- Ensure no empty rows in data
- Verify data format is consistent
- Remove any merged cells

### Generation Fails
- Ensure staging data exists
- Check database connectivity
- Try uploading again

## Export After Generation

After generating offer letters, you can export the data:
1. Go to Offer Letters → Manage
2. Click "Export to Excel"
3. Downloaded file will include:
   - All original columns from your Excel
   - Generated Offer Letter Number
   - Batch ID
   - Generation timestamp
   - Status

## Support

For additional help or questions:
- Refer to the [Offer Letter Guide](OFFER_LETTER_GUIDE.md)
- Check the [Test Checklist](OFFER_LETTER_TEST_CHECKLIST.md)
- Contact system administrator
