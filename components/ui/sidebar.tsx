"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart2,
  Star,
  CreditCard,
  Settings,
  Plus,
  List,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
    children: [
      // {
      //   title: "Add New Product",
      //   href: "/dashboard/products/new",
      //   icon: Plus,
      // },
      {
        title: "View All Products",
        href: "/dashboard/products",
        icon: List,
      },
    ],
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    // children: [
    //   {
    //     title: "New Orders",
    //     href: "/dashboard/orders/new",
    //     icon: Plus,
    //   },
    //   {
    //     title: "Completed Orders",
    //     href: "/dashboard/orders/completed",
    //     icon: List,
    //   },
    // ],
  },
  // {
  //   title: "Sales & Reports",
  //   href: "/dashboard/sales",
  //   icon: BarChart2,
  // },
  // {
  //   title: "Reviews & Ratings",
  //   href: "/dashboard/reviews",
  //   icon: Star,
  // },
  {
    title: "Payment",
    href: "/dashboard/payment",
    icon: CreditCard,
  },
  // {
  //   title: "Settings",
  //   href: "/dashboard/settings",
  //   icon: Settings,
  // },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title]
    );
  };

  return (
    <div className={cn("pb-12 w-[250px] bg-white border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link href="/dashboard" className="flex items-center px-4 mb-6">
            <img src="/logo.png" alt="Logo" className="h-12 w-12" />
            <span className="ml-2 text-xl font-bold">Before the Dates</span>
          </Link>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <div key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                    pathname === item.href
                      ? "bg-[#00BFA6]/10 text-[#00BFA6]"
                      : ""
                  )}
                  onClick={() => item.children && toggleExpand(item.title)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
                {item.children && expandedItems.includes(item.title) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 text-sm",
                          pathname === child.href
                            ? "bg-[#00BFA6]/10 text-[#00BFA6]"
                            : ""
                        )}
                      >
                        <child.icon className="h-4 w-4" />
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
