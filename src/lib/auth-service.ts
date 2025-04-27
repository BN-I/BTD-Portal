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
          reject(error.response.data.message || "Invalid credentials"); // Return a rejected promise with the error
        });
    } catch (error) {
      reject("Login failed"); // Return a rejected promise with the error
    }
  });
}
