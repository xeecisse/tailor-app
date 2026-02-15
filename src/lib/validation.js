// Form validation utilities
export const validators = {
  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) ? null : 'Invalid email address';
  },

  phone: (value) => {
    const regex = /^[\d\s\-\+\(\)]{10,}$/;
    return regex.test(value) ? null : 'Invalid phone number';
  },

  required: (value) => {
    return value && value.trim() ? null : 'This field is required';
  },

  minLength: (min) => (value) => {
    return value && value.length >= min ? null : `Minimum ${min} characters required`;
  },

  maxLength: (max) => (value) => {
    return value && value.length <= max ? null : `Maximum ${max} characters allowed`;
  },

  number: (value) => {
    return !isNaN(value) && value !== '' ? null : 'Must be a number';
  },

  positiveNumber: (value) => {
    return !isNaN(value) && parseFloat(value) >= 0 ? null : 'Must be a positive number';
  },

  currency: (value) => {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(value) ? null : 'Invalid currency format';
  },

  date: (value) => {
    return new Date(value) instanceof Date && !isNaN(new Date(value)) ? null : 'Invalid date';
  },
};

// Validate form data
export const validateForm = (data, schema) => {
  const errors = {};

  Object.keys(schema).forEach((field) => {
    const validators_list = schema[field];
    const value = data[field];

    for (const validator of validators_list) {
      const error = validator(value);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return errors;
};

// Common validation schemas
export const schemas = {
  client: {
    name: [validators.required, validators.minLength(2)],
    phone: [validators.required, validators.phone],
    email: [validators.email],
    gender: [validators.required],
  },

  order: {
    clientId: [validators.required],
    measurementId: [validators.required],
    attireType: [validators.required],
    price: [validators.required, validators.positiveNumber],
  },

  inventoryItem: {
    name: [validators.required, validators.minLength(2)],
    categoryId: [validators.required],
    quantity: [validators.required, validators.positiveNumber],
    costPrice: [validators.required, validators.positiveNumber],
    sellingPrice: [validators.required, validators.positiveNumber],
  },

  payment: {
    amount: [validators.required, validators.positiveNumber],
    method: [validators.required],
  },
};
