"use client";

import { Bell, LogOut, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "@/lib/auth-types";
import axios from "axios";
import { Notification } from "@/app/types";
import { deleteAllCookies } from "@/app/common";

export function Header() {
  const [unreadNotifications, setUnreadNotifications] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const obj = JSON.parse(user) as User;
      setUserName(obj.name ?? "");
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const user = localStorage.getItem("user");
    if (!user) return;
    const userObj = JSON.parse(user) as User;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/user/${userObj._id}?page=1&perPage=10000&isRead=true`,
      );
      setUnreadNotifications(
        response.data.some((n: Notification) => !n.isRead),
      );
    } catch { /* silent */ }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    deleteAllCookies();
    window.location.href = "/auth/signin";
  };

  const initials = userName
    ? userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "V";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-stone-200/60 bg-white/80 backdrop-blur-md px-6 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      {/* Left: greeting */}
      <div className="flex-1">
        <p className="text-sm font-medium text-stone-700">
          {userName ? (
            <>Good day, <span className="text-teal-600 font-semibold">{userName}</span> 👋</>
          ) : (
            <span className="text-stone-400 text-xs">Vendor Dashboard</span>
          )}
        </p>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Link
          href="/dashboard/notifications"
          className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 transition-all duration-150 shadow-sm"
        >
          <Bell className="h-4 w-4 text-stone-500" />
          {unreadNotifications && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </Link>

        {/* Profile */}
        <Button variant="outline" size="sm" asChild
          className="rounded-xl border-stone-200 shadow-sm"
        >
          <Link href="/dashboard/account" className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">{initials}</span>
            </div>
            <span className="text-stone-600">Profile</span>
          </Link>
        </Button>

        {/* Logout */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-200 shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out? You will need to sign in again
                to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-rose-500 hover:bg-rose-600"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
