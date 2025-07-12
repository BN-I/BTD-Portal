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
import { login } from "@/lib/auth-service";
import { cookies } from "next/headers"; // Import this to access cookies
import axios from "axios";
import { getStoreData } from "@/lib/http/getStoreData";

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Load video after page loads
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 1000); // Show video after 1 second

    return () => clearTimeout(timer);
  }, []);

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
        document.cookie = `user=${encodeURIComponent(
          userCookie
        )}; path=/; max-age=${60 * 60 * 24 * 365}`; // Expires in 365 days
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("user", JSON.stringify(response));

        toast({
          title: "Login successful",
          description: "Welcome back!",
        });

        if (response.role == "Vendor") {
          await getStoreData(response._id);
          router.push("/dashboard");
        } else if (response.role == "Admin") {
          router.push("/admin");
        }
      });
      // asdasda
      //asdfasdf

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
    <div className="min-h-screen flex gap-4 items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-8">
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

        <div className="mt-8 flex gap-4 items-stretch justify-center">
          <div
            className={`max-w-md h-full w-full transition-all duration-1000`}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-6 border flex flex-col justify-center h-full min-h-[400px] border-[#00BFA6] p-4 rounded-2xl shadow-xl"
            >
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
                    href="/auth/change-password"
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
          <div
            className={`max-w-md w-full transition-all duration-1000 ${
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

      {/* Video Tutorial Section */}
    </div>
  );
}
