"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useFacebookPixel } from "@/hooks/use-facebook-pixel";
import { Package, ShoppingCart, BarChart3, ArrowRight, Shield } from "lucide-react";

export default function HomePage() {
  const { trackMainPageView, trackCTA } = useFacebookPixel();

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
      color: "bg-teal-50 text-teal-600",
      border: "border-teal-100",
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

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-sm">
              <Image src="/logo.png" alt="Logo" width={18} height={18} className="object-contain" />
            </div>
            <span className="font-bold text-sm text-stone-800">
              Before the{" "}
              <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                Dates
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-6">
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
              className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              onClick={() => trackCTA("register", "main_page")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-sm font-semibold shadow-md shadow-teal-500/20 transition-all"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section className="pt-24 pb-20 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">

            {/* Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-xs font-semibold text-teal-600"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                  {pill}
                </span>
              ))}
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1]">
              Your store.{" "}
              <span className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 bg-clip-text text-transparent">
                Fully in control.
              </span>
            </h1>

            <p className="text-lg text-stone-500 max-w-xl mx-auto leading-relaxed">
              The vendor portal for Before the Dates — manage your products, track every order, and watch your revenue grow.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/auth/register"
                onClick={() => trackCTA("register", "main_page")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-teal-500/25 transition-all hover:-translate-y-px"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/signin"
                onClick={() => trackCTA("login", "main_page")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/80 hover:bg-white border border-stone-200 text-stone-700 font-semibold shadow-sm transition-all hover:-translate-y-px"
              >
                Log in
              </Link>
            </div>
          </div>

          {/* Decorative dashboard preview strip */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="relative rounded-3xl bg-white/80 backdrop-blur-sm border border-stone-200/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden p-6">
              {/* Fake stat cards */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Total Revenue", value: "$12,480", color: "from-teal-500 to-teal-600" },
                  { label: "Avg Order", value: "$94.20", color: "from-violet-500 to-violet-600" },
                  { label: "Balance", value: "$3,210", color: "from-amber-400 to-orange-500" },
                ].map((card) => (
                  <div
                    key={card.label}
                    className={`rounded-2xl bg-gradient-to-br ${card.color} p-4 text-white`}
                  >
                    <p className="text-xs text-white/75 font-medium">{card.label}</p>
                    <p className="text-xl font-bold mt-1">{card.value}</p>
                  </div>
                ))}
              </div>
              {/* Fake bar chart rows */}
              <div className="space-y-2">
                {[75, 45, 90, 60, 80].map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 text-[10px] text-stone-300 shrink-0">
                      {["Jan", "Feb", "Mar", "Apr", "May"][i]}
                    </div>
                    <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-500"
                        style={{ width: `${w}%` }}
                      />
                    </div>
                    <div className="w-12 text-right text-[10px] text-stone-400 shrink-0">
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
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-500 mb-3">
                Everything you need
              </p>
              <h2 className="text-3xl font-bold text-stone-900">
                Built for vendors, not developers
              </h2>
              <p className="text-stone-500 mt-3 max-w-md mx-auto">
                A clean, fast portal that keeps you focused on your business — not on the software.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={`rounded-2xl bg-white/80 backdrop-blur-sm border ${f.border} p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow`}
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
        <section className="py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="rounded-3xl bg-gradient-to-br from-teal-500 to-teal-700 p-10 shadow-[0_20px_60px_rgba(20,184,166,0.25)]">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-teal-200" />
                <span className="text-xs font-semibold text-teal-200 uppercase tracking-wider">Secure & reliable</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Ready to start selling?
              </h2>
              <p className="text-teal-100 mb-7">
                Join vendors already growing their business on Before the Dates.
              </p>
              <Link
                href="/auth/register"
                onClick={() => trackCTA("register_cta_band", "main_page")}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-teal-700 font-semibold hover:bg-teal-50 shadow-lg transition-all hover:-translate-y-px"
              >
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={14} height={14} className="object-contain" />
            </div>
            <p className="text-xs text-stone-400">
              © {new Date().getFullYear()} Before the Dates. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-5">
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
