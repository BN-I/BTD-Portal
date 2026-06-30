"use client";

import { Sidebar, SidebarContent } from "../../../components/ui/sidebar";
import { Header } from "../../../components/ui/header";
import { useEffect, useState } from "react";
import { User } from "@/lib/auth-types";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");

      const storeData = localStorage.getItem("storeData");
      const businessInformation = localStorage.getItem("businessInformation");
      const paymentInformation = localStorage.getItem("paymentInformation");
      const subscription = localStorage.getItem("subscription");

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
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-transparent overflow-x-hidden">
      {showSidebar && (
        <>
          <Sidebar className="hidden lg:flex shrink-0" />
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent side="left" className="p-0 w-[min(100vw-2rem,280px)] flex flex-col h-full">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="flex flex-col h-full pb-6 overflow-y-auto">
                <SidebarContent onNavigate={closeMobileSidebar} />
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          onMenuClick={showSidebar ? () => setMobileSidebarOpen(true) : undefined}
        />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
