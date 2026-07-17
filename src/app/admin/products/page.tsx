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
import { Search, Eye, EyeOff, Star, Trash2 } from "lucide-react";
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
import { Product, ProductStatus, Review, Vendor } from "@/app/types";
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
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [isDeleteReviewDialogOpen, setIsDeleteReviewDialogOpen] =
    useState(false);

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
    currentPage * Number(itemsPerPage),
  );

  // Handle product visibility toggle
  const handleVisibilityToggle = (product: Product) => {
    const formData = new FormData();

    formData.append(
      "status",
      product.status === ProductStatus.Active
        ? ProductStatus.Inactive
        : ProductStatus.Active,
    );

    product.status =
      product.status === ProductStatus.Active
        ? ProductStatus.Inactive
        : ProductStatus.Active;

    setSelectedProduct({ ...product });

    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`,
        formData,
      )
      .then(() => {
        toast({
          variant: "default",
          title: product.status,
          description: "Product visibility updated successfully",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      });
  };

  const setProductIsFeatured = (product: Product) => {
    product.isFeatured = !product.isFeatured;

    setSelectedProduct({ ...product });

    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, {
        isFeatured: product.isFeatured ? "true" : "false",
      })
      .then(() => {
        toast({
          variant: "default",
          title: "Success",
          description: "Product featured status updated successfully",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      });
  };

  // Display product details and toggle visibility
  const handleProductDetails = (product: any) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
    fetchProductReviews(product._id);
  };

  const fetchProductReviews = (productId: string) => {
    setLoadingReviews(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/reviews/product/${productId}`)
      .then((res) => {
        setProductReviews(res.data.reviews ?? []);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load reviews",
        });
      })
      .finally(() => setLoadingReviews(false));
  };

  // Stacking this AlertDialog on top of the still-open product details
  // Dialog confuses Radix's body pointer-events lock, so the details
  // Dialog is closed first and the AlertDialog only opens once its close
  // animation (duration-200) has finished, instead of running both at once.
  const DIALOG_TRANSITION_MS = 200;

  const confirmDeleteReview = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setIsDialogOpen(false);
    setTimeout(() => {
      setIsDeleteReviewDialogOpen(true);
    }, DIALOG_TRANSITION_MS);
  };

  const closeDeleteReviewDialog = () => {
    setReviewToDelete(null);
    setIsDeleteReviewDialogOpen(false);
    setTimeout(() => {
      setIsDialogOpen(true);
    }, DIALOG_TRANSITION_MS);
  };

  const handleDeleteReview = () => {
    if (!reviewToDelete) return;

    axios
      .delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/reviews/${reviewToDelete}`,
      )
      .then(() => {
        setProductReviews((prev) =>
          prev.filter((review) => review._id !== reviewToDelete),
        );
        toast({
          variant: "default",
          title: "Success",
          description: "Review deleted successfully",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      })
      .finally(() => {
        closeDeleteReviewDialog();
      });
  };

  const fetchProducts = (): Promise<Product[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        await axios
          .get(
            `${process.env.NEXT_PUBLIC_API_URL}/product?&perPage=9999&source=admin`,
          )
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
    new Set(products.map((product) => product.category)),
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
            filteredProducts.length,
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

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="product-visibility">Featured Product</Label>
                  <div className="text-sm text-gray-500">
                    Toggle whether this product is featured
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="product-visibility"
                    checked={selectedProduct.isFeatured === true}
                    onCheckedChange={() =>
                      setProductIsFeatured(selectedProduct)
                    }
                  />
                  <Label htmlFor="product-visibility" className="sr-only">
                    Toggle visibility
                  </Label>
                  {selectedProduct.isFeatured === true ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <Label>
                  Reviews
                  {productReviews.length > 0 && ` (${productReviews.length})`}
                </Label>
                <div className="mt-2 space-y-3 max-h-64 overflow-y-auto">
                  {loadingReviews ? (
                    <div className="text-sm text-gray-500">
                      Loading reviews...
                    </div>
                  ) : productReviews.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No reviews yet
                    </div>
                  ) : (
                    productReviews.map((review) => (
                      <div
                        key={review._id}
                        className="flex items-start justify-between gap-4 border rounded-md p-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {review.user?.name || "Anonymous"}
                            </span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3.5 w-3.5 ${
                                    star <= review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-600">
                              {review.comment}
                            </p>
                          )}
                          <div className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                          onClick={() => confirmDeleteReview(review._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete review</span>
                        </Button>
                      </div>
                    ))
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

      {/* Delete review confirmation dialog */}
      <AlertDialog
        open={isDeleteReviewDialogOpen}
        onOpenChange={(open) => {
          if (open) {
            setIsDeleteReviewDialogOpen(true);
          } else {
            closeDeleteReviewDialog();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              This hides the review from customers and vendors and
              recalculates the product's rating as if it were never left. It
              stays in the database for audit purposes and isn't shown
              anywhere.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteReviewDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
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
