export interface User {
  _id: string;
  email: string;
  apartmentNumber: string | undefined;
  city: string | undefined;
  country: string | undefined;
  createdAt: string;
  emailVerified: boolean;
  loginProvider: string;
  name: string;
  phoneNumber: string | undefined;
  countryCode: string | undefined;
  postalCode: string | undefined;
  role: string;
  state: string | undefined;
  streetAddress: string | undefined;
  token: string;
  status: string;
  lastLogin: string | undefined;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
