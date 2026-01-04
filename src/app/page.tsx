"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useFacebookPixel } from "@/hooks/use-facebook-pixel";
import { useEffect } from "react";

export default function HomePage() {
  const { trackMainPageView, trackCTA } = useFacebookPixel();

  // Track main page view
  useEffect(() => {
    trackMainPageView("direct");
  }, []);

  const handleCTAClick = (ctaType: string) => {
    trackCTA(ctaType, "main_page");
  };
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <span className="font-bold text-xl">Before the Dates</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="https://beforethedates.com/about-us/"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="mailto:info@beforethedates.com"
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 flex flex-col justify-center items-center">
                <Image
                  src="/logo.png"
                  alt="BTD Logo"
                  width={100}
                  height={100}
                />
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Before the Dates
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Manage your inventory, payments, and orders all in one place.
                </p>
              </div>
              <div className="space-x-4">
                {/* <Link href="/signup">
                  <Button>Get Started</Button>
                </Link> */}
                <Link href="/auth/signin">
                  <Button onClick={() => handleCTAClick("login")}>
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button onClick={() => handleCTAClick("register")}>
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Before the Dates. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="https://beforethedates.com/TermsConditions"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="https://beforethedates.com/privacy"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
