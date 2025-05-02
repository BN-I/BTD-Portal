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
import { Search, Store, Clock, Ban, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IBusinessInformation,
  IPaymentInformation,
  IStoreInformation,
  User as IUser,
  UserStatus,
} from "@/lib/auth-types";
import { formatDate, formatTime } from "@/app/common";
import axios from "axios";
import { Order, Product } from "@/app/types";

// Interface for the vendor form
interface VendorFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  category: string;
  description: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<IUser | null>(null);
  const [vendors, setVendors] = useState<IUser[]>([]);
  const [vendorProducts, setVendorProducts] = useState<
    Record<string, Product[]>
  >({});
  const [vendorStores, setVendorStores] = useState<
    Record<string, IStoreInformation>
  >({});
  const [vendorBusiness, setVendorBusiness] = useState<
    Record<string, IBusinessInformation>
  >({});
  const [vendorPayment, setVendorPayment] = useState<
    Record<string, IPaymentInformation>
  >({});

  const [vendorOrders, setVendorOrders] = useState<Record<string, Order[]>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<VendorFormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    category: "",
    description: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  const [formError, setFormError] = useState("");

  const stats = useMemo(() => {
    return [
      {
        title: "Total Vendors",
        value: vendors.length,
        icon: Store,
        status: "Active",
      },
      {
        title: "Pending Approval",
        value: vendors.filter((vendor) => vendor.status === UserStatus.pending)
          .length,
        icon: Clock,
        status: "Pending",
      },
      {
        title: "Blocked Vendors",
        value: vendors.filter((vendor) => vendor.status === UserStatus.blocked)
          .length,
        icon: Ban,
        status: "Blocked",
      },
      {
        title: "Total Products",
        value: Object.values(vendorProducts).reduce(
          (sum, products) => sum + products.length,
          0
        ),
        icon: ShoppingBag,
        status: "Listed",
      },
    ];
  }, [vendors, vendorProducts]);

  const handleOpenVendorDetails = (vendor: IUser) => {
    setSelectedVendor(vendor);
    setDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email.includes("@")) {
      setFormError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters long");
      return;
    }

    // Reset error
    setFormError("");

    // Submit logic would go here
    // For demonstration, we'll just show a success toast
    toast({
      title: "Vendor Added",
      description: `${formData.name} has been added successfully`,
    });

    // Close dialog and reset form
    setAddDialogOpen(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      category: "",
      description: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
    });
  };

  const fetchVendors = async (): Promise<IUser[]> => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/vendors`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const fetchVendorProducts = async (vendorId: string): Promise<Product[]> => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/product/vendor/${vendorId}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const fetchVendorStore = async (
    vendorId: string
  ): Promise<IStoreInformation> => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/store/storeInformation/${vendorId}`
        )
        .then((res) => {
          resolve(res.data.storeInformation);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const fetchVendorOrders = async (vendorId: string): Promise<any[]> => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/vendor/${vendorId}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const fetchVendorBusiness = async (
    vendorId: string
  ): Promise<IBusinessInformation> => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/store/businessInformation/${vendorId}`
        )
        .then((res) => {
          resolve(res.data.businessInformation);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const fetchVendorPayment = async (
    vendorId: string
  ): Promise<IPaymentInformation> => {
    return new Promise(async (resolve, reject) => {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/store/paymentInformation/${vendorId}`
        )
        .then((res) => {
          resolve(res.data.paymentInformation);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const filteredVendors = vendors.filter((vendor) => {
    return (
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    fetchVendors()
      .then((data) => {
        setVendors(data);

        data.forEach(async (vendor) => {
          await fetchVendorProducts(vendor._id)
            .then((products) => {
              setVendorProducts((prev) => ({
                ...prev,
                [vendor._id]: products,
              }));
            })
            .catch(console.error);

          await fetchVendorStore(vendor._id)
            .then((store) => {
              setVendorStores((prev) => ({
                ...prev,
                [vendor._id]: store,
              }));
            })
            .catch(console.error);

          await fetchVendorOrders(vendor._id).then((orders) => {
            setVendorOrders((prev) => ({
              ...prev,
              [vendor._id]: orders,
            }));
          });

          await fetchVendorBusiness(vendor._id)
            .then((business) => {
              setVendorBusiness((prev) => ({
                ...prev,
                [vendor._id]: business,
              }));
            })
            .catch(console.error);

          await fetchVendorPayment(vendor._id)
            .then((payment) => {
              setVendorPayment((prev) => ({
                ...prev,
                [vendor._id]: payment,
              }));
            })
            .catch(console.error);
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vendor Management</h2>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          {/* <DialogTrigger asChild>
            <Button className="bg-[#00BFA6]">Add New Vendor</Button>
          </DialogTrigger> */}
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new vendor to the platform.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddVendor} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter store name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="vendor@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange(value, "category")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="home">Home & Garden</SelectItem>
                      <SelectItem value="beauty">Beauty & Health</SelectItem>
                      <SelectItem value="food">Food & Beverages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Vendor Street, City, Country"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter store description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2 pt-4">
                <h3 className="font-medium text-gray-700">
                  Banking Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      placeholder="Bank Name"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      name="accountName"
                      placeholder="Account Name"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    placeholder="XXXX-XXXX-XXXX-1234"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {formError && (
                <div className="text-red-500 text-sm">{formError}</div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#00BFA6]">
                  Add Vendor
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                <p className="text-xs text-gray-500">{stat.status}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search vendors..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total Products</TableHead>
              <TableHead>Total Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor._id}>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>
                  {vendorProducts[vendor._id]
                    ? vendorProducts[vendor._id].length
                    : 0}
                </TableCell>
                <TableCell>
                  $
                  {`${(vendorOrders[vendor._id]
                    ? vendorOrders[vendor._id].reduce((a, b: any) => {
                        return Number(a) + Number(b.totalAmount);
                      }, 0)
                    : 0
                  ).toLocaleString()}
                  `}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      vendor.status === UserStatus.active
                        ? "bg-green-100 text-green-700"
                        : vendor.status === UserStatus.pending
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </TableCell>
                <TableCell>
                  {formatDate(vendor.createdAt) +
                    " " +
                    formatTime(vendor.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenVendorDetails(vendor)}
                    >
                      View
                    </Button>
                    {/* <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                    >
                      Block
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedVendor && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedVendor.name}
                </DialogTitle>
                <DialogDescription>
                  Vendor ID: {selectedVendor._id}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">
                      Basic Information
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Email:</span>
                        <span className="text-sm font-medium">
                          {selectedVendor.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Phone:</span>
                        <span className="text-sm font-medium">
                          {vendorBusiness[selectedVendor._id]?.businessPhone ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span
                          className={`text-sm font-medium ${
                            selectedVendor.status === UserStatus.active
                              ? "text-green-600"
                              : selectedVendor.status === UserStatus.pending
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {selectedVendor.status.charAt(0).toUpperCase() +
                            selectedVendor.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Join Date:
                        </span>
                        <span className="text-sm font-medium">
                          {formatDate(selectedVendor.createdAt) +
                            " " +
                            formatTime(selectedVendor.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700">
                      Store Information
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Address:</span>
                        <span className="text-sm font-medium">
                          {vendorBusiness[selectedVendor._id]
                            ?.businessAddress || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Business Type:
                        </span>
                        <span className="text-sm font-medium">
                          {vendorBusiness[selectedVendor._id]?.businessType ||
                            "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Tax ID:</span>
                        <span className="text-sm font-medium">
                          {vendorBusiness[selectedVendor._id]?.taxID || "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Email:</span>
                        <span className="text-sm font-medium">
                          {vendorBusiness[selectedVendor._id]?.businessEmail ||
                            "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Performance</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Total Products:
                        </span>
                        <span className="text-sm font-medium">
                          {vendorProducts[selectedVendor._id]
                            ? vendorProducts[selectedVendor._id].length
                            : 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Total Revenue:
                        </span>
                        <span className="text-sm font-medium">
                          $
                          {`${(vendorOrders[selectedVendor._id]
                            ? vendorOrders[selectedVendor._id].reduce(
                                (a, b: any) => {
                                  return Number(a) + Number(b.totalAmount);
                                },
                                0
                              )
                            : 0
                          ).toLocaleString()}
                  `}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700">
                      Banking Information
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Account Name:
                        </span>
                        <span className="text-sm font-medium">
                          {vendorPayment[selectedVendor._id]
                            ?.accountHolderName || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Account Number:
                        </span>
                        <span className="text-sm font-medium">
                          {vendorPayment[selectedVendor._id]?.accountNumber ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Bank Name:
                        </span>
                        <span className="text-sm font-medium">
                          {vendorPayment[selectedVendor._id]?.bankName || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <h3 className="font-medium text-gray-700">Description</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {vendorStores[selectedVendor._id]?.storeDescription ||
                      "N/A"}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setDialogOpen(false)} variant="outline">
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
