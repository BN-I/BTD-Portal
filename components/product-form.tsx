"use client";

import { useState, useEffect, useRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Info,
  Upload,
  Package,
  Tag,
  Truck,
  Palette,
  Layers,
  DollarSign,
  ImageIcon,
  X,
  Maximize2,
} from "lucide-react";
import type { Product, ProductForm } from "@/app/types";
import { Block } from "@uiw/react-color";

/* ── Tooltip ─────────────────────────────────────────────────────── */
function FieldTooltip({ content }: { content: string }) {
  return (
    <TooltipPrimitive.Provider delayDuration={250}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-stone-200 hover:bg-stone-900 text-stone-500 hover:text-white cursor-help transition-all duration-150"
          >
            <Info className="h-2.5 w-2.5" />
          </button>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className="z-[200] max-w-[220px] rounded-lg bg-stone-900 px-3 py-2 text-xs leading-relaxed text-white shadow-xl"
            sideOffset={6}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-stone-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

/* ── Section card ─────────────────────────────────────────────────── */
function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-stone-900 text-white shrink-0">
          {icon}
        </span>
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

/* ── Field label with optional tooltip ───────────────────────────── */
function FL({
  htmlFor,
  children,
  tip,
  optional,
  count,
  max,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  tip?: string;
  optional?: boolean;
  count?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-1.5">
        <Label
          htmlFor={htmlFor}
          className="text-sm font-medium text-stone-700 cursor-pointer"
        >
          {children}
        </Label>
        {optional && (
          <span className="text-[10px] font-medium text-stone-400 bg-stone-100 rounded-full px-1.5 py-0.5">
            optional
          </span>
        )}
        {tip && <FieldTooltip content={tip} />}
      </div>
      {count !== undefined && max !== undefined && (
        <span
          className={`text-[11px] tabular-nums ${count >= max ? "text-red-400" : "text-stone-400"}`}
        >
          {count}/{max}
        </span>
      )}
    </div>
  );
}

/* ── Image preview lightbox ──────────────────────────────────────── */
function Lightbox({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[150] bg-black/85 flex items-center justify-center p-4"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 rounded-full p-1.5 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={src}
        alt="Preview"
        className="max-w-[92%] max-h-[88%] rounded-xl object-contain shadow-2xl"
      />
    </div>
  );
}

/* ── Image tile ──────────────────────────────────────────────────── */
function ImageTile({
  src,
  label,
  faded,
  onRemove,
  onPreview,
}: {
  src: string;
  label: string;
  faded?: boolean;
  onRemove?: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="relative group flex flex-col items-center gap-1">
      {/* tile */}
      <div
        className="relative w-full aspect-square rounded-lg overflow-hidden border border-stone-200 cursor-pointer bg-stone-100"
        onClick={onPreview}
      >
        <img
          src={src}
          alt={label}
          className={`w-full h-full object-cover transition-all duration-200 group-hover:brightness-75 ${
            faded ? "opacity-35 grayscale" : ""
          }`}
        />
        {/* hover overlay */}
        {!faded && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="h-5 w-5 text-white drop-shadow" />
          </div>
        )}
      </div>
      {/* remove button */}
      {onRemove && !faded && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      {faded && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-stone-400 text-white flex items-center justify-center shadow z-10">
          <X className="h-3 w-3" />
        </div>
      )}
      <span className="text-[10px] text-stone-500 text-center truncate w-full px-0.5">
        {label}
      </span>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
interface ProductFormProps {
  product?: Product;
  onSubmit: (product: ProductForm) => void;
}

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const [name, setName] = useState(product?.title || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [discountedPrice, setDiscountedPrice] = useState(
    product?.discountedPrice?.toString() || "",
  );
  const [category, setCategory] = useState(product?.category || "");
  const [orderMaxDays, setOrderMaxDays] = useState<number>(
    product?.orderMaxDays || 0,
  );
  const [orderMinDays, setOrderMinDays] = useState<number>(
    product?.orderMinDays || 0,
  );
  const [weight, setWeight] = useState<string>(
    product?.weight?.toString() || "",
  );
  const [length, setLength] = useState<number>(product?.length || 0);
  const [width, setWidth] = useState<number>(product?.width || 0);
  const [height, setHeight] = useState<number>(product?.height || 0);
  const [colors, setColors] = useState<{ hex: string; isOpen: boolean }[]>(
    product?.colorVariations
      ? product.colorVariations.map((color) => ({ hex: color, isOpen: false }))
      : [],
  );
  const [customSizes, setCustomSizes] = useState<string[]>(
    product?.sizeVariations?.length ? product.sizeVariations : [""],
  );
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const [crossedImages, setCrossedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const savedScrollRef = useRef(0);

  /* ── Draft: save to localStorage (new products only) ─────────── */
  const DRAFT_KEY = "btd-product-form-draft";

  useEffect(() => {
    if (product) return;
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    try {
      const d = JSON.parse(draft);
      if (d.name) setName(d.name);
      if (d.description) setDescription(d.description);
      if (d.price) setPrice(d.price);
      if (d.discountedPrice) setDiscountedPrice(d.discountedPrice);
      if (d.category) setCategory(d.category);
      if (d.orderMinDays) setOrderMinDays(d.orderMinDays);
      if (d.orderMaxDays) setOrderMaxDays(d.orderMaxDays);
      if (d.weight) setWeight(d.weight);
      if (d.length) setLength(d.length);
      if (d.width) setWidth(d.width);
      if (d.height) setHeight(d.height);
      if (d.customSizes?.length) setCustomSizes(d.customSizes);
      if (d.colors?.length) setColors(d.colors.map((hex: string) => ({ hex, isOpen: false })));
      setDraftRestored(true);
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (product) return;
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        name, description, price, discountedPrice, category,
        orderMinDays, orderMaxDays, weight, length, width, height,
        customSizes,
        colors: colors.map((c) => c.hex),
      }),
    );
  }, [name, description, price, discountedPrice, category, orderMinDays, orderMaxDays, weight, length, width, height, customSizes, colors, product]);

  /* ── Scroll helpers for lightbox ─────────────────────────────── */
  const getScrollParent = (node: HTMLElement | null): HTMLElement | null => {
    if (!node) return null;
    if (node.scrollHeight > node.clientHeight + 1) return node;
    return getScrollParent(node.parentElement);
  };

  const openPreview = (src: string) => {
    const scrollable = getScrollParent(formRef.current?.parentElement ?? null);
    savedScrollRef.current = scrollable?.scrollTop ?? 0;
    if (scrollable) scrollable.scrollTop = 0;
    setPreviewImage(src);
  };

  const closePreview = () => {
    setPreviewImage(null);
    const scrollable = getScrollParent(formRef.current?.parentElement ?? null);
    if (scrollable) {
      // defer so the DOM has settled after state update
      requestAnimationFrame(() => { scrollable.scrollTop = savedScrollRef.current; });
    }
  };

  /* ── Validation & submit ─────────────────────────────────────── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setImageError("");

    if (discountedPrice && parseFloat(discountedPrice) > parseFloat(price)) {
      setError("Discounted price cannot be greater than price");
      return;
    }
    if (!category) { setError("Category is required"); return; }
    if (!orderMaxDays || !orderMinDays) {
      setError("Order min and max days are required");
      return;
    }
    if (orderMaxDays < orderMinDays) {
      setError("Order max days cannot be less than order min days");
      return;
    }
    const weightValue = parseFloat(weight);
    if (!weight || isNaN(weightValue) || weightValue <= 0) {
      setError("Weight is required and must be greater than 0");
      return;
    }
    if (!length || isNaN(length) || length <= 0) {
      setError("Length is required and must be greater than 0");
      return;
    }
    if (!width || isNaN(width) || width <= 0) {
      setError("Width is required and must be greater than 0");
      return;
    }
    if (!height || isNaN(height) || height <= 0) {
      setError("Height is required and must be greater than 0");
      return;
    }
    if (!product && files.length === 0) {
      setError("Please select at least one image file");
      return;
    }
    if (
      product &&
      files.length === 0 &&
      (!product.images || product.images.length === 0)
    ) {
      setError("Please select at least one image file or keep existing images");
      return;
    }
    if (files.length > 0) {
      const maxSize = 50 * 1024 * 1024;
      const oversized = files.filter((f) => f.size > maxSize).map((f) => f.name);
      if (oversized.length > 0) {
        setImageError(`Image(s) exceed 50MB limit: ${oversized.join(", ")}`);
        return;
      }
    }

    if (!product) localStorage.removeItem(DRAFT_KEY);

    onSubmit({
      _id: product?._id ?? "",
      title: name,
      description,
      price: parseFloat(price),
      discountedPrice: discountedPrice ? parseFloat(discountedPrice) : 0,
      category,
      orderMinDays,
      orderMaxDays,
      colorVariations: colors.map((c) => c.hex),
      sizeVariations: customSizes.filter((s) => s.trim() !== ""),
      files,
      weight: parseFloat(weight),
      length: length || 0,
      width: width || 0,
      height: height || 0,
      crossedImages,
    });
  };

  /* ── File helpers ────────────────────────────────────────────── */
  const processNewFiles = (selected: FileList | File[]) => {
    setImageError("");
    const arr = Array.from(selected);
    const existingCount = product?.images
      ? product.images.filter((img) => !crossedImages.includes(img)).length
      : 0;
    const total = existingCount + files.length + arr.length;
    if (total > 5) {
      const remaining = 5 - (existingCount + files.length);
      setImageError(
        `Max 5 images. You have ${existingCount + files.length} selected, ${remaining} slot${remaining === 1 ? "" : "s"} remaining.`,
      );
      return;
    }
    const maxSize = 50 * 1024 * 1024;
    const oversized = arr.filter((f) => f.size > maxSize).map((f) => f.name);
    if (oversized.length > 0) {
      setImageError(`Image(s) exceed 50MB limit: ${oversized.join(", ")}`);
      return;
    }
    setFiles((prev) => [...prev, ...arr]);
    setFileUrls((prev) => [...prev, ...arr.map((f) => URL.createObjectURL(f))]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processNewFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.match(/^image\/(png|jpeg|bmp|webp)$/),
    );
    if (dropped.length) processNewFiles(dropped);
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(fileUrls[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCloseAllColors = () => {
    setColors((prev) => prev.map((c) => ({ ...c, isOpen: false })));
  };

  /* ── Size helpers ────────────────────────────────────────────── */
  const handleSizeChange = (index: number, value: string) => {
    const updated = [...customSizes];
    updated[index] = value;
    setCustomSizes(updated);
  };
  const addSizeInput = () => {
    if (customSizes.length < 10) setCustomSizes((p) => [...p, ""]);
  };
  const removeSizeInput = (index: number) => {
    if (customSizes.length > 1)
      setCustomSizes((p) => p.filter((_, i) => i !== index));
  };

  /* ── Cleanup blob URLs ───────────────────────────────────────── */
  useEffect(() => {
    return () => fileUrls.forEach((u) => URL.revokeObjectURL(u));
  }, [fileUrls]);

  /* ── Derived ─────────────────────────────────────────────────── */
  const existingImgCount = product?.images
    ? product.images.filter((img) => !crossedImages.includes(img)).length
    : 0;
  const totalImageCount = existingImgCount + files.length;

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <>
      {previewImage && (
        <Lightbox src={previewImage} onClose={closePreview} />
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

        {/* ── Draft restored banner ── */}
        {draftRestored && (
          <div className="flex items-center justify-between text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2">
            <span>Draft restored from your last session.</span>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(DRAFT_KEY);
                setDraftRestored(false);
              }}
              className="ml-3 underline underline-offset-2 hover:text-amber-900 shrink-0"
            >
              Clear draft
            </button>
          </div>
        )}

        {/* ── General Information ── */}
        <Section icon={<Package className="h-4 w-4" />} title="General Information">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div className="flex flex-col gap-4">
              <div>
                <FL
                  htmlFor="name"
                  tip="Your product's display name shown to customers. Keep it clear and descriptive."
                  count={name.length}
                  max={50}
                >
                  Product Name
                </FL>
                <Input
                  id="name"
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  required
                  className="bg-white"
                />
              </div>
            </div>
            <div>
              <FL
                htmlFor="description"
                tip="A detailed description shown on the product page. Include key features, materials, and use cases."
                count={description.length}
                max={1000}
              >
                Description
              </FL>
              <Textarea
                id="description"
                placeholder="Describe your product in detail — features, materials, dimensions, use cases..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                required
                className="bg-white min-h-[90px] lg:min-h-[100px] resize-none"
              />
            </div>
          </div>
        </Section>

        {/* ── Pricing ── */}
        <Section icon={<DollarSign className="h-4 w-4" />} title="Pricing">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FL
                htmlFor="price"
                tip="The base selling price of this product in USD. Customers pay this unless a discounted price is set."
              >
                Price
              </FL>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none select-none">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="pl-6 bg-white"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <FL
                htmlFor="discounted-price"
                optional
                tip="Sale price shown to customers. Must be lower than the original price. Leave blank if no discount applies."
              >
                Discounted Price
              </FL>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none select-none">
                  $
                </span>
                <Input
                  id="discounted-price"
                  type="number"
                  placeholder="0.00"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  className="pl-6 bg-white"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* ── Product Images ── */}
        <Section icon={<ImageIcon className="h-4 w-4" />} title="Product Images">
          <FL
            tip="Upload up to 5 high-quality images. The first image will be the main display photo. Supports PNG, JPG, WEBP, BMP up to 50MB each."
          >
            Images
            <span className="ml-1.5 text-[10px] text-stone-400 font-normal normal-case tracking-normal">
              ({totalImageCount}/5 used)
            </span>
          </FL>

          {/* Drop zone */}
          <label
            htmlFor="picture"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed py-7 px-4 cursor-pointer transition-all duration-200 select-none
              ${isDragging
                ? "border-stone-900 bg-stone-100"
                : "border-stone-300 bg-white hover:border-stone-400 hover:bg-stone-50"
              }
              ${totalImageCount >= 5 ? "pointer-events-none opacity-50" : ""}
            `}
          >
            <div className={`rounded-full p-3 ${isDragging ? "bg-stone-200" : "bg-stone-100"} transition-colors`}>
              <Upload className="h-5 w-5 text-stone-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-stone-700">
                {isDragging ? "Drop images here" : "Click to upload or drag & drop"}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                PNG, JPG, WEBP, BMP · Max 50MB per image · Up to 5 images
              </p>
              {product?.images && product.images.length > 0 && (
                <p className="text-xs text-stone-400 mt-0.5">
                  New images will be added alongside existing ones
                </p>
              )}
            </div>
            <input
              id="picture"
              type="file"
              accept="image/png,image/jpeg,image/bmp,image/jpg,image/webp"
              multiple
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>

          {/* Image grid */}
          {(product?.images?.length || fileUrls.length) ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-1">
              {/* Existing images */}
              {product?.images?.map((img, i) => {
                const isCrossed = crossedImages.includes(img);
                return (
                  <ImageTile
                    key={`existing-${i}`}
                    src={img}
                    label={`Existing ${i + 1}`}
                    faded={isCrossed}
                    onRemove={
                      !isCrossed
                        ? () => setCrossedImages((prev) => [...prev, img])
                        : undefined
                    }
                    onPreview={() => openPreview(img)}
                  />
                );
              })}
              {/* New uploads */}
              {fileUrls.map((url, i) => (
                <ImageTile
                  key={`new-${i}`}
                  src={url}
                  label={
                    files[i]
                      ? files[i].name.length > 12
                        ? files[i].name.substring(0, 12) + "…"
                        : files[i].name
                      : `New ${i + 1}`
                  }
                  onRemove={() => removeNewImage(i)}
                  onPreview={() => openPreview(url)}
                />
              ))}
            </div>
          ) : null}

          {imageError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-1">
              {imageError}
            </p>
          )}
        </Section>

        {/* ── Category & Fulfillment ── */}
        <Section icon={<Tag className="h-4 w-4" />} title="Category & Fulfillment">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <FL
                htmlFor="category"
                tip="Select the most relevant category so customers can find your product easily."
              >
                Category
              </FL>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="bg-white">
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
            <div>
              <FL
                htmlFor="orderMinDays"
                tip="Minimum number of business days required to process and ship this order."
              >
                Min Order Days
              </FL>
              <Input
                id="orderMinDays"
                type="number"
                placeholder="e.g. 3"
                value={orderMinDays}
                onChange={(e) => setOrderMinDays(parseInt(e.target.value))}
                required
                className="bg-white"
                min="0"
              />
            </div>
            <div>
              <FL
                htmlFor="orderMaxDays"
                tip="Maximum number of business days the order fulfillment could take. Must be ≥ min days."
              >
                Max Order Days
              </FL>
              <Input
                id="orderMaxDays"
                type="number"
                placeholder="e.g. 7"
                value={orderMaxDays}
                onChange={(e) => setOrderMaxDays(parseInt(e.target.value))}
                required
                className="bg-white"
                min="0"
              />
            </div>
          </div>
        </Section>

        {/* ── Shipping ── */}
        <Section icon={<Truck className="h-4 w-4" />} title="Shipping Details">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <FL
                htmlFor="weight"
                tip="Product weight in ounces (oz). Used to calculate accurate shipping rates at checkout."
              >
                Weight (oz)
              </FL>
              <Input
                id="weight"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 5.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="bg-white"
              />
            </div>
            <div>
              <FL
                htmlFor="length"
                tip="Package length in centimeters. Used with width and height to calculate shipping dimensions."
              >
                Length (cm)
              </FL>
              <Input
                id="length"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 30"
                value={length || ""}
                onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                required
                className="bg-white"
              />
            </div>
            <div>
              <FL
                htmlFor="width"
                tip="Package width in centimeters."
              >
                Width (cm)
              </FL>
              <Input
                id="width"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 20"
                value={width || ""}
                onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                required
                className="bg-white"
              />
            </div>
            <div>
              <FL
                htmlFor="height"
                tip="Package height in centimeters."
              >
                Height (cm)
              </FL>
              <Input
                id="height"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 10"
                value={height || ""}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                required
                className="bg-white"
              />
            </div>
          </div>
        </Section>

        {/* ── Colors + Variations: side by side on large screens ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

        {/* ── Colors ── */}
        <Section icon={<Palette className="h-4 w-4" />} title="Color Variants">
          <FL tip="Add color swatches that customers can choose from. Click a swatch to open the color picker, then pick a color.">
            Colors
            <span className="ml-1.5 text-[10px] text-stone-400 font-normal normal-case tracking-normal">
              (optional)
            </span>
          </FL>
          <div className="flex flex-wrap gap-3 items-start">
            {colors.map((color, index) => (
              <div key={index} className="flex flex-col items-center relative group/color">
                {/* remove */}
                <button
                  type="button"
                  onClick={() =>
                    setColors((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-stone-400 hover:bg-red-500 text-white flex items-center justify-center z-10 opacity-0 group-hover/color:opacity-100 transition-opacity"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
                {/* swatch */}
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer ring-2 ring-stone-200 hover:ring-stone-400 transition-all"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => {
                    handleCloseAllColors();
                    setColors((prev) =>
                      prev.map((c, i) => ({
                        ...c,
                        isOpen: i === index ? !c.isOpen : false,
                      })),
                    );
                  }}
                />
                <Block
                  color={color.hex}
                  onChange={(e) => {
                    setColors((prev) =>
                      prev.map((c, i) =>
                        i === index ? { hex: e.hex, isOpen: false } : c,
                      ),
                    );
                  }}
                  className={`${color.isOpen ? "" : "hidden"} mt-2 z-20 absolute top-full left-0`}
                />
              </div>
            ))}
            {/* add button */}
            <button
              type="button"
              onClick={() =>
                setColors((prev) => [...prev, { hex: "#3b82f6", isOpen: true }])
              }
              className="w-10 h-10 rounded-full border-2 border-dashed border-stone-300 bg-white hover:border-stone-500 hover:bg-stone-50 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-all font-bold text-lg"
            >
              +
            </button>
          </div>
        </Section>

        {/* ── Variations / Sizes ── */}
        <Section icon={<Layers className="h-4 w-4" />} title="Size Variations">
          <FL tip="Add size or variation options customers can select (e.g. XL, 42, 52 inches). Up to 10 variations allowed.">
            Variations
            <span className="ml-1.5 text-[10px] text-stone-400 font-normal normal-case tracking-normal">
              (optional)
            </span>
          </FL>
          <div className="space-y-2">
            {customSizes.map((size, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Variation ${index + 1} — e.g. XL, 42, 52"`}
                  value={size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  maxLength={15}
                  className="bg-white"
                />
                {customSizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSizeInput(index)}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {customSizes.length < 10 && (
              <button
                type="button"
                onClick={addSizeInput}
                className="w-full h-9 rounded-lg border border-dashed border-stone-300 text-sm text-stone-500 hover:border-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-all"
              >
                + Add Variation
              </button>
            )}
          </div>
        </Section>

        </div>{/* end Colors + Variations grid */}

        {/* ── Submit ── */}
        <div className="pt-1 space-y-3">
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <X className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 text-white transition-colors"
          >
            {product ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </form>
    </>
  );
}
