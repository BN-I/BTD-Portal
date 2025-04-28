"use client";

import { useState } from "react";
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
  DialogDescription,
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
import { Search, Eye, Ban, User, Mail, Calendar, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Interface for user data
interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedDate: string;
  phone?: string;
  address?: string;
  lastLogin?: string;
}

// Dummy data - replace with API call
const users: UserData[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "vendor",
    status: "active",
    joinedDate: "2023-01-15",
    phone: "+1 (555) 123-4567",
    address: "123 Vendor Street, New York, NY",
    lastLogin: "2023-05-20 14:30",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    joinedDate: "2023-02-20",
    phone: "+1 (555) 987-6543",
    address: "456 Customer Ave, Los Angeles, CA",
    lastLogin: "2023-05-21 09:15",
  },
  // Add more dummy data
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle opening user details
  const handleOpenUserDetails = (user: UserData) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  // Handle inactivating user account
  const handleInactivateUser = () => {
    if (selectedUser) {
      // In a real app, this would be an API call
      const updatedUser = { ...selectedUser, status: "inactive" };

      // For demo purposes, we'll just show a toast notification
      toast({
        title: "User Account Updated",
        description: `${selectedUser.name}'s account has been inactivated.`,
      });

      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className="capitalize">{user.role}</span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : user.status === "inactive"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.joinedDate}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenUserDetails(user)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* User details dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedUser.name}
                </DialogTitle>
                <DialogDescription>
                  User ID: {selectedUser.id}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <Label className="text-sm text-gray-500">
                        Email Address
                      </Label>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <Label className="text-sm text-gray-500">
                        Phone Number
                      </Label>
                      <p className="font-medium">
                        {selectedUser.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <Label className="text-sm text-gray-500">Role</Label>
                      <p className="font-medium capitalize">
                        {selectedUser.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <Label className="text-sm text-gray-500">
                        Joined Date
                      </Label>
                      <p className="font-medium">{selectedUser.joinedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">Address</Label>
                  <p className="text-sm">
                    {selectedUser.address || "Not provided"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">Last Login</Label>
                  <p className="text-sm">{selectedUser.lastLogin || "Never"}</p>
                </div>

                <div>
                  <Label className="text-sm text-gray-500">
                    Account Status
                  </Label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        selectedUser.status === "active"
                          ? "bg-green-100 text-green-700"
                          : selectedUser.status === "inactive"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedUser.status.charAt(0).toUpperCase() +
                        selectedUser.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-between">
                <Button onClick={() => setDialogOpen(false)} variant="outline">
                  Close
                </Button>
                {selectedUser.status === "active" && (
                  <Button
                    onClick={handleInactivateUser}
                    variant="destructive"
                    className="gap-1"
                  >
                    <Ban className="h-4 w-4" />
                    Inactivate Account
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
