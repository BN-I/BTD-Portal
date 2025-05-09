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
  status: UserStatus;
  lastLogin: string | undefined;
  updatedAt: string;
}

export enum UserStatus {
  active = "Active",
  inactive = "Inactive",
  pending = "Pending",
  suspended = "Suspended",
  blocked = "Blocked",
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface IBusinessInformation {
  _id: string;
  vendorID: string;
  businessType: string;
  taxID: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  storePolicy: string;
  returnPolicy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStoreInformation {
  _id: string;
  vendorID: string;
  storeImage?: string;
  storeName: string;
  storeDescription: string;
  businessCategory: string;
  companySize: string;
  yearFounded: string;
  website: string;
  instagram: string;
  facebook: string;
  twitter: string;
  createdAt?: Date;
  updatedAt?: Date;
  category?: string;
}

export interface IPaymentInformation {
  _id: string;
  vendorID: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}
