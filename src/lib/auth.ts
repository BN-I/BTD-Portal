import { NextRequest } from "next/server";
import { User } from "./auth-types";
import { getCookie } from "@/app/common";

export function setAuthToken(token: string) {
  localStorage.setItem("auth_token", token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function removeAuthToken() {
  localStorage.removeItem("auth_token");
}

export function setUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser(): User | null {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function removeUser() {
  localStorage.removeItem("user");
}

export async function signOut() {
  removeAuthToken();
  removeUser();
  window.location.href = "/auth/signin";
}

export function hasStoreData(user: User | null): boolean {
  if (!user) return false;
  if (user.role !== "Vendor") return true;

  // Check if vendor has store data
  const storeData = getCookie("storeData");
  return !!storeData;
}
