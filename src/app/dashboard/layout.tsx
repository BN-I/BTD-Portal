"use client";

import { Sidebar } from "../../../components/ui/sidebar";
import { Header } from "../../../components/ui/header";
import { useEffect, useState } from "react";
import { User } from "@/lib/auth-types";
import { hasStoreData } from "@/lib/auth";
import { get } from "http";
import { getCookie } from "../common";

// sdasda

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");

      const storeData = getCookie("storeData");
      const businessInformation = getCookie("businessInformation");
      const paymentInformation = getCookie("paymentInformation");
      const subscription = getCookie("subscription");
      console.log("user", user);
      console.log("storeData", storeData);
      console.log("businessInformation", businessInformation);
      console.log("paymentInformation", paymentInformation);
      console.log("subscription", subscription ? "true" : "false");
      if (
        user &&
        (!storeData ||
          !businessInformation ||
          !paymentInformation ||
          !subscription)
      ) {
        const userData = JSON.parse(user) as User;
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    } catch (error) {
      console.log(error);
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
