/**
 * Server-side validation utilities for employee data
 */

const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Name must be 2-100 characters and contain only letters and spaces'
  },
  designation: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s-]+$/,
    message: 'Designation must be 2-50 characters and contain only letters, spaces, and hyphens'
  },
  department: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Department must be 2-50 characters and contain only letters and spaces'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email must be a valid email address'
  },
  phone: {
    required: true,
    pattern: /^[6-9]\d{9}$/,
    validator: (value) => {
      if (!value) return false;
      const cleaned = value.toString().replace(/\D/g, '');
      return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
    },
    message: 'Phone must be a valid 10-digit Indian mobile number starting with 6-9'
  },
  aadhar_number: {
    required: false,
    pattern: /^[0-9]{12}$/,
    message: 'Aadhar number must be exactly 12 digits'
  },
  pan_number: {
    required: false,
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    message: 'PAN number must be in format: ABCDE1234F'
  },
  date_of_birth: {
    required: false,
    validator: (value) => {
      if (!value) return true;
      const date = new Date(value);
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 18 && age <= 100;
    },
    message: 'Date of birth must be valid and person must be at least 18 years old'
  },
  joining_date: {
    required: false,
    validator: (value) => {
      if (!value) return true;
      const date = new Date(value);
      return date <= new Date();
    },
    message: 'Joining date cannot be in the future'
  },
  bank_account: {
    required: false,
    pattern: /^[0-9]{9,18}$/,
    message: 'Bank account must be 9-18 digits'
  },
  salary: {
    required: false,
    pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
    message: 'Salary must be a valid number'
  },
  emergency_phone: {
    required: false,
    pattern: /^[6-9][0-9]{9}$/,
    message: 'Emergency phone must start with 6-9 and be exactly 10 digits'
  },
  type: {
    required: true,
    pattern: /^(employee|intern)$/,
    message: 'Type must be either employee or intern'
  },
  employment_type: {
    required: true,
    pattern: /^(full_time|part_time|contract|intern)$/,
    message: 'Employment type must be full_time, part_time, contract, or intern'
  },
  work_location: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s-]+$/,
    message: 'Work location must be 2-50 characters and contain only letters, spaces, and hyphens'
  }
};

/**
 * Validate a single field
 * @param {string} fieldName - Name of the field to validate
 * @param {any} value - Value to validate
 * @returns {object} - { valid: boolean, error: string }
 */
function validateField(fieldName, value) {
  const rule = VALIDATION_RULES[fieldName];

  if (!rule) {
    return { valid: true };
  }

  // Check if field is required
  if (rule.required && (!value || value.toString().trim() === '')) {
    return { valid: false, error: `${fieldName} is required` };
  }

  // If not required and empty, it's valid
  if (!value || value.toString().trim() === '') {
    return { valid: true };
  }

  // Check min/max length
  if (rule.minLength && value.toString().length < rule.minLength) {
    return { valid: false, error: rule.message };
  }

  if (rule.maxLength && value.toString().length > rule.maxLength) {
    return { valid: false, error: rule.message };
  }

  // Check pattern
  if (rule.pattern && !rule.pattern.test(value.toString())) {
    return { valid: false, error: rule.message };
  }

  // Check custom validator function
  if (rule.validator && !rule.validator(value)) {
    return { valid: false, error: rule.message };
  }

  return { valid: true };
}

/**
 * Validate all employee fields
 * @param {object} employeeData - Employee data object
 * @returns {object} - { valid: boolean, errors: object }
 */
function validateEmployeeData(employeeData) {
  const errors = {};
  const fieldsToValidate = [
    'name', 'designation', 'department', 'type', 'employment_type', 'work_location',
    'email', 'phone', 'date_of_birth', 'joining_date', 'aadhar_number', 'pan_number',
    'bank_account', 'salary', 'emergency_phone'
  ];

  fieldsToValidate.forEach(field => {
    const result = validateField(field, employeeData[field]);
    if (!result.valid) {
      errors[field] = result.error;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Sanitize input to prevent SQL injection and XSS
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
  if (input === null || input === undefined) {
    return '';
  }
  if (typeof input !== 'string') {
    return String(input);
  }
  return input
    .trim()
    .replace(/[<>"'&]/g, '') // Remove potential XSS characters
    .substring(0, 500); // Limit length
}

/**
 * Sanitize all employee data
 * @param {object} data - Employee data object
 * @returns {object} - Sanitized data
 */
function sanitizeEmployeeData(data) {
  const sanitized = {};
  Object.keys(data).forEach(key => {
    sanitized[key] = sanitizeInput(data[key]);
  });
  return sanitized;
}

module.exports = {
  validateField,
  validateEmployeeData,
  sanitizeInput,
  sanitizeEmployeeData,
  VALIDATION_RULES
};
