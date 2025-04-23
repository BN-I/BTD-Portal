"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/lib/auth-service";
import { cookies } from "next/headers"; // Import this to access cookies
import axios from "axios";

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData).then(async (response) => {
        const userCookie = JSON.stringify(response);
        document.cookie = `user=${userCookie}; path=/; max-age=${
          60 * 60 * 24 * 365
        }`; // Expires in 365 days
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("user", JSON.stringify(response));

        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/store/storeInformation/${response._id}`
          )
          .then((res) => {
            if (res.data.storeInformation) {
              document.cookie = `storeData=${JSON.stringify(
                res.data.storeInformation
              )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
            }
          })
          .catch((err) => {
            console.log(err);
          });

        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/store/businessInformation/${response._id}`
          )
          .then((res) => {
            if (res.data.businessInformation) {
              document.cookie = `businessInformation=${JSON.stringify(
                res.data.businessInformation
              )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
            }
          })
          .catch((err) => {
            console.log(err);
          });

        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/store/paymentInformation/${response._id}`
          )
          .then((res) => {
            if (res.data.paymentInformation) {
              document.cookie = `paymentInformation=${JSON.stringify(
                res.data.paymentInformation
              )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
            }
          })
          .catch((err) => {
            console.log(err);
          });

        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/${response._id}`
          )
          .then((res) => {
            if (res.data.subscription) {
              document.cookie = `subscription=${JSON.stringify(
                res.data.subscription
              )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
            }
          })
          .catch((err) => {
            console.log(err);
          });

        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        router.push("/dashboard");
      });
      setErrorMessage("");
    } catch (error) {
      console.error("Login failed", JSON.stringify(error));
      setErrorMessage(error as string);
      toast({
        variant: "destructive",
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={82}
            height={82}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/register"
              className="font-medium text-[#00BFA6] hover:text-[#00BFA6]/90"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-[#00BFA6] hover:text-[#00BFA6]/90"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          <div>
            <p className="mt-2 text-sm  text-red-600">
              {errorMessage ? errorMessage : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
