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
  DialogTrigger,
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
import { Search, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import { Product, ProductStatus, Vendor } from "@/app/types";
import { User } from "@/lib/auth-types";
import { toast } from "@/hooks/use-toast";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [itemsPerPage, setItemsPerPage] = useState("20");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const vendors = products.reduce((acc: Vendor[], product) => {
    if (!acc.find((v) => v._id === product.vendor._id)) {
      acc.push(product.vendor);
    }
    return acc;
  }, []);
  // Filter products based on search term, vendor and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesVendor =
      selectedVendor === "all" || product.vendor.name === selectedVendor;
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesVendor && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / Number(itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * Number(itemsPerPage),
    currentPage * Number(itemsPerPage)
  );

  // Handle product visibility toggle
  const handleVisibilityToggle = (product: Product) => {
    const formData = new FormData();

    formData.append(
      "status",
      product.status === ProductStatus.Active
        ? ProductStatus.Inactive
        : ProductStatus.Active
    );

    product.status =
      product.status === ProductStatus.Active
        ? ProductStatus.Inactive
        : ProductStatus.Active;

    setSelectedProduct({ ...product });

    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`,
        formData
      )
      .then(() => {
        toast({
          variant: "default",
          title: product.status,
          description: "Product visibility updated successfully",
        });
      });
  };

  // Display product details and toggle visibility
  const handleProductDetails = (product: any) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const fetchProducts = (): Promise<Product[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/product?&perPage=9999`)
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  };

  // Extract unique categories for the filter
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  useEffect(() => {
    fetchProducts().then((res) => {
      setProducts(res);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products Management</h2>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={selectedVendor} onValueChange={setSelectedVendor}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by vendor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            {vendors.map((vendor) => (
              <SelectItem key={vendor._id} value={vendor.name}>
                {vendor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
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

      {/* Products table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product._id}</TableCell>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.vendor.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  {product.status == ProductStatus.Active ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Visible
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Hidden
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(product.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleProductDetails(product)}
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
          {Math.min(
            currentPage * Number(itemsPerPage),
            filteredProducts.length
          )}{" "}
          of {filteredProducts.length} products
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

      {/* Product details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xlg">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID</Label>
                  <div>{selectedProduct._id}</div>
                </div>
                <div>
                  <Label>Name</Label>
                  <div>{selectedProduct.title}</div>
                </div>
                <div>
                  <Label>Vendor</Label>
                  <div>{selectedProduct.vendor.name}</div>
                </div>
                <div>
                  <Label>Category</Label>
                  <div>{selectedProduct.category}</div>
                </div>
                <div>
                  <Label>Price</Label>
                  <div>${selectedProduct.price}</div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="product-visibility">Product Visibility</Label>
                  <div className="text-sm text-gray-500">
                    Toggle whether this product is visible to users
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="product-visibility"
                    checked={selectedProduct.status === ProductStatus.Active}
                    onCheckedChange={() =>
                      handleVisibilityToggle(selectedProduct)
                    }
                  />
                  <Label htmlFor="product-visibility" className="sr-only">
                    Toggle visibility
                  </Label>
                  {selectedProduct.status === ProductStatus.Active ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-red-600" />
                  )}
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
