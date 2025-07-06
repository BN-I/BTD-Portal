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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Calendar,
  CreditCard,
  DollarSign,
  CheckCircle,
  Package,
  User,
} from "lucide-react";
import { Order } from "@/app/types";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { formatDate, formatTime } from "@/app/common";
import { Separator } from "@/components/ui/separator";

export default function PaymentsPage() {
  const [dateRange, setDateRange] = useState("");
  const [selectedPayments, setSelectedPayments] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [shouldUpdate, setShouldUpdate] = useState(false);

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
    [totalPayments, pendingPayments, dispatchedPayments, processedPayments]
  );

  const filteredPayments = orders.filter((order) => {
    const matchesStatus =
      selectedPayments === "all" ||
      (order.amountDispatched && selectedPayments === "dispatched") ||
      (!order.amountDispatched && selectedPayments === "pending");
    return matchesStatus;
  });

  useEffect(() => {
    fetchOrders();
  }, [shouldUpdate]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleOpenConfirmDialog = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleDispatchPayment = async (order: Order) => {
    try {
      // Placeholder for dispatch payment logic
      console.log("Dispatch payment for order:", order._id);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/dispatch-amount`,
        { orderID: order._id }
      );
      toast({
        title: "Dispatch Initiated",
        description: `Payment dispatch for order ${order._id} has been initiated.`,
      });
      setShouldUpdate(!shouldUpdate);
      setIsConfirmDialogOpen(false);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error dispatching payment:", error);
      toast({
        title: "Error",
        description: "Failed to dispatch payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Management</h2>
        <div className="flex gap-4">
          <Select value={selectedPayments} onValueChange={setSelectedPayments}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Payment Status" />
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
              <TableHead>Amount dispatched</TableHead>
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
                <TableCell>
                  {order.amountDispatched ? "$" + order.totalAmount : "-"}
                </TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>${order.amount}</TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Payment Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    Order {selectedOrder._id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Created on {formatDate(selectedOrder.createdAt)}{" "}
                    {formatTime(selectedOrder.createdAt)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <User className="mr-2 h-4 w-4" />
                    Vendor Information
                  </div>
                  <p className="font-medium">
                    {selectedOrder.vendor?.name || "Unknown Vendor"}
                  </p>
                  <p className="text-sm text-gray-500">
                    ID: {selectedOrder.vendor?._id || "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Information
                  </div>
                  <p className="text-sm">
                    Method: Credit Card
                    <br />
                    Status:{" "}
                    {selectedOrder.amountDispatched ? "Dispatched" : "Pending"}
                    <br />
                    Total: ${selectedOrder.totalAmount}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Transaction Details
                  </div>
                  <p className="text-sm">
                    Amount: ${selectedOrder.amount}
                    <br />
                    Total Paid: ${selectedOrder.totalAmount}
                    <br />
                    Type: Product
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Package className="h-4 w-4 mr-2 text-gray-500" />
                  Order Items
                </h4>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.gifts?.map((gift: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            {gift.product?.title || `Gift Item ${index + 1}`}
                          </TableCell>
                          <TableCell>
                            $
                            {gift.discountedPrice?.toFixed(2) ||
                              gift.price.toFixed(2)}
                          </TableCell>
                          <TableCell>1</TableCell>
                          <TableCell className="text-right">
                            ${gift.price.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-right font-medium"
                        >
                          Total
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${selectedOrder.totalAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Order Timeline</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span>{formatDate(selectedOrder.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center w-full justify-between">
            <Button
              onClick={handleOpenConfirmDialog}
              disabled={
                selectedOrder &&
                !selectedOrder.amountDispatched &&
                selectedOrder.status === "delivered"
                  ? false
                  : true
              }
            >
              {selectedOrder?.amountDispatched
                ? "Already Dispatched"
                : "Dispatch Payment"}
            </Button>

            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment Dispatch</DialogTitle>
            <DialogDescription>
              Are you sure you want to dispatch the payment for order{" "}
              {selectedOrder?._id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedOrder && handleDispatchPayment(selectedOrder)
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
