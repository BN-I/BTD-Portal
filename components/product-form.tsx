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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
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
  RotateCw,
} from "lucide-react";
import type { Product, ProductForm } from "@/app/types";
import { Block } from "@uiw/react-color";

/* ─────────────────────────────────────────────────────────────────────────── */
/* Helpers                                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function normalizeOrientation(
  file: File,
): Promise<{ file: File; previewUrl: string }> {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    const blob = await new Promise<Blob>((res, rej) =>
      canvas.toBlob(
        (b) => (b ? res(b) : rej(new Error("blob"))),
        "image/jpeg",
        0.92,
      ),
    );
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    const normalized = new File([blob], name, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
    return { file: normalized, previewUrl: URL.createObjectURL(normalized) };
  } catch {
    return { file, previewUrl: URL.createObjectURL(file) };
  }
}

async function rotateBitmap(
  bitmap: ImageBitmap,
): Promise<{ blob: Blob; width: number; height: number }> {
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.height;
  canvas.height = bitmap.width;
  const ctx = canvas.getContext("2d")!;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
  bitmap.close();
  const blob = await new Promise<Blob>((res, rej) =>
    canvas.toBlob(
      (b) => (b ? res(b) : rej(new Error("blob"))),
      "image/jpeg",
      0.92,
    ),
  );
  return { blob, width: canvas.width, height: canvas.height };
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Small UI components                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */

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
          className={`text-[11px] tabular-nums ${
            count >= max ? "text-red-400" : "text-stone-400"
          }`}
        >
          {count}/{max}
        </span>
      )}
    </div>
  );
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[150] bg-black/85 flex items-center justify-center p-4">
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

function ImageTile({
  src,
  label,
  faded,
  isProcessing,
  onRemove,
  onRotate,
  onPreview,
}: {
  src: string;
  label: string;
  faded?: boolean;
  isProcessing?: boolean;
  onRemove?: () => void;
  onRotate?: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="relative group flex flex-col items-center gap-1">
      <div
        className="relative w-full aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-100 cursor-pointer"
        onClick={!isProcessing ? onPreview : undefined}
      >
        <img
          src={src}
          alt={label}
          className={`w-full h-full object-cover transition-all duration-200 group-hover:brightness-75 ${
            faded ? "opacity-35 grayscale" : ""
          }`}
        />
        {/* Processing spinner */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {/* Preview icon on hover */}
        {!faded && !isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="h-5 w-5 text-white drop-shadow" />
          </div>
        )}
      </div>

      {/* Remove button */}
      {onRemove && !faded && !isProcessing && (
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

      {/* Rotate button */}
      {onRotate && !faded && !isProcessing && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRotate();
          }}
          className="absolute -top-1.5 left-1.5 w-5 h-5 rounded-full bg-stone-700 hover:bg-stone-900 text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Rotate 90°"
        >
          <RotateCw className="h-3 w-3" />
        </button>
      )}

      {/* Deletion marker */}
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

/* ─────────────────────────────────────────────────────────────────────────── */
/* Types                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

interface ExistingImage {
  url: string;
  crossed: boolean;
}

interface NewImage {
  id: string;
  file: File;
  previewUrl: string;
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductForm) => Promise<void>;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Main component                                                               */
/* ─────────────────────────────────────────────────────────────────────────── */

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  /* ── Non-image fields ──────────────────────────────────────────── */
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
      ? product.colorVariations.map((c) => ({ hex: c, isOpen: false }))
      : [],
  );
  const [customSizes, setCustomSizes] = useState<string[]>(
    product?.sizeVariations?.length ? product.sizeVariations : [""],
  );

  /* ── Image state ───────────────────────────────────────────────── */
  const [existingImgs, setExistingImgs] = useState<ExistingImage[]>(() =>
    (product?.images ?? []).map((url) => ({ url, crossed: false })),
  );
  const [newImgs, setNewImgs] = useState<NewImage[]>([]);
  // IDs / URLs of images currently being processed (rotation, fetch)
  const [processingSet, setProcessingSet] = useState<Set<string>>(new Set());

  /* ── UI state ──────────────────────────────────────────────────── */
  const [isDragging, setIsDragging] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const savedScrollRef = useRef(0);

  /* ── Derived image counts ──────────────────────────────────────── */
  const activeExistingCount = existingImgs.filter((e) => !e.crossed).length;
  const totalImageCount = activeExistingCount + newImgs.length;
  const atLimit = totalImageCount >= 5;

  /* ── Cleanup blob URLs on unmount ──────────────────────────────── */
  const newImgsRef = useRef(newImgs);
  newImgsRef.current = newImgs;
  useEffect(() => {
    return () => {
      newImgsRef.current.forEach((n) => URL.revokeObjectURL(n.previewUrl));
    };
  }, []);

  /* ── Draft (new products only) ─────────────────────────────────── */
  const DRAFT_KEY = "btd-product-form-draft";

  useEffect(() => {
    if (product) return;
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
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
      if (d.colors?.length)
        setColors(d.colors.map((hex: string) => ({ hex, isOpen: false })));
      setDraftRestored(true);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (product) return;
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        name,
        description,
        price,
        discountedPrice,
        category,
        orderMinDays,
        orderMaxDays,
        weight,
        length,
        width,
        height,
        customSizes,
        colors: colors.map((c) => c.hex),
      }),
    );
  }, [
    name,
    description,
    price,
    discountedPrice,
    category,
    orderMinDays,
    orderMaxDays,
    weight,
    length,
    width,
    height,
    customSizes,
    colors,
    product,
  ]);

  /* ── Scroll helpers for lightbox ───────────────────────────────── */
  const getScrollParent = (node: HTMLElement | null): HTMLElement | null => {
    if (!node) return null;
    if (node.scrollHeight > node.clientHeight + 1) return node;
    return getScrollParent(node.parentElement);
  };

  const openPreview = (src: string) => {
    const sp = getScrollParent(formRef.current?.parentElement ?? null);
    savedScrollRef.current = sp?.scrollTop ?? 0;
    if (sp) sp.scrollTop = 0;
    setPreviewSrc(src);
  };

  const closePreview = () => {
    setPreviewSrc(null);
    const sp = getScrollParent(formRef.current?.parentElement ?? null);
    if (sp)
      requestAnimationFrame(() => {
        sp.scrollTop = savedScrollRef.current;
      });
  };

  /* ── Processing set helpers ────────────────────────────────────── */
  const startProcessing = (id: string) =>
    setProcessingSet((prev) => new Set([...prev, id]));
  const stopProcessing = (id: string) =>
    setProcessingSet((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  /* ── Add new images ────────────────────────────────────────────── */
  const processNewFiles = async (selected: FileList | File[]) => {
    setImageError("");
    const arr = Array.from(selected);
    console.log("Selected files:", totalImageCount);
    if (totalImageCount + arr.length > 5) {
      const remaining = 5 - totalImageCount;
      setImageError(
        `Max 5 images. ${remaining} slot${
          remaining === 1 ? "" : "s"
        } remaining.`,
      );
      return;
    }

    const oversized = arr.filter((f) => f.size > 50 * 1024 * 1024);
    if (oversized.length) {
      setImageError(
        `Exceeds 50 MB: ${oversized.map((f) => f.name).join(", ")}`,
      );
      return;
    }

    const normalized = await Promise.all(arr.map(normalizeOrientation));
    setNewImgs((prev) => [
      ...prev,
      ...normalized.map((n) => ({
        id: genId(),
        file: n.file,
        previewUrl: n.previewUrl,
      })),
    ]);
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

  /* ── Remove images ─────────────────────────────────────────────── */
  const removeNewImage = (id: string) => {
    setNewImgs((prev) => {
      const img = prev.find((n) => n.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter((n) => n.id !== id);
    });
  };

  const crossExisting = (url: string) =>
    setExistingImgs((prev) =>
      prev.map((e) => (e.url === url ? { ...e, crossed: true } : e)),
    );

  /* ── Rotate new image (already in newImgs) ─────────────────────── */
  const rotateNewImage = async (id: string) => {
    if (processingSet.has(id)) return;
    startProcessing(id);
    try {
      const img = newImgs.find((n) => n.id === id);
      if (!img) return;

      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(img.file, {
          imageOrientation: "from-image",
        });
      } catch {
        bitmap = await createImageBitmap(img.file);
      }

      const { blob } = await rotateBitmap(bitmap);

      if (blob.size > 50 * 1024 * 1024) {
        setImageError("Rotated image exceeds 50 MB.");
        return;
      }

      // Use the image's unique id in the filename so every file is distinct.
      const rotatedFile = new File([blob], `img-${id}.jpg`, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
      const rotatedUrl = URL.createObjectURL(rotatedFile);

      setNewImgs((prev) =>
        prev.map((n) => {
          if (n.id !== id) return n;
          URL.revokeObjectURL(n.previewUrl);
          return { id, file: rotatedFile, previewUrl: rotatedUrl };
        }),
      );
    } catch {
      setImageError("Unable to rotate image.");
    } finally {
      stopProcessing(id);
    }
  };

  /* ── Rotate existing (server) image ────────────────────────────── */
  const rotateExistingImage = async (url: string) => {
    if (processingSet.has(url)) return;
    startProcessing(url);
    setImageError("");
    try {
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
      const resp = await fetch(proxyUrl);
      if (!resp.ok) throw new Error("proxy error");
      const blob = await resp.blob();
      const srcFile = new File([blob], "src.jpg", {
        type: blob.type || "image/jpeg",
      });

      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(srcFile, {
          imageOrientation: "from-image",
        });
      } catch {
        bitmap = await createImageBitmap(srcFile);
      }

      const { blob: rotatedBlob } = await rotateBitmap(bitmap);

      if (rotatedBlob.size > 50 * 1024 * 1024) {
        setImageError("Rotated image exceeds 50 MB.");
        return;
      }

      // Unique ID ensures a unique filename — critical when rotating multiple
      // images, as the server uses filenames as storage keys.
      const id = genId();
      const rotatedFile = new File([rotatedBlob], `img-${id}.jpg`, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
      const previewUrl = URL.createObjectURL(rotatedFile);

      // Cross out the original; add the rotated copy as a new upload.
      // Net count is neutral: –1 existing active, +1 new.
      setExistingImgs((prev) =>
        prev.map((e) => (e.url === url ? { ...e, crossed: true } : e)),
      );
      setNewImgs((prev) => [...prev, { id, file: rotatedFile, previewUrl }]);
    } catch {
      setImageError("Unable to rotate image.");
    } finally {
      stopProcessing(url);
    }
  };

  /* ── Colors ────────────────────────────────────────────────────── */
  const closeAllColorPickers = () =>
    setColors((prev) => prev.map((c) => ({ ...c, isOpen: false })));

  /* ── Sizes ─────────────────────────────────────────────────────── */
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

  /* ── Submit ────────────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setImageError("");

    if (discountedPrice && parseFloat(discountedPrice) > parseFloat(price)) {
      setError("Discounted price cannot be greater than original price.");
      return;
    }
    if (!category) {
      setError("Category is required.");
      return;
    }
    if (!orderMaxDays || !orderMinDays) {
      setError("Order min and max days are required.");
      return;
    }
    if (orderMaxDays < orderMinDays) {
      setError("Order max days cannot be less than order min days.");
      return;
    }
    const weightValue = parseFloat(weight);
    if (!weight || isNaN(weightValue) || weightValue <= 0) {
      setError("Weight is required and must be greater than 0.");
      return;
    }
    if (!length || isNaN(length) || length <= 0) {
      setError("Length is required and must be greater than 0.");
      return;
    }
    if (!width || isNaN(width) || width <= 0) {
      setError("Width is required and must be greater than 0.");
      return;
    }
    if (!height || isNaN(height) || height <= 0) {
      setError("Height is required and must be greater than 0.");
      return;
    }

    const hasImages = totalImageCount > 0;
    if (!hasImages) {
      setImageError("Please upload at least one image.");
      return;
    }

    if (!product) localStorage.removeItem(DRAFT_KEY);

    setIsSubmitting(true);
    try {
      await onSubmit({
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
        files: newImgs.map((n) => n.file),
        crossedImages: existingImgs.filter((e) => e.crossed).map((e) => e.url),
        weight: parseFloat(weight),
        length: length || 0,
        width: width || 0,
        height: height || 0,
      });
    } catch {
      // error shown via toast in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─────────────────────────────────────────────────────────────── */
  /* Render                                                           */
  /* ─────────────────────────────────────────────────────────────── */
  return (
    <>
      {previewSrc && <Lightbox src={previewSrc} onClose={closePreview} />}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        {/* Draft banner */}
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

        {/* General Information */}
        <Section
          icon={<Package className="h-4 w-4" />}
          title="General Information"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div>
              <FL
                htmlFor="name"
                tip="Your product's display name shown to customers."
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
            <div>
              <FL
                htmlFor="description"
                tip="A detailed description shown on the product page."
                count={description.length}
                max={1000}
              >
                Description
              </FL>
              <Textarea
                id="description"
                placeholder="Describe your product in detail…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                required
                className="bg-white min-h-[90px] lg:min-h-[100px] resize-none"
              />
            </div>
          </div>
        </Section>

        {/* Pricing */}
        <Section icon={<DollarSign className="h-4 w-4" />} title="Pricing">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FL htmlFor="price" tip="Base selling price in USD.">
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
                tip="Sale price. Must be lower than the original price."
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

        {/* Product Images */}
        <Section
          icon={<ImageIcon className="h-4 w-4" />}
          title="Product Images"
        >
          <FL tip="Upload up to 5 images. PNG, JPG, WEBP, BMP · max 50 MB each.">
            Images
            <span className="ml-1.5 text-[10px] text-stone-400 font-normal normal-case tracking-normal">
              ({totalImageCount}/5 used)
            </span>
          </FL>

          {/* Drop zone */}
          <label
            htmlFor="picture"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed py-7 px-4 cursor-pointer transition-all duration-200 select-none
              ${
                isDragging
                  ? "border-stone-900 bg-stone-100"
                  : "border-stone-300 bg-white hover:border-stone-400 hover:bg-stone-50"
              }
              ${atLimit ? "pointer-events-none opacity-50" : ""}
            `}
          >
            <div
              className={`rounded-full p-3 ${
                isDragging ? "bg-stone-200" : "bg-stone-100"
              } transition-colors`}
            >
              <Upload className="h-5 w-5 text-stone-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-stone-700">
                {isDragging
                  ? "Drop images here"
                  : "Click to upload or drag & drop"}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                PNG, JPG, WEBP, BMP · Max 50 MB per image · Up to 5 images
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
          {(existingImgs.length > 0 || newImgs.length > 0) && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-1">
              {/* Existing images */}
              {existingImgs.map((img) => (
                <ImageTile
                  key={img.url}
                  src={img.url}
                  label={img.crossed ? "Will be removed" : "Existing"}
                  faded={img.crossed}
                  isProcessing={processingSet.has(img.url)}
                  onRemove={
                    !img.crossed ? () => crossExisting(img.url) : undefined
                  }
                  onRotate={
                    !img.crossed
                      ? () => rotateExistingImage(img.url)
                      : undefined
                  }
                  onPreview={() => openPreview(img.url)}
                />
              ))}
              {/* New uploads */}
              {newImgs.map((img) => (
                <ImageTile
                  key={img.id}
                  src={img.previewUrl}
                  label={
                    img.file.name.length > 12
                      ? img.file.name.substring(0, 12) + "…"
                      : img.file.name
                  }
                  isProcessing={processingSet.has(img.id)}
                  onRemove={() => removeNewImage(img.id)}
                  onRotate={() => rotateNewImage(img.id)}
                  onPreview={() => openPreview(img.previewUrl)}
                />
              ))}
            </div>
          )}

          {imageError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-1">
              {imageError}
            </p>
          )}
        </Section>

        {/* Category & Fulfillment */}
        <Section
          icon={<Tag className="h-4 w-4" />}
          title="Category & Fulfillment"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <FL htmlFor="category" tip="Select the most relevant category.">
                Category
              </FL>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Electronics & Tech</SelectLabel>
                    <SelectItem value="electronics">
                      Electronics & Gadgets
                    </SelectItem>
                    <SelectItem value="computers">
                      Computers & Accessories
                    </SelectItem>
                    <SelectItem value="mobile">Mobile & Tablets</SelectItem>
                    <SelectItem value="audio">Audio & Headphones</SelectItem>
                    <SelectItem value="cameras">
                      Cameras & Photography
                    </SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Fashion & Apparel</SelectLabel>
                    <SelectItem value="mens-clothing">
                      Men's Clothing
                    </SelectItem>
                    <SelectItem value="womens-clothing">
                      Women's Clothing
                    </SelectItem>
                    <SelectItem value="kids-clothing">
                      Kids' Clothing
                    </SelectItem>
                    <SelectItem value="shoes">Shoes & Footwear</SelectItem>
                    <SelectItem value="bags">Bags & Accessories</SelectItem>
                    <SelectItem value="jewelry">Jewelry & Watches</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Home & Living</SelectLabel>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="kitchen">Kitchen & Dining</SelectItem>
                    <SelectItem value="bedding">Bedding & Bath</SelectItem>
                    <SelectItem value="decor">Home Decor & Art</SelectItem>
                    <SelectItem value="appliances">Appliances</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Health & Beauty</SelectLabel>
                    <SelectItem value="health">Health & Wellness</SelectItem>
                    <SelectItem value="beauty">Beauty & Skincare</SelectItem>
                    <SelectItem value="sports">Sports & Fitness</SelectItem>
                    <SelectItem value="outdoor">Outdoor & Camping</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Books & Media</SelectLabel>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="movies">Movies & TV</SelectItem>
                    <SelectItem value="video-games">Video Games</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Food & Confectionery</SelectLabel>
                    <SelectItem value="sweets-candy">Sweets & Candy</SelectItem>
                    <SelectItem value="chocolates">Chocolates</SelectItem>
                    <SelectItem value="baked-goods">Baked Goods</SelectItem>
                    <SelectItem value="snacks">Snacks & Crisps</SelectItem>
                    <SelectItem value="beverages">
                      Beverages & Drinks
                    </SelectItem>
                    <SelectItem value="food">Food & Grocery</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Other</SelectLabel>
                    <SelectItem value="toys">Toys & Games</SelectItem>
                    <SelectItem value="baby">Baby & Kids</SelectItem>
                    <SelectItem value="pets">Pet Supplies</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="office">Office Supplies</SelectItem>
                    <SelectItem value="art-crafts">Art & Crafts</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <FL
                htmlFor="orderMinDays"
                tip="Minimum business days to process and ship."
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
                tip="Maximum business days for fulfillment. Must be ≥ min days."
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

        {/* Shipping */}
        <Section icon={<Truck className="h-4 w-4" />} title="Shipping Details">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <FL htmlFor="weight" tip="Product weight in ounces (oz).">
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
              <FL htmlFor="length" tip="Package length in inches.">
                Length (Inches)
              </FL>
              <Input
                id="length"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 15"
                value={length || ""}
                onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                required
                className="bg-white"
              />
            </div>
            <div>
              <FL htmlFor="width" tip="Package width in inches.">
                Width (Inches)
              </FL>
              <Input
                id="width"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 10"
                value={width || ""}
                onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                required
                className="bg-white"
              />
            </div>
            <div>
              <FL htmlFor="height" tip="Package height in inches.">
                Height (Inches)
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

        {/* Colors + Sizes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <Section
            icon={<Palette className="h-4 w-4" />}
            title="Color Variants"
          >
            <FL tip="Add color swatches customers can choose from.">
              Colors
              <span className="ml-1.5 text-[10px] text-stone-400 font-normal normal-case tracking-normal">
                (optional)
              </span>
            </FL>
            <div className="flex flex-wrap gap-3 items-start">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center relative group/color"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setColors((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-stone-400 hover:bg-red-500 text-white flex items-center justify-center z-10 opacity-0 group-hover/color:opacity-100 transition-opacity"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md cursor-pointer ring-2 ring-stone-200 hover:ring-stone-400 transition-all"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => {
                      closeAllColorPickers();
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
                    onChange={(e) =>
                      setColors((prev) =>
                        prev.map((c, i) =>
                          i === index ? { hex: e.hex, isOpen: false } : c,
                        ),
                      )
                    }
                    className={`${
                      color.isOpen ? "" : "hidden"
                    } mt-2 z-20 absolute top-full left-0`}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setColors((prev) => [
                    ...prev,
                    { hex: "#3b82f6", isOpen: true },
                  ])
                }
                className="w-10 h-10 rounded-full border-2 border-dashed border-stone-300 bg-white hover:border-stone-500 hover:bg-stone-50 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-all font-bold text-lg"
              >
                +
              </button>
            </div>
          </Section>

          <Section
            icon={<Layers className="h-4 w-4" />}
            title="Size Variations"
          >
            <FL tip="Add size options customers can select (e.g. XL, 42). Up to 10.">
              Variations
              <span className="ml-1.5 text-[10px] text-stone-400 font-normal normal-case tracking-normal">
                (optional)
              </span>
            </FL>
            <div className="space-y-2">
              {customSizes.map((size, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Variation ${index + 1} — e.g. XL, 42`}
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
        </div>

        {/* Submit */}
        <div className="pt-1 space-y-3">
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <X className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 text-sm font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 text-white transition-colors disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving…"
              : product
              ? "Save Changes"
              : "Add Product"}
          </Button>
        </div>
      </form>
    </>
  );
}
