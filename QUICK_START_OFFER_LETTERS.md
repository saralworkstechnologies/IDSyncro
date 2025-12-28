# Offer Letter Generator - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- IDSyncro system running (Backend on port 5000, Frontend on port 3000)
- Excel file with offer letter data (for bulk generation)

## 📝 Option 1: Create Single Offer Letter

### Steps:
1. **Navigate**: Click "Offer Letters" in the main menu
2. **Select**: Click "Create Single" tab
3. **Fill Form**:
   - Candidate Name: `John Doe` (required)
   - Company Name: `ABC Corporation` (required)
   - Designation: `Software Engineer` (required)
   - Department: `IT` (optional)
   - Salary: `50000` (optional)
   - Joining Date: `2024-02-01` (optional)
   - Validity Period: `30 days` (optional)
   - Location: `New York` (optional)
   - Email: `john@example.com` (optional)
   - Phone: `1234567890` (optional)
4. **Generate**: Click "📄 Generate Offer Letter"
5. **Success**: Note the offer letter number (e.g., `OL-2024-123456`)

**Time Required**: 2 minutes

---

## 📤 Option 2: Bulk Generate from Excel

### Steps:

#### Step 1: Prepare Excel File (2 minutes)
Create an Excel file with these columns:
```
Candidate Name | Company | Designation | Department | Salary | Joining Date | Validity Period | Location | Email | Phone
```

Example data:
```
John Doe | ABC Corp | Software Engineer | IT | 50000 | 2024-02-01 | 30 days | New York | john@example.com | 1234567890
Jane Smith | ABC Corp | Data Analyst | Analytics | 45000 | 2024-02-15 | 30 days | Boston | jane@example.com | 0987654321
```

#### Step 2: Upload & Stage (1 minute)
1. Navigate to "Offer Letters" → "Bulk Generation"
2. Click "📁 Choose Excel File"
3. Select your Excel file
4. Click "⬆️ Upload & Stage"
5. Review the import summary and preview

#### Step 3: Generate (1 minute)
1. Review the staged data
2. Click "🚀 Generate Offer Letters"
3. Wait for generation to complete
4. Note the batch ID and offer letter numbers

**Time Required**: 4 minutes

---

## ✅ Verify an Offer Letter

### Steps:
1. Navigate to "Verify ID" in the main menu (or click Verify from Offer Letters)
2. Select "Offer Letter" tab
3. Enter offer letter number (e.g., `OL-2024-123456`)
4. Click "Verify Document"
5. View verification results

**Time Required**: 30 seconds

---

## 📊 Export Offer Letters

### Steps:
1. Navigate to "Offer Letters" → "Manage"
2. (Optional) Filter by batch
3. Click "📊 Export to Excel"
4. Excel file downloads automatically

**Time Required**: 30 seconds

---

## 🎯 Quick Tips

### For Best Results:
✅ Use consistent column names in Excel
✅ Ensure no empty rows in your data
✅ Keep file size under 10MB
✅ Use .xlsx or .xls format only
✅ Review staged data before generating

### Common Mistakes to Avoid:
❌ Don't upload files larger than 10MB
❌ Don't use special characters in column names
❌ Don't leave required fields empty
❌ Don't try to generate without staging first
❌ Don't upload non-Excel files

---

## 📋 Sample Excel Template

### Minimum Required Columns:
```
Candidate Name | Company | Designation
John Doe | ABC Corp | Software Engineer
```

### Recommended Columns:
```
Candidate Name | Company | Designation | Department | Salary | Joining Date | Validity Period | Location | Email | Phone
```

### Download Template:
Create a new Excel file with the headers above and add your data.

---

## 🔢 Understanding Offer Letter Numbers

### Format: `OL-YYYY-XXXXXX`
- **OL**: Offer Letter prefix
- **YYYY**: Current year (e.g., 2024)
- **XXXXXX**: Unique 6-digit number

### Example: `OL-2024-123456`

### Properties:
- ✅ Globally unique
- ✅ Immutable (cannot be changed)
- ✅ Auto-generated
- ✅ Database-enforced uniqueness

---

## 📦 Understanding Batches

### What is a Batch?
A batch groups all offer letters generated from a single Excel upload.

### Batch ID Format: `BATCH-OL-timestamp`
Example: `BATCH-OL-1704067200000`

### Benefits:
- Track related offer letters
- Filter by batch
- Export specific batches
- View batch statistics

---

## 🔐 Verification Information

### What's Shown (Public):
✅ Offer Letter Number
✅ Company Name
✅ Designation
✅ Validity Period
✅ Issue Date
✅ Status

### What's Protected (Private):
❌ Personal contact information
❌ Salary details
❌ Internal notes
❌ Candidate personal data

---

## 🆘 Troubleshooting

### Upload Fails?
1. Check file format (.xlsx or .xls)
2. Verify file size (< 10MB)
3. Ensure file is not open in Excel
4. Try re-saving the file

### Generation Fails?
1. Ensure data is staged
2. Check database connection
3. Try uploading again
4. Contact administrator

### Verification Not Working?
1. Check offer letter number format
2. Ensure number is correct
3. Verify offer letter exists
4. Check status is "active"

---

## 📞 Need Help?

### Documentation:
- 📖 [Offer Letter Guide](OFFER_LETTER_GUIDE.md) - Detailed documentation
- ✅ [Test Checklist](OFFER_LETTER_TEST_CHECKLIST.md) - Testing guide
- 📊 [Excel Template Guide](EXCEL_TEMPLATE_GUIDE.md) - Excel help
- 📝 [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Technical details

### Support:
- Check the main README.md
- Contact system administrator
- Review error messages carefully

---

## 🎉 Success Checklist

After completing this guide, you should be able to:
- ✅ Create individual offer letters
- ✅ Upload Excel files for bulk generation
- ✅ Generate offer letters with unique numbers
- ✅ Verify offer letters
- ✅ Export offer letter data
- ✅ Manage and filter offer letters
- ✅ Understand batch tracking

---

## 🚦 Next Steps

1. **Test with Sample Data**: Create 2-3 test offer letters
2. **Try Bulk Upload**: Upload a small Excel file (5 rows)
3. **Verify**: Test the verification system
4. **Export**: Download and review exported data
5. **Production**: Start using with real data

---

**Estimated Total Time**: 10-15 minutes to master all features

**Ready to Start?** Navigate to the Offer Letters section in IDSyncro! 🚀
