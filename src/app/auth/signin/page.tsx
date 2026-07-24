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
import { login } from "@/lib/auth-service";
import axios from "axios";
import { getStoreData } from "@/lib/http/getStoreData";
import { useFacebookPixel } from "@/hooks/use-facebook-pixel";

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { trackPageView, trackLoginAttempt, trackLoginSuccess, trackCTA } =
    useFacebookPixel();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    trackPageView("login", "auth");
    setShowVideo(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    trackLoginAttempt("email");

    let success = false;
    try {
      await login(formData).then(async (response) => {
        const userCookie = JSON.stringify(response);
        document.cookie = `user=${encodeURIComponent(
          userCookie,
        )}; path=/; max-age=${60 * 60 * 24 * 365}`;
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("user", JSON.stringify(response));

        trackLoginSuccess(response.role);

        if (response.role === "Vendor") {
          await getStoreData(response._id);
        }

        success = true;
        setIsRedirecting(true);

        if (response.role === "Vendor") {
          router.push("/dashboard");
        } else if (response.role === "Admin") {
          router.push("/admin");
        }
      });
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Invalid credentials",
      );
      toast({
        variant: "destructive",
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
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
            Vendor Portal &mdash; sign in to manage your store
          </p>
        </div>

        {/* Two-panel grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Form panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-stone-200/60 shadow-[0_8px_40px_rgba(0,0,0,0.07)] p-8 flex flex-col justify-center">
            <div className="mb-7">
              <h2 className="text-xl font-semibold text-stone-800">
                Welcome back
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="flex justify-end">
                <Link
                  href="/auth/change-password"
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2.5">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold shadow-lg shadow-brand-500/20 border-0 transition-all"
                disabled={isLoading || isRedirecting}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Opening your dashboard…
                  </>
                ) : isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              {isRedirecting && (
                <p className="text-xs text-brand-600 text-center flex items-center justify-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
                  You're in — taking you there now
                </p>
              )}
            </form>

            <p className="mt-6 text-center text-xs text-stone-400">
              New vendor?{" "}
              <Link
                href="/auth/register"
                className="text-brand-600 hover:text-brand-700 font-semibold transition-colors"
                onClick={() => trackCTA("register_link", "login_page")}
              >
                Create an account
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700">
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
    </div>
  );
}
