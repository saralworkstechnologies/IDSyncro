require('dotenv').config();
const QRCode = require('qrcode');
const { connectDB, Employee, Certificate } = require('./database');

const VERIFY_PORTAL_BASE_URL = process.env.VERIFY_PORTAL_BASE_URL || 'https://verify.saralworkstechnologies.info';
const NORMALIZED_VERIFY_PORTAL_URL = VERIFY_PORTAL_BASE_URL.replace(/\/$/, '');

async function generateQRCode(uuid) {
  const verifyUrl = `${NORMALIZED_VERIFY_PORTAL_URL}/verify/${uuid}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 200,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  return qrCodeDataUrl;
}

async function updateAllQRCodes() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected successfully');

    console.log(`Using verification URL: ${NORMALIZED_VERIFY_PORTAL_URL}`);

    // Update Employee QR codes
    const employees = await Employee.find();
    console.log(`Found ${employees.length} employees to update`);

    let updatedCount = 0;
    for (const employee of employees) {
      const newQrCode = await generateQRCode(employee.uuid);
      employee.qr_code = newQrCode;
      await employee.save();
      updatedCount++;
      console.log(`Updated ${updatedCount}/${employees.length}: ${employee.name} (${employee.employee_id})`);
    }

    console.log(`\n✅ Successfully updated ${updatedCount} employee QR codes`);
    console.log(`All QR codes now point to: ${NORMALIZED_VERIFY_PORTAL_URL}/verify/{UUID}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating QR codes:', error);
    process.exit(1);
  }
}

updateAllQRCodes();
