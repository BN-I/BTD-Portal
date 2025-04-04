"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShoppingBag,
  CreditCard,
  Settings,
  BarChart2,
  Bell,
  Truck,
  Store,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Event Management",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Vendor Management",
    href: "/admin/vendors",
    icon: Store,
  },
  {
    title: "Payment Management",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Gift Management",
    href: "/admin/gifts",
    icon: ShoppingBag,
  },
  {
    title: "Tracking Management",
    href: "/admin/tracking",
    icon: Truck,
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Reports & Analytics",
    href: "/admin/reports",
    icon: BarChart2,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-[80px]" : "w-[250px]"
      )}
    >
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-12 w-12" />
          {!isCollapsed && <span className="font-bold text-xl">Admin</span>}
        </Link>
      </div>
      <nav className="space-y-1 px-3">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
              pathname === item.href ? "bg-[#00BFA6]/10 text-[#00BFA6]" : ""
            )}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
