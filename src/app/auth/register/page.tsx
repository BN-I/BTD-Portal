"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { register } from "@/lib/auth-service";
import { set } from "date-fns";
import axios, { Axios, AxiosError } from "axios";
import { isValidEmail } from "@/app/common";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useFacebookPixel } from "@/hooks/use-facebook-pixel";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    trackPageView,
    trackRegistrationFormStart,
    trackRegistrationAttempt,
    trackRegistrationSuccess,
    trackAgreementViewed,
    trackAgreementAccepted,
    trackCTA,
  } = useFacebookPixel();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isAgreementOpen, setIsAgreementOpen] = useState(false); // modal state
  const [hasReadAgreement, setHasReadAgreement] = useState(false);

  // Track page view and form start
  useEffect(() => {
    trackPageView("register", "auth");
    trackRegistrationFormStart();

    // Load video after page loads
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 1000); // Show video after 1 second

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!isValidEmail(formData.email)) {
        throw new Error("Please enter a valid email");
      }
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        throw new Error("All fields are required");
      }

      // Track registration attempt
      trackRegistrationAttempt();

      // If validations pass → open agreement modal
      setIsAgreementOpen(true);
    } catch (error: any) {
      setErrorMessage(error.message);
      toast({
        variant: "destructive",
        title: "Validation failed",
        description: error.message,
      });
    }
  };

  const handleAcceptAgreement = async () => {
    setIsAgreementOpen(false);
    setIsLoading(true);

    // Track agreement acceptance
    trackAgreementAccepted();

    try {
      await register({
        ...formData,
        role: "Vendor",
        loginProvider: "Local",
      });

      // Track successful registration
      trackRegistrationSuccess("vendor");

      toast({
        title: "Registration successful",
        description: "Welcome to the dashboard!",
      });
      router.push("/auth/signin");
    } catch (error: any) {
      console.log("error", error.response?.data?.message);
      setErrorMessage(error.response?.data?.message || "Something went wrong");
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex gap-4 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={110}
            height={110}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-[#00BFA6] hover:text-[#00BFA6]/90"
              onClick={() => trackCTA("login_link", "register_page")}
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="mt-8 flex md:flex-row flex-col gap-4 items-stretch justify-center">
          <div className="max-w-md h-full w-full">
            <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
              <form onSubmit={handleContinue} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>

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

                <div>
                  <Label htmlFor="password">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-red-600"> {errorMessage}</p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#00BFA6] hover:bg-[#00BFA6]/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div
            className={`max-w-md w-full flex items-center flex-1 h-full lg:min-h-[496px] transition-all duration-1000 ${
              showVideo
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="border border-[#00BFA6] min-h-[400px] rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Portal Tutorial
                  </h3>
                  <p className="text-sm text-gray-600">
                    Learn how to use our platform effectively
                  </p>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video">
                  {!videoError ? (
                    <>
                      <video
                        className="w-full h-full object-contain"
                        controls
                        poster="/logo.png"
                        preload="metadata"
                        onError={(e) => {
                          console.error("Video error:", e);
                          setVideoError(true);
                        }}
                        onLoadStart={() => console.log("Video loading started")}
                        onCanPlay={() => console.log("Video can play")}
                      >
                        <source src="/tutorial-video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>

                      {/* Video overlay when not playing */}
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="bg-white bg-opacity-90 rounded-full p-4">
                          <Play className="h-8 w-8 text-[#00BFA6]" />
                        </div>
                      </div>
                    </>
                  ) : (
                    // Fallback when video fails to load
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#00BFA6] to-[#00BFA6]/70 text-white">
                      <Image
                        src="/logo.png"
                        alt="Tutorial Preview"
                        width={80}
                        height={80}
                        className="mb-4 opacity-90"
                      />
                      <h4 className="text-lg font-semibold mb-2">
                        Tutorial Video
                      </h4>
                      <p className="text-sm text-center px-4 opacity-90">
                        Video temporarily unavailable.
                        <br />
                        Please check back later.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Watch this tutorial to get started with our portal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isAgreementOpen}
        onOpenChange={(open) => {
          setIsAgreementOpen(open);
          if (open) {
            trackAgreementViewed();
          }
        }}
      >
        <DialogContent className="max-w-lg flex flex-col">
          <DialogHeader>
            <DialogTitle>Terms & Agreement</DialogTitle>
            <DialogDescription>
              Please read and accept our agreement before continuing.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto max-h-[400px] p-2 space-y-4 text-sm text-gray-700 bg-[#F3F4F6] ">
            <h1 className="font-semibold">Vendor Agreement</h1>

            <p>
              This agreement establishes the terms under which a vendor
              affiliates with the company to sell products through the company’s
              mobile application platform. It defines the responsibilities,
              fees, and legal considerations for both parties involved.
            </p>

            <div>
              <h2 className="font-semibold">I. Scope of Agreement</h2>
              <ul>
                <li>
                  The company will onboard the vendor as an affiliate on its
                  platform for a one-year term.
                </li>
                <li>
                  No employment or agency relationship is created; the vendor
                  may market products elsewhere but cannot imply company
                  endorsement.
                </li>
                <li>
                  The vendor may not assign duties without prior written consent
                  from the company.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold">
                II. Vendor Onboarding & Portal Access
              </h2>
              <ul>
                <li>
                  The vendor receives a personalized portal to manage product
                  listings, inventory, pricing, and related operations.
                </li>
                <li>
                  The vendor agrees to comply with platform policies and
                  requirements.
                </li>
                <li>
                  The vendor must provide accurate product descriptions, images,
                  and inventory availability.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold">III. Fees and Commissions</h2>
              <ul>
                <li>The vendor pays an annual administrative fee.</li>
                <li>
                  The company charges a commission percentage on each successful
                  sale.
                </li>
                <li>Merchant processing fees are deducted before payment.</li>
                <li>
                  Payments are released 30 days after delivery confirmation.
                </li>
                <li>
                  The vendor is responsible for applicable taxes and
                  chargebacks.
                </li>
                <li>Commission fees are non-refundable.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold">IV. Vendor Obligations</h2>
              <ul>
                <li>
                  Vendor must ensure timely delivery of genuine, quality
                  products.
                </li>
                <li>Vendor bears all shipping costs and risks.</li>
                <li>
                  Vendor handles customer complaints, returns, and service
                  matters directly.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold">
                V. Confidentiality, Non-Disclosure and Non-Compete
              </h2>
              <ul>
                <li>
                  Both parties agree to maintain confidentiality of business and
                  customer information.
                </li>
                <li>
                  The company’s platform processes are trade secrets and cannot
                  be used outside this agreement.
                </li>
                <li>
                  All intellectual property of the platform belongs exclusively
                  to the company.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold">VI. Liability</h2>
              <ul>
                <li>
                  The company limits liability except in cases of gross
                  negligence or willful misconduct.
                </li>
                <li>
                  The vendor indemnifies the company against claims related to
                  products sold on the platform.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold">VII. Termination</h2>
              <ul>
                <li>
                  Either party may terminate with five (5) days’ written notice.
                </li>
                <li>
                  The vendor must complete pending shipments, and the company
                  will pay outstanding amounts due.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold">VIII. Miscellaneous</h2>
              <ul>
                <li>
                  The agreement is governed by Florida law, with jurisdiction in
                  Volusia County.
                </li>
                <li>
                  The prevailing party in litigation may recover attorney’s
                  fees.
                </li>
                <li>
                  This document constitutes the entire agreement, superseding
                  prior understandings.
                </li>
              </ul>
            </div>
            <p>{/* 🔽 Put your full long agreement text here */}</p>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="read-agreement"
              checked={hasReadAgreement}
              onCheckedChange={(val) => setHasReadAgreement(!!val)}
            />
            <label
              htmlFor="read-agreement"
              className="text-sm text-gray-700 select-none cursor-pointer"
            >
              I have read and agree to the terms above
            </label>
          </div>
          <DialogFooter className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsAgreementOpen(false)}>
              Decline
            </Button>
            <Button
              className="bg-[#00BFA6] hover:bg-[#00BFA6]/90"
              onClick={handleAcceptAgreement}
              disabled={isLoading || !hasReadAgreement}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Accept & Continue"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
