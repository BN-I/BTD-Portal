"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, ProductForm } from "@/app/types";
import { Block } from "@uiw/react-color";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { parse } from "path";
interface ProductFormProps {
  product?: Product;
  onSubmit: (product: ProductForm) => void;
}

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const [name, setName] = useState(product?.title || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [discountedPrice, setDiscountedPrice] = useState(
    product?.discountedPrice?.toString() || ""
  );
  const [category, setCategory] = useState(product?.category || "");
  const [orderMaxDays, setOrderMaxDays] = useState<number>(
    product?.orderMaxDays || 0
  );
  const [orderMinDays, setOrderMinDays] = useState<number>(
    product?.orderMinDays || 0
  );

  const [colors, setColors] = useState<{ hex: string; isOpen: boolean }[]>(
    product?.colorVariations
      ? product?.colorVariations?.map((color) => ({
          hex: color,
          isOpen: false,
        }))
      : []
  );
  const [customSizes, setCustomSizes] = useState<string[]>(
    product?.sizeVariations?.length ? product.sizeVariations : [""]
  );
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission - files state:", files);
    console.log("Form submission - fileUrls state:", fileUrls);

    // Clear previous errors
    setError("");
    setImageError("");

    if (discountedPrice && parseFloat(discountedPrice) > parseFloat(price)) {
      setError("Discounted price cannot be greater than price");
      return;
    }

    if (!category) {
      setError("Category is required");
      return;
    }

    if (!orderMaxDays || !orderMinDays) {
      setError("Order min and max days are required");
      return;
    }

    if (orderMaxDays < orderMinDays) {
      setError("Order max days cannot be less than order min days");
      return;
    }

    // Check if files are required and present
    // For new products: require at least one image
    // For editing products: either keep existing images or add new ones
    if (!product && files.length === 0) {
      setError("Please select at least one image file");
      return;
    }

    // For editing products, ensure we have either existing images or new files
    if (
      product &&
      files.length === 0 &&
      (!product.images || product.images.length === 0)
    ) {
      setError("Please select at least one image file or keep existing images");
      return;
    }

    // Validate image file sizes
    if (files.length > 0) {
      const maxSize = 1 * 1024 * 1024; // 5MB in bytes
      const oversizedFiles: string[] = [];

      files.forEach((file) => {
        if (file.size > maxSize) {
          oversizedFiles.push(file.name);
        }
      });

      if (oversizedFiles.length > 0) {
        setImageError(
          `Image(s) exceed 1MB limit: ${oversizedFiles.join(", ")}`
        );
        return;
      }
    }

    onSubmit({
      _id: product?._id ? product._id : "",
      title: name,
      description,
      price: parseFloat(price),
      discountedPrice: discountedPrice ? parseFloat(discountedPrice) : 0,
      category,
      orderMinDays: orderMinDays,
      orderMaxDays: orderMaxDays,
      colorVariations: colors.map((color) => color.hex),
      sizeVariations: customSizes.filter((size) => size.trim() !== ""),
      files: files,
    });
  };

  const handleSizeChange = (index: number, value: string) => {
    const updatedSizes = [...customSizes];
    updatedSizes[index] = value;
    setCustomSizes(updatedSizes);
  };

  const addSizeInput = () => {
    if (customSizes.length < 10) {
      setCustomSizes([...customSizes, ""]);
    }
  };

  const removeSizeInput = (index: number) => {
    if (customSizes.length > 1) {
      const updatedSizes = customSizes.filter((_, i) => i !== index);
      setCustomSizes(updatedSizes);
    }
  };

  const handleCloseAllColors = async () => {
    new Promise((resolve) => {
      setColors(
        colors.map((color) => ({
          ...color,
          isOpen: false,
        }))
      );
      resolve(true);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    setImageError(""); // Clear previous image errors

    console.log("handleFileChange - selectedFiles:", selectedFiles);
    console.log("handleFileChange - current files state:", files);

    if (selectedFiles) {
      const maxSize = 1 * 1024 * 1024; // 5MB in bytes
      const oversizedFiles: string[] = [];

      Array.from(selectedFiles).forEach((file) => {
        if (file.size > maxSize) {
          oversizedFiles.push(file.name);
        }
      });

      if (oversizedFiles.length > 0) {
        setImageError(
          `Image(s) exceed 1MB limit: ${oversizedFiles.join(", ")}`
        );
        e.target.value = ""; // Reset the input
        return;
      }

      // Convert selectedFiles to array and combine with existing files
      const newFiles = Array.from(selectedFiles);
      console.log("New files to add:", newFiles);

      if (files.length > 0) {
        console.log("Combining existing files with new files");
        // Combine existing files with new files
        const combinedFiles = [...files, ...newFiles];
        console.log("Combined files:", combinedFiles);
        setFiles(combinedFiles);

        // Create URLs for new thumbnails and add to existing ones
        const newUrls = newFiles.map((file) => URL.createObjectURL(file));
        setFileUrls((prev) => [...prev, ...newUrls]);
      } else {
        console.log("First time selecting files");
        // First time selecting files
        setFiles(newFiles);

        // Create URLs for thumbnails
        const urls = newFiles.map((file) => URL.createObjectURL(file));
        setFileUrls(urls);
      }

      // Reset the input so user can select more files
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    if (files.length > 0) {
      // Remove the file at the specified index
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);

      // Update file URLs
      const newUrls = [...fileUrls];
      URL.revokeObjectURL(newUrls[index]); // Clean up the removed URL
      newUrls.splice(index, 1);
      setFileUrls(newUrls);
    }
  };

  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      fileUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileUrls]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <div className="input-icon">
          <Input
            id="price"
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <i>$</i>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="discounted-price">Discounted Price (optional)</Label>

        <div className="input-icon">
          <Input
            id="discounted-price"
            type="number"
            placeholder="Enter Discounted price"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(e.target.value)}
            required={false}
          />
          <i>$</i>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture">Picture</Label>
          <span className="text-xs text-muted-foreground text-stone-400">
            png | jpg | bmp | jpeg | webp (Max size: 1MB per image)
          </span>
          <span className="text-xs text-blue-600">
            💡 You can select multiple images at once or add more images by
            clicking "Choose Files" again
            {product && product.images && product.images.length > 0 && (
              <span className="block mt-1">
                📸 New images will be added to existing ones
              </span>
            )}
          </span>
          <Input
            className="cursor-pointer"
            id="picture"
            type="file"
            accept="image/png,image/jpeg,image/bmp,image/jpg,image/webp"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {/* Show existing product images when editing */}
        {product?.images && product.images.length > 0 && (
          <div className="mt-3">
            <Label className="text-sm font-medium">
              Existing Product Images:
            </Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="relative min-w-[103px] flex flex-col items-center justify-center group"
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    Existing Image {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show thumbnails of newly uploaded images */}
        {fileUrls.length > 0 && (
          <div className="mt-3">
            <Label className="text-sm font-medium">Uploaded Images:</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {fileUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative min-w-[103px] flex flex-col items-center justify-center group"
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Remove image"
                  >
                    ×
                  </button>
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {files[index]
                      ? files[index].name.substring(0, 15) +
                        (files[index].name.length > 15 ? "..." : "")
                      : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {imageError && (
          <div className="text-red-500 text-sm mt-1">{imageError}</div>
        )}

        {/* Debug info - remove this after fixing the issue */}
        {/* {process.env.NODE_ENV === "development" && (
          <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-100 rounded">
            <div>Debug Info:</div>
            <div>Files count: {files ? files.length : 0}</div>
            <div>File URLs count: {fileUrls.length}</div>
            {files &&
              Array.from(files).map((file, index) => (
                <div key={index}>
                  File {index + 1}: {file.name} ({file.size} bytes)
                </div>
              ))}
          </div>
        )} */}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="home">Home & Garden</SelectItem>
            <SelectItem value="books">Books</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className=" flex flex-row space-x-4">
        <div className="space-y-2">
          <Label htmlFor="orderMinDays">Min days to order</Label>
          <Input
            id="orderMinDays"
            type="number"
            placeholder="Enter Min days to order"
            value={orderMinDays}
            onChange={(e) => setOrderMinDays(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orderMaxDays">Max days to order</Label>
          <Input
            id="orderMaxDays"
            type="number"
            placeholder="Enter Max days to order"
            value={orderMaxDays}
            onChange={(e) => setOrderMaxDays(parseInt(e.target.value))}
            required
          />
        </div>
      </div>

      <div className="space-y-2 ">
        <Label htmlFor="color">Color</Label>

        <div className="flex flex-row space-x-4">
          {colors.map((color, index) => (
            <div key={index} className="flex items-center  flex-col relative">
              <div
                className="absolute top-[-15px] right-0 cursor-pointer z-10 text-gray-400"
                style={{ right: color.isOpen ? "50px" : "0" }}
                onClick={() => {
                  const updatedColors = [...colors];
                  updatedColors.splice(index, 1);
                  setColors(updatedColors);
                }}
              >
                x
              </div>
              <div
                className="w-[50px] h-[50px]  rounded-[50%] cursor-pointer "
                style={{ backgroundColor: color.hex }}
                onClick={async () => {
                  await handleCloseAllColors().then(() => {
                    const updatedColors = [...colors];
                    updatedColors[index].isOpen = !updatedColors[index].isOpen;
                    setColors(updatedColors);
                  });
                }}
              ></div>
              <Block
                color={color.hex}
                onChange={(e) => {
                  const updatedColors = [...colors];
                  updatedColors[index].hex = e.hex;
                  updatedColors[index].isOpen = false;
                  setColors(updatedColors);
                }}
                className={`${color.isOpen ? "" : "hidden"} mt-3`}
              />
            </div>
          ))}
          <div
            className="w-[50px] h-[50px] border border-black bg-gray-100 rounded-[50%] flex items-center justify-center cursor-pointer font-bold"
            onClick={() => {
              const updatedColors = [...colors];
              updatedColors.push({ hex: "#000000", isOpen: true });
              setColors(updatedColors);
            }}
          >
            +
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Size Options</Label>
        <div className="space-y-2">
          {customSizes.map((size, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <Input
                placeholder={`Size ${index + 1} (e.g., XL, 42, 52 inches)`}
                value={size}
                onChange={(e) => handleSizeChange(index, e.target.value)}
                maxLength={15}
              />
              {customSizes.length > 1 && (
                // asdasd
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSizeInput(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          {customSizes.length < 10 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSizeInput}
              className="w-full"
            >
              + Add Size
            </Button>
          )}
        </div>
      </div>
      <Button type="submit">
        {product ? "Update Product" : "Add Product"}
      </Button>
      <div>
        <Label className="text-red-500">{error}</Label>
      </div>
    </form>
  );
}
