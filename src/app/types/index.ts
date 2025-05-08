import { User } from "@/lib/auth-types";

export interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  discountedPrice: number | undefined;
  images: string[];
  isFeatured: boolean;
  colorVariations: string[];
  sizeVariations: string[];
  vendor: Vendor;
  status: ProductStatus;
  link: string;
  orders: number;
  orderMinDays: number;
  orderMaxDays: number;
  createdAt: string;
  updatedAt: string;
  files: File[] | undefined;
  __v: number;
}

export enum ProductStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export interface DeletingProduct {
  _id: string;
  title: string;
  __v: number;
}

export interface productForm {
  _id: string | undefined;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  orderMinDays: number;
  orderMaxDays: number;
  colorVariations?: string[];
  sizeVariations?: string[];
  images?: string[];
  files?: File[];
}

export interface ProductForm {
  _id: string | undefined;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  orderMinDays: number;
  orderMaxDays: number;
  colorVariations?: string[];
  sizeVariations?: string[];
  images?: string[];
  files?: File[];
}

export interface Vendor {
  activePackage: string;
  _id: string;
  name: string;
  email: string;
  password: string;
  token: string;
  loginProvider: string;
  role: string;
  streetAddress: string;
  apartmentNumber: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  emailVerified: boolean;
  stripeCustomerId: string;
  FCMToken: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Gift {
  selectedVariations: {
    color: string;
    size: string;
  };
  product: Product;
  price: number;
  vendor: string;
  _id: string;
}

export interface Event {
  _id: string;
  title: string;
  fullDate: string;
  date: number;
  month: number;
  year: number;
  time: string;
  location: string;
  note: string;
  recipientPhone: string;
  recurringEvent: boolean;
  user: string;
}

export interface Order {
  _id: string;
  gifts: Gift[];
  vendor: User;
  amount: number;
  totalAmount: number;
  status: string;
  user: User;
  event: Event;
  shippingService: string | undefined;
  trackingID: string | undefined;
  trackingURL: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export type SalesRecord = {
  month: string;
  revenue: number;
  expense: number;
};

export interface Notification {
  _id: string;
  title: string;
  description: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  user: string;
}
