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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Product, ProductForm, DeletingProduct, ProductStatus } from "@/app/types";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/auth-types";
import { ProductForm as ProductFormComponent } from "../../../../components/product-form";
import { Toaster } from "@/components/ui/toaster";
import { Eye, EyeOff, Package } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] =
    useState<DeletingProduct | null>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const { toast } = useToast();

  // Pagination logic
  const totalPages = Math.ceil(products.length / Number(itemsPerPage));
  const paginatedProducts = products.slice(
    (currentPage - 1) * Number(itemsPerPage),
    currentPage * Number(itemsPerPage),
  );

  const handleAddProduct = async (newProduct: ProductForm): Promise<void> => {
    const user = localStorage.getItem("user") as string | null;
    let userObj: User | null = null;
    if (user) userObj = JSON.parse(user) as User;

    const formData = new FormData();
    formData.append("title", newProduct.title);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price.toString());
    formData.append(
      "discountedPrice",
      newProduct.discountedPrice ? newProduct.discountedPrice.toString() : "",
    );
    formData.append("vendorID", userObj?._id.toString() || "");
    formData.append("isFeatured", "false");
    formData.append("status", "Active");
    formData.append("orderMaxDays", newProduct.orderMaxDays.toString());
    formData.append("orderMinDays", newProduct.orderMinDays.toString());

    newProduct.sizeVariations?.forEach((size) =>
      formData.append("sizeVariations", size),
    );
    newProduct.colorVariations?.forEach((color) =>
      formData.append("colorVariations", color),
    );
    newProduct.files?.forEach((image) => formData.append("files", image));
    formData.append("category", newProduct.category);
    formData.append("weight", newProduct.weight?.toString() || "0");
    formData.append("length", (newProduct.length ?? 0).toString());
    formData.append("width", (newProduct.width ?? 0).toString());
    formData.append("height", (newProduct.height ?? 0).toString());
    newProduct.availableStates?.forEach((state) =>
      formData.append("availableStates", state),
    );

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/product`, formData, {
        timeout: 18000,
      });
      toast({
        variant: "default",
        title: "Success",
        description: "Product added successfully",
      });
      setDialogOpen(false);
      setShouldUpdate((v) => !v);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }
  };

  const handleEditProduct = async (
    updatedProduct: ProductForm,
  ): Promise<void> => {
    const formData = new FormData();
    formData.append("title", updatedProduct.title);
    formData.append("description", updatedProduct.description);
    formData.append("price", updatedProduct.price.toString());
    formData.append(
      "discountedPrice",
      updatedProduct.discountedPrice
        ? updatedProduct.discountedPrice.toString()
        : "",
    );
    formData.append("isFeatured", "false");
    formData.append("status", "Active");
    formData.append("orderMaxDays", updatedProduct.orderMaxDays.toString());
    formData.append("orderMinDays", updatedProduct.orderMinDays.toString());

    updatedProduct.sizeVariations?.forEach((size) =>
      formData.append("sizeVariations", size),
    );
    updatedProduct.colorVariations?.forEach((color) =>
      formData.append("colorVariations", color),
    );
    updatedProduct.files?.forEach((image) => formData.append("files", image));
    formData.append("category", updatedProduct.category);
    formData.append("weight", updatedProduct.weight?.toString() || "0");
    formData.append("length", (updatedProduct.length ?? 0).toString());
    formData.append("width", (updatedProduct.width ?? 0).toString());
    formData.append("height", (updatedProduct.height ?? 0).toString());
    updatedProduct.crossedImages?.forEach((image) =>
      formData.append("crossedImages", image),
    );
    updatedProduct.availableStates?.forEach((state) =>
      formData.append("availableStates", state),
    );

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${updatedProduct._id}`,
        formData,
      );
      toast({
        variant: "default",
        title: "Success",
        description: "Product edited successfully",
      });
      setEditDialogOpen(false);
      setEditingProduct(null);
      setShouldUpdate((v) => !v);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }
  };

  const handleDeleteProduct = (id: string | undefined) => {
    setProducts(products.filter((p) => p._id !== id));

    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`)
      .then(() => {
        toast({
          variant: "default",
          title: "Success",
          description: "Product deleted successfully",
        });
        setDeleteDialogOpen(false);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        setDeleteDialogOpen(false);
      });
  };

  const handleVisibilityToggle = (product: Product) => {
    if (togglingId) return;
    const newStatus =
      product.status === ProductStatus.Active
        ? ProductStatus.Inactive
        : ProductStatus.Active;

    setTogglingId(product._id);
    setProducts((prev) =>
      prev.map((p) => (p._id === product._id ? { ...p, status: newStatus } : p)),
    );

    const formData = new FormData();
    formData.append("status", newStatus);

    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/product/${product._id}`, formData)
      .then(() => {
        toast({
          variant: "default",
          title: newStatus === ProductStatus.Active ? "Product Visible" : "Product Hidden",
          description: "Product visibility updated successfully",
        });
      })
      .catch((error) => {
        setProducts((prev) =>
          prev.map((p) =>
            p._id === product._id ? { ...p, status: product.status } : p,
          ),
        );
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      })
      .finally(() => setTogglingId(null));
  };

  useEffect(() => {
    var user = localStorage.getItem("user") as string | null;
    if (user) {
      var userObj = JSON.parse(user) as User;
      setLoading(true);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/product/vendor/${userObj?._id}?perPage=9999&source=vendor`,
        )
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [shouldUpdate, dialogOpen, editDialogOpen]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return (
    <div className="space-y-4">
      <Toaster />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800">Products</h2>
          <p className="text-sm text-stone-400 mt-0.5">Manage your listings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto shrink-0">Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[92vh] w-full sm:max-w-2xl lg:max-w-3xl overflow-y-auto custom-scrollbar scrollbar"
            onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductFormComponent onSubmit={handleAddProduct} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-2xl border border-stone-200/60 bg-white/90 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><div className="skeleton h-4 w-40" /></TableCell>
                <TableCell><div className="skeleton h-4 w-16" /></TableCell>
                <TableCell><div className="skeleton h-4 w-24" /></TableCell>
                <TableCell><div className="skeleton h-5 w-16 rounded-full" /></TableCell>
                <TableCell><div className="skeleton h-8 w-44" /></TableCell>
              </TableRow>
            ))
          ) : paginatedProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-16 text-center">
                <Package className="h-10 w-10 text-stone-200 mx-auto mb-3" />
                <p className="text-stone-500 font-medium">No products yet</p>
                <p className="text-stone-400 text-xs mt-1">
                  Click &ldquo;Add Product&rdquo; to create your first listing
                </p>
              </TableCell>
            </TableRow>
          ) : null}
          {!loading && paginatedProducts.map((product) => (
            <TableRow
              key={product._id}
              className={
                product.status === ProductStatus.Inactive
                  ? "opacity-50 grayscale bg-stone-50/80"
                  : ""
              }
            >
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.category || "-"}</TableCell>
              <TableCell>
                {product.status === ProductStatus.Active ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    <Eye className="h-3 w-3" /> Visible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-500">
                    <EyeOff className="h-3 w-3" /> Hidden
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(product);
                      setEditDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={
                      product.status === ProductStatus.Active
                        ? "text-stone-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50"
                        : "text-emerald-600 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50/50"
                    }
                    disabled={togglingId === product._id}
                    onClick={() => handleVisibilityToggle(product)}
                  >
                    {togglingId === product._id ? (
                      <span className="flex items-center gap-1.5">
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        Saving…
                      </span>
                    ) : product.status === ProductStatus.Active ? (
                      <span className="flex items-center gap-1.5">
                        <EyeOff className="h-3.5 w-3.5" /> Hide
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5" /> Show
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setDeletingProduct(product);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>

      {/* Edit dialog — single page-level instance so only one ProductFormComponent
          is ever mounted. key={_id} ensures clean state when switching products. */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          className="max-h-[92vh] w-full sm:max-w-2xl lg:max-w-3xl overflow-y-auto custom-scrollbar scrollbar"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductFormComponent
              key={editingProduct._id}
              product={editingProduct}
              onSubmit={handleEditProduct}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete dialog — single page-level instance */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deletingProduct?.title}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action is irreversible.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteProduct(deletingProduct?._id)}
            >
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pagination controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Items per page:</span>
          <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-gray-500 text-center sm:text-left">
          Showing {(currentPage - 1) * Number(itemsPerPage) + 1} to{" "}
          {Math.min(currentPage * Number(itemsPerPage), products.length)} of{" "}
          {products.length} products
        </div>

        <Pagination className="justify-center sm:justify-end">
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
    </div>
  );
}
