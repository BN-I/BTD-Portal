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
import Image from "next/image";
import { deleteAllCookies } from "@/app/common";
import axios from "axios";
import { User } from "@/lib/auth-types";
import { useEffect, useState } from "react";
import { Notification } from "@/app/types";

export function AdminHeader() {
  const [unreadNotifications, setUnreadNotifications] = useState(false);
  const perPage = 10000;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNotifications();
  }, []);
  const fetchNotifications = async () => {
    console.log("fetching notifications");
    const user = localStorage.getItem("user");
    if (!user) return;

    console.log(user, "user");
    const userObj = JSON.parse(user) as User;
    // Add filter parameter if not showing all notifications
    let url = `${process.env.NEXT_PUBLIC_API_URL}/notifications/user/${userObj._id}?page=${currentPage}&perPage=${perPage}&isRead=true`;

    const response = await axios.get(url);

    console.log(response.data, "response");

    const unreadNotifications = response.data.filter(
      (notification: Notification) => !notification.isRead
    );

    setUnreadNotifications(unreadNotifications.length > 0);
  };

  console.log(unreadNotifications, "unread");

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-white px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Quick search for products, orders"
            className="pl-8 bg-gray-50 border-none"
          />
        </div>

        <Link href="/admin/notifications">
          <Button variant="outline" size="icon" className="relative">
            {" "}
            <Bell className="h-4 w-4" />
            {unreadNotifications && (
              <span className="absolute top-[-3px] right-[-1px] h-2 w-2 bg-red-600 rounded-full" />
            )}
            <span className="sr-only">Toggle notifications</span>{" "}
          </Button>{" "}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Admin avatar" />
                <AvatarFallback className="">
                  <Image
                    width={40}
                    height={40}
                    src="/logo.png"
                    alt="Admin avatar"
                  />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user");
                deleteAllCookies();

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
