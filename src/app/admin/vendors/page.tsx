"use client";

import { useState } from "react";
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

const stats = [
  {
    title: "Total Vendors",
    value: "350",
    icon: Store,
    status: "Active",
  },
  {
    title: "Pending Approval",
    value: "5",
    icon: Clock,
    status: "Pending",
  },
  {
    title: "Blocked Vendors",
    value: "2",
    icon: Ban,
    status: "Blocked",
  },
  {
    title: "Total Products",
    value: "15,000",
    icon: ShoppingBag,
    status: "Listed",
  },
];

interface VendorBankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

interface Vendor {
  id: number;
  name: string;
  email: string;
  products: number;
  revenue: number;
  status: string;
  joinDate: string;
  address: string;
  phone: string;
  category: string;
  description: string;
  bankDetails: VendorBankDetails;
}

const vendors: Vendor[] = [
  {
    id: 1,
    name: "Vendor Store A",
    email: "vendor@example.com",
    products: 150,
    revenue: 25000,
    status: "active",
    joinDate: "2023-12-01",
    address: "123 Vendor Street, City, Country",
    phone: "+1234567890",
    category: "Electronics",
    description:
      "A leading electronics vendor offering the latest gadgets and technology.",
    bankDetails: {
      accountName: "Vendor A Inc.",
      accountNumber: "XXXX-XXXX-XXXX-1234",
      bankName: "Global Bank",
    },
  },
  // Add more dummy data
];

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
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
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

  const handleOpenVendorDetails = (vendor: Vendor) => {
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
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.products}</TableCell>
                <TableCell>${vendor.revenue.toLocaleString()}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      vendor.status === "active"
                        ? "bg-green-100 text-green-700"
                        : vendor.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </TableCell>
                <TableCell>{vendor.joinDate}</TableCell>
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
                  Vendor ID: {selectedVendor.id}
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
                          {selectedVendor.phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span
                          className={`text-sm font-medium ${
                            selectedVendor.status === "active"
                              ? "text-green-600"
                              : selectedVendor.status === "pending"
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
                          {selectedVendor.joinDate}
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
                        <span className="text-sm text-gray-500">Category:</span>
                        <span className="text-sm font-medium">
                          {selectedVendor.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Address:</span>
                        <span className="text-sm font-medium">
                          {selectedVendor.address}
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
                          {selectedVendor.products}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Total Revenue:
                        </span>
                        <span className="text-sm font-medium">
                          ${selectedVendor.revenue.toLocaleString()}
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
                          {selectedVendor.bankDetails.accountName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Account Number:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedVendor.bankDetails.accountNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">
                          Bank Name:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedVendor.bankDetails.bankName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <h3 className="font-medium text-gray-700">Description</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedVendor.description}
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
