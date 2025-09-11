"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Search,
  Package,
  User,
  MapPin,
  CreditCard,
  ShoppingCart,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Order status options
const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded",
];

// Payment status options
const paymentStatuses = ["Paid", "Pending", "Failed", "Refunded"];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("20");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const { toast } = useToast();

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`
      );
      const apiOrders = response.data;

      console.log("apiOrders", apiOrders);

      // Transform API data to match component's expected structure
      const transformedOrders = apiOrders.map((order: any) => ({
        id: order._id,
        userId: order.user?._id,
        userName: order.user?.name || "Unknown User",
        vendorId: order.vendor?._id,
        vendorName: order.vendor?.name || "Unknown Vendor",
        items: order.gifts.map((gift: any, index: number) => ({
          id: index + 1,
          productId: gift._id,
          name: gift.product?.name || `Gift Item ${index + 1}`,
          quantity: 1, // API doesn't provide quantity, assuming 1
          price: gift.price.toFixed(2),
        })),
        totalAmount: order.totalAmount.toFixed(2),
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1), // Capitalize (e.g., "delivered" → "Delivered")
        paymentStatus: order.amountDispatched ? "Paid" : "Pending", // Derive from amountDispatched
        paymentMethod: "Unknown", // Placeholder, as API doesn't provide this
        shippingAddress: {
          address: order?.address || "N/A",
          state: order.state || "N/A",
          city: order.city || "N/A",
          zipcode: order.zipcode || "N/A",
          additionalAddressInfo: order.additionalAddressInfo || "N/A",
        },
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        shippingService: order.shippingService, // Additional field for modal
        trackingID: order.trackingID || "N/A",
        trackingURL: order.trackingURL || "N/A",
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Get unique vendors for filter
  const uniqueVendors = Array.from(
    new Set(orders.map((order) => order.vendorName))
  );

  // Filter orders based on search, status, and vendor
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesVendor =
      selectedVendor === "all" || order.vendorName === selectedVendor;
    return matchesSearch && matchesStatus && matchesVendor;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / Number(itemsPerPage));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * Number(itemsPerPage),
    currentPage * Number(itemsPerPage)
  );

  // Display order details
  const handleOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Calculate order total
  const calculateTotal = (items: any[]) => {
    return items
      .reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
      .toFixed(2);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Processing":
        return "text-blue-600 bg-blue-100";
      case "Shipped":
        return "text-purple-600 bg-purple-100";
      case "Delivered":
        return "text-green-600 bg-green-100";
      case "Cancelled":
        return "text-red-600 bg-red-100";
      case "Refunded":
        return "text-gray-600 bg-gray-100";
      case "Paid":
        return "text-green-600 bg-green-100";
      case "Failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orders Management</h2>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by order ID, customer, or vendor..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {orderStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedVendor} onValueChange={setSelectedVendor}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by vendor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            {uniqueVendors.map((vendor) => (
              <SelectItem key={vendor} value={vendor}>
                {vendor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.userName}</TableCell>
                <TableCell>{order.vendorName}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOrderDetails(order)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * Number(itemsPerPage) + 1} to{" "}
          {Math.min(currentPage * Number(itemsPerPage), filteredOrders.length)}{" "}
          of {filteredOrders.length} orders
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={pageNumber === currentPage}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {totalPages > 5 && <PaginationEllipsis />}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Order details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    Order {selectedOrder.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Placed on {formatDate(selectedOrder.createdAt)}
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
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      selectedOrder.paymentStatus
                    )}`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Customer info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <User className="mr-2 h-4 w-4" />
                    Customer Information
                  </div>
                  <p className="font-medium">{selectedOrder.userName}</p>
                  <p className="text-sm text-gray-500">
                    ID: {selectedOrder.userId}
                  </p>
                </div>

                {/* Shipping info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <MapPin className="mr-2 h-4 w-4" />
                    Shipping Information
                  </div>
                  <p className="text-sm">
                    {selectedOrder.shippingAddress.address}
                    <br />
                    {selectedOrder.shippingAddress.state},{" "}
                    {selectedOrder.shippingAddress.city} <br />
                    {selectedOrder.shippingAddress.zipcode}
                    <br />
                    {selectedOrder.shippingAddress.additionalAddressInfo}
                    <br />
                    Service: {selectedOrder.shippingService}
                    <br />
                    Tracking ID: {selectedOrder.trackingID}
                    <br />
                    Tracking URL: {selectedOrder.trackingURL}
                  </p>
                </div>

                {/* Payment info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment Information
                  </div>
                  <p className="text-sm">
                    Method: {selectedOrder.paymentMethod}
                    <br />
                    Status: {selectedOrder.paymentStatus}
                    <br />
                    Total: ${selectedOrder.totalAmount}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Order items */}
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
                      {selectedOrder.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>${item.price}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-right font-medium"
                        >
                          Subtotal
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${calculateTotal(selectedOrder.items)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="font-medium mb-2">Vendor Information</h4>
                  <p className="text-sm">
                    {selectedOrder.vendorName}
                    <br />
                    ID: {selectedOrder.vendorId}
                  </p>
                </div>

                <div className="flex-1">
                  <h4 className="font-medium mb-2">Order Timeline</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Updated:</span>
                      <span>
                        {new Date(selectedOrder.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
