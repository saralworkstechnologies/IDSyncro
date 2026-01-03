const mongoose = require('mongoose');

const DEFAULT_DB_NAME = 'idsyncro';

mongoose.set('strictQuery', true);

const counterSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  value: { type: Number, default: 0 }
}, { versionKey: false });

const employeeIdCounterSchema = new mongoose.Schema({
  type: { type: String, required: true },
  year: { type: String, required: true },
  counter: { type: Number, default: 0 }
}, { versionKey: false });
employeeIdCounterSchema.index({ type: 1, year: 1 }, { unique: true });

const employeeSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  uuid: { type: String, unique: true, required: true },
  employee_id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  type: { type: String, required: true, enum: ['employee', 'intern'] },
  employment_type: { type: String, default: 'full_time' },
  work_location: { type: String, default: null },
  status: { type: String, default: 'active' },
  photo: { type: String, default: null },
  qr_code: { type: String, default: null },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  emergency_contact: { type: String, default: null },
  emergency_phone: { type: String, default: null },
  date_of_birth: { type: String, default: null },
  joining_date: { type: String, default: null },
  salary: { type: String, default: null },
  bank_account: { type: String, default: null },
  aadhar_number: { type: String, default: null },
  pan_number: { type: String, default: null },
  blood_group: { type: String, default: null },
  manager: { type: String, default: null }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false
});



employeeSchema.index({ type: 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ name: 1 });

const certificateSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  certificate_uuid: { type: String, unique: true, required: true },
  certificate_code: { type: String, unique: true, required: true },
  person_uuid: { type: String, required: true },
  name: { type: String, required: true },
  certificate_type: { type: String, required: true },
  certificate_data: { type: String, required: true },
  fingerprint: { type: String, required: true },
  signature: { type: String, required: true },
  status: { type: String, default: 'active' },
  batch_id: { type: String, default: null },
  schema_version: { type: Number, default: 1 },
  issue_date: { type: String, required: true },
  created_by: { type: String, default: null },
  revoked_at: { type: Date, default: null },
  revocation_reason: { type: String, default: null }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false
});

certificateSchema.index({ person_uuid: 1 });
certificateSchema.index({ status: 1 });
certificateSchema.index({ batch_id: 1 });

const certificateBatchSchema = new mongoose.Schema({
  batch_id: { type: String, unique: true, required: true },
  certificate_type: { type: String, required: true },
  schema: { type: String, required: true },
  excel_hash: { type: String, default: null },
  certificate_count: { type: Number, default: 0 },
  created_by: { type: String, default: null }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  versionKey: false
});

const offerLetterStagingSchema = new mongoose.Schema({
  staging_id: { type: String, unique: true, required: true },
  excel_data: { type: String, required: true },
  excel_filename: { type: String, default: null },
  excel_hash: { type: String, default: null },
  row_number: { type: Number, required: true },
  import_timestamp: { type: String, required: true },
  status: { type: String, default: 'draft' }
}, {
  timestamps: false,
  versionKey: false
});

offerLetterStagingSchema.index({ row_number: 1 });


const offerLetterSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  offer_letter_number: { type: String, unique: true, required: true },
  offer_data: { type: String, required: true },
  batch_id: { type: String, default: null },
  excel_filename: { type: String, default: null },
  excel_hash: { type: String, default: null },
  row_number: { type: Number, default: null },
  import_timestamp: { type: String, default: null },
  generated_timestamp: { type: String, default: null },
  generated_by: { type: String, default: null },
  status: { type: String, default: 'active' }
}, {
  timestamps: false,
  versionKey: false
});

offerLetterSchema.index({ status: 1 });
offerLetterSchema.index({ batch_id: 1 });

const offerLetterBatchSchema = new mongoose.Schema({
  batch_id: { type: String, unique: true, required: true },
  excel_filename: { type: String, default: null },
  excel_hash: { type: String, default: null },
  offer_count: { type: Number, default: 0 },
  import_timestamp: { type: String, default: null },
  generated_timestamp: { type: String, default: null },
  generated_by: { type: String, default: null }
}, {
  timestamps: false,
  versionKey: false
});

const Counter = mongoose.model('Counter', counterSchema);
const EmployeeIdCounter = mongoose.model('EmployeeIdCounter', employeeIdCounterSchema);
const Employee = mongoose.model('Employee', employeeSchema);
const Certificate = mongoose.model('Certificate', certificateSchema);
const CertificateBatch = mongoose.model('CertificateBatch', certificateBatchSchema);
const OfferLetterStaging = mongoose.model('OfferLetterStaging', offerLetterStagingSchema);
const OfferLetter = mongoose.model('OfferLetter', offerLetterSchema);
const OfferLetterBatch = mongoose.model('OfferLetterBatch', offerLetterBatchSchema);

function resolveMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }
  throw new Error('MONGODB_URI is not configured. Create a .env file with your MongoDB connection string.');
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  const uri = resolveMongoUri();
  const dbName = process.env.MONGODB_DB || DEFAULT_DB_NAME;
  await mongoose.connect(uri, {
    dbName,
    serverSelectionTimeoutMS: 5000
  });
  return mongoose.connection;
}

async function getNextSequenceValue(name) {
  const next = await Counter.findOneAndUpdate(
    { name },
    { $inc: { value: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return next.value;
}

async function generateEmployeeCode(type) {
  const normalizedType = type === 'intern' ? 'intern' : 'employee';
  const typeCode = normalizedType === 'employee' ? 'EMP' : 'INT';
  const year = new Date().getFullYear().toString().slice(-2);
  const counter = await EmployeeIdCounter.findOneAndUpdate(
    { type: normalizedType, year },
    { $inc: { counter: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  if (counter.counter > 9999) {
    throw new Error('Maximum ID limit (9999) reached for this year');
  }
  return `SWT-${year}-${typeCode}-${counter.counter.toString().padStart(4, '0')}`;
}

module.exports = {
  connectDB,
  Employee,
  Certificate,
  CertificateBatch,
  OfferLetter,
  OfferLetterBatch,
  OfferLetterStaging,
  Counter,
  EmployeeIdCounter,
  getNextSequenceValue,
  generateEmployeeCode
};
