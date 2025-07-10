"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Mail,
  Shield,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";

type Step = "email" | "pin" | "password" | "success";

interface FormData {
  email: string;
  pin: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    pin: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePin = (pin: string): boolean => {
    return /^\d{4}$/.test(pin);
  };

  const validatePassword = (
    password: string
  ): { isValid: boolean; message?: string } => {
    const requirements = [];

    if (password.length < 8) {
      requirements.push("at least 8 characters");
    }

    if (!/[A-Z]/.test(password)) {
      requirements.push("1 uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      requirements.push("1 lowercase letter");
    }

    if (!/\d/.test(password)) {
      requirements.push("1 digit");
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      requirements.push("1 special character");
    }

    if (requirements.length > 0) {
      return {
        isValid: false,
        message: `Password must contain ${requirements.join(", ")}`,
      };
    }

    return { isValid: true };
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.email) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call API to send PIN to email
      // await sendPinToEmail(formData.email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCurrentStep("pin");
      toast({
        title: "Verification PIN sent to your email",
        description: "Please check your email for the verification PIN",
      });
    } catch (error) {
      toast({
        title: "Failed to send PIN. Please try again.",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.pin) {
      setErrors({ pin: "PIN is required" });
      return;
    }

    if (!validatePin(formData.pin)) {
      setErrors({ pin: "PIN must be exactly 4 digits" });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call API to verify PIN
      // await verifyPin(formData.email, formData.pin);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCurrentStep("password");
      toast({
        title: "PIN verified successfully",
        description: "Please enter your new password",
      });
    } catch (error) {
      toast({
        title: "Invalid PIN. Please try again.",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.newPassword) {
      setErrors({ newPassword: "New password is required" });
      return;
    }

    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      setErrors({ newPassword: passwordValidation.message });
      return;
    }

    if (!formData.confirmPassword) {
      setErrors({ confirmPassword: "Please confirm your password" });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call API to change password
      // await changePassword(formData.email, formData.pin, formData.newPassword);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCurrentStep("success");
      toast({
        title: "Password changed successfully!",
        description: "Please login with your new password",
      });
    } catch (error) {
      toast({
        title: "Failed to change password. Please try again.",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/auth/signin");
  };

  const handleGoBack = () => {
    if (currentStep === "pin") {
      setCurrentStep("email");
    } else if (currentStep === "password") {
      setCurrentStep("pin");
    }
  };

  const getStepIcon = (step: Step) => {
    switch (step) {
      case "email":
        return <Mail className="w-6 h-6" />;
      case "pin":
        return <Shield className="w-6 h-6" />;
      case "password":
        return <Lock className="w-6 h-6" />;
      case "success":
        return <CheckCircle className="w-6 h-6" />;
    }
  };

  const getStepTitle = (step: Step) => {
    switch (step) {
      case "email":
        return "Enter Your Email";
      case "pin":
        return "Verify PIN";
      case "password":
        return "Set New Password";
      case "success":
        return "Password Changed!";
    }
  };

  const getStepDescription = (step: Step) => {
    switch (step) {
      case "email":
        return "Enter your email address to receive a verification PIN";
      case "pin":
        return "Enter the 4-digit PIN sent to your email";
      case "password":
        return "Create a new secure password for your account";
      case "success":
        return "Your password has been successfully changed";
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Image
        src="/logo.png"
        alt="logo"
        width={700}
        height={700}
        className="mx-auto mb-3 absolute top-10 z-0 opacity-50 left-[50%] translate-x-[-50%]"
      />
      <div className="max-w-md bg-white pt-10 w-full space-y-8 z-10 relative">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#00BFA6]/10 rounded-full">
              <div className="text-[#00BFA6]">{getStepIcon(currentStep)}</div>
            </div>
          </div>

          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            {getStepTitle(currentStep)}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getStepDescription(currentStep)}
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {currentStep === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={isLoading}
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90"
                disabled={isLoading}
              >
                {isLoading ? "Sending PIN..." : "Send Verification PIN"}
              </Button>
            </form>
          )}

          {currentStep === "pin" && (
            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div>
                <Label htmlFor="pin">Verification PIN</Label>
                <Input
                  id="pin"
                  type="text"
                  placeholder="Enter 4-digit PIN"
                  value={formData.pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setFormData({ ...formData, pin: value });
                  }}
                  maxLength={4}
                  disabled={isLoading}
                  className="mt-1 text-center text-lg tracking-widest"
                />
                {errors.pin && (
                  <p className="text-sm text-red-500">{errors.pin}</p>
                )}
                <p className="text-xs text-gray-500 text-center mt-2">
                  PIN sent to {formData.email}. <br /> The pin will expire in 5
                  minutes.
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoBack}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#00BFA6] hover:bg-[#00BFA6]/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify PIN"}
                </Button>
              </div>
            </form>
          )}

          {currentStep === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.newPassword ? (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.newPassword}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    Password must contain at least 8 characters, 1 uppercase
                    letter, 1 lowercase letter, 1 digit, 1 special character
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoBack}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#00BFA6] hover:bg-[#00BFA6]/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          )}

          {currentStep === "success" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600">
                Your password has been successfully changed. You can now log in
                with your new password.
              </p>
              <Button onClick={handleBackToLogin} className="w-full">
                Back to Login
              </Button>
            </div>
          )}

          {currentStep !== "success" && (
            <div className="mt-6">
              <Button
                variant="ghost"
                onClick={handleBackToLogin}
                className="w-full text-sm text-gray-500"
              >
                Back to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
