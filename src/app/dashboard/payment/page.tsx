"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  Search,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import type { User } from "@/lib/auth-types";
import { formatDate } from "@/app/common";
import { DateRangePicker } from "../../../../components/date-range-picker";
import { set } from "date-fns";

interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: string;
  expectedPaymentDate: string;
  products: Array<{
    _id: string;
    title: string;
    price: number;
    image?: string;
  }>;
  customer: {
    name: string;
    email: string;
  };
  order: {
    _id: string;
    status: string;
    createdAt: string;
  };
}

interface PaymentStats {
  totalReceived: number;
  totalAmount: number;
  pendingAmount: number;
  thisMonthAmount: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalReceived: 0,
    totalAmount: 0,
    pendingAmount: 0,
    thisMonthAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchPaymentsStats();
  }, []);

  useEffect(() => {
    // Filter payments based on search term and status filter
    let filtered = [...payments];

    // Filter by tab
    if (activeTab === "pending") {
      filtered = filtered.filter((p) => p.status === "pending");
    } else if (activeTab === "completed") {
      filtered = filtered.filter((p) => p.status === "completed");
    } else if (activeTab === "processing") {
      filtered = filtered.filter((p) => p.status === "processing");
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.products.some((product: any) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by status if not already filtered by tab
    if (statusFilter !== "all" && activeTab === "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter, activeTab]);

  // const fetchPayments = async () => {
  //   setLoading(true);
  //   try {
  //     const user = localStorage.getItem("user");
  //     if (!user) return;

  //     const userObj = JSON.parse(user) as User;

  //     // Fetch payments data
  //     const response = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_URL}/payments/vendor/${userObj._id}`
  //     );

  //     console.log("fetchPayments -->", response.data);
  //     // This is mock data - in a real app, you'd use the API response
  //     const mockPayments: Payment[] = [
  //       {
  //         _id: "pay_123456",
  //         orderId: "ord_123456",
  //         amount: 129.99,
  //         status: "pending",
  //         createdAt: "2024-03-15T10:30:00Z",
  //         expectedPaymentDate: "2024-03-30T10:30:00Z",
  //         products: [
  //           {
  //             _id: "prod_1",
  //             title: "Premium Gift Box",
  //             price: 129.99,
  //             image:
  //               "https://static.nike.com/a/images/w_1280,q_auto,f_auto/b4bbffd7-1fe1-4a92-970e-49e1a3a54ac4/air-jordan-6-white-and-university-red-ct8529-162-release-date.jpg",
  //           },
  //         ],
  //         customer: {
  //           name: "John Doe",
  //           email: "john@example.com",
  //         },
  //         order: {
  //           _id: "ord_123456",
  //           status: "delivered",
  //           createdAt: "2024-03-10T10:30:00Z",
  //         },
  //       },
  //       {
  //         _id: "pay_123457",
  //         orderId: "ord_123457",
  //         amount: 249.99,
  //         status: "processing",
  //         createdAt: "2024-03-12T14:20:00Z",
  //         expectedPaymentDate: "2024-03-27T14:20:00Z",
  //         products: [
  //           {
  //             _id: "prod_2",
  //             title: "Luxury Watch",
  //             price: 249.99,
  //             image:
  //               "https://static.nike.com/a/images/w_1280,q_auto,f_auto/b4bbffd7-1fe1-4a92-970e-49e1a3a54ac4/air-jordan-6-white-and-university-red-ct8529-162-release-date.jpg",
  //           },
  //         ],
  //         customer: {
  //           name: "Jane Smith",
  //           email: "jane@example.com",
  //         },
  //         order: {
  //           _id: "ord_123457",
  //           status: "delivered",
  //           createdAt: "2024-03-08T14:20:00Z",
  //         },
  //       },
  //       {
  //         _id: "pay_123458",
  //         orderId: "ord_123458",
  //         amount: 89.99,
  //         status: "completed",
  //         createdAt: "2024-03-01T09:15:00Z",
  //         expectedPaymentDate: "2024-03-16T09:15:00Z",
  //         products: [
  //           {
  //             _id: "prod_3",
  //             title: "Birthday Special Pack",
  //             price: 89.99,
  //             image:
  //               "https://static.nike.com/a/images/w_1280,q_auto,f_auto/b4bbffd7-1fe1-4a92-970e-49e1a3a54ac4/air-jordan-6-white-and-university-red-ct8529-162-release-date.jpg",
  //           },
  //         ],
  //         customer: {
  //           name: "Robert Johnson",
  //           email: "robert@example.com",
  //         },
  //         order: {
  //           _id: "ord_123458",
  //           status: "delivered",
  //           createdAt: "2024-02-25T09:15:00Z",
  //         },
  //       },
  //     ];

  //     setPayments(mockPayments);
  //   } catch (error) {
  //     console.error("Error fetching payments:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchPaymentsStats = async () => {
    setLoading(true);
    try {
      const user = localStorage.getItem("user");
      if (!user) return;
      const userObj = JSON.parse(user) as User;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/paymentsStats/${userObj._id}`
      );

      console.log("fetchPaymentsStats", response.data);

      setStats({
        totalReceived: response.data.totalReceivedPaymentOrders || 0.0,
        totalAmount: response.data.totalEarnings || 0.0,
        pendingAmount: response.data.pendingPaymentOrdersAmount || 0.0,
        thisMonthAmount: response.data.thisMonthAmount || 0.0,
      });

      setPayments([
        ...(response.data.pendingPaymentOrders || []),
        ...(response.data.receivedPaymentOrders || []),
      ]);
    } catch (error) {
      console.error("Error fetching payments stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-2 bg-[#00BFA6]/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-[#00BFA6]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Amount</p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.pendingAmount)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Payments Received</p>
              <p className="text-2xl font-bold">{stats.totalReceived}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.thisMonthAmount)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search by order ID, customer, or product..."
            className="pl-8 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DateRangePicker />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Tabs and Payments Table */}
      <Tabs
        defaultValue="pending"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFA6]"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-10">
              <CreditCard className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No payments found</h3>
              <p className="text-gray-500">
                There are no payments matching your criteria.
              </p>
            </div>
          ) : (
            <div className="rounded-md border bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell className="font-medium">
                        {payment._id}
                      </TableCell>
                      <TableCell>{payment.user.name}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>{formatDate(payment.createdAt)}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(payment.status)}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#00BFA6] border-[#00BFA6] hover:bg-[#00BFA6] hover:text-white"
                          onClick={() => {
                            setSelectedPayment(payment);
                            setIsDetailsOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Payment Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Complete information about this payment
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Payment ID
                  </h3>
                  <p className="mt-1">{selectedPayment._id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Order ID
                  </h3>
                  <p className="mt-1">{selectedPayment.orderId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Customer
                  </h3>
                  <p className="mt-1">{selectedPayment.customer.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{selectedPayment.customer.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <div className="mt-1 flex items-center gap-1">
                    {getStatusIcon(selectedPayment.status)}
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedPayment.status
                      )}`}
                    >
                      {selectedPayment.status}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Amount
                  </h3>
                  <p className="mt-1 font-bold">
                    {formatCurrency(selectedPayment.amount)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Created Date
                  </h3>
                  <p className="mt-1">
                    {formatDate(selectedPayment.createdAt)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Expected Payment Date
                  </h3>
                  <p className="mt-1">
                    {formatDate(selectedPayment.expectedPaymentDate)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Products
                </h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPayment.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {product.image && (
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.title}
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium">{product.title}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Order Information
                </h3>
                <div className="border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Order ID
                      </h4>
                      <p>{selectedPayment.order._id}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Order Date
                      </h4>
                      <p>{formatDate(selectedPayment.order.createdAt)}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500">
                        Order Status
                      </h4>
                      <p>{selectedPayment.order.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            {selectedPayment && selectedPayment.status === "pending" && (
              <Button className="bg-[#00BFA6]">Request Payment</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
