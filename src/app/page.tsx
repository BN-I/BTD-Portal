"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFacebookPixel } from "@/hooks/use-facebook-pixel";
import { Package, ShoppingCart, BarChart3, ArrowRight, Shield, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

export default function HomePage() {
  const { trackMainPageView, trackCTA } = useFacebookPixel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    trackMainPageView("direct");
  }, []);

  const features = [
    {
      icon: Package,
      title: "Product Management",
      description:
        "Add, edit, and control visibility of your listings. Upload photos, set pricing, and manage inventory from one place.",
      color: "bg-violet-50 text-violet-600",
      border: "border-violet-100",
    },
    {
      icon: ShoppingCart,
      title: "Order Tracking",
      description:
        "View every incoming order, update statuses in real time, and add tracking details when you ship.",
      color: "bg-brand-50 text-brand-600",
      border: "border-brand-100",
    },
    {
      icon: BarChart3,
      title: "Revenue Insights",
      description:
        "See your total revenue, average order value, and monthly sales trends at a glance.",
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
  ];

  const pills = ["Easy setup", "Real-time updates", "Secure payouts"];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={36}
              height={36}
              className="object-contain shrink-0 w-8 h-8 sm:w-9 sm:h-9"
            />
            <span className="font-bold text-sm text-stone-800 truncate">
              Before the Dates
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              href="https://beforethedates.com/about-us/"
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              About
            </Link>
            <Link
              href="mailto:info@beforethedates.com"
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/auth/signin"
              onClick={() => trackCTA("login", "main_page")}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              onClick={() => trackCTA("register", "main_page")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/20 transition-all"
            >
              Get started
            </Link>
          </nav>

          <button
            type="button"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors shrink-0"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="right" className="w-[min(100vw-2rem,20rem)] pt-12">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <nav className="flex flex-col gap-1">
              <Link
                href="https://beforethedates.com/about-us/"
                onClick={closeMobileMenu}
                className="px-3 py-3 rounded-xl text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-800 transition-colors"
              >
                About
              </Link>
              <Link
                href="mailto:info@beforethedates.com"
                onClick={closeMobileMenu}
                className="px-3 py-3 rounded-xl text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-800 transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/auth/signin"
                onClick={() => {
                  trackCTA("login", "main_page");
                  closeMobileMenu();
                }}
                className="px-3 py-3 rounded-xl text-sm font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                onClick={() => {
                  trackCTA("register", "main_page");
                  closeMobileMenu();
                }}
                className="mt-2 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold shadow-md shadow-brand-500/20 transition-all"
              >
                Get started
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section className="pt-12 sm:pt-20 lg:pt-24 pb-12 sm:pb-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">

            {/* Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-xs font-semibold text-brand-600"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                  {pill}
                </span>
              ))}
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.15] sm:leading-[1.1]">
              Your store.{" "}
              <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 bg-clip-text text-transparent">
                Fully in control.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-500 max-w-xl mx-auto leading-relaxed px-1">
              The vendor portal for Before the Dates — manage your products, track every order, and watch your revenue grow.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 w-full max-w-xs sm:max-w-none mx-auto">
              <Link
                href="/auth/register"
                onClick={() => trackCTA("register", "main_page")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-px w-full sm:w-auto"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/signin"
                onClick={() => trackCTA("login", "main_page")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/80 hover:bg-white border border-stone-200 text-stone-700 font-semibold shadow-sm transition-all hover:-translate-y-px w-full sm:w-auto"
              >
                Log in
              </Link>
            </div>
          </div>

          {/* Decorative dashboard preview strip */}
          <div className="max-w-4xl mx-auto mt-10 sm:mt-16">
            <div className="relative rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-sm border border-stone-200/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden p-4 sm:p-6">
              {/* Fake stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                {[
                  { label: "Total Revenue", value: "$12,480" },
                  { label: "Avg Order", value: "$94.20" },
                  { label: "Balance", value: "$3,210" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="rounded-xl sm:rounded-2xl bg-white border border-stone-200/80 p-3 sm:p-4 shadow-sm"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{card.label}</p>
                    <p className="text-base sm:text-lg font-bold mt-1 text-stone-800">{card.value}</p>
                  </div>
                ))}
              </div>
              {/* Fake bar chart rows */}
              <div className="space-y-2">
                {[75, 45, 90, 60, 80].map((w, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 sm:w-8 text-[10px] text-stone-300 shrink-0">
                      {["Jan", "Feb", "Mar", "Apr", "May"][i]}
                    </div>
                    <div className="flex-1 min-w-0 h-3 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-500"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                    <div className="hidden sm:block w-12 text-right text-[10px] text-stone-400 shrink-0">
                      ${(w * 160).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              {/* Overlay gradient at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-3">
                Everything you need
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 px-2">
                Built for vendors, not developers
              </h2>
              <p className="text-sm sm:text-base text-stone-500 mt-3 max-w-md mx-auto px-2">
                A clean, fast portal that keeps you focused on your business — not on the software.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={`rounded-2xl bg-white/80 backdrop-blur-sm border ${f.border} p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow sm:last:col-span-2 md:last:col-span-1`}
                >
                  <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-stone-800 mb-2">{f.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="py-10 sm:py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 sm:p-10 shadow-[0_20px_60px_rgba(255,58,68,0.25)]">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-brand-200 shrink-0" />
                <span className="text-xs font-semibold text-brand-200 uppercase tracking-wider">Secure & reliable</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Ready to start selling?
              </h2>
              <p className="text-sm sm:text-base text-brand-100 mb-6 sm:mb-7 px-1">
                Join vendors already growing their business on Before the Dates.
              </p>
              <Link
                href="/auth/register"
                onClick={() => trackCTA("register_cta_band", "main_page")}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-white text-brand-700 font-semibold hover:bg-brand-50 shadow-lg transition-all hover:-translate-y-px w-full sm:w-auto"
              >
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 max-w-full">
            <Image
              src="/logo.png"
              alt="Logo"
              width={36}
              height={36}
              className="object-contain w-8 h-8 sm:w-9 sm:h-9 shrink-0"
            />
            <p className="text-xs text-stone-400">
              © {new Date().getFullYear()} Before the Dates. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <Link
              href="https://beforethedates.com/TermsConditions"
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="https://beforethedates.com/privacy"
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="mailto:info@beforethedates.com"
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>

    </div>
  );
}
