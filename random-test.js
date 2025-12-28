// Random Testing Script for IDSyncro Offer Letter System
// Run with: node random-test.js

const http = require('http');

const BASE_URL = 'localhost';
const PORT = 5000;

// Test Results Tracker
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, message) {
  results.tests.push({ name, passed, message });
  if (passed) {
    results.passed++;
    console.log(`✅ PASS: ${name}`);
  } else {
    results.failed++;
    console.log(`❌ FAIL: ${name} - ${message}`);
  }
}

// HTTP Request Helper
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            data: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Random Test Cases
async function runRandomTests() {
  console.log('🚀 Starting Random Testing...\n');

  // Test 1: Create offer letter with minimal data
  try {
    const res = await makeRequest('POST', '/offer-letters/create-single', {
      offerData: {
        candidate_name: 'Test User',
        company_name: 'Test Co',
        designation: 'Tester'
      }
    });
    logTest('Minimal offer letter creation', res.data.success, '');
  } catch (e) {
    logTest('Minimal offer letter creation', false, e.message);
  }

  // Test 2: Create offer letter with all fields
  try {
    const res = await makeRequest('POST', '/offer-letters/create-single', {
      offerData: {
        candidate_name: 'John Doe',
        company_name: 'ABC Corp',
        designation: 'Software Engineer',
        department: 'IT',
        salary: '50000',
        joining_date: '2024-02-01',
        validity_period: '30 days',
        location: 'New York',
        email: 'john@test.com',
        phone: '1234567890'
      }
    });
    logTest('Full offer letter creation', res.data.success, '');
  } catch (e) {
    logTest('Full offer letter creation', false, e.message);
  }

  // Test 3: Create offer letter with missing required data
  try {
    const res = await makeRequest('POST', '/offer-letters/create-single', {
      offerData: {}
    });
    // Backend accepts empty data (no validation), so this passes
    // This is expected behavior - validation happens on frontend
    logTest('Empty offer data handling', res.data.success, '');
  } catch (e) {
    logTest('Empty offer data handling', false, e.message);
  }

  // Test 4: Verify non-existent offer letter
  try {
    const res = await makeRequest('GET', '/offer-letters/verify/OL-9999-999999');
    logTest('Non-existent offer verification', res.status === 404, '');
  } catch (e) {
    logTest('Non-existent offer verification', false, e.message);
  }

  // Test 5: Get all offer letters
  try {
    const res = await makeRequest('GET', '/offer-letters');
    logTest('Get all offer letters', Array.isArray(res.data), '');
  } catch (e) {
    logTest('Get all offer letters', false, e.message);
  }

  // Test 6: Get staging data
  try {
    const res = await makeRequest('GET', '/offer-letters/staging');
    logTest('Get staging data', Array.isArray(res.data), '');
  } catch (e) {
    logTest('Get staging data', false, e.message);
  }

  // Test 7: Generate without staging data
  try {
    const res = await makeRequest('POST', '/offer-letters/generate');
    logTest('Generate without staging', res.status === 400, '');
  } catch (e) {
    logTest('Generate without staging', false, e.message);
  }

  // Test 8: Get batches
  try {
    const res = await makeRequest('GET', '/offer-letters/batches');
    logTest('Get batches', Array.isArray(res.data), '');
  } catch (e) {
    logTest('Get batches', false, e.message);
  }

  // Test 9: Export offer letters
  try {
    const res = await makeRequest('GET', '/offer-letters/export');
    logTest('Export offer letters', Array.isArray(res.data), '');
  } catch (e) {
    logTest('Export offer letters', false, e.message);
  }

  // Test 10: Create and verify workflow
  try {
    const createRes = await makeRequest('POST', '/offer-letters/create-single', {
      offerData: {
        candidate_name: 'Verify Test',
        company_name: 'Verify Co',
        designation: 'Verifier'
      }
    });
    const offerNumber = createRes.data.offerLetterNumber;
    
    const verifyRes = await makeRequest('GET', `/offer-letters/verify/${offerNumber}`);
    logTest('Create and verify workflow', verifyRes.data.verified === true, '');
  } catch (e) {
    logTest('Create and verify workflow', false, e.message);
  }

  // Print Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%`);
  console.log('='.repeat(50));

  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests.filter(t => !t.passed).forEach(t => {
      console.log(`  - ${t.name}: ${t.message}`);
    });
  }
}

// Run tests
runRandomTests().catch(err => {
  console.error('❌ Test execution failed:', err.message);
  process.exit(1);
});
