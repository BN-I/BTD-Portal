import axios from "axios";
import { User } from "./auth-types";

const api = axios.create({
  baseURL: "/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function register(data: {
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Vendor";
  loginProvider: "Local";
}) {
  return new Promise(async (resolve, reject) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/signup`, data)
      .then((response) => {
        resolve(response.data.user);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<User> {
  // Simulating API call
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/login`, data)
        .then((response) => {
          console.log(response.data);
          resolve(response.data.user);
        })
        .catch((error) => {
          reject(
            error.response?.data?.message ||
              error.message ||
              "Invalid credentials"
          ); // Return a rejected promise with the error
        });
    } catch (error) {
      reject("Login failed"); // Return a rejected promise with the error
    }
  });
}

export async function forgotPassword(data: {
  email: string;
}): Promise<{ message: string }> {
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(
            error.response?.data?.message ||
              error.message ||
              "Failed to send password reset email"
          );
        });
    } catch (error) {
      reject("Failed to send password reset email");
    }
  });
}

export async function verifyOTP(data: {
  email: string;
  otp: string;
}): Promise<{ message: string }> {
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/verify-otp`, data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(
            error.response?.data?.message ||
              error.message ||
              "Invalid OTP"
          );
        });
    } catch (error) {
      reject("OTP verification failed");
    }
  });
}

export async function resetPassword(data: {
  email: string;
  password: string;
  otp: string;
}): Promise<{ message: string }> {
  return new Promise((resolve, reject) => {
    try {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(
            error.response?.data?.message ||
              error.message ||
              "Failed to reset password"
          );
        });
    } catch (error) {
      reject("Password reset failed");
    }
  });
}


