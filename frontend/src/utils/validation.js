/**
 * Validation utility functions for form validation
 */

/**
 * Validates an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password (must be at least 6 characters)
 * @param {string} password - The password to validate
 * @returns {boolean} - Whether the password is valid
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Checks if two passwords match
 * @param {string} password - The first password
 * @param {string} confirmPassword - The second password
 * @returns {boolean} - Whether the passwords match
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validates a URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidUrl = (url) => {
  if (!url) return true; // Empty URLs are allowed
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validates that a value is a number and within a range
 * @param {string|number} value - The value to validate
 * @param {number} min - Minimum allowed value (optional)
 * @param {number} max - Maximum allowed value (optional)
 * @returns {boolean} - Whether the value is a valid number within range
 */
export const isValidNumber = (value, min = null, max = null) => {
  const num = Number(value);
  
  if (isNaN(num)) return false;
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  
  return true;
};

/**
 * Validates bike field constraints
 * @param {string} field - The field name
 * @param {any} value - The field value
 * @returns {string|null} - Error message or null if valid
 */
export const validateBikeField = (field, value) => {
  switch (field) {
    case 'brand':
    case 'model':
      return value.trim() ? null : `${field} is required`;
    
    case 'year':
      if (!value) return 'Year is required';
      if (!isValidNumber(value, 1900, new Date().getFullYear() + 1)) {
        return `Year must be between 1900 and ${new Date().getFullYear() + 1}`;
      }
      return null;
    
    case 'price':
      if (!value) return 'Price is required';
      if (!isValidNumber(value, 0)) return 'Price must be a positive number';
      return null;
    
    case 'kilometers_driven':
      if (!value) return 'Kilometers driven is required';
      if (!isValidNumber(value, 0)) return 'Kilometers driven must be a positive number';
      return null;
    
    case 'location':
      return value.trim() ? null : 'Location is required';
    
    case 'image_url':
      return value ? (isValidUrl(value) ? null : 'Please enter a valid URL') : null;
    
    default:
      return null;
  }
};

/**
 * Validates all bike fields at once
 * @param {object} bike - The bike object with all fields
 * @returns {object} - Object with field names as keys and error messages as values
 */
export const validateBike = (bike) => {
  const errors = {};
  
  Object.keys(bike).forEach(field => {
    const error = validateBikeField(field, bike[field]);
    if (error) {
      errors[field] = error;
    }
  });
  
  return errors;
};

/**
 * Validates user registration fields
 * @param {object} user - The user object with registration fields
 * @returns {object} - Object with field names as keys and error messages as values
 */
export const validateRegistration = (user) => {
  const { email, password, confirm } = user;
  const errors = {};
  
  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (!confirm) {
    errors.confirm = 'Please confirm your password';
  } else if (!passwordsMatch(password, confirm)) {
    errors.confirm = 'Passwords do not match';
  }
  
  return errors;
};

/**
 * Validates login fields
 * @param {object} user - The user object with login fields
 * @returns {object} - Object with field names as keys and error messages as values
 */
export const validateLogin = (user) => {
  const { email, password } = user;
  const errors = {};
  
  if (!email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!password) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

/**
 * Checks if there are any errors in the errors object
 * @param {object} errors - The errors object
 * @returns {boolean} - Whether there are any errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};