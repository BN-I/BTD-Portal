// Validation patterns and functions for account forms

// Email validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email);

// Phone number validation (US format)
export const PHONE_REGEX = /^(\+1\s?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
};

// Bank account number validation (8-17 digits)
export const ACCOUNT_NUMBER_REGEX = /^\d{8,17}$/;
export const isValidAccountNumber = (accountNumber: string): boolean => {
  const cleaned = accountNumber.replace(/\D/g, '');
  return ACCOUNT_NUMBER_REGEX.test(cleaned);
};

// Routing number validation (9 digits)
export const ROUTING_NUMBER_REGEX = /^\d{9}$/;
export const isValidRoutingNumber = (routingNumber: string): boolean => {
  const cleaned = routingNumber.replace(/\D/g, '');
  return ROUTING_NUMBER_REGEX.test(cleaned);
};

// SSN/ITIN validation (9 digits with optional formatting)
export const SSN_REGEX = /^\d{3}-?\d{2}-?\d{4}$/;
export const isValidSSN = (ssn: string): boolean => {
  const cleaned = ssn.replace(/\D/g, '');
  return cleaned.length === 9;
};

// Tax ID validation (EIN format: XX-XXXXXXX)
export const TAX_ID_REGEX = /^\d{2}-?\d{7}$/;
// export const TAX_ID_REGEX = /^\d{2;
export const isValidTaxId = (taxId: string): boolean => {
  const cleaned = taxId.replace(/\D/g, '');
  return cleaned.length === 9;
};

// Website URL validation
export const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
export const isValidUrl = (url: string): boolean => {
  if (!url) return true; // Optional field
  return URL_REGEX.test(url);
};

// Social media handle validation
export const SOCIAL_HANDLE_REGEX = /^@?[a-zA-Z0-9._]{1,30}$/;
export const isValidSocialHandle = (handle: string): boolean => {
  if (!handle) return true; // Optional field
  return SOCIAL_HANDLE_REGEX.test(handle);
};

// Postal code validation (US format)
export const POSTAL_CODE_REGEX = /^\d{5}(-\d{4})?$/;
export const isValidPostalCode = (postalCode: string): boolean => {
  return POSTAL_CODE_REGEX.test(postalCode);
};

// Year validation (1900 to current year)
export const isValidYear = (year: string): boolean => {
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);
  return yearNum >= 1900 && yearNum <= currentYear;
};

// Name validation (letters, spaces, hyphens, apostrophes)
export const NAME_REGEX = /^[a-zA-Z\s\-']{2,50}$/;
export const isValidName = (name: string): boolean => {
  return NAME_REGEX.test(name.trim());
};

// Store name validation
export const STORE_NAME_REGEX = /^[a-zA-Z0-9\s\-'&]{2,100}$/;
export const isValidStoreName = (name: string): boolean => {
  return STORE_NAME_REGEX.test(name.trim());
};

// Date of birth validation
export const isValidDateOfBirth = (day: string, month: string, year: string): boolean => {
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  
  if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) return false;
  
  const date = new Date(yearNum, monthNum - 1, dayNum);
  const currentDate = new Date();
  const minAge = 18;
  const maxAge = 100;
  
  // Check if date is valid
  if (date.getFullYear() !== yearNum || date.getMonth() !== monthNum - 1 || date.getDate() !== dayNum) {
    return false;
  }
  
  // Check age range
  let age = currentDate.getFullYear() - date.getFullYear();
  const monthDiff = currentDate.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < date.getDate())) {
    age--;
  }
  
  return age >= minAge && age <= maxAge;
};

// Validation error messages
export const VALIDATION_MESSAGES = {
  required: (field: string) => `${field} is required`,
  invalidEmail: 'Please enter a valid email address',
  invalidPhone: 'Please enter a valid phone number (e.g., (555) 123-4567)',
  invalidAccountNumber: 'Account number must be 8-17 digits',
  invalidRoutingNumber: 'Routing number must be exactly 9 digits',
  invalidSSN: 'SSN/ITIN must be exactly 9 digits',
  invalidTaxId: 'Tax ID must be in format XX-XXXXXXX',
  invalidUrl: 'Please enter a valid URL (e.g., https://example.com)',
  invalidSocialHandle: 'Please enter a valid social media handle',
  invalidPostalCode: 'Please enter a valid postal code',
  invalidYear: 'Please enter a valid year',
  invalidName: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  invalidStoreName: 'Store name can contain letters, numbers, spaces, hyphens, apostrophes, and ampersands',
  invalidDateOfBirth: 'Please enter a valid date of birth (must be 18+ years old)',
  minLength: (field: string, min: number) => `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) => `${field} must be no more than ${max} characters`,
};

// Form validation functions
export const validateStoreInfo = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.storeName?.trim()) {
    errors.storeName = VALIDATION_MESSAGES.required('Store name');
  } else if (!isValidStoreName(data.storeName)) {
    errors.storeName = VALIDATION_MESSAGES.invalidStoreName;
  }

  if (!data.storeDescription?.trim()) {
    errors.storeDescription = VALIDATION_MESSAGES.required('Store description');
  } else if (data.storeDescription.length < 10) {
    errors.storeDescription = VALIDATION_MESSAGES.minLength('Store description', 10);
  }

  if (!data.category) {
    errors.category = VALIDATION_MESSAGES.required('Business category');
  }

  if (data.website && !isValidUrl(data.website)) {
    errors.website = VALIDATION_MESSAGES.invalidUrl;
  }

  if (data.instagram && !isValidSocialHandle(data.instagram)) {
    errors.instagram = VALIDATION_MESSAGES.invalidSocialHandle;
  }

  if (data.facebook && !isValidSocialHandle(data.facebook)) {
    errors.facebook = VALIDATION_MESSAGES.invalidSocialHandle;
  }

  if (data.twitter && !isValidSocialHandle(data.twitter)) {
    errors.twitter = VALIDATION_MESSAGES.invalidSocialHandle;
  }

  if (data.yearFounded && !isValidYear(data.yearFounded)) {
    errors.yearFounded = VALIDATION_MESSAGES.invalidYear;
  }

  return errors;
};

export const validateBusinessDetails = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.businessType?.trim()) {
    errors.businessType = VALIDATION_MESSAGES.required('Business type');
  }

  if (!data.taxId?.trim()) {
    errors.taxId = VALIDATION_MESSAGES.required('Tax ID');
  } else if (!isValidTaxId(data.taxId)) {
    errors.taxId = VALIDATION_MESSAGES.invalidTaxId;
  }

  if (!data.businessEmail?.trim()) {
    errors.businessEmail = VALIDATION_MESSAGES.required('Business email');
  } else if (!isValidEmail(data.businessEmail)) {
    errors.businessEmail = VALIDATION_MESSAGES.invalidEmail;
  }

  if (!data.businessPhone?.trim()) {
    errors.businessPhone = VALIDATION_MESSAGES.required('Business phone');
  } else if (!isValidPhone(data.businessPhone)) {
    errors.businessPhone = VALIDATION_MESSAGES.invalidPhone;
  }

  if (!data.streetAddress?.trim()) {
    errors.streetAddress = VALIDATION_MESSAGES.required('Street address');
  }

  if (!data.city?.trim()) {
    errors.city = VALIDATION_MESSAGES.required('City');
  }

  if (!data.state?.trim()) {
    errors.state = VALIDATION_MESSAGES.required('State');
  }

  if (!data.postalCode?.trim()) {
    errors.postalCode = VALIDATION_MESSAGES.required('Postal code');
  } else if (!isValidPostalCode(data.postalCode)) {
    errors.postalCode = VALIDATION_MESSAGES.invalidPostalCode;
  }

  if (!data.country?.trim()) {
    errors.country = VALIDATION_MESSAGES.required('Country');
  }

  if (!data.shippingPolicy?.trim()) {
    errors.shippingPolicy = VALIDATION_MESSAGES.required('Shipping policy');
  }

  if (!data.returnPolicy?.trim()) {
    errors.returnPolicy = VALIDATION_MESSAGES.required('Return policy');
  }

  return errors;
};

export const validatePaymentInfo = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.bankName?.trim()) {
    errors.bankName = VALIDATION_MESSAGES.required('Bank name');
  }

  if (!data.accountHolderFirstName?.trim()) {
    errors.accountHolderFirstName = VALIDATION_MESSAGES.required('Account holder first name');
  } else if (!isValidName(data.accountHolderFirstName)) {
    errors.accountHolderFirstName = VALIDATION_MESSAGES.invalidName;
  }

  if (!data.accountHolderLastName?.trim()) {
    errors.accountHolderLastName = VALIDATION_MESSAGES.required('Account holder last name');
  } else if (!isValidName(data.accountHolderLastName)) {
    errors.accountHolderLastName = VALIDATION_MESSAGES.invalidName;
  }

  if (!data.businessUrl?.trim()) {
    errors.businessUrl = VALIDATION_MESSAGES.required('Business URL');
  } else if (!isValidUrl(data.businessUrl)) {
    errors.businessUrl = VALIDATION_MESSAGES.invalidUrl;
  }

  if (!data.accountNumber?.trim()) {
    errors.accountNumber = VALIDATION_MESSAGES.required('Account number');
  } else if (!isValidAccountNumber(data.accountNumber)) {
    errors.accountNumber = VALIDATION_MESSAGES.invalidAccountNumber;
  }

  if (!data.routingNumber?.trim()) {
    errors.routingNumber = VALIDATION_MESSAGES.required('Routing number');
  } else if (!isValidRoutingNumber(data.routingNumber)) {
    errors.routingNumber = VALIDATION_MESSAGES.invalidRoutingNumber;
  }

  if (!data.phoneNumber?.trim()) {
    errors.phoneNumber = VALIDATION_MESSAGES.required('Phone number');
  } else if (!isValidPhone(data.phoneNumber)) {
    errors.phoneNumber = VALIDATION_MESSAGES.invalidPhone;
  }

  if (!data.addressP?.trim()) {
    errors.addressP = VALIDATION_MESSAGES.required('Address');
  }

  if (!data.cityP?.trim()) {
    errors.cityP = VALIDATION_MESSAGES.required('City');
  }

  if (!data.stateP?.trim()) {
    errors.stateP = VALIDATION_MESSAGES.required('State');
  }

  if (!data.postalCodeP?.trim()) {
    errors.postalCodeP = VALIDATION_MESSAGES.required('Postal code');
  } else if (!isValidPostalCode(data.postalCodeP)) {
    errors.postalCodeP = VALIDATION_MESSAGES.invalidPostalCode;
  }

  if (!data.countryP?.trim()) {
    errors.countryP = VALIDATION_MESSAGES.required('Country');
  }

  if (!data.dobDay?.trim() || !data.dobMonth?.trim() || !data.dobYear?.trim()) {
    errors.dateOfBirth = VALIDATION_MESSAGES.required('Date of birth');
  } else if (!isValidDateOfBirth(data.dobDay, data.dobMonth, data.dobYear)) {
    errors.dateOfBirth = VALIDATION_MESSAGES.invalidDateOfBirth;
  }

  if (!data.id_number?.trim()) {
    errors.id_number = VALIDATION_MESSAGES.required('SSN/ITIN');
  } else if (!isValidSSN(data.id_number)) {
    errors.id_number = VALIDATION_MESSAGES.invalidSSN;
  }

  if (!data.industry?.trim()) {
    errors.industry = VALIDATION_MESSAGES.required('Industry');
  }

  return errors;
}; 