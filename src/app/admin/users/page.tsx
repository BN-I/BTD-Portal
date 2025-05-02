"use client";

import { useEffect, useState } from "react";
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
import { User as IUser, UserStatus } from "@/lib/auth-types";
import { resolve } from "path";
import { rejects } from "assert";
import axios from "axios";
import { formatDate, formatPhoneNumber, formatTime } from "@/app/common";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState<Array<IUser>>([]);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const { toast } = useToast();

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const fetchUsers = (): Promise<Array<IUser>> => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/users`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // Handle opening user details
  const handleOpenUserDetails = (user: IUser) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  // Handle inactivating user account
  const handleInactivateUser = async (status: string) => {
    if (selectedUser) {
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/user/updateStatus/${selectedUser._id}`,
          {
            status,
          }
        )
        .then((res) => {
          console.log(res);
          toast({
            title: "User Account Updated",
            description: `${selectedUser.name}'s account has been ${status}.`,
          });
          setShouldUpdate(!shouldUpdate);
        })
        .catch((err) => {
          console.log(JSON.stringify(err.response));
          toast({
            variant: "destructive",
            title: "User Account Update Failed",
            description: `${err.response.data.message}`,
          });
        });

      setDialogOpen(false);
    }
  };

  useEffect(() => {
    fetchUsers()
      .then((users) => {
        setUsers(users);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [shouldUpdate]);

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

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Blocked">Blocked</SelectItem>
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
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className="capitalize">{user.role}</span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      user.status === UserStatus.active
                        ? "bg-green-100 text-green-700"
                        : user.status === UserStatus.inactive
                        ? "bg-gray-100 text-gray-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
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
                  User ID: {selectedUser._id}
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
                        {selectedUser.phoneNumber
                          ? `${selectedUser.countryCode} ${formatPhoneNumber(
                              selectedUser.phoneNumber
                            )}`
                          : "Not provided"}
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
                      <p className="font-medium">
                        {` ${formatDate(selectedUser.createdAt)} ${formatTime(
                          selectedUser.createdAt
                        )}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">Address</Label>
                  <p className="text-sm">
                    {selectedUser.streetAddress || "Not provided"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">Last Login</Label>
                  <p className="text-sm">
                    {selectedUser.lastLogin
                      ? `${formatDate(selectedUser.lastLogin)} ${formatTime(
                          selectedUser.lastLogin
                        )}`
                      : "Never"}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-gray-500">
                    Account Status
                  </Label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        selectedUser.status === UserStatus.active
                          ? "bg-green-100 text-green-700"
                          : selectedUser.status === UserStatus.inactive
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedUser.status?.charAt(0).toUpperCase() +
                        selectedUser.status?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-between">
                <Button onClick={() => setDialogOpen(false)} variant="outline">
                  Close
                </Button>

                <Button
                  onClick={() => {
                    handleInactivateUser(
                      selectedUser.status == UserStatus.active
                        ? UserStatus.inactive
                        : UserStatus.active
                    );
                  }}
                  variant={
                    selectedUser.status === UserStatus.active
                      ? "destructive"
                      : "secondary"
                  }
                  className="gap-1"
                >
                  {selectedUser.status &&
                  selectedUser.status === UserStatus.active ? (
                    <>
                      <Ban className="h-4 w-4" /> Inactivate Account
                    </>
                  ) : (
                    "Reactivate Account"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
