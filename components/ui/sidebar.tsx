"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  Star,
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Products", href: "/dashboard/products", icon: Package },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { title: "Reviews", href: "/dashboard/reviews", icon: Star },
  { title: "Payment", href: "/dashboard/payment", icon: CreditCard },
];

const iconStyle: Record<string, string> = {
  Dashboard: "bg-teal-50 text-teal-600",
  Products: "bg-violet-50 text-violet-600",
  Orders: "bg-blue-50 text-blue-600",
  Reviews: "bg-amber-50 text-amber-600",
  Payment: "bg-rose-50 text-rose-500",
};

interface SidebarContentProps {
  onNavigate?: () => void;
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Brand */}
      <div className="px-5 py-4 sm:py-5 border-b border-stone-100">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onNavigate}>
          <img
            src="/logo.png"
            alt="Logo"
            className="h-12 w-12 sm:h-[60px] sm:w-[60px] object-contain flex-shrink-0"
          />
          <span className="text-[15px] sm:text-[16px] font-bold text-stone-800">
            Before the Dates
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
          Menu
        </p>
        {sidebarItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const ic = iconStyle[item.title] ?? "bg-stone-100 text-stone-500";
          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-gradient-to-r from-teal-500/12 to-teal-400/5 text-teal-700 shadow-[inset_0_0_0_1px_rgba(20,184,166,0.2)]"
                  : "text-stone-500 hover:bg-stone-100/80 hover:text-stone-800",
              )}
            >
              <span
                className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                  isActive ? "bg-teal-100 text-teal-600" : ic,
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
              </span>
              <span>{item.title}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer badge */}
      <div className="mx-3 px-4 py-3 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-100/80">
        <p className="text-[11px] font-semibold text-teal-700">Vendor Portal</p>
        <p className="text-[10px] text-teal-500 mt-0.5">Manage your store</p>
      </div>
    </>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex flex-col pb-6 w-[260px] bg-white border-r border-stone-200/70 shadow-[2px_0_16px_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      <SidebarContent />
    </div>
  );
}
