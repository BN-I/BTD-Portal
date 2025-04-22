"use client";

import { Sidebar } from "../../../components/ui/sidebar";
import { Header } from "../../../components/ui/header";
import { useEffect, useState } from "react";
import { User } from "@/lib/auth-types";
import { hasStoreData } from "@/lib/auth";

// sdasda

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user) as User;
      setShowSidebar(hasStoreData(userData));
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {showSidebar && <Sidebar />}
      <div className="flex-1">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
