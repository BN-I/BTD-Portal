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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, UserPlus, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Interface for API response
interface AdminResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // For additional fields
}

// Interface for component admin data
interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  createdAt: string;
}

export default function AdminsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch admins from API
  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admins`
      );
      const apiAdmins: AdminResponse[] = response.data;

      // Transform API data
      const transformedAdmins: Admin[] = apiAdmins.map((admin) => ({
        id: admin._id,
        name: admin.name || "Unknown Admin",
        email: admin.email,
        role: "Super Admin", // Display as Super Admin
        lastLogin: "N/A", // API doesn't provide lastLogin
        createdAt: admin.createdAt,
      }));

      setAdmins(transformedAdmins);
    } catch (error: any) {
      console.error("Error fetching admins:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to fetch admins. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch admins on mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Filter admins based on search
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input change for new admin form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdminData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newAdminData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!newAdminData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newAdminData.email)) {
      errors.email = "Email is invalid";
    } else if (admins.some((admin) => admin.email === newAdminData.email)) {
      errors.email = "Email already exists";
    }

    if (!newAdminData.password) {
      errors.password = "Password is required";
    } else if (newAdminData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (newAdminData.password !== newAdminData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add new super admin
  const handleAddAdmin = async () => {
    if (!validateForm()) return;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admins`, {
        name: newAdminData.name,
        email: newAdminData.email,
        password: newAdminData.password,
        role: "Admin", // Match API role
      });

      // Refetch admins to ensure consistency
      await fetchAdmins();
      setNewAdminData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setIsAddDialogOpen(false);

      toast({
        title: "Success",
        description: `Super admin ${newAdminData.name} has been added`,
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error adding admin:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to add admin. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete confirmation
  const confirmDelete = (adminId: string) => {
    setAdminToDelete(adminId);
    setIsDeleteDialogOpen(true);
  };

  // Delete super admin
  const handleDeleteAdmin = async () => {
    if (adminToDelete === null) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admins/${adminToDelete}`
      );
      const adminToDeleteName = admins.find(
        (a) => a.id === adminToDelete
      )?.name;
      await fetchAdmins(); // Refetch to ensure consistency
      setIsDeleteDialogOpen(false);
      setAdminToDelete(null);

      toast({
        title: "Admin Removed",
        description: `${adminToDeleteName} has been removed from super admins`,
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error deleting admin:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to delete admin. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Super Admins Management</h2>
        <Button
          className="bg-[#00BFA6] hover:bg-[#00BFA6]/90"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Super Admin
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search admins..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Admins table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-500" />
                </TableCell>
              </TableRow>
            ) : filteredAdmins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No super admins found
                </TableCell>
              </TableRow>
            ) : (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.id}</TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {admin.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {admin.lastLogin === "N/A"
                      ? "Never"
                      : new Date(admin.lastLogin).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDelete(admin.id)}
                      disabled={admins.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add admin dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Super Admin</DialogTitle>
            <DialogDescription>
              Create a new super admin account with full access to the admin
              portal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                value={newAdminData.name}
                onChange={handleInputChange}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={newAdminData.email}
                onChange={handleInputChange}
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a secure password"
                value={newAdminData.password}
                onChange={handleInputChange}
              />
              {formErrors.password && (
                <p className="text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={newAdminData.confirmPassword}
                onChange={handleInputChange}
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#00BFA6] hover:bg-[#00BFA6]/90"
              onClick={handleAddAdmin}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              admin from the system and revoke their access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAdminToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAdmin}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
