"use client";

import { Bell, Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { User } from "@/lib/auth-types";
import axios from "axios";
import { Notification } from "@/app/types";

export function Header() {
  const perPage = 10000;
  const [currentPage, setCurrentPage] = useState(1);
  const [unreadNotifications, setUnreadNotifications] = useState(false);
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const user = localStorage.getItem("user");
    if (!user) return;

    const userObj = JSON.parse(user) as User;
    // Add filter parameter if not showing all notifications
    let url = `${process.env.NEXT_PUBLIC_API_URL}/notifications/user/${userObj._id}?page=${currentPage}&perPage=${perPage}&isRead=true`;

    const response = await axios.get(url);

    const unreadNotifications = response.data.filter(
      (notification: Notification) => !notification.isRead
    );

    setUnreadNotifications(unreadNotifications.length > 0);
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-white px-6">
      <div className="flex flex-1 items-center gap-4">
        {/* <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Quick search for products, orders"
            className="pl-8 bg-gray-50 border-none"
          />
        </div> */}
        {/* <Button variant="outline" size="icon" className="relative">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button> */}
        <Button variant="outline" size="icon" className="relative">
          <Link href="/dashboard/notifications" className="relative">
            {/* Icon container with dot */}
            <span className="relative inline-block">
              <Bell className="h-4 w-4" />
              {unreadNotifications && (
                <span className="absolute top-[-3px] right-[-1px] h-2 w-2 bg-red-600 rounded-full" />
              )}
            </span>
            <span className="sr-only">Toggle notifications</span>
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                <AvatarFallback className="text-[10px]">BTD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard/account">
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
            </Link>
            {/* <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/auth/signin";
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
