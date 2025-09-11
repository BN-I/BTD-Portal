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
import { Product, ProductForm, DeletingProduct } from "@/app/types";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/auth-types";
import { ProductForm as ProductFormComponent } from "../../../../components/product-form";
import { Toaster } from "@/components/ui/toaster";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
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
    currentPage * Number(itemsPerPage)
  );

  const handleAddProduct = (newProduct: ProductForm) => {
    console.log("handleAddProduct - newProduct:", newProduct);
    console.log("handleAddProduct - files:", newProduct.files);
    console.log("handleAddProduct - files length:", newProduct.files?.length);
    var user = localStorage.getItem("user") as string | null;
    var userObj = null;
    if (user) {
      userObj = JSON.parse(user) as User;
    }
    const formData = new FormData();

    formData.append("title", newProduct.title);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price.toString());
    formData.append(
      "discountedPrice",
      newProduct.discountedPrice ? newProduct.discountedPrice.toString() : ""
    );
    formData.append("vendorID", userObj?._id.toString() || "");
    formData.append("isFeatured", "false");
    formData.append("status", "Active");
    formData.append("orderMaxDays", newProduct.orderMaxDays.toString());
    formData.append("orderMinDays", newProduct.orderMinDays.toString());

    newProduct.sizeVariations?.forEach((size) => {
      formData.append("sizeVariations", size);
    });

    newProduct.colorVariations?.forEach((color) => {
      formData.append("colorVariations", color);
    });

    if (newProduct.files && newProduct.files.length > 0) {
      console.log("Adding files to FormData:", newProduct.files);
      newProduct.files.forEach((image: any) => {
        console.log("Adding file to FormData:", image.name, image.size);
        formData.append("files", image);
      });
    } else {
      console.log("No files to add to FormData");
    }

    formData.append("category", newProduct.category);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/product`, formData, {
        timeout: 18000,
      })
      .then(() => {
        toast({
          variant: "default",
          title: "Success",
          description: "Product added successfully",
        });
        setDialogOpen(false);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        setDialogOpen(false);
      });

    setTimeout(() => {
      setShouldUpdate(!shouldUpdate);
    }, 1000);
  };

  const handleEditProduct = (updatedProduct: ProductForm) => {
    const formData = new FormData();

    formData.append("title", updatedProduct.title);
    formData.append("description", updatedProduct.description);
    formData.append("price", updatedProduct.price.toString());
    formData.append(
      "discountedPrice",
      updatedProduct.discountedPrice
        ? updatedProduct.discountedPrice.toString()
        : ""
    );

    formData.append("isFeatured", "false");
    formData.append("status", "Active");
    formData.append("orderMaxDays", updatedProduct.orderMaxDays.toString());
    formData.append("orderMinDays", updatedProduct.orderMinDays.toString());

    updatedProduct.sizeVariations?.forEach((size) => {
      formData.append("sizeVariations", size);
    });

    updatedProduct.colorVariations?.forEach((color) => {
      formData.append("colorVariations", color);
    });

    updatedProduct.files?.forEach((image) => {
      formData.append("files", image);
    });

    formData.append("category", updatedProduct.category);

    // setProducts(
    //   products.map((p) => (p._id === updatedProduct?._id ? updatedProduct : p))
    // );
    setEditingProduct(null);

    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${updatedProduct._id}`,
        formData
      )
      .then(() => {
        toast({
          variant: "default",
          title: "Success",
          description: "Product edited successfully",
        });
        setEditDialogOpen(false);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        setEditDialogOpen(false);
      });
    setShouldUpdate(!shouldUpdate);
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

  useEffect(() => {
    var user = localStorage.getItem("user") as string | null;
    if (user) {
      var userObj = JSON.parse(user) as User;
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/product/vendor/${userObj?._id}?perPage=9999`
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
        });
    }
  }, [shouldUpdate, dialogOpen, editDialogOpen]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  return (
    <div className="space-y-4">
      <Toaster />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto custom-scrollbar scrollbar">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductFormComponent onSubmit={handleAddProduct} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.title}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.category || "-"} </TableCell>
              <TableCell>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => setEditingProduct(product)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] overflow-y-auto custom-scrollbar scrollbar">
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    {editingProduct && (
                      <ProductFormComponent
                        product={editingProduct}
                        onSubmit={handleEditProduct}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogTrigger>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mr-2"
                      onClick={() => setDeletingProduct(product)}
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold">
                          {deletingProduct?.title}
                        </span>
                        ?
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        This action is irreversible.
                      </p>
                    </div>
                    <div className="flex justify-end gap-3">
                      <DialogTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogTrigger>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleDeleteProduct(deletingProduct?._id)
                        }
                      >
                        Confirm Delete
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                {/* <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
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

        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * Number(itemsPerPage) + 1} to{" "}
          {Math.min(currentPage * Number(itemsPerPage), products.length)} of{" "}
          {products.length} products
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
    </div>
  );
}
