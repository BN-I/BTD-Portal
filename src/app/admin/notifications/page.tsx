"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Package,
  CreditCard,
} from "lucide-react";
import axios from "axios";
import type { User } from "@/lib/auth-types";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  user: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const perPage = 10;

  useEffect(() => {
    fetchNotifications();
  }, [currentPage, activeTab]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const user = localStorage.getItem("user");
      if (!user) return;

      const userObj = JSON.parse(user) as User;

      // Add filter parameter if not showing all notifications
      let url = `${process.env.NEXT_PUBLIC_API_URL}/notifications/user/${userObj._id}?page=${currentPage}&perPage=${perPage}`;
      if (activeTab !== "all") {
        url += `&filter=${activeTab}`;
      }

      const response = await axios.get(url);

      setNotifications(response.data.notifications || response.data);

      // If the API returns pagination info
      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      } else {
        // Estimate total pages if not provided
        const total = response.data.length;
        setTotalPages(Math.ceil(total / perPage));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return;

      const userObj = JSON.parse(user) as User;

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`,
        {
          userId: userObj._id,
        }
      );

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return;

      const userObj = JSON.parse(user) as User;

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/mark-all-read`,
        {
          userId: userObj._id,
        }
      );

      // Update local state
      setNotifications(
        notifications.map((notification) => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "order":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "event":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case "payment":
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <Button
          variant="outline"
          onClick={markAllAsRead}
          disabled={notifications.every((n) => n.isRead)}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="order">Orders</TabsTrigger>
          <TabsTrigger value="event">Events</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFA6]"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-10">
              <Bell className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No notifications</h3>
              <p className="text-gray-500">
                You don't have any notifications at the moment.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification._id}
                className={`transition-colors ${
                  notification.isRead ? "bg-white" : "bg-blue-50"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => markAsRead(notification._id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              <span className="text-xs">Mark read</span>
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
