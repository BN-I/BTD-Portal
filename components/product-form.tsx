"use client";

import { useState } from "react";
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
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    product?.sizeVariations || []
  );
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const [files, setFiles] = useState<FileList | null>();
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(typeof orderMaxDays);
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
      sizeVariations: selectedSizes,
      files: files ? Array.from(files) : [],
    });
  };

  const handleCheckboxChange = (size: string) => {
    setSelectedSizes((prevSizes) => {
      if (prevSizes.includes(size)) {
        // If size is already selected, remove it
        return prevSizes.filter((s) => s !== size);
      } else {
        // If size is not selected, add it
        return [...prevSizes, size];
      }
    });
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

          <Input
            id="picture"
            type="file"
            multiple
            required={product ? false : true}
            onChange={(e) => {
              setFiles(e.target.files);
            }}
          />
        </div>

        {product?.images && !files && (
          <div className="flex flex-row space-x-4">
            {product.images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Product ${index}`} />
              </div>
            ))}
          </div>
        )}
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
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <Checkbox
                id={size}
                onCheckedChange={() => handleCheckboxChange(size)}
                checked={selectedSizes.includes(size)}
              />
              <label
                htmlFor={size}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {size}
              </label>
            </div>
          ))}
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
