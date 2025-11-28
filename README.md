# IDSyncro ID Management System

A comprehensive web application for organizations to design, issue, and verify ID cards and certificates.

## Features

### ID Card Management
- **Employee IDs**: Format `SWT-25-EMP-0XXX`
- **Intern IDs**: Format `SWT-25-INT-0XXX`
- Auto-generated unique ID numbers
- Photo upload and management
- QR code generation for verification

### Template Designer
- Dynamic form fields based on ID type
- Photo upload with preview
- Automatic ID number generation
- QR code integration

### Verification System
- Public verification page
- QR code scanning support
- UUID-based verification
- Real-time status checking

### Management Features
- CRUD operations for all ID types
- Filtering by ID type
- Dashboard with statistics
- Bulk operations support

## Technology Stack

### Backend
- Node.js with Express
- SQLite database
- Multer for file uploads
- QRCode generation
- Canvas for image processing

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Modern responsive design

## Installation

### Backend Setup
1. Navigate to the root directory:
   ```bash
   cd IDSyncro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   Frontend will run on http://localhost:3000

## Usage

### Creating IDs
1. Go to "Create ID" page
2. Select ID type (Employee/Intern)
3. Fill required fields based on type
4. Upload photo
5. Click "Generate ID"

### Managing IDs
1. Go to "Manage IDs" page
2. View all created IDs
3. Filter by type
4. Delete IDs as needed
5. Verify IDs directly

### Verification
1. Go to "Verify ID" page
2. Enter UUID or Employee ID
3. View verification results
4. Check ID status and details

## API Endpoints

- `POST /api/employees` - Create new employee/intern
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get specific employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/verify/:uuid` - Verify ID by UUID

## ID Format

### Employee ID
- Format: `SWT-25-EMP-0XXX`
- Example: `SWT-25-EMP-0001`

### Intern ID
- Format: `SWT-25-INT-0XXX`
- Example: `SWT-25-INT-0001`

## QR Code Integration

Each ID includes a QR code that contains:
- Verification URL: `http://localhost:3000/verify/{UUID}`
- Direct access to verification page
- Real-time status checking

## Security Features

- UUID-based verification
- Secure file upload handling
- Input validation
- CORS protection
- SQL injection prevention

## Future Enhancements

- Cryptographic signatures
- Blockchain integration
- Bulk CSV upload
- PDF export functionality
- Advanced template designer
- Role-based access control
- Email notifications
- Audit logging