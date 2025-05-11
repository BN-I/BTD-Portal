"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, CreditCard, DollarSign, CheckCircle } from "lucide-react";
import { Order } from "@/app/types";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { formatDate, formatTime } from "@/app/common";

export default function PaymentsPage() {
  const [dateRange, setDateRange] = useState("");
  const [selectedPayments, setSelectedPayments] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`
      );
      const apiOrders = response.data;

      console.log("apiOrders", apiOrders);

      setOrders(apiOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalPayments = useMemo(() => {
    return orders.reduce((acc, order) => acc + order.totalAmount, 0);
  }, [orders]);

  const pendingPayments = useMemo(() => {
    return orders.reduce((acc, order) => {
      if (order.amountDispatched) return acc;

      return acc + order.totalAmount;
    }, 0);
  }, [orders]);

  const dispatchedPayments = useMemo(() => {
    return orders.reduce((acc, order) => {
      if (!order?.amountDispatched) return acc;

      return acc + order.totalAmount;
    }, 0);
  }, [orders]);

  const processedPayments = useMemo(() => {
    return orders.filter((order) => {
      return order.amountDispatched;
    }).length;
  }, [orders]);

  const stats = useMemo(
    () => [
      {
        title: "Total Payments",
        value: `$${totalPayments.toLocaleString()}`,
        icon: DollarSign,
      },
      {
        title: "Pending Payments",
        value: `$${pendingPayments.toLocaleString()}`,
        icon: CreditCard,
      },
      {
        title: "Dispatched Amount",
        value: `$${dispatchedPayments.toLocaleString()}`,
        icon: Calendar,
      },
      {
        title: "Processed Payment",
        value: `${processedPayments}`,
        icon: CheckCircle,
      },
    ],
    []
  );

  const filteredPayments = orders.filter((order) => {
    const matchesStatus =
      selectedPayments === "all" ||
      (order.amountDispatched && selectedPayments == "dispatched") ||
      (!order.amountDispatched && selectedPayments == "pending");

    return matchesStatus;
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Management</h2>
        <div className="flex gap-4">
          <Select value={selectedPayments} onValueChange={setSelectedPayments}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Product Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-2 bg-[#00BFA6]/10 rounded-lg">
                <stat.icon className="h-6 w-6 text-[#00BFA6]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total Paid</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  {formatDate(order.createdAt)} {formatTime(order.createdAt)}
                </TableCell>
                <TableCell>{order.vendor?.name || "Unknown Vendor"}</TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>${order.amount}</TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
