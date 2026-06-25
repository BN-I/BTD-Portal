"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { register } from "@/lib/auth-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { isValidEmail } from "@/app/common";
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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [hasReadAgreement, setHasReadAgreement] = useState(false);

  useEffect(() => {
    trackPageView("register", "auth");
    trackRegistrationFormStart();
    setShowVideo(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!isValidEmail(formData.email))
        throw new Error("Please enter a valid email");
      if (formData.password !== formData.confirmPassword)
        throw new Error("Passwords do not match");
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      )
        throw new Error("All fields are required");
      trackRegistrationAttempt();
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
    trackAgreementAccepted();
    let success = false;
    try {
      await register({ ...formData, role: "Vendor", loginProvider: "Local" });
      trackRegistrationSuccess("vendor");
      toast({
        title: "Account created!",
        description: "Please sign in to continue.",
      });
      success = true;
      setIsRedirecting(true);
      router.push("/auth/signin");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      if (!success) setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto space-y-10">
        {/* Brand */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-stone-800">
              Before the Dates
            </span>
          </div>
          <p className="text-sm text-stone-400">
            Vendor Portal &mdash; create your account
          </p>
        </div>

        {/* Two-panel grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Form panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-stone-200/60 shadow-[0_8px_40px_rgba(0,0,0,0.07)] p-8">
            <div className="mb-7">
              <h2 className="text-xl font-semibold text-stone-800">
                Create your account
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleContinue} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-[11px] font-semibold uppercase tracking-widest text-stone-400"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="h-11 rounded-xl border-stone-200 bg-stone-50/60 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-[11px] font-semibold uppercase tracking-widest text-stone-400"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-11 rounded-xl border-stone-200 bg-stone-50/60 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-[11px] font-semibold uppercase tracking-widest text-stone-400"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-stone-200 bg-stone-50/60 focus:bg-white transition-colors pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-[11px] font-semibold uppercase tracking-widest text-stone-400"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-stone-200 bg-stone-50/60 focus:bg-white transition-colors pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2.5">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-teal-500/20 border-0 transition-all mt-2"
                disabled={isLoading || isRedirecting}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                    account…
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-stone-400">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                onClick={() => trackCTA("login_link", "register_page")}
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Tutorial panel */}
          <div
            className={`bg-white/80 backdrop-blur-sm rounded-3xl border border-stone-200/60 shadow-[0_8px_40px_rgba(0,0,0,0.07)] overflow-hidden flex flex-col transition-all duration-700 ${
              showVideo
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-stone-800">
                  Platform Tutorial
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  A quick walkthrough of your vendor dashboard
                </p>
              </div>
              <div className="flex-1 relative rounded-2xl overflow-hidden bg-stone-900 min-h-[230px]">
                {!videoError ? (
                  <video
                    className="w-full h-full object-contain"
                    controls
                    poster="/logo.png"
                    preload="auto"
                    onError={() => setVideoError(true)}
                  >
                    <source src="/tutorial-video-2.MP4" type="video/mp4" />
                  </video>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700">
                    <Image
                      src="/logo.png"
                      alt="Tutorial"
                      width={52}
                      height={52}
                      className="mb-3 opacity-90"
                    />
                    <p className="text-sm font-semibold text-white">
                      Tutorial Video
                    </p>
                    <p className="text-xs text-white/65 mt-1 text-center px-6">
                      Temporarily unavailable — check back soon
                    </p>
                  </div>
                )}
              </div>
              <p className="mt-4 text-xs text-stone-400 text-center">
                Watch this to get started with your vendor portal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agreement Dialog */}
      <Dialog
        open={isAgreementOpen}
        onOpenChange={(open) => {
          setIsAgreementOpen(open);
          if (open) trackAgreementViewed();
        }}
      >
        <DialogContent className="max-w-lg flex flex-col">
          <DialogHeader>
            <DialogTitle>Terms &amp; Agreement</DialogTitle>
            <DialogDescription>
              Please read and accept our agreement before continuing.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto max-h-[400px] p-4 space-y-4 text-sm text-stone-700 bg-stone-50 rounded-xl border border-stone-100">
            <h1 className="font-semibold text-stone-800">Vendor Agreement</h1>
            <p>
              This agreement establishes the terms under which a vendor
              affiliates with the company to sell products through the company's
              mobile application platform.
            </p>
            <div>
              <h2 className="font-semibold text-stone-800">
                I. Scope of Agreement
              </h2>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-stone-600">
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
              <h2 className="font-semibold text-stone-800">
                II. Vendor Onboarding &amp; Portal Access
              </h2>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-stone-600">
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
              <h2 className="font-semibold text-stone-800">
                III. Fees and Commissions
              </h2>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-stone-600">
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
              <h2 className="font-semibold text-stone-800">
                IV. Vendor Obligations
              </h2>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-stone-600">
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
              <h2 className="font-semibold text-stone-800">
                V. Confidentiality, Non-Disclosure and Non-Compete
              </h2>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-stone-600">
                <li>
                  Both parties agree to maintain confidentiality of business and
                  customer information.
                </li>
                <li>
                  The company's platform processes are trade secrets and cannot
                  be used outside this agreement.
                </li>
                <li>
                  All intellectual property of the platform belongs exclusively
                  to the company.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold text-stone-800">VI. Liability</h2>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-stone-600">
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
              <h2 className="font-semibold text-stone-800">VII. Termination</h2>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-stone-600">
                <li>
                  Either party may terminate with five (5) days&apos; written
                  notice.
                </li>
                <li>
                  The vendor must complete pending shipments, and the company
                  will pay outstanding amounts due.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold text-stone-800">
                VIII. Miscellaneous
              </h2>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-stone-600">
                <li>
                  The agreement is governed by Florida law, with jurisdiction in
                  Volusia County.
                </li>
                <li>
                  The prevailing party in litigation may recover attorney&apos;s
                  fees.
                </li>
                <li>
                  This document constitutes the entire agreement, superseding
                  prior understandings.
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center gap-2.5 mt-4">
            <Checkbox
              id="read-agreement"
              checked={hasReadAgreement}
              onCheckedChange={(val) => setHasReadAgreement(!!val)}
            />
            <label
              htmlFor="read-agreement"
              className="text-sm text-stone-600 select-none cursor-pointer"
            >
              I have read and agree to the terms above
            </label>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-4 border-t border-stone-100">
            <Button variant="outline" onClick={() => setIsAgreementOpen(false)}>
              Decline
            </Button>
            <Button
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 shadow-md shadow-teal-500/20"
              onClick={handleAcceptAgreement}
              disabled={isLoading || !hasReadAgreement}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Accept &amp; Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
